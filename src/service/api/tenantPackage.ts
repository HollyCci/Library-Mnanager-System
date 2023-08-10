import { request } from '../request';
// 租户套餐信息接口，描述了租户套餐的各个属性
export interface TenantPackageVO {
  id: number; // 套餐ID
  name: string; // 套餐名称
  status: number; // 套餐状态
  remark: string; // 备注
  creator: string; // 创建者
  updater: string; // 更新者
  updateTime: string; // 更新时间
  menuIds: number[]; // 菜单ID列表
  createTime: Date; // 创建时间
}

/**
 * 查询租户套餐列表
 * @param params 分页参数
 * @returns TenantPackageVO[]
 */
export function fetchTenantPackagePage(params: PageParam) {
  return request.get('/system/tenant-package/page', params);
}

/**
 * 根据ID查询租户套餐信息
 * @param id 租户ID
 * @returns TenantPackageVO
 */
export function fetchTenantPackage(id: number) {
  return request.get(`/system/tenant-package/get?id=${id}`);
}

/**
 * 创建租户草滩
 * @param data TenantPackageVO
 * @returns
 */
export function createTenantPackage(data: TenantPackageVO) {
  return request.post('/system/tenant-package/create', data);
}

/**
 * 更新租户套餐信息
 * @param data TenantPackageVO
 * @returns Boolean
 */
export function updateTenantPackage(data: TenantPackageVO) {
  return request.put('/system/tenant-package/update', data);
}

/**
 * 根据ID删除租户套餐
 * @param id 租户套餐ID
 * @returns Boolean
 */
export function deleteTenantPackage(id: number) {
  return request.delete(`/system/tenant-package/delete?id=${id}`);
}

/**
 * 获取租户套餐精简信息列表
 * @returns
 */
export function fetchTenantPackageList() {
  return request.get('/system/tenant-package/get-simple-list');
}
