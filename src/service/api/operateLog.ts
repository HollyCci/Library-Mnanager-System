import { request } from '../request';

/**
 * 获取操作日志数据
 * @returns 操作日志数据列表
 */
export function pageOperateLog(params: PageParam) {
  return request.get<any>('/system/operate-log/page', { params });
}

/**
 * 导出操作日志数据
 * @param params 参数
 * @returns
 */
export function exportOperateLog(params: any) {
  return request.download('/system/operate-log/export', params);
}
