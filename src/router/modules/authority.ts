const authority: AuthRoute.Route = {
  name: 'authority',
  path: '/authority',
  component: 'basic',
  children: [
    {
      name: 'authority_role',
      path: '/authority/role',
      component: 'self',
      meta: {
        title: '角色管理',
        i18nTitle: 'routes.authority.role',
        requiresAuth: true,
        icon: 'carbon:user-role'
      }
    },
    {
      name: 'authority_menu',
      path: '/authority/menu',
      component: 'self',
      meta: {
        title: '菜单管理',
        i18nTitle: 'routes.authority.menu',
        icon: 'pepicons-pop:menu'
      }
    },
    {
      name: 'authority_token',
      path: '/authority/token',
      component: 'self',
      meta: {
        title: '令牌管理',
        i18nTitle: 'routes.authority.token',
        icon: 'material-symbols:token'
      }
    }
  ],
  meta: {
    title: '权限管理',
    i18nTitle: 'routes.authority._value',
    icon: 'ic:baseline-security',
    order: 3
  }
};

export default authority;
