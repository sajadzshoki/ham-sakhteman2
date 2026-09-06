<script setup lang="ts">
/**
 * نمایش تصویر با حالت‌های بارگذاری و خطا.
 * مقدار `src` می‌تواند یک دیتای مستقیم (مثل SVG دیتایوآرال) یا کلید مرجع
 * `img:` باشد که تصویر واقعی آن در حافظه محلی مرورگر نگهداری می‌شود.
 * رندر سرور همیشه اسکلت نمایش می‌دهد تا با رندر اولیه کلاینت هم‌خوان بماند.
 */
const props = withDefaults(
  defineProps<{
    src: string
    alt?: string
    /** کلاس نسبت تصویر؛ مثال: aspect-video یا aspect-[4/3] */
    aspect?: string
    rounded?: string
  }>(),
  {
    alt: '',
    aspect: 'aspect-video',
    rounded: 'rounded-xl',
  },
)

const resolved = ref<string | null>(null)
const failed = ref(false)

function resolve(value: string) {
  failed.value = false
  if (isImageKey(value)) {
    const data = loadImage(value)
    resolved.value = data
    // در سرور اسکلت نگه می‌داریم؛ در کلاینت اگر تصویر پیدا نشد حالت خطا نشان بده
    failed.value = !data && import.meta.client
    return
  }
  resolved.value = value
}

onMounted(() => resolve(props.src))
watch(() => props.src, resolve)
</script>

<template>
  <div :class="[rounded, 'overflow-hidden bg-slate-100 dark:bg-slate-800/70']">
    <img
      v-if="resolved && !failed"
      :src="resolved"
      :alt="alt"
      loading="lazy"
      :class="[aspect, 'w-full object-cover']"
      @error="failed = true"
    >
    <div
      v-else-if="failed"
      :class="[aspect, 'flex w-full flex-col items-center justify-center gap-1.5 text-slate-400 dark:text-slate-500']"
    >
      <Icon name="i-lucide-image-off" class="size-7" />
      <span class="text-[11px] font-medium">تصویر در دسترس نیست</span>
    </div>
    <div v-else :class="[aspect, 'w-full animate-pulse bg-slate-200 dark:bg-slate-700/60']" />
  </div>
</template>
