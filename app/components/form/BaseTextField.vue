<script setup lang="ts">
withDefaults(
  defineProps<{
    label?: string
    hint?: string
    error?: string
    required?: boolean
    type?: string
    placeholder?: string
    icon?: string
    disabled?: boolean
    /** جهت متن ورودی؛ برای شماره موبایل و کدها از «ltr» استفاده می‌شود */
    dir?: 'rtl' | 'ltr'
  }>(),
  {
    label: undefined,
    hint: undefined,
    error: undefined,
    type: 'text',
    placeholder: undefined,
    icon: undefined,
    disabled: false,
    dir: undefined,
  },
)

const model = defineModel<string>({ default: '' })
</script>

<template>
  <UFormField :label="label" :hint="hint" :error="error" :required="required" size="lg" class="w-full">
    <UInput
      v-model="model"
      :type="type"
      :placeholder="placeholder"
      :icon="icon"
      :disabled="disabled"
      :dir="dir"
      size="lg"
      class="w-full"
    />
  </UFormField>
</template>
