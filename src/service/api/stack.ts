import { request } from '../request';
export interface StackVO {
  id?: number;
  name: string;
  core: string;
  picUrl: string;
  count: number;
  status: number;
  creator: string;
  createTime: Date;
  updater: string;
  updateTime: Date;
}

/**
 * 查询书库列表
 * @param params 查询参数
 * @returns StackVO
 */
export function fetchStackPage(params: PageParam) {
  return request.get('/library/stack/page', { params });
}

/**
 * 根据ID查询书库
 * @param id 书库ID
 * @returns 书库详情
 */
export function fetchStack(id: number) {
  return request.get(`/library/stack/get?id=${id}`);
}

/**
 * 删除指定书库
 * @param 书库ID
 * @returns
 */
export function deleteStack(id: number) {
  return request.delete(`/library/stack/delete?id=${id}`);
}

/**
 * 获取所有书库精简信息
 * @returns StackVO[]
 */
export function fetchSimpleStackList() {
  return request.get<StackVO[]>('/library/stack/list-all-simple');
}

/**
 * 添加书库
 * @param data StackVO
 * @returns
 */
export function createStack(data: StackVO) {
  return request.post('/library/stack/create', data);
}

/**
 * 修改书库信息
 * @param params StackVO
 * @returns
 */
export function updateStack(params: StackVO) {
  return request.put('/library/stack/update', params);
}

/**
 * 导出书库
 * @param params
 * @returns 二进制流
 */
export function exportStack(params: any) {
  return request.download('/library/stack/export', params);
}

/**
 * 获取书库导入模板
 * @returns 二进制流
 */
export function importStackTemplate() {
  return request.download('library/stack/get-import-template');
}
