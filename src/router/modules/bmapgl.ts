const bmapgl: AuthRoute.Route = {
  name: 'BMapGL',
  path: '/BMapGL',
  component: 'basic',
  children: [
    {
      name: 'BMapGL_showInfo',
      path: '/BMapGL/showInfo',
      component: 'self',
      meta: {
        title: '我的位置',
        i18nTitle: 'routes.bmapgl.show_info',
        requiresAuth: true,
        icon: 'carbon:map'
      }
    }
  ],
  meta: {
    title: '地图功能',
    i18nTitle: 'routes.bmapgl._value',
    icon: 'charm:map',
    order: 8
  }
};

export default bmapgl;
