import { describe, it, expect, vi, afterEach } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import MessagePanel from '~/components/MessagePanel.vue'

// Mock window for positioning tests
Object.defineProperty(window, 'innerHeight', { value: 800, writable: true })
Object.defineProperty(window, 'innerWidth', { value: 1200, writable: true })

describe('MessagePanel', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })
  it('renders messages when provided', async () => {
    const messages = ['Message 1', 'Message 2']
    const wrapper = await mountSuspended(MessagePanel, {
      props: {
        messages
      }
    })

    expect(wrapper.exists()).toBe(true)
    const messageElements = wrapper.findAll('.message')
    expect(messageElements.length).toBe(2)
    expect(messageElements[0]!.text()).toBe('Message 1')
    expect(messageElements[1]!.text()).toBe('Message 2')
  })

  it('does not render if messages array is empty', async () => {
    const wrapper = await mountSuspended(MessagePanel, {
      props: {
        messages: []
      }
    })

    expect(wrapper.html()).toBe('<!--v-if-->')
  })

  it('emits close event when close button is clicked', async () => {
    const wrapper = await mountSuspended(MessagePanel, {
      props: {
        messages: ['Test message']
      }
    })

    const closeButton = wrapper.find('.close-btn')
    await closeButton.trigger('click')

    expect(wrapper.emitted('close')).toBeTruthy()
  })

  it('positions panel at bottom of screen on mount', async () => {
    const wrapper = await mountSuspended(MessagePanel, {
      props: {
        messages: ['Test message']
      }
    })

    // Wait for onMounted to execute
    await wrapper.vm.$nextTick()

    const panel = wrapper.find('.message-panel')
    expect(panel.attributes('style')).toContain('top: 600px') // 800 - 200
  })

  it('handles drag start on mousedown', async () => {
    const addEventListenerSpy = vi.spyOn(document, 'addEventListener')

    const wrapper = await mountSuspended(MessagePanel, {
      props: {
        messages: ['Test message']
      }
    })

    const panel = wrapper.find('.message-panel')
    const event = new MouseEvent('mousedown', { clientX: 100, clientY: 100 })

    await panel.trigger('mousedown', event)

    // Check if dragging state is set (internal state)
    // Since isDragging is internal, we can check if event listeners are added
    expect(addEventListenerSpy).toHaveBeenCalledWith('mousemove', expect.any(Function))
    expect(addEventListenerSpy).toHaveBeenCalledWith('mouseup', expect.any(Function))
  })
})
