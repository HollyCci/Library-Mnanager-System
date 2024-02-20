import { request } from '../request';

/**
 * 获取异常日志数据
 * @returns 异常日志数据列表
 */
export function getApiErrorLogPage(params: PageParam) {
  return request.get<any>('/infra/api-error-log/page', { params });
}

/**
 * 导出异常日志数据
 * @param params 参数
 * @returns
 */
export function exportApiErrorLogExcel(params: any) {
  return request.download('/infra/api-error-log/export-excel', params);
}

/**
 * 更新异常日志数据
 * @param id 编号
 * @param processStatus 处理状态
 * @returns
 */
export function updateApiErrorLogProcess(id: number, processStatus: number) {
  return request.put(`/infra/api-error-log/update-status?id=${id}&processStatus=${processStatus}`);
}
