import { request } from '../request';

// 定义库存数据的接口类型
export interface InventoryVO {
  id: number;
  stackId: number;
  bookId: number;
  barCode: string;
  location: string;
  status: number;
  createTime: Date;
}

/**
 * 创建库存数据
 * @param data 库存数据
 * @returns 请求结果
 */
export function createInventory(data: InventoryVO) {
  return request.post('/library/inventory/create', data);
}

/**
 * 更新库存数据
 * @param params 更新的库存数据
 * @returns 请求结果
 */
export function updateInventory(params: InventoryVO) {
  return request.put('/library/inventory/update', params);
}

/**
 * 获取特定库存数据
 * @param id 库存数据的ID
 * @returns 库存数据
 */
export function getInventory(id: number) {
  return request.get(`/library/inventory/get?id=${id}`);
}

/**
 * 分页获取库存数据
 * @param params 分页参数
 * @returns 分页数据
 */
export function getInventoryPage(params: PageParam) {
  return request.get<any>('/library/inventory/page', { params });
}

/**
 * 删除库存数据
 * @param id 要删除的库存数据的ID
 * @returns 请求结果
 */
export function deleteInventoryPage(id: number) {
  return request.delete(`/library/inventory/delete?id=${id}`);
}

/**
 * 获取所有库存数据（简化信息）
 * @returns 所有库存数据（简化信息）
 */
export function fetchInventoryPage() {
  return request.get('/library/inventory/list-all-simple');
}

/**
 * 导出库存数据
 * @param params 导出参数
 * @returns 导出的数据
 */
export function exportInventory(params: any) {
  return request.download('/library/inventory/export', { params });
}

/**
 * 获取库存导入模板
 * @returns 二进制流（导入模板）
 */
export function importInventoryTemplate() {
  return request.download('library/inventory/get-import-template');
}
