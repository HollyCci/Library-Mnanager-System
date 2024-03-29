const locale: I18nType.Schema = {
  system: {
    title: 'ZTBU Library'
  },
  common: {
    add: 'Add',
    addSuccess: 'Add Success',
    edit: 'Edit',
    editSuccess: 'Edit Success',
    delete: 'Delete',
    deleteSuccess: 'Delete Success',
    batchDelete: 'Batch Delete',
    confirm: 'Confirm',
    cancel: 'Cancel',
    pleaseCheckValue: 'Please check the value is valid',
    action: 'Action'
  },
  routes: {
    dashboard: {
      _value: 'Dashboard',
      analysis: 'Analysis',
      workbench: 'Workbench',
      'Intelligent recommendation': 'Guess U Like'
    },
    document: {
      _value: 'Document',
      vue: 'Vue Document',
      vite: 'Vite Document',
      naive: 'NaiveUI Document',
      ldoc: 'Knowledge Base Document',
      project: 'Project Document',
      'project-link': 'Project Document(href)',
      'update-log': 'Update Log'
    },
    component: {
      _value: 'Component',
      button: 'Button',
      card: 'Card',
      table: 'Table'
    },
    plugin: {
      _value: 'Plugin',
      charts: {
        _value: 'Chart',
        echarts: 'ECharts'
      },
      copy: 'Copy',
      editor: {
        _value: 'Editor',
        quill: 'Quill',
        markdown: 'Markdown'
      },
      icon: 'Icon',
      map: 'Map',
      print: 'Print',
      swiper: 'Swiper',
      video: 'Video'
    },
    'auth-demo': {
      _value: 'Auth Demo',
      permission: 'Toggle Permission',
      super: 'Super Auth'
    },
    function: {
      _value: 'Function',
      tab: 'System Tab',
      upload_image: 'Upload Image'
    },
    exception: {
      _value: 'Exception',
      403: '403',
      404: '404',
      500: '500'
    },
    management: {
      _value: 'System Management',
      route: 'Route',
      user: 'User',
      dept: 'Department management',
      post: 'Position management',
      class: 'Class management',
      notice: 'Notice management',
      dict: 'Class management'
    },
    tenant: {
      _value: 'Tenant Management',
      management: 'Tenant List',
      packages: 'Tenant Package'
    },
    book: {
      _value: 'Book management',
      books: 'Collected Books',
      subject: 'subject management',
      borrow: 'Borrowing management',
      category: 'Category management',
      stack: 'StackRoom management',
      inventory: 'Inventory management'
    },
    'analyze-data': {
      _value: 'analyze Data',
      'book-data': 'Book data',
      'borrow-data': 'Borrow data',
      'stack-data': 'Stack data',
      'user-data': 'User data'
    },
    reader: {
      _value: 'Reader Service',
      borrow: 'Borrow books',
      info: 'My Borrowing'
    },
    authority: {
      _value: 'Permission management',
      role: 'Role management',
      menu: 'Menu management',
      token: 'Token management'
    },
    bmapgl: {
      _value: 'Map function',
      show_info: 'My Location'
    },
    facility: {
      _value: 'System facilities',
      'scheduled-tasks': 'Scheduled tasks',
      'api-interface-documents': 'Scheduled tasks',
      'database-documents': 'Database documents',
      'audit-log': 'Audit Log',
      'login-log': 'Login Log',
      'operate-log': 'Operate Log',
      apiLog: 'API Log',
      accessLog: 'Access Log',
      exceptionLog: 'Access Log',
      mysql: 'MySQL monitoring',
      redis: 'Redis monitoring'
    },
    about: 'About'
  },
  layout: {
    settingDrawer: {
      title: 'Theme configuration',
      themeModeTitle: 'Theme mode',
      darkMode: 'Dark mode',
      layoutModelTitle: 'Layout mode',
      systemThemeTitle: 'System theme',
      pageFunctionsTitle: 'Page functions',
      pageViewTitle: 'Page view',
      followSystemTheme: 'Follow the system',
      isCustomizeDarkModeTransition: 'Custom dark theme animation transition',
      scrollMode: 'scrollMode',
      scrollModeList: {
        wrapper: 'Outer layer scroll',
        content: 'Main body scroll'
      },
      fixedHeaderAndTab: 'Fixed header and multiple tabs',
      header: {
        inverted: 'darkHead',
        height: 'Head Height',
        crumb: {
          visible: 'Crumb',
          icon: 'Crumb icon'
        }
      },
      tab: {
        visible: 'Multi-page tab',
        height: 'Multiple tab height',
        modeList: {
          mode: 'Multi-tab style',
          chrome: 'Google style',
          button: 'Button style'
        },
        isCache: 'Multiple tab caching'
      },
      sider: {
        inverted: 'Dark sidebar',
        width: 'Sidebar expanded width',
        mixWidth: 'Left hybrid sidebar expanded width'
      },
      menu: {
        horizontalPosition: 'Top menu position',
        horizontalPositionList: {
          flexStart: 'Right',
          center: 'center',
          flexEnd: 'Left'
        }
      },
      footer: {
        inverted: 'Dark bottom',
        visible: 'Show bottom',
        fixed: 'Fixed bottom',
        right: 'Bottom to the right'
      },
      page: {
        animate: 'switch animation',
        animateMode: 'switch animation type',
        animateModeList: {
          zoomFade: 'Gradual change',
          zoomOut: 'Flash',
          fadeSlide: 'Slide',
          fade: 'Fade away',
          fadeBottom: 'Bottom fade',
          fadeScale: 'Resizing fade away'
        }
      },
      systemTheme: {
        moreColors: 'More colors'
      },
      themeConfiguration: {
        title: 'Theme configuration',
        copy: 'Copy the current configuration',
        reset: 'Reset the current configuration',
        resetSuccess: 'The configuration has been reset, please copy it again!',
        operateSuccess: 'Successful operation',
        copySuccess: 'Copy success, please replace the content of src/settings/theme.json!',
        confirmCopy: 'Confirm'
      }
    }
  },
  page: {
    login: {
      common: {
        tenantPlaceholder: 'Please select your campus',
        userNamePlaceholder: 'Please enter user name',
        phonePlaceholder: 'Please enter phone number',
        codePlaceholder: 'Please enter verification code',
        passwordPlaceholder: 'Please enter password',
        confirmPasswordPlaceholder: 'Please enter password again',
        codeLogin: 'Verification code login',
        confirm: 'Confirm',
        back: 'Back',
        validateSuccess: 'Verification passed',
        loginSuccess: 'Login success',
        welcomeBack: 'Welcome back, {userName}!'
      },
      pwdLogin: {
        title: 'Password Login',
        rememberMe: 'Remember me',
        forgetPassword: 'Forget password?',
        register: 'Register account',
        otherAccountLogin: 'Other Account Login',
        otherLoginMode: 'Other Login Mode',
        superAdmin: 'Super Administrator',
        admin: 'Administrator',
        user: 'Ordinary User'
      },
      weChatLogin: {
        title: 'WeChat Login'
      },
      codeLogin: {
        title: 'Verification Code Login',
        getCode: 'Get verification code',
        imageCodePlaceholder: 'Please enter image verification code'
      },
      register: {
        title: 'Register Account',
        agreement: 'I have read and agree to',
        protocol: '《User Agreement》',
        policy: '《Privacy Policy》'
      },
      resetPwd: {
        title: 'Reset Password'
      },
      bindWeChat: {
        title: 'Bind WeChat'
      }
    }
  }
};

export default locale;
