declare namespace PageRoute {
  /**
   * the root route key
   * @translate 根路由
   */
  type RootRouteKey = 'root';

  /**
   * the not found route, which catch the invalid route path
   * @translate 未找到路由(捕获无效路径的路由)
   */
  type NotFoundRouteKey = 'not-found';

  /**
   * the route key
   * @translate 页面路由
   */
  type RouteKey =
    | '403'
    | '404'
    | '500'
    | 'constant-page'
    | 'login'
    | 'not-found'
    | 'about'
    | 'auth-demo'
    | 'auth-demo_permission'
    | 'auth-demo_super'
    | 'authority'
    | 'authority_auth'
    | 'authority_menu'
    | 'authority_role'
    | 'authority_token'
    | 'book'
    | 'book_books'
    | 'book_borrow'
    | 'book_inventory'
    | 'component'
    | 'component_button'
    | 'component_card'
    | 'component_table'
    | 'dashboard'
    | 'dashboard_analysis'
    | 'dashboard_recommend'
    | 'dashboard_workbench'
    | 'document'
    | 'document_naive'
    | 'document_project-link'
    | 'document_project'
    | 'document_vite'
    | 'document_vue'
    | 'exception'
    | 'exception_403'
    | 'exception_404'
    | 'exception_500'
    | 'function'
    | 'function_tab-detail'
    | 'function_tab-multi-detail'
    | 'function_tab'
    | 'function_websocket'
    | 'management'
    | 'management_class'
    | 'management_dept'
    | 'management_dict'
    | 'management_notice'
    | 'management_route'
    | 'management_user'
    | 'plugin'
    | 'plugin_charts'
    | 'plugin_charts_antv'
    | 'plugin_charts_echarts'
    | 'plugin_copy'
    | 'plugin_editor'
    | 'plugin_editor_markdown'
    | 'plugin_editor_quill'
    | 'plugin_icon'
    | 'plugin_map'
    | 'plugin_print'
    | 'plugin_swiper'
    | 'plugin_video'
    | 'reader'
    | 'reader_borrow'
    | 'reader_info'
    | 'tenant'
    | 'tenant_management'
    | 'tenant_packages';

  /**
   * last degree route key, which has the page file
   * @translate 最后一级路由(该级路有对应的页面文件)
   */
  type LastDegreeRouteKey = Extract<
    RouteKey,
    | '403'
    | '404'
    | '500'
    | 'constant-page'
    | 'login'
    | 'not-found'
    | 'about'
    | 'auth-demo_permission'
    | 'auth-demo_super'
    | 'authority_auth'
    | 'authority_menu'
    | 'authority_role'
    | 'authority_token'
    | 'book_books'
    | 'book_borrow'
    | 'book_inventory'
    | 'component_button'
    | 'component_card'
    | 'component_table'
    | 'dashboard_analysis'
    | 'dashboard_recommend'
    | 'dashboard_workbench'
    | 'document_naive'
    | 'document_project-link'
    | 'document_project'
    | 'document_vite'
    | 'document_vue'
    | 'exception_403'
    | 'exception_404'
    | 'exception_500'
    | 'function_tab-detail'
    | 'function_tab-multi-detail'
    | 'function_tab'
    | 'function_websocket'
    | 'management_class'
    | 'management_dept'
    | 'management_dict'
    | 'management_notice'
    | 'management_route'
    | 'management_user'
    | 'plugin_charts_antv'
    | 'plugin_charts_echarts'
    | 'plugin_copy'
    | 'plugin_editor_markdown'
    | 'plugin_editor_quill'
    | 'plugin_icon'
    | 'plugin_map'
    | 'plugin_print'
    | 'plugin_swiper'
    | 'plugin_video'
    | 'reader_borrow'
    | 'reader_info'
    | 'tenant_management'
    | 'tenant_packages'
  >;
}
