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
      name: 'book_borrow',
      path: '/book/borrow',
      component: 'self',
      meta: {
        title: '借阅管理',
        i18nTitle: 'routes.book.borrow',
        requiresAuth: true,
        icon: 'pepicons-pop:book'
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
