<script setup lang="ts">
const router = useRouter()
const { user, isManager } = useAuth()
const store = useAppStore()

useSeoMeta({
  title: 'اطلاعیه‌ها',
  ogTitle: 'اطلاعیه‌ها',
})

const building = computed(() => store.buildingOfUser(user.value))

const announcements = computed(() =>
  building.value ? store.buildingAnnouncements(building.value.id) : [],
)

function goNew() {
  router.push('/announcements/new')
}
</script>

<template>
  <div class="space-y-5">
    <PageHeader title="اطلاعیه‌ها" description="اخبار و اطلاع‌رسانی‌های ساختمان">
      <template v-if="isManager" #actions>
        <UButton color="primary" variant="solid" size="md" label="اطلاعیه جدید" icon="i-lucide-plus" @click="goNew" />
      </template>
    </PageHeader>

    <!-- حالت بارگذاری اولیه استور (بذرپاشی در اولین بازدید) -->
    <LoadingState v-if="!building" :rows="3" />

    <template v-else-if="announcements.length">
      <div class="space-y-3">
        <NuxtLink
          v-for="announcement in announcements"
          :key="announcement.id"
          :to="`/announcements/${announcement.id}`"
          class="block"
        >
          <AppCard as="article" hover>
            <div class="flex items-center justify-between gap-2">
              <StatusBadge :status="announcement.importance" />
              <time class="shrink-0 text-[11px] text-slate-400 dark:text-slate-500">
                {{ formatRelative(announcement.createdAt) }}
              </time>
            </div>
            <h2 class="mt-2.5 text-sm font-bold text-slate-800 dark:text-slate-100">
              {{ announcement.title }}
            </h2>
            <p class="mt-1 line-clamp-2 text-xs leading-5 text-slate-500 dark:text-slate-400">
              {{ announcement.body }}
            </p>
            <AppImage
              v-if="announcement.image"
              :src="announcement.image"
              :alt="announcement.title"
              aspect="aspect-[3/1.2]"
              class="mt-3"
            />
            <p class="mt-3 flex items-center gap-1.5 text-[11px] font-medium text-slate-400 dark:text-slate-500">
              <Icon name="i-lucide-user-round" class="size-3.5" />
              {{ announcement.createdByName }}
            </p>
          </AppCard>
        </NuxtLink>
      </div>
    </template>

    <EmptyState
      v-else
      icon="i-lucide-megaphone"
      title="هنوز اطلاعیه‌ای ثبت نشده"
      :description="isManager
        ? 'اولین اطلاعیه ساختمان را ثبت کنید تا همه ساکنین در جریان قرار بگیرند.'
        : 'به‌زودی اطلاعیه‌های ساختمان اینجا نمایش داده می‌شود.'"
    >
      <template v-if="isManager" #action>
        <UButton color="primary" variant="solid" size="md" label="ایجاد اطلاعیه" icon="i-lucide-plus" @click="goNew" />
      </template>
    </EmptyState>
  </div>
</template>
