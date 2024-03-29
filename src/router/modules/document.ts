const document: AuthRoute.Route = {
  name: 'document',
  path: '/document',
  component: 'basic',
  children: [
    {
      name: 'document_vue',
      path: '/document/vue',
      component: 'self',
      meta: {
        title: 'vue文档',
        i18nTitle: 'routes.document.vue',
        requiresAuth: true,
        icon: 'logos:vue'
      }
    },
    {
      name: 'document_vite',
      path: '/document/vite',
      component: 'self',
      meta: {
        title: 'vite文档',
        i18nTitle: 'routes.document.vite',
        requiresAuth: true,
        icon: 'logos:vitejs'
      }
    },
    {
      name: 'document_naive',
      path: '/document/naive',
      component: 'self',
      meta: {
        title: 'naive文档',
        i18nTitle: 'routes.document.naive',
        requiresAuth: true,
        icon: 'logos:naiveui'
      }
    },
    {
      name: 'document_lihaha',
      path: '/document/lihaha',
      component: 'self',
      meta: {
        title: '程序员知识库',
        i18nTitle: 'routes.document.ldoc',
        requiresAuth: true,
        icon: 'logos:active-campaign-icon'
      }
    },
    {
      name: 'document_project',
      path: '/document/project',
      component: 'self',
      meta: {
        title: '项目文档',
        i18nTitle: 'routes.document.project',
        requiresAuth: true,
        localIcon: 'logo'
      }
    },
    {
      name: 'document_update-log',
      path: '/document/update-log',
      component: 'self',
      meta: {
        title: '更新日志',
        i18nTitle: 'routes.document.update-log',
        requiresAuth: true,
        localIcon: 'vscode-icons:file-type-jsbeautify'
      }
    },
    {
      name: 'document_project-link',
      path: '/document/project-link',
      meta: {
        title: '项目文档(外链)',
        i18nTitle: 'routes.document.project-link',
        requiresAuth: true,
        localIcon: 'logo',
        href: 'https://docs.soybean.pro/'
      }
    }
  ],
  meta: {
    title: '文档',
    i18nTitle: 'routes.document._value',
    icon: 'mdi:file-document-multiple-outline',
    order: 8
  }
};

export default document;
