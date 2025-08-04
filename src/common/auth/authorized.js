import { storeToRefs } from 'pinia'
import { getAllRoutes } from '@/helpers/route.js'
import { useUserStore } from '@/stores/user.js'

export const authorized = (to, next, router) => {
  const { user } = storeToRefs(useUserStore())
  const routePermissionName = to.meta.permission
  const permissions = new Set(user.value.permissions.map(
    ({ permission }) => permission.name,
  ))
  const routes = getAllRoutes(router.options.routes)

  if (!!routePermissionName && !permissions.has(routePermissionName)) {
    const firstRoute = routes.find(
      r =>
        r.meta && r.meta.permission && permissions.has(r.meta.permission),
    )

    router.push({ name: firstRoute ? firstRoute.name : '404' })
  }

  next()
}
