<script setup lang="ts">
import type { ServiceCategory, ServiceRequest, ServiceRequestStatus } from '~/types'
import { serviceCategories, serviceRequests as requestsMock } from '~/data/mock'

const { t } = useI18n()
const toast = useToast()

useSeoMeta({
  title: t('nav.services'),
  ogTitle: t('nav.services'),
})

const { data: requestsData, pending, error, refresh } = useMockApi('service-requests', () => requestsMock, 800)

/** فهرست درخواست‌ها (موارد جدیدِ ثبت‌شده در جلسه را هم نگه می‌دارد) */
const requests = ref<ServiceRequest[]>([])

watch(requestsData, value => {
  if (value) requests.value = [...value]
}, { immediate: true })

const categoryMeta = (id: ServiceCategory) =>
  serviceCategories.find(category => category.id === id)

// ——— فیلترها ———
type Filter = 'all' | 'active' | 'closed'

const filters: { id: Filter; label: string }[] = [
  { id: 'all', label: 'همه' },
  { id: 'active', label: 'در جریان' },
  { id: 'closed', label: 'بایگانی' },
]

const activeFilter = ref<Filter>('all')

const filteredRequests = computed(() => {
  if (activeFilter.value === 'active') {
    return requests.value.filter(request => ['pending', 'in-progress'].includes(request.status))
  }
  if (activeFilter.value === 'closed') {
    return requests.value.filter(request => ['done', 'canceled'].includes(request.status))
  }
  return requests.value
})

// ——— ثبت درخواست جدید ———
const isFormOpen = ref(false)
const formTitle = ref('')
const formCategory = ref<ServiceCategory | undefined>()
const formDescription = ref('')
const formError = ref<string | undefined>()

const categoryOptions = computed(() =>
  serviceCategories.map(category => ({ label: category.label, value: category.id })),
)

function openForm() {
  formTitle.value = ''
  formCategory.value = undefined
  formDescription.value = ''
  formError.value = undefined
  isFormOpen.value = true
}

function submitRequest() {
  if (!formTitle.value.trim()) {
    formError.value = t('common.required')
    return
  }
  if (!formCategory.value) {
    formError.value = 'دسته‌بندی خدمت را انتخاب کنید.'
    return
  }

  const newRequest: ServiceRequest = {
    id: createId('sr'),
    title: formTitle.value.trim(),
    category: formCategory.value,
    status: 'pending' satisfies ServiceRequestStatus,
    createdAt: new Date(),
    description: formDescription.value.trim() || undefined,
  }

  requests.value = [newRequest, ...requests.value]
  isFormOpen.value = false
  toast.add({ title: 'درخواست شما ثبت شد', description: 'مدیریت ساختمان آن را بررسی می‌کند.', color: 'success' })
}

// ——— لغو درخواست ———
const requestToCancel = ref<ServiceRequest | null>(null)
const isCancelDialogOpen = ref(false)

function askCancel(request: ServiceRequest) {
  requestToCancel.value = request
  isCancelDialogOpen.value = true
}

function confirmCancel() {
  if (!requestToCancel.value) return
  const targetId = requestToCancel.value.id
  requests.value = requests.value.map(request =>
    request.id === targetId ? { ...request, status: 'canceled' as const } : request,
  )
  requestToCancel.value = null
  toast.add({ title: 'درخواست لغو شد', color: 'neutral' })
}
</script>

