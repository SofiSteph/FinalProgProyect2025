import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import FormsInput from '~/components/FormsInput.vue'

describe('FormsInput', () => {
  it('renders with props', async () => {
    const wrapper = await mountSuspended(FormsInput, {
      props: {
        id: 'test-input',
        type: 'text',
        placeholder: 'Enter text',
        modelValue: 'test value'
      }
    })

    const input = wrapper.find('input')
    expect(input.exists()).toBe(true)
    expect(input.attributes('id')).toBe('test-input')
    expect(input.attributes('type')).toBe('text')
    expect(input.attributes('placeholder')).toBe('Enter text')
    expect(input.element.value).toBe('test value')
  })

  it('emits update:modelValue on input', async () => {
    const wrapper = await mountSuspended(FormsInput, {
      props: {
        modelValue: ''
      }
    })

    const input = wrapper.find('input')
    await input.setValue('new value')

    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')[0]).toEqual(['new value'])
  })
})
