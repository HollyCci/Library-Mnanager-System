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
    },
    {
      name: 'reader_book-info',
      path: '/reader/book-info',
      component: 'self',
      meta: {
        title: '图书详情',
        requiresAuth: true,
        hide: true,
        activeMenu: 'reader_borrow',
        icon: 'pajamas:details-block'
      }
    },
    {
      name: 'reader_borrow-detail',
      path: '/reader/borrow-detail',
      component: 'self',
      meta: {
        title: '借阅详情',
        requiresAuth: true,
        hide: true,
        activeMenu: 'reader_info',
        icon: 'pajamas:details-block'
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
