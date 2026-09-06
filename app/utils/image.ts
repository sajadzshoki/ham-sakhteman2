/**
 * نگهداری تصاویر آپلودشده در حافظه محلی مرورگر (localStorage).
 * کوکی‌ها ظرفیت محدودی دارند، پس رکوردها فقط یک «کلید مرجع» با پیشوند
 * `img:` ذخیره می‌کنند و خود تصویر جداگانه نگه داشته می‌شود.
 */

const STORAGE_PREFIX = 'ham-img-'

/** آیا مقدار یک کلید مرجع به تصویر ذخیره‌شده است؟ */
export function isImageKey(value: string | undefined): value is string {
  return !!value && value.startsWith('img:')
}

function storageKey(ref: string): string {
  return `${STORAGE_PREFIX}${ref.slice(4)}`
}

/** خواندن تصویر از حافظه محلی؛ فقط در کلاینت و با تحمل خطا */
export function loadImage(ref: string): string | null {
  if (!import.meta.client || !isImageKey(ref)) return null
  try {
    return window.localStorage.getItem(storageKey(ref))
  }
  catch {
    return null
  }
}

/** ذخیره دیتای تصویر و برگرداندن کلید مرجع برای ذخیره در رکورد */
export function saveImage(dataUrl: string): string | undefined {
  if (!import.meta.client) return undefined
  const id = createId('x')
  try {
    window.localStorage.setItem(`${STORAGE_PREFIX}${id}`, dataUrl)
    return `img:${id}`
  }
  catch {
    // حافظه پر یا در دسترس نیست — تصویر اختیاری است و ثبت بدون آن انجام می‌شود
    return undefined
  }
}

/** حذف تصویر ذخیره‌شده همراه با رکورد */
export function removeImage(ref: string | undefined): void {
  if (!import.meta.client || !ref || !isImageKey(ref)) return
  try {
    window.localStorage.removeItem(storageKey(ref))
  }
  catch {
    // نادیده بگیر
  }
}

/**
 * تبدیل مقدار تصویر فرم به کلید مرجع قابل ذخیره در رکورد.
 * - دیتای تازه (`data:`) را ذخیره و کلید آن را برمی‌گرداند
 * - کلید مرجع قبلی را بدون تغییر برمی‌گرداند
 * - اگر تصویر حذف شده باشد، تصویر قبلی را پاک می‌کند
 */
export function resolveImagePayload(
  formValue: string | undefined,
  previous?: string,
): string | undefined {
  if (!formValue) {
    if (previous) removeImage(previous)
    return undefined
  }
  if (formValue.startsWith('data:')) {
    const next = saveImage(formValue)
    // اگر تصویر جدید ذخیره شد، تصویر قبلی دیگر لازم نیست
    if (next && previous && previous !== next) removeImage(previous)
    return next
  }
  return formValue
}

export type ImageReadResult =
  | { ok: true, dataUrl: string }
  | { ok: false, error: 'type' | 'size' | 'read' }

const MAX_FILE_BYTES = 8 * 1024 * 1024

/**
 * خواندن فایل تصویر، تغییر اندازه و فشرده‌سازی با canvas تا خروجی کوچک بماند.
 */
export async function readImageFile(file: File, maxDim = 1280, quality = 0.82): Promise<ImageReadResult> {
  if (!file.type.startsWith('image/')) return { ok: false, error: 'type' }
  if (file.size > MAX_FILE_BYTES) return { ok: false, error: 'size' }

  try {
    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(String(reader.result))
      reader.onerror = () => reject(reader.error)
      reader.readAsDataURL(file)
    })

    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const element = new Image()
      element.onload = () => resolve(element)
      element.onerror = () => reject(new Error('decode'))
      element.src = dataUrl
    })

    const scale = Math.min(1, maxDim / Math.max(image.naturalWidth, image.naturalHeight))
    if (scale >= 1 && file.size < 400 * 1024) {
      // تصویر کوچک است؛ نیازی به فشرده‌سازی مجدد نیست
      return { ok: true, dataUrl }
    }

    const canvas = document.createElement('canvas')
    canvas.width = Math.max(1, Math.round(image.naturalWidth * scale))
    canvas.height = Math.max(1, Math.round(image.naturalHeight * scale))
    const context = canvas.getContext('2d')
    if (!context) return { ok: true, dataUrl }
    context.drawImage(image, 0, 0, canvas.width, canvas.height)
    return { ok: true, dataUrl: canvas.toDataURL('image/jpeg', quality) }
  }
  catch {
    return { ok: false, error: 'read' }
  }
}
