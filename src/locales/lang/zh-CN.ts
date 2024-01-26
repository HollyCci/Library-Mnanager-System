const locale: I18nType.Schema = {
  system: {
    title: '郑州工商学院-图书馆'
  },
  common: {
    add: '添加',
    addSuccess: '添加成功',
    edit: '修改',
    editSuccess: '修改成功',
    delete: '删除',
    deleteSuccess: '删除成功',
    batchDelete: '批量删除',
    confirm: '确认',
    cancel: '取消',
    pleaseCheckValue: '请检查输入的值是否合法',
    action: '操作'
  },
  routes: {
    dashboard: {
      _value: '仪表盘',
      analysis: '分析页',
      workbench: '工作台',
      'Intelligent recommendation': '猜你喜欢'
    },
    document: {
      _value: '文档',
      vue: 'Vue文档',
      vite: 'Vite文档',
      naive: 'NaiveUI文档',
      ldoc: '程序员知识库',
      project: '项目文档',
      'project-link': '项目文档(外链)',
      'update-log': '更新日志'
    },
    component: {
      _value: '组件示例',
      button: '按钮',
      card: '卡片',
      table: '表格'
    },
    plugin: {
      _value: '插件示例',
      charts: {
        _value: '图表',
        echarts: 'ECharts',
        antv: 'AntV'
      },
      copy: '剪贴板',
      editor: {
        _value: '编辑器',
        quill: '富文本',
        markdown: 'Markdown'
      },
      icon: '图标',
      map: '地图',
      print: '打印',
      swiper: 'Swiper',
      video: '视频'
    },
    'auth-demo': {
      _value: '权限示例',
      permission: '切换权限',
      super: '超级管理员可见'
    },
    function: {
      _value: '功能',
      tab: 'Tab页签',
      upload_image: '上传图片'
    },
    exception: {
      _value: '异常页',
      403: '403',
      404: '404',
      500: '500'
    },
    management: {
      _value: '系统管理',
      route: '路由管理',
      user: '用户管理',
      dept: '部门管理',
      post: '岗位管理',
      class: '班级管理',
      notice: '通知管理',
      dict: '字典管理'
    },
    tenant: {
      _value: '租户管理',
      management: '租户列表',
      packages: '租户套餐'
    },
    book: {
      _value: '图书管理',
      books: '馆藏图书',
      subject: '主题词管理',
      category: '分类管理',
      borrow: '借阅管理',
      stack: '书库管理',
      inventory: '库存管理'
    },
    'analyze-data': {
      _value: '数据分析',
      'book-data': '图书数据',
      'borrow-data': '借阅数据',
      'stack-data': '库存数据',
      'user-data': '用户数据'
    },
    reader: {
      _value: '读者服务',
      borrow: '借阅图书',
      info: '我的借阅'
    },
    authority: {
      _value: '权限管理',
      role: '角色管理',
      menu: '菜单管理',
      token: '令牌管理'
    },
    bmapgl: {
      _value: '地图功能',
      show_info: '我的位置'
    },
    facility: {
      _value: '系统设施',
      'scheduled-tasks': '定时任务',
      'api-interface-documents': '系统接口',
      'database-documents': '数据库文档',
      apiLog: 'API日志',
      accessLog: '访问日志',
      exceptionLog: '异常日志',
      mysql: 'MySQL监控',
      redis: 'Redis监控'
    },
    about: '关于'
  },
  layout: {
    settingDrawer: {
      title: '主题配置',
      themeModeTitle: '主题模式',
      darkMode: '深色主题',
      layoutModelTitle: '布局模式',
      systemThemeTitle: '系统主题',
      pageFunctionsTitle: '界面功能',
      pageViewTitle: '界面显示',
      followSystemTheme: '跟随系统',
      isCustomizeDarkModeTransition: '自定义暗黑主题动画过渡',
      scrollMode: '滚动模式',
      scrollModeList: {
        wrapper: '外层滚动',
        content: '主体滚动'
      },
      fixedHeaderAndTab: '固定头部和多页签',
      header: {
        inverted: '头部深色',
        height: '头部高度',
        crumb: {
          visible: '面包屑',
          icon: '面包屑图标'
        }
      },
      tab: {
        visible: '多页签',
        height: '多页签高度',
        modeList: {
          mode: '多页签风格',
          chrome: '谷歌风格',
          button: '按钮风格'
        },
        isCache: '多页签缓存'
      },
      sider: {
        inverted: '侧边栏深色',
        width: '侧边栏展开宽度',
        mixWidth: '左侧混合侧边栏展开宽度'
      },
      menu: {
        horizontalPosition: '顶部菜单位置',
        horizontalPositionList: {
          flexStart: '居左',
          center: '居中',
          flexEnd: '居右'
        }
      },
      footer: {
        inverted: '底部深色',
        visible: '显示底部',
        fixed: '固定底部',
        right: '底部居右'
      },
      page: {
        animate: '页面切换动画',
        animateMode: '页面切换动画类型',
        animateModeList: {
          zoomFade: '渐变',
          zoomOut: '闪现',
          fadeSlide: '滑动',
          fade: '消退',
          fadeBottom: '底部消退',
          fadeScale: '缩放消退'
        }
      },
      systemTheme: {
        moreColors: '更多颜色'
      },
      themeConfiguration: {
        title: '主题配置',
        copy: '拷贝当前配置',
        reset: '重置当前配置',
        resetSuccess: '已重置配置，请重新拷贝！',
        operateSuccess: '操作成功',
        copySuccess: '复制成功,请替换 src/settings/theme.json的内容！',
        confirmCopy: '确认'
      }
    }
  },
  page: {
    login: {
      common: {
        tenantPlaceholder: '请选择所在校区',
        userNamePlaceholder: '请输入用户名',
        phonePlaceholder: '请输入手机号',
        codePlaceholder: '请输入验证码',
        passwordPlaceholder: '请输入密码',
        confirmPasswordPlaceholder: '请再次输入密码',
        codeLogin: '验证码登录',
        confirm: '确定',
        back: '返回',
        validateSuccess: '验证成功',
        loginSuccess: '登录成功',
        welcomeBack: '欢迎回来，{userName}!'
      },
      pwdLogin: {
        title: '密码登录',
        rememberMe: '记住我',
        forgetPassword: '忘记密码？',
        register: '注册账号',
        otherAccountLogin: '其他账号登录',
        otherLoginMode: '其他登录方式',
        superAdmin: '超级管理员',
        admin: '管理员',
        user: '普通用户'
      },
      weChatLogin: {
        title: '微信登录'
      },
      codeLogin: {
        title: '验证码登录',
        getCode: '获取验证码',
        imageCodePlaceholder: '请输入图片验证码'
      },
      register: {
        title: '注册账号',
        agreement: '我已经仔细阅读并接受',
        protocol: '《用户协议》',
        policy: '《隐私权政策》'
      },
      resetPwd: {
        title: '重置密码'
      },
      bindWeChat: {
        title: '绑定微信'
      }
    }
  }
};

export default locale;
