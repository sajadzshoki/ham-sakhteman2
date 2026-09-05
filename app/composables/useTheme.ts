/** مدیریت تم روشن/تاریک روی ماژول color-mode */
export function useTheme() {
  const colorMode = useColorMode()

  const isDark = computed(() => colorMode.value === 'dark')

  function setTheme(theme: 'light' | 'dark') {
    colorMode.preference = theme
  }

  function toggleTheme() {
    setTheme(isDark.value ? 'light' : 'dark')
  }

  return { isDark, setTheme, toggleTheme }
}
