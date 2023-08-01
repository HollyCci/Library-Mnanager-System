const about: AuthRoute.Route = {
  name: 'about',
  path: '/about',
  component: 'self',
  meta: {
    title: '关于',
    i18nTitle: 'routes.about',
    requiresAuth: true,
    keepAlive: true,
    singleLayout: 'basic',
    // permissions: ['super_admin', 'admin', 'user', 'common'],
    icon: 'fluent:book-information-24-regular',
    order: 13
  }
};

export default about;
