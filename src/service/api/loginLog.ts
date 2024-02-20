import { request } from '../request';

/**
 * 获取登录日志数据
 * @returns 登录日志数据列表
 */
export function getLoginLogPage(params: PageParam) {
  return request.get<any>('/system/login-log/page', { params });
}

/**
 * 导出登录日志数据
 * @param params 参数
 * @returns
 */
export function exportLoginLog(params: any) {
  return request.download('/system/login-log/export', params);
}
