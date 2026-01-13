import { ref } from 'vue'

export const messages = ref<string[]>([])

export const push = (message: string) => {
  if (messages.value.length === 0 || messages.value[messages.value.length - 1] !== message) {
    messages.value.push(message)
  }
}
