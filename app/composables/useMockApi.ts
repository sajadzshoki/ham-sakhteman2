/**
 * شبیه‌سازی دریافت داده از API روی دیتای ماک.
 * در فازهای بعدی با فراخوانی‌های واقعی سرور جایگزین می‌شود.
 */
export function useMockApi<DataT>(
  key: string,
  producer: () => DataT,
  delayMs = 650,
) {
  return useAsyncData<DataT>(key, async () => {
    await delay(delayMs)
    return producer()
  })
}
