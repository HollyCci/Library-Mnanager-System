import { request } from '../request';

/**
 * 获取访问日志数据
 * @returns 访问日志数据列表
 */
export function getApiAccessLogPage(params: PageParam) {
  return request.get<any>('/infra/api-access-log/page', { params });
}

/**
 * 导出访问日志数据
 * @param params 参数
 * @returns
 */
export function exportApiAccessLogExcel(params: any) {
  return request.download('/infra/api-access-log/export-excel', params);
}
