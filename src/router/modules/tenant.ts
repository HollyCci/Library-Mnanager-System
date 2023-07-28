const tenant: AuthRoute.Route = {
  name: 'tenant',
  path: '/tenant',
  component: 'basic',
  children: [
    {
      name: 'tenant_management',
      path: '/tenant/management',
      component: 'self',
      meta: {
        title: '租户列表',
        i18nTitle: 'routes.tenant.management',
        requiresAuth: true,
        icon: 'nonicons:class-16'
      }
    },
    {
      name: 'tenant_packages',
      path: '/tenant/packages',
      component: 'self',
      meta: {
        title: '租户套餐',
        i18nTitle: 'routes.tenant.packages',
        requiresAuth: true,
        icon: 'teenyicons:webpack-outline'
      }
    }
  ],
  meta: {
    title: '租户管理',
    i18nTitle: 'routes.tenant._value',
    icon: 'fluent-emoji-high-contrast:classical-building',
    order: 3
  }
};
export default tenant;
