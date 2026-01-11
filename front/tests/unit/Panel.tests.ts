import { describe, it, expect, vi } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import Panel from '~/components/Panel.vue'

// Mock the formatText function
vi.mock('@/assets/formatText', () => ({
  formatText: vi.fn((text: string) => `formatted-${text}`)
}))

describe('Panel', () => {
  it('renders formatted text when text prop is provided', async () => {
    const wrapper = await mountSuspended(Panel, {
      props: {
        text: 'Hello World'
      }
    })

    expect(wrapper.exists()).toBe(true)
    const panelText = wrapper.find('.panel-text')
    expect(panelText.exists()).toBe(true)
    expect(panelText.text()).toBe('formatted-Hello World')
  })

  it('renders slot content', async () => {
    const wrapper = await mountSuspended(Panel, {
      props: {
        text: 'Test'
      },
      slots: {
        default: '<div>Slot Content</div>'
      }
    })

    expect(wrapper.html()).toContain('Slot Content')
  })

  it('does not render panel text if text prop is not provided', async () => {
    const wrapper = await mountSuspended(Panel)

    const panelText = wrapper.find('.panel-text')
    expect(panelText.exists()).toBe(false)
  })
})
