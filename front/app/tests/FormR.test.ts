import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { nextTick } from 'vue'
import FormR from '~/components/FormR.vue'
import { messages } from '~/assets/messages'
import { navigateTo } from '#app'

// Mock dependencies
vi.mock('#app', () => ({
  navigateTo: vi.fn()
}))

const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
})

describe('FormR', () => {
  let mockFetch: any

  beforeEach(() => {
    vi.clearAllMocks()
    mockFetch = vi.fn()
    vi.stubGlobal('$fetch', mockFetch)
    messages.value = []
  })

  it('renders the form correctly', async () => {
    const wrapper = await mountSuspended(FormR)

    expect(wrapper.find('form').exists()).toBe(true)
    expect(wrapper.find('img').exists()).toBe(true)
    expect(wrapper.findComponent({ name: 'FormsInput' }).exists()).toBe(true)
    expect(wrapper.find('select').exists()).toBe(true)
    expect(wrapper.text()).toContain('Aceptar')
  })

  it('fetches salas and roles on mount', async () => {
    mockFetch
      .mockResolvedValueOnce([{ id: 1, room_name: 'Sala 1' }])
      .mockResolvedValueOnce([{ id: 1, role: 'reader' }])

    const wrapper = await mountSuspended(FormR)

    expect(mockFetch).toHaveBeenCalledTimes(2)
    expect(mockFetch).toHaveBeenCalledWith('http://localhost:4000/api/book_rooms/', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    })
    expect(mockFetch).toHaveBeenCalledWith('http://localhost:4000/api/roles/', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    })
    expect(wrapper.vm.salas).toEqual([{ id: 1, room_name: 'Sala 1' }])
    expect(wrapper.vm.roles).toEqual([{ id: 1, role: 'reader' }])
  })

  it('shows validation errors for empty fields', async () => {
    const wrapper = await mountSuspended(FormR)

    await wrapper.find('form').trigger('submit')

    expect(messages.value).toContain('Su nombre es requerido')
    expect(messages.value).toContain('Su contraseña es requerida')
    expect(messages.value).toContain('Su email es requerido')
    expect(messages.value).toContain('Su nombre de usuario es requerido')
    expect(messages.value).toContain('Su rol es requerido')
  })

  it('shows validation error for technician without bookroom', async () => {
    const wrapper = await mountSuspended(FormR)

    wrapper.vm.form.rol = { role: 'technician' }
    wrapper.vm.form.nombre = 'Test'
    wrapper.vm.form.contraseña = 'pass'
    wrapper.vm.form.email = 'test@test.com'
    wrapper.vm.form.usuario = 'user'

    await wrapper.find('form').trigger('submit')

    expect(messages.value).toContain('La sala es requerida')
  })

  it('submits form successfully for reader role', async () => {
    mockFetch
      .mockResolvedValueOnce([{ id: 1, room_name: 'Sala 1' }])
      .mockResolvedValueOnce([{ id: 1, role: 'reader' }])
      .mockResolvedValueOnce({ data: { id: 1 } })

    const wrapper = await mountSuspended(FormR)

    wrapper.vm.form.nombre = 'Test'
    wrapper.vm.form.contraseña = 'pass'
    wrapper.vm.form.email = 'test@test.com'
    wrapper.vm.form.usuario = 'user'
    wrapper.vm.form.rol = { id: 1, role: 'reader' }

    await wrapper.find('form').trigger('submit')

    expect(mockFetch).toHaveBeenCalledWith('http://localhost:4000/api/users/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test',
        password: 'pass',
        email: 'test@test.com',
        username: 'user',
        role_id: 1
      })
    })
    expect(navigateTo).toHaveBeenCalledWith('/reader/books/all')
    expect(messages.value).toContain("Bienvenido a la sala de libros. Aquí puedes ver su información (Ver) y obtenerlos por medio de préstamos (Obtener) en caso de que lo desees")
  })

  it('submits form successfully for technician role', async () => {
    mockFetch
      .mockResolvedValueOnce([{ id: 1, room_name: 'Sala 1' }])
      .mockResolvedValueOnce([{ id: 2, role: 'technician' }])
      .mockResolvedValueOnce({ data: { id: 2 } })

    const wrapper = await mountSuspended(FormR)

    wrapper.vm.form.nombre = 'Test'
    wrapper.vm.form.contraseña = 'pass'
    wrapper.vm.form.email = 'test@test.com'
    wrapper.vm.form.usuario = 'user'
    wrapper.vm.form.rol = { id: 2, role: 'technician' }
    wrapper.vm.form.bookroom = 1

    await wrapper.find('form').trigger('submit')

    expect(mockFetch).toHaveBeenCalledWith('http://localhost:4000/api/users/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test',
        password: 'pass',
        email: 'test@test.com',
        username: 'user',
        role_id: 2,
        book_room_id: 1
      })
    })
    expect(navigateTo).toHaveBeenCalledWith('/technician/loans/all')
    expect(messages.value).toContain("Bienvenido a la sección de Préstamos Solicitados por los Usuarios. Valídalos (Validar) o no (Invalidar), según convenga. También puedes obtener información de estos (Info)")
  })

  it('handles submission error', async () => {
    mockFetch
      .mockResolvedValueOnce([{ id: 1, room_name: 'Sala 1' }])
      .mockResolvedValueOnce([{ id: 1, role: 'reader' }])
      .mockRejectedValue(new Error('API Error'))

    const wrapper = await mountSuspended(FormR)

    wrapper.vm.form.nombre = 'Test'
    wrapper.vm.form.contraseña = 'pass'
    wrapper.vm.form.email = 'test@test.com'
    wrapper.vm.form.usuario = 'user'
    wrapper.vm.form.rol = { id: 1, role: 'reader' }

    await wrapper.find('form').trigger('submit')

    expect(messages.value).toContain('Error al crear el usuario: Error: API Error')
  })

  it('loads data from localStorage on mount', async () => {
    localStorageMock.getItem.mockReturnValue(JSON.stringify({
      nombre: 'saved',
      contraseña: 'savedpass',
      email: 'saved@test.com',
      usuario: 'saveduser',
      rol: { role: 'reader' },
      bookroom: 0
    }))

    const wrapper = await mountSuspended(FormR)

    expect(wrapper.vm.form.nombre).toBe('saved')
    expect(wrapper.vm.form.contraseña).toBe('savedpass')
    expect(wrapper.vm.form.email).toBe('saved@test.com')
    expect(wrapper.vm.form.usuario).toBe('saveduser')
  })

  it('saves data to localStorage on form change', async () => {
    const wrapper = await mountSuspended(FormR)

    wrapper.vm.form.nombre = 'newname'
    await nextTick()

    expect(localStorageMock.setItem).toHaveBeenCalledWith('localMemory', JSON.stringify(wrapper.vm.form))
  })
})
