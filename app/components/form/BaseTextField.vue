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
  }>(),
  {
    label: undefined,
    hint: undefined,
    error: undefined,
    type: 'text',
    placeholder: undefined,
    icon: undefined,
    disabled: false,
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
      size="lg"
      class="w-full"
    />
  </UFormField>
</template>
