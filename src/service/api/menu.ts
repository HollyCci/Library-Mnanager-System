import { request } from '../request';
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

// 查询菜单（精简）列表
export function getSimpleMenusList() {
  return request.get('/system/menu/list-all-simple');
}

// 查询菜单列表
export function getMenuList(params: any) {
  return request.get('/system/menu/list', { params });
}

// 获取菜单详情
export function getMenu(id: number) {
  return request.get(`/system/menu/get?id=${id}`);
}

// 新增菜单
export function createMenu(data: MenuVO) {
  return request.post('/system/menu/create', data);
}

// 修改菜单
export function updateMenu(data: any) {
  return request.put('/system/menu/update', data);
}

// 删除菜单
export function deleteMenu(id: number) {
  return request.delete(`/system/menu/delete?id=${id}`);
}

// 更新缓存设置

export function updateKeepAlive(id: number, keepAlive: boolean) {
  return request.put(`/system/menu/update-keepAlive?id=${id}&keepAlive=${keepAlive}`);
}
