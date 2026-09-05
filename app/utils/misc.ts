/** توقف شبیه‌سازی‌شده برای شبیه‌سازی تأخیر شبکه در دیتای ماک */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/** تولید شناسه ساده برای آیتم‌های ماک/محلی */
export function createId(prefix = 'id'): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`
}
