export default defineNuxtRouteMiddleware((to) => {
  const store = useAppStore()
  store.ensureSeeded()

  const { user, pendingJoinCode } = useAuth()

  // صفحات ورود برای کاربر لاگین‌شده در دسترس نیست
  if ((to.path === '/auth/login' || to.path === '/auth/register') && user.value) {
    return navigateTo('/')
  }

  // آنبردینگ: فقط مدیرِ بدون ساختمان
  if (to.path === '/onboarding') {
    if (!user.value) return navigateTo('/auth/login')
    if (user.value.role !== 'manager') return navigateTo('/')
    if (store.buildingOfUser(user.value) && to.query.force === undefined) {
      return navigateTo('/building')
    }
  }

  // پیوستن بدون ورود: کد را ذخیره کن و به صفحه ورود بفرست
  if (to.path === '/join' && !user.value) {
    const code = typeof to.query.code === 'string' ? to.query.code : undefined
    if (code) pendingJoinCode.value = code.toUpperCase()
    return navigateTo('/auth/login')
  }

  // اطلاعیه‌ها و گزارش مشکلات: نیازمند ورود و عضویت در ساختمان
  if (to.path === '/announcements' || to.path.startsWith('/announcements/')
    || to.path === '/problems' || to.path.startsWith('/problems/')) {
    if (!user.value) return navigateTo('/auth/login')
    if (!store.buildingOfUser(user.value)) return navigateTo('/building')
    // ایجاد و ویرایش اطلاعیه فقط برای مدیر
    const isAnnouncementWrite = to.path === '/announcements/new' || /^\/announcements\/[^/]+\/edit$/.test(to.path)
    if (isAnnouncementWrite && user.value.role !== 'manager') return navigateTo('/announcements')
  }

  // صفحات داخلی ساختمان
  if (to.path.startsWith('/building/') && to.path !== '/building') {
    if (!user.value) return navigateTo('/auth/login')
    if (!store.buildingOfUser(user.value)) return navigateTo('/building')
    if (to.path === '/building/invite' && user.value.role !== 'manager') {
      return navigateTo('/building')
    }
  }
})
