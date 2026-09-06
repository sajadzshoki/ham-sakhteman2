export type ThemeMode = 'light' | 'dark' | 'system'

/** مدیریت تم روشن/تاریک/سیستم روی ماژول color-mode */
export function useTheme() {
  const colorMode = useColorMode()

  const mode = computed<ThemeMode>(() => (colorMode.preference as ThemeMode) || 'system')
  const isDark = computed(() => colorMode.value === 'dark')

  function setTheme(theme: ThemeMode) {
    colorMode.preference = theme
  }

  function toggleTheme() {
    setTheme(isDark.value ? 'light' : 'dark')
  }

  return { mode, isDark, setTheme, toggleTheme }
}
