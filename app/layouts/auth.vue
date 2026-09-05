<template>
  <div class="flex min-h-dvh flex-col">
    <header class="flex items-center justify-center px-4 pt-10 pb-6">
      <NuxtLink to="/" class="flex items-center gap-2.5">
        <span class="flex size-10 items-center justify-center rounded-xl bg-teal-600 text-white shadow-sm">
          <Icon name="i-lucide-building-2" class="size-5.5" />
        </span>
        <span class="text-lg font-extrabold tracking-tight text-slate-900 dark:text-white">
          هم‌ساختمان
        </span>
      </NuxtLink>
    </header>
    <main class="mx-auto w-full max-w-md flex-1 px-4 pb-12">
      <slot />
    </main>
  </div>
</template>
