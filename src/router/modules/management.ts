const management: AuthRoute.Route = {
  name: 'management',
  path: '/management',
  component: 'basic',
  children: [
    {
      name: 'management_user',
      path: '/management/user',
      component: 'self',
      meta: {
        title: '用户管理',
        i18nTitle: 'routes.management.user',
        requiresAuth: true,
        icon: 'ic:round-manage-accounts'
      }
    },
    {
      name: 'management_route',
      path: '/management/route',
      component: 'self',
      meta: {
        title: '路由管理',
        i18nTitle: 'routes.management.route',
        requiresAuth: true,
        icon: 'material-symbols:route'
      }
    }
  ],
  meta: {
    title: '系统管理',
    i18nTitle: 'routes.management._value',
    icon: 'carbon:cloud-service-management',
    order: 2
  }
};

export default management;
