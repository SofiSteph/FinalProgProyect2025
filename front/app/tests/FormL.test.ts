import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { nextTick } from 'vue'
import FormL from '~/components/FormL.vue'
import { useRouter } from 'vue-router'
import { messages } from '~/assets/messages'

// Mock dependencies
vi.mock('vue-router', () => ({
  useRouter: vi.fn()
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

describe('FormL', () => {
  let mockRouter: any
  let mockFetch: any

  beforeEach(() => {
    vi.clearAllMocks()
    mockRouter = { push: vi.fn() }
    useRouter.mockReturnValue(mockRouter)
    mockFetch = vi.fn()
    vi.stubGlobal('$fetch', mockFetch)
    messages.value = []
  })

  it('renders the form correctly', async () => {
    const wrapper = await mountSuspended(FormL)

    expect(wrapper.find('form').exists()).toBe(true)
    expect(wrapper.find('img').exists()).toBe(true)
    expect(wrapper.findComponent({ name: 'FormsInput' }).exists()).toBe(true)
    expect(wrapper.text()).toContain('Registrarse')
    expect(wrapper.text()).toContain('Aceptar')
  })

  it('submits form with valid credentials for reader role', async () => {
    mockFetch
      .mockResolvedValueOnce({ id: '1', password: 'pass', role_id: '1' })
      .mockResolvedValueOnce({ role: 'reader' })

    const wrapper = await mountSuspended(FormL)

    wrapper.vm.form.usuario = 'user'
    wrapper.vm.form.contraseña = 'pass'

    await wrapper.find('form').trigger('submit')

    expect(mockFetch).toHaveBeenCalledTimes(2)
    expect(mockFetch).toHaveBeenCalledWith('http://localhost:4000/api/users/username/user', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    })
    expect(mockFetch).toHaveBeenCalledWith('http://localhost:4000/api/roles/1', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    })
    expect(mockRouter.push).toHaveBeenCalledWith('/reader/books/all')
    expect(messages.value).toContain("Bienvenido a la sala de libros. Aquí puedes ver su información (Ver) y obtenerlos por medio de préstamos (Obtener) en caso de que lo desees")
  })

  it('submits form with invalid credentials', async () => {
    mockFetch.mockRejectedValue(new Error('User not found'))

    const wrapper = await mountSuspended(FormL)

    wrapper.vm.form.usuario = 'invalid'
    wrapper.vm.form.contraseña = 'wrong'

    await wrapper.find('form').trigger('submit')

    expect(mockFetch).toHaveBeenCalledTimes(1)
    expect(messages.value).toContain('Error: Error: User not found')
  })

  it('shows validation errors for empty fields', async () => {
    const wrapper = await mountSuspended(FormL)

    await wrapper.find('form').trigger('submit')

    expect(messages.value).toContain('Su usuario es requerido')
    expect(messages.value).toContain('Su contraseña es incorrecta')
  })

  it('loads data from localStorage on mount', async () => {
    localStorageMock.getItem.mockReturnValue(JSON.stringify({ usuario: 'saved', contraseña: 'savedpass' }))

    const wrapper = await mountSuspended(FormL)

    expect(wrapper.vm.form.usuario).toBe('saved')
    expect(wrapper.vm.form.contraseña).toBe('savedpass')
  })

  it('saves data to localStorage on form change', async () => {
    const wrapper = await mountSuspended(FormL)

    wrapper.vm.form.usuario = 'newuser'
    await nextTick()

    expect(localStorageMock.setItem).toHaveBeenCalledWith('localMemory', JSON.stringify(wrapper.vm.form))
  })
})
