import { request } from '../request';

export interface PermissionAssignUserRoleReqVO {
  userId: number;
  roleIds: number[];
}

export interface PermissionAssignRoleMenuReqVO {
  roleId: number;
  menuIds: number[];
}

export interface PermissionAssignRoleDataScopeReqVO {
  roleId: number;
  dataScope: number;
  dataScopeDeptIds: number[];
}

// 查询角色拥有的菜单权限
export function getRoleMenuList(roleId: number) {
  return request.get(`/system/permission/list-role-resources?roleId=${roleId}`);
}

// 赋予角色菜单权限
export function assignRoleMenu(data: PermissionAssignRoleMenuReqVO) {
  return request.post('/system/permission/assign-role-menu', data);
}

// 赋予角色数据权限
export function assignRoleDataScope(data: PermissionAssignRoleDataScopeReqVO) {
  return request.post('/system/permission/assign-role-data-scope', data);
}

// 查询用户拥有的角色数组
export function getUserRoleList(userId: number) {
  return request.get(`/system/permission/list-user-roles?userId=${userId}`);
}

// 查询用户拥有的角色的精简信息
export function getSimpleUserRoleList(userId: number) {
  return request.get(`/system/permission/list-simple-user-role?userId=${userId}`);
}
// 赋予用户角色
export function assignUserRole(data: PermissionAssignUserRoleReqVO) {
  return request.post('/system/permission/assign-user-role', data);
}
