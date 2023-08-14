import { request } from '../request';

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
export interface UpdateStatusReqVO {
  id: number;
  status: number;
}

// 查询角色列表
export function fetchRolePage(params: PageParam) {
  return request.get('/system/role/page', { params });
}

// 查询角色（精简)列表
export function fetchSimpleRoleList() {
  return request.get('/system/role/list-all-simple');
}

// 查询角色详情
export function fetchRole(id: number) {
  return request.get(`/system/role/get?id=${id}`);
}

// 新增角色
export function createRole(data: RoleVO) {
  return request.post('/system/role/create', data);
}

// 修改角色
export function updateRole(data: RoleVO) {
  return request.put('/system/role/update', data);
}

// 修改角色状态
export function updateRoleStatus(data: UpdateStatusReqVO) {
  return request.put('/system/role/update-status', data);
}

// 删除角色
export function deleteRole(id: number) {
  return request.delete(`/system/role/delete?id=${id}`);
}

// 导出角色
export function exportRole(params: any) {
  return request.download('/system/role/export', params);
}
