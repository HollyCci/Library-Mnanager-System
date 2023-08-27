import { request } from '../request';

// 定义角色分配用户角色所需的请求数据类型
export interface PermissionAssignUserRoleReqVO {
  userId: number;
  roleIds: number[];
}

// 定义角色分配菜单权限所需的请求数据类型
export interface PermissionAssignRoleMenuReqVO {
  roleId: number;
  menuIds: number[];
}

// 定义角色分配数据权限所需的请求数据类型
export interface PermissionAssignRoleDataScopeReqVO {
  roleId: number;
  dataScope: number;
  dataScopeDeptIds: number[];
}

/**
 * 查询角色拥有的菜单权限
 * @param roleId 角色的ID
 * @returns 角色拥有的菜单权限
 */
export function getRoleMenuList(roleId: number) {
  return request.get(`/system/permission/list-role-resources?roleId=${roleId}`);
}

/**
 * 赋予角色菜单权限
 * @param data 赋予角色菜单权限的请求数据
 * @returns 请求结果
 */
export function assignRoleMenu(data: PermissionAssignRoleMenuReqVO) {
  return request.post('/system/permission/assign-role-menu', data);
}

/**
 * 赋予角色数据权限
 * @param data 赋予角色数据权限的请求数据
 * @returns 请求结果
 */
export function assignRoleDataScope(data: PermissionAssignRoleDataScopeReqVO) {
  return request.post('/system/permission/assign-role-data-scope', data);
}

/**
 * 查询用户拥有的角色数组
 * @param userId 用户的ID
 * @returns 用户拥有的角色数组
 */
export function getUserRoleList(userId: number) {
  return request.get(`/system/permission/list-user-roles?userId=${userId}`);
}

/**
 * 查询用户拥有的角色的精简信息
 * @param userId 用户的ID
 * @returns 用户拥有的角色的精简信息
 */
export function getSimpleUserRoleList(userId: number) {
  return request.get(`/system/permission/list-simple-user-role?userId=${userId}`);
}

/**
 * 赋予用户角色
 * @param data 赋予用户角色的请求数据
 * @returns 请求结果
 */
export function assignUserRole(data: PermissionAssignUserRoleReqVO) {
  return request.post('/system/permission/assign-user-role', data);
}
