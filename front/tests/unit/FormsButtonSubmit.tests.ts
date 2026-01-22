import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import FormsButtonSubmit from '~/components/FormsButtonSubmit.vue'

describe('FormsButtonSubmit', () => {
  it('renders the submit button correctly', async () => {
    const wrapper = await mountSuspended(FormsButtonSubmit)

    const button = wrapper.find('button')
    expect(button.exists()).toBe(true)
    expect(button.attributes('type')).toBe('submit')
    expect(button.text()).toBe(' Aceptar ')
    expect(button.classes()).toContain('change')
    expect(button.classes()).toContain('bg-inputsBg')
    expect(button.classes()).toContain('text-inputsText')
    expect(button.classes()).toContain('button')
  })
})
