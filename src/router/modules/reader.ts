const reader: AuthRoute.Route = {
  name: 'reader',
  path: '/reader',
  component: 'basic',
  children: [
    {
      name: 'reader_borrow',
      path: '/reader/borrow',
      component: 'self',
      meta: {
        title: '借阅图书',
        i18nTitle: 'routes.reader.borrow',
        requiresAuth: true,
        icon: 'line-md:beer-filled'
      }
    },
    {
      name: 'reader_info',
      path: '/reader/info',
      component: 'self',
      meta: {
        title: '我的借阅',
        i18nTitle: 'routes.reader.info',
        requiresAuth: true,
        icon: 'line-md:calendar'
      }
    }
  ],
  meta: {
    title: '读者服务',
    i18nTitle: 'routes.reader._value',
    icon: 'line-md:laptop-twotone',
    order: 6
  }
};
export default reader;
