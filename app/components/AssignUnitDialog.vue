<script setup lang="ts">
import type { BuildingMember, UnitStatus } from '~/types'

const props = defineProps<{
  buildingId: string
  member: BuildingMember | null
}>()

const store = useAppStore()
const toast = useToast()

const open = defineModel<boolean>('open', { default: false })

const unitId = ref('')
const unitStatus = ref<UnitStatus>('owner')

/** واحدهای قابل تخصیص: واحدهای خالی + واحد فعلی خود عضو */
const unitOptions = computed(() => {
  if (!props.member) return []
  const occupiedByOthers = new Set(
    store
      .buildingMembers(props.buildingId)
      .filter(member => member.id !== props.member?.id && member.unitId)
      .map(member => member.unitId),
  )
  return [
    { label: 'بدون واحد', value: '' },
    ...store
      .buildingUnits(props.buildingId)
      .filter(unit => !occupiedByOthers.has(unit.id))
      .map(unit => ({ label: `واحد ${toPersianDigits(unit.number)} — طبقه ${toPersianDigits(unit.floor)}`, value: unit.id })),
  ]
})

watch(open, (value) => {
  if (!value || !props.member) return
  unitId.value = props.member.unitId ?? ''
  unitStatus.value = props.member.unitStatus ?? 'owner'
})

function submit() {
  if (!props.member) return
  store.assignMemberToUnit(props.member.id, unitId.value || null, unitId.value ? unitStatus.value : undefined)
  toast.add({
    title: unitId.value ? 'واحد به عضو تخصیص یافت' : 'عضو از واحد جدا شد',
    color: 'success',
  })
  open.value = false
}
</script>

<template>
  <UModal
    v-model:open="open"
    title="تخصیص واحد"
    :description="member ? `واحد ${member.name} را انتخاب کنید` : ''"
    :ui="{ content: 'max-w-md' }"
  >
    <template #body>
      <form class="space-y-4" @submit.prevent="submit">
        <BaseSelectField v-model="unitId" label="واحد" :items="unitOptions" />
        <BaseSelectField
          v-if="unitId"
          v-model="unitStatus"
          label="وضعیت سکونت"
          :items="[{ label: 'مالک', value: 'owner' }, { label: 'مستأجر', value: 'tenant' }]"
        />
        <div class="flex w-full flex-row-reverse gap-2">
          <UButton type="submit" color="primary" variant="solid" size="md" block label="ذخیره" />
          <UButton type="button" color="neutral" variant="soft" size="md" block label="انصراف" @click="open = false" />
        </div>
      </form>
    </template>
  </UModal>
</template>
