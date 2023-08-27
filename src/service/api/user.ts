import { request } from '../request';

// 用户数据类型定义
export interface UserVO {
  id: number;
  username: string;
  nickname: string;
  classId: number;
  deptId: number;
  postIds: string[];
  email: string;
  mobile: string;
  sex: number;
  avatar: string;
  loginIp: string;
  status: number;
  remark: string;
  loginDate: Date;
  createTime: Date;
}

/**
 * 查询用户管理列表
 * @param params 查询参数
 * @returns 用户管理列表数据
 */
export function getUserPage(params: PageParam) {
  return request.get<any>('/system/user/page', { params });
}

/**
 * 获取用户详情
 * @param id 用户ID
 * @returns 用户详情数据
 */
export function getUser(id: number) {
  return request.get(`/system/user/get?id=${id}`);
}

/**
 * 创建用户
 * @param data 用户数据
 * @returns 创建结果
 */
export function createUser(data: UserVO) {
  return request.post('/system/user/create', data);
}

/**
 * 更新用户信息
 * @param data 用户数据
 * @returns 更新结果
 */
export function updateUser(data: UserVO) {
  return request.put('/system/user/update', data);
}

/**
 * 删除用户
 * @param id 用户ID
 * @returns 删除结果
 */
export function deleteUser(id: number) {
  return request.delete(`/system/user/delete?id=${id}`);
}

/**
 * 导出用户数据
 * @param params 导出参数
 * @returns 导出的用户数据
 */
export function exportUser(params: any) {
  return request.download('/system/user/export', params);
}

/**
 * 获取用户导入模板
 * @returns 用户导入模板的二进制流
 */
export function importUserTemplate() {
  return request.download('/system/user/get-import-template');
}

/**
 * 重置用户密码
 * @param id 用户ID
 * @param password 新密码
 * @returns 重置结果
 */
export function resetUserPwd(id: number, password: string) {
  const data = {
    id,
    password
  };
  return request.put('/system/user/update-password', data);
}

/**
 * 更新用户状态
 * @param id 用户ID
 * @param status 用户状态
 * @returns 更新状态结果
 */
export function updateUserStatus(id: number, status: number) {
  const data = {
    id,
    status
  };
  return request.put('/system/user/update-status', data);
}

/**
 * 获取用户精简信息列表
 * @returns 用户简单信息列表
 */
export function fetchSimpleUserList() {
  return request.get<Auth.UserVo[]>('/system/user/list-all-simple');
}