<template>
  <div class="space-y-7">
    <PageHeader
      title="خدمات"
      description="درخواست و پیگیری خدمات نگهداری ساختمان"
    >
      <template #actions>
        <UButton
          color="primary"
          variant="solid"
          size="md"
          icon="i-lucide-plus"
          label="درخواست جدید"
          @click="openForm"
        />
      </template>
    </PageHeader>

    <!-- دسته‌بندی خدمات -->
    <section>
      <SectionHeader title="دسته‌بندی خدمات" />
      <div class="grid grid-cols-3 gap-2.5 sm:gap-3">
        <button
          v-for="category in serviceCategories"
          :key="category.id"
          type="button"
          class="flex flex-col items-center gap-1.5 rounded-2xl bg-white px-1 py-3.5 shadow-sm ring-1 ring-slate-950/5 transition-shadow hover:shadow-md dark:bg-slate-900 dark:ring-white/10"
          @click="openForm(); formCategory = category.id"
        >
          <span class="flex size-10 items-center justify-center rounded-xl" :class="category.tint">
            <Icon :name="category.icon" class="size-5" />
          </span>
          <span class="text-[11px] font-semibold text-slate-600 dark:text-slate-300">{{ category.label }}</span>
        </button>
      </div>
    </section>

    <!-- درخواست‌های من -->
    <section>
      <SectionHeader title="درخواست‌های من" />

      <!-- فیلتر -->
      <div class="mb-3 grid grid-cols-3 rounded-xl bg-slate-200/60 p-1 dark:bg-slate-800/60">
        <button
          v-for="filter in filters"
          :key="filter.id"
          type="button"
          class="rounded-lg py-1.5 text-xs font-bold transition-colors"
          :class="
            activeFilter === filter.id
              ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-900 dark:text-white'
              : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
          "
          @click="activeFilter = filter.id"
        >
          {{ filter.label }}
        </button>
      </div>

      <AppCard v-if="pending">
        <LoadingState :rows="3" />
      </AppCard>

      <ErrorState v-else-if="error" @retry="refresh" />

      <EmptyState
        v-else-if="filteredRequests.length === 0"
        icon="i-lucide-clipboard-list"
        title="درخواستی ثبت نشده است"
        description="اولین درخواست خدمات خود را ثبت کنید تا در این فهرست نمایش داده شود."
      >
        <template #action>
          <UButton color="primary" variant="soft" size="sm" icon="i-lucide-plus" label="ثبت درخواست" @click="openForm" />
        </template>
      </EmptyState>

      <div v-else class="space-y-3">
        <AppCard v-for="request in filteredRequests" :key="request.id" as="article" hover>
          <div class="flex items-start gap-3">
            <span
              class="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-xl"
              :class="categoryMeta(request.category)?.tint"
            >
              <Icon :name="categoryMeta(request.category)?.icon ?? 'i-lucide-wrench'" class="size-5" />
            </span>
            <div class="min-w-0 flex-1">
              <div class="flex items-start justify-between gap-2">
                <h3 class="text-sm font-bold text-slate-800 dark:text-slate-100">{{ request.title }}</h3>
                <StatusBadge :status="request.status" class="shrink-0" />
              </div>
              <p v-if="request.description" class="mt-1 line-clamp-2 text-xs leading-5 text-slate-500 dark:text-slate-400">
                {{ request.description }}
              </p>
              <div class="mt-2 flex items-center justify-between">
                <p class="text-[11px] text-slate-400 dark:text-slate-500">
                  {{ categoryMeta(request.category)?.label }} • {{ formatRelative(request.createdAt) }}
                </p>
                <button
                  v-if="request.status === 'pending'"
                  type="button"
                  class="flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-bold text-red-500 transition-colors hover:bg-red-50 dark:hover:bg-red-400/10"
                  @click="askCancel(request)"
                >
                  <Icon name="i-lucide-x-circle" class="size-3.5" />
                  لغو درخواست
                </button>
              </div>
            </div>
          </div>
        </AppCard>
      </div>
    </section>

    <!-- فرم درخواست جدید -->
    <UModal v-model:open="isFormOpen" title="ثبت درخواست خدمات" :description="'نوع خدمت و جزئیات آن را بنویسید.'" :ui="{ content: 'max-w-md' }">
      <template #body>
        <div class="space-y-4">
          <BaseTextField
            v-model="formTitle"
            label="عنوان درخواست"
            required
            placeholder="مثلاً: تعمیر درب پارکینگ"
            :error="formError && !formTitle.trim() ? formError : undefined"
            @update:model-value="formError = undefined"
          />
          <BaseSelectField
            v-model="formCategory"
            label="دسته‌بندی خدمت"
            required
            placeholder="انتخاب کنید…"
            :items="categoryOptions"
          />
          <BaseTextAreaField
            v-model="formDescription"
            label="توضیحات"
            :hint="`${t('common.optional')} — جزئیات بیشتر به انجام سریع‌تر کمک می‌کند.`"
            placeholder="جزئیات مشکل یا محل آن را بنویسید…"
          />
          <p v-if="formError && !formCategory" class="text-xs font-medium text-red-600 dark:text-red-400">
            {{ formError }}
          </p>
        </div>
      </template>
      <template #footer>
        <div class="flex w-full flex-row-reverse gap-2">
          <UButton color="primary" variant="solid" size="md" block label="ثبت درخواست" @click="submitRequest" />
          <UButton color="neutral" variant="soft" size="md" block :label="t('common.cancel')" @click="isFormOpen = false" />
        </div>
      </template>
    </UModal>

    <!-- تأیید لغو درخواست -->
    <ConfirmDialog
      v-model:open="isCancelDialogOpen"
      title="لغو درخواست"
      :description="`آیا از لغو «${requestToCancel?.title ?? ''}» مطمئن هستید؟ این کار قابل بازگشت نیست.`"
      tone="danger"
      confirm-label="بله، لغو شود"
      @confirm="confirmCancel"
    />
  </div>
</template>
