const book: AuthRoute.Route = {
  name: 'book',
  path: '/book',
  component: 'basic',
  children: [
    {
      name: 'book_books',
      path: '/book/books',
      component: 'self',
      meta: {
        title: '馆藏图书',
        i18nTitle: 'routes.book.books',
        requiresAuth: true,
        icon: 'ion:library'
      }
    },
    {
      name: 'book_stack',
      path: '/book/stack',
      component: 'self',
      meta: {
        title: '书库管理',
        i18nTitle: 'routes.book.stack',
        requiresAuth: true,
        icon: 'fa6-solid:warehouse'
      }
    },
    {
      name: 'book_inventory',
      path: '/book/inventory',
      component: 'self',
      meta: {
        title: '库存管理',
        i18nTitle: 'routes.book.inventory',
        requiresAuth: true,
        icon: 'material-symbols:inventory-2'
      }
    },
    {
      name: 'book_category',
      path: '/book/category',
      component: 'self',
      meta: {
        title: '分类管理',
        i18nTitle: 'routes.book.category',
        requiresAuth: true,
        icon: 'mingcute:classify-2-fill'
      }
    },
    {
      name: 'book_borrow',
      path: '/book/borrow',
      component: 'self',
      meta: {
        title: '借阅管理',
        i18nTitle: 'routes.book.borrow',
        requiresAuth: true,
        icon: 'pepicons-pop:book'
      }
    },
    {
      name: 'book_subject',
      path: '/book/subject',
      component: 'self',
      meta: {
        title: '主题词管理',
        i18nTitle: 'routes.book.subject',
        requiresAuth: true,
        icon: 'maki:terminal'
      }
    },
    {
      name: 'book_book-info',
      path: '/book/book-info',
      component: 'self',
      meta: {
        title: '图书详情',
        requiresAuth: true,
        hide: true,
        multiTab: true,
        activeMenu: 'book_books',
        icon: 'pajamas:details-block'
      }
    },
    {
      name: 'book_book-create',
      path: '/book/book-create',
      component: 'self',
      meta: {
        title: '图书新增',
        requiresAuth: true,
        hide: true,
        multiTab: true,
        activeMenu: 'book_books',
        icon: 'pajamas:details-block'
      }
    }
  ],
  meta: {
    title: '图书管理',
    i18nTitle: 'routes.book._value',
    icon: 'fa6-solid:book',
    order: 5
  }
};

export default book;
