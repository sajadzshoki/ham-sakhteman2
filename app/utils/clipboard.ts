/** کپی متن در کلیپ‌بورد با فالبک برای مرورگرهای قدیمی/محدود */
export async function copyToClipboard(text: string): Promise<boolean> {
  if (import.meta.server) return false

  try {
    await navigator.clipboard.writeText(text)
    return true
  }
  catch {
    try {
      const textarea = document.createElement('textarea')
      textarea.value = text
      textarea.setAttribute('readonly', '')
      textarea.style.position = 'fixed'
      textarea.style.opacity = '0'
      document.body.appendChild(textarea)
      textarea.select()
      const ok = document.execCommand('copy')
      document.body.removeChild(textarea)
      return ok
    }
    catch {
      return false
    }
  }
}
