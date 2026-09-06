<script setup lang="ts">
import type { BuildingUnit } from '~/types'

const props = withDefaults(
  defineProps<{
    buildingId: string
    /** در حالت ویرایش، واحد موردنظر */
    unit?: BuildingUnit | null
  }>(),
  {
    unit: null,
  },
)

const emit = defineEmits<{ saved: [] }>()

const store = useAppStore()
const toast = useToast()

const open = defineModel<boolean>('open', { default: false })

const isEdit = computed(() => props.unit !== null)
const title = computed(() => (isEdit.value ? 'ویرایش واحد' : 'افزودن واحد'))

const number = ref('')
const floor = ref('')
const numberError = ref('')
const floorError = ref('')

watch(open, (value) => {
  if (!value) return
  number.value = props.unit ? String(props.unit.number) : ''
  floor.value = props.unit ? String(props.unit.floor) : ''
  numberError.value = ''
  floorError.value = ''
})

function submit() {
  numberError.value = ''
  floorError.value = ''

  const unitNumber = Number.parseInt(number.value, 10)
  const unitFloor = Number.parseInt(floor.value, 10)

  if (!number.value || Number.isNaN(unitNumber) || unitNumber <= 0) {
    numberError.value = 'شماره واحد را با عدد معتبر وارد کنید.'
    return
  }
  if (!floor.value || Number.isNaN(unitFloor) || unitFloor <= 0) {
    floorError.value = 'طبقه را با عدد معتبر وارد کنید.'
    return
  }

  const duplicate = store.buildingUnits(props.buildingId).some(
    item => item.number === unitNumber && item.id !== props.unit?.id,
  )
  if (duplicate) {
    numberError.value = `واحد ${toPersianDigits(unitNumber)} قبلاً ثبت شده است.`
    return
  }

  if (isEdit.value && props.unit) {
    store.updateUnit(props.unit.id, { number: unitNumber, floor: unitFloor })
    toast.add({ title: 'واحد به‌روزرسانی شد', color: 'success' })
  }
  else {
    store.addUnit(props.buildingId, { number: unitNumber, floor: unitFloor })
    toast.add({ title: 'واحد اضافه شد', color: 'success' })
  }

  open.value = false
  emit('saved')
}
</script>

<template>
  <UModal v-model:open="open" :title="title" description="شماره واحد و طبقه آن را وارد کنید" :ui="{ content: 'max-w-md' }">
    <template #body>
      <form class="space-y-4" @submit.prevent="submit">
        <div class="grid grid-cols-2 gap-3">
          <BaseTextField
            v-model="number"
            label="شماره واحد"
            required
            type="number"
            placeholder="مثلاً: ۵"
            :error="numberError"
            @update:model-value="numberError = ''"
          />
          <BaseTextField
            v-model="floor"
            label="طبقه"
            required
            type="number"
            placeholder="مثلاً: ۳"
            :error="floorError"
            @update:model-value="floorError = ''"
          />
        </div>
        <div class="flex w-full flex-row-reverse gap-2">
          <UButton type="submit" color="primary" variant="solid" size="md" block :label="isEdit ? 'ذخیره تغییرات' : 'افزودن واحد'" />
          <UButton type="button" color="neutral" variant="soft" size="md" block label="انصراف" @click="open = false" />
        </div>
      </form>
    </template>
  </UModal>
</template>
