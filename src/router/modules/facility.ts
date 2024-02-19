const facility: AuthRoute.Route = {
  name: 'facility',
  path: '/facility',
  component: 'basic',
  children: [
    {
      name: 'facility_scheduled-tasks',
      path: '/facility/scheduled-tasks',
      component: 'self',
      meta: {
        title: '定时任务',
        i18nTitle: 'routes.facility.scheduled-tasks',
        requiresAuth: true,
        icon: 'mdi:clock-time-eight-outline'
      }
    },
    {
      name: 'facility_database-documents',
      path: '/facility/database-documents',
      component: 'self',
      meta: {
        title: '数据库文档',
        i18nTitle: 'routes.facility.database-documents',
        requiresAuth: true,
        icon: 'mdi:database'
      }
    },
    {
      name: 'facility_api-interface-documents',
      path: '/facility/api-interface-documents',
      component: 'self',
      meta: {
        title: '系统接口',
        i18nTitle: 'routes.facility.api-interface-documents',
        requiresAuth: true,
        icon: 'mdi:application-export'
      }
    },
    {
      name: 'facility_audit-log',
      path: '/facility/audit-log',
      component: 'multi',
      children: [
        {
          name: 'facility_audit-log_login-log',
          path: '/facility/audit-log/login-log',
          component: 'self',
          meta: {
            title: '登录日志',
            i18nTitle: 'routes.facility.login-log',
            requiresAuth: true,
            icon: 'ant-design:login-outlined'
          }
        },
        {
          name: 'facility_audit-log_operate-log',
          path: '/facility/audit-log/operate-log',
          component: 'self',
          meta: {
            title: '操作日志',
            i18nTitle: 'routes.facility.operate-log',
            requiresAuth: true,
            icon: 'ant-design:file-done-outlined'
          }
        }
      ],
      meta: {
        title: '审计日志',
        i18nTitle: 'routes.facility.audit-log',
        icon: 'ant-design:audit-outlined'
      }
    },
    {
      name: 'facility_apiLog',
      path: '/facility/apiLog',
      component: 'multi',
      children: [
        {
          name: 'facility_apiLog_access-log',
          path: '/facility/apiLog/access-log',
          component: 'self',
          meta: {
            title: '访问日志',
            i18nTitle: 'routes.facility.accessLog',
            requiresAuth: true,
            icon: 'arcticons:greenpass'
          }
        },
        {
          name: 'facility_apiLog_exception-log',
          path: '/facility/apiLog/exception-log',
          component: 'self',
          meta: {
            title: '异常日志',
            i18nTitle: 'routes.facility.exceptionLog',
            requiresAuth: true,
            icon: 'ant-design:exception-outlined'
          }
        }
      ],
      meta: {
        title: 'API日志',
        i18nTitle: 'routes.facility.apiLog',
        icon: 'pajamas:log'
      }
    },
    {
      name: 'facility_mysql',
      path: '/facility/mysql',
      component: 'self',
      meta: {
        title: 'MySQL监控',
        i18nTitle: 'routes.facility.mysql',
        requiresAuth: true,
        icon: 'cib:mysql'
      }
    },
    {
      name: 'facility_redis',
      path: '/facility/redis',
      component: 'self',
      meta: {
        title: 'Redis监控',
        i18nTitle: 'routes.facility.redis',
        requiresAuth: true,
        icon: 'cib:redis'
      }
    }
  ],
  meta: {
    title: '系统设施',
    i18nTitle: 'routes.facility._value',
    icon: 'gg:browser',
    order: 8
  }
};

export default facility;
