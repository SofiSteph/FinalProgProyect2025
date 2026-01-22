import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import FormsButtonLink from '~/components/FormsButtonLink.vue'

describe('FormsButtonLink', () => {
  it('renders with props', async () => {
    const wrapper = await mountSuspended(FormsButtonLink, {
      props: {
        to: '/test-route',
        text: 'Test Link'
      }
    })

    const link = wrapper.find('a')
    expect(link.exists()).toBe(true)
    expect(link.attributes('href')).toBe('/test-route')
    expect(link.text()).toBe('Test Link')
    expect(link.classes()).toContain('bg-inputsBg')
    expect(link.classes()).toContain('text-inputsText')
    expect(link.classes()).toContain('button')
  })
})
