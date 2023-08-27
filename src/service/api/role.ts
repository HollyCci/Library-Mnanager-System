import { request } from '../request';

// 角色数据的类型定义
export interface RoleVO {
  id: number;
  name: string;
  code: string;
  sort: number;
  status: number;
  type: number;
  dataScope: number;
  dataScopeDeptIds: number[];
  createTime: Date;
}

// 修改角色状态的请求数据类型定义
export interface UpdateStatusReqVO {
  id: number;
  status: number;
}

/**
 * 查询角色列表
 * @param params 查询参数
 * @returns 角色列表数据
 */
export function fetchRolePage(params: PageParam) {
  return request.get('/system/role/page', { params });
}

/**
 * 查询角色（精简)列表
 * @returns 精简角色列表数据
 */
export function fetchSimpleRoleList() {
  return request.get('/system/role/list-all-simple');
}

/**
 * 查询角色详情
 * @param id 角色ID
 * @returns 角色详情数据
 */
export function fetchRole(id: number) {
  return request.get(`/system/role/get?id=${id}`);
}

/**
 * 新增角色
 * @param data 角色数据
 * @returns 新增结果
 */
export function createRole(data: RoleVO) {
  return request.post('/system/role/create', data);
}

/**
 * 修改角色
 * @param data 角色数据
 * @returns 修改结果
 */
export function updateRole(data: RoleVO) {
  return request.put('/system/role/update', data);
}

/**
 * 修改角色状态
 * @param data 修改状态请求数据
 * @returns 修改状态结果
 */
export function updateRoleStatus(data: UpdateStatusReqVO) {
  return request.put('/system/role/update-status', data);
}

/**
 * 删除角色
 * @param id 角色ID
 * @returns 删除结果
 */
export function deleteRole(id: number) {
  return request.delete(`/system/role/delete?id=${id}`);
}

/**
 * 导出角色数据
 * @param params 导出参数
 * @returns 导出的角色数据
 */
export function exportRole(params: any) {
  return request.download('/system/role/export', params);
}
