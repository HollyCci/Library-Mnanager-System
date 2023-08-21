const analyzeData: AuthRoute.Route = {
  name: 'analyze-data',
  path: '/analyze-data',
  component: 'basic',
  children: [
    {
      name: 'analyze-data_bookData',
      path: '/analyze-data/bookData',
      component: 'self',
      meta: {
        title: '图书数据',
        i18nTitle: 'routes.analyze-data.book-data',
        requiresAuth: true,
        icon: 'carbon:data-base-alt'
      }
    },
    {
      name: 'analyze-data_borrowData',
      path: '/analyze-data/borrowData',
      component: 'self',
      meta: {
        title: '借阅数据',
        i18nTitle: 'routes.analyze-data.borrow-data',
        requiresAuth: true,
        icon: 'bi:clipboard-data-fill'
      }
    },
    {
      name: 'analyze-data_stackData',
      path: '/analyze-data/stackData',
      component: 'self',
      meta: {
        title: '库存数据',
        i18nTitle: 'routes.analyze-data.stack-data',
        requiresAuth: true,
        icon: 'academicons:open-data'
      }
    },
    {
      name: 'analyze-data_userData',
      path: '/analyze-data/userData',
      component: 'self',
      meta: {
        title: '用户数据',
        i18nTitle: 'routes.analyze-data.user-data',
        requiresAuth: true,
        icon: 'eos-icons:data-scientist-outlined'
      }
    }
  ],
  meta: {
    title: '数据分析',
    i18nTitle: 'routes.analyze-data._value',
    requiresAuth: true,
    icon: 'icon-park:data-sheet'
  }
};

export default analyzeData;
