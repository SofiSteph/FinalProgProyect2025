export const useUser = () => {
  const userId = useState<number | null>('userId', () => null)

  const setUserId = (id: number) => {
    userId.value = id
  }

  const getUserId = () => {
    return userId.value
  }

  const clearUserId = () => {
    userId.value = null
  }

  return {
    userId,
    setUserId,
    getUserId,
    clearUserId
  }
}
