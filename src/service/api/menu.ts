import { request } from '../request';

// 定义菜单的接口类型
export interface MenuVO {
  id: number;
  name: string;
  parentId: number;
  path: string;
  redirect: string;
  component: string;
  title: string;
  i18nTitle: string;
  singleLayout: string;
  requiresAuth: boolean;
  keepAlive: boolean;
  icon: string;
  localIcon: string;
  hide: boolean;
  href: string;
  multiTab: boolean;
  order: number;
  activeMenu: string;
  affix: boolean;
  permission: string;
  status: string;
  type: number;
  createTime: Date;
}

/**
 * 获取所有菜单的精简信息
 * @returns 所有菜单的精简信息
 */
export function getSimpleMenusList() {
  return request.get('/system/menu/list-all-simple');
}

/**
 * 查询菜单列表
 * @param params 查询参数
 * @returns 菜单列表
 */
export function getMenuList(params: any) {
  return request.get('/system/menu/list', { params });
}

/**
 * 获取特定菜单的详情
 * @param id 菜单的ID
 * @returns 菜单详情
 */
export function getMenu(id: number) {
  return request.get(`/system/menu/get?id=${id}`);
}

/**
 * 新增菜单
 * @param data 菜单数据
 * @returns 请求结果
 */
export function createMenu(data: MenuVO) {
  return request.post('/system/menu/create', data);
}

/**
 * 修改菜单
 * @param data 菜单数据
 * @returns 请求结果
 */
export function updateMenu(data: any) {
  return request.put('/system/menu/update', data);
}

/**
 * 删除菜单
 * @param id 菜单的ID
 * @returns 请求结果
 */
export function deleteMenu(id: number) {
  return request.delete(`/system/menu/delete?id=${id}`);
}

/**
 * 更新菜单缓存设置
 * @param id 菜单的ID
 * @param keepAlive 是否缓存菜单
 * @returns 请求结果
 */
export function updateKeepAlive(id: number, keepAlive: boolean) {
  return request.put(`/system/menu/update-keepAlive?id=${id}&keepAlive=${keepAlive}`);
}
