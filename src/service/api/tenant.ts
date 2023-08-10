import { request } from '../request';
// 租户信息接口，描述了租户的各个属性
export interface TenantVO {
  id: number; // 租户ID
  name: string; // 租户名称
  contactName: string; // 联系人姓名
  contactMobile: string; // 联系人手机号
  status: number; // 租户状态
  domain: string; // 租户域名
  packageId: number; // 套餐ID
  username: string; // 用户名
  password: string; // 密码
  expireTime: Date; // 到期时间
  accountCount: number; // 账号额度
  createTime: Date; // 创建时间
}
// 租户分页请求参数接口，继承了分页参数接口PageParam
export interface TenantPageReqVO extends PageParam {
  name?: string; // 租户名称
  contactName?: string; // 联系人姓名
  contactMobile?: string; // 联系人手机号
  status?: number | null; // 租户状态，允许为空
  createTime?: Date[]; // 创建时间范围，数组类型，包含起始和结束时间
}

// 租户导出请求参数接口
export interface TenantExportReqVO {
  name?: string; // 租户名称
  contactName?: string; // 联系人姓名
  contactMobile?: string; // 联系人手机号
  status?: number; // 租户状态
  createTime?: Date[]; // 创建时间范围，数组类型，包含起始和结束时间
}

/**
 * 获取租户分页数据
 * @param params 租户分页请求参数
 * @returns TenantVO[]
 */
export function fetchTenantPage(params: TenantPageReqVO) {
  return request.get('/system/tenant/page', { params });
}

/**
 * 根据租户ID获取租户信息
 * @param id  租户ID
 * @returns TenantVO
 */
export function fetchTenant(id: number) {
  return request.get(`/system/tenant/get?id=${id}`);
}

/**
 * 创建租户，即对应的用户，角色，角色权限等信息，如果租户的用户名不存在，会同时创建用户
 * @param data TenantVO
 * @returns 租户ID
 */
export function createTenant(data: TenantVO) {
  return request.post('/system/tenant/create', data);
}

/**
 * 更新租户信息
 * @param data TenantVO
 * @returns Boolean
 */
export function updateTenant(data: TenantVO) {
  return request.put('/system/tenant/update', data);
}

/**
 * 根据ID删除租户信息
 * @param id 租户ID
 * @returns Boolean
 */
export function deleteTenant(id: number) {
  return request.delete(`/system/tenant/delete?id=${id}`);
}

/**
 * 导出租户信息
 * @param params TenantExportReqVO
 * @returns
 */
export function exportTenant(params: TenantExportReqVO) {
  return request.download('/system/tenant/export-excel', params);
}
