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
      name: 'management_dept',
      path: '/management/dept',
      component: 'self',
      meta: {
        title: '部门管理',
        i18nTitle: 'routes.management.dept',
        requiresAuth: true,
        icon: 'prime:sitemap'
      }
    },
    {
      name: 'management_class',
      path: '/management/class',
      component: 'self',
      meta: {
        title: '班级管理',
        i18nTitle: 'routes.management.class',
        requiresAuth: true,
        icon: 'solar:home-linear'
      }
    },
    {
      name: 'management_dict',
      path: '/management/dict',
      component: 'self',
      meta: {
        title: '字典管理',
        i18nTitle: 'routes.management.dict',
        icon: 'fluent-mdl2:dictionary'
      }
    },
    {
      name: 'management_notice',
      path: '/management/notice',
      component: 'self',
      meta: {
        title: '通知公告',
        i18nTitle: 'routes.management.notice',
        icon: 'fe:notice-push'
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
