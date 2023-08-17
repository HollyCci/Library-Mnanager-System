import { request } from '../request';

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
 * @param params
 * @returns
 */
export function getUserPage(params: PageParam) {
  return request.get<any>('/system/user/page', { params });
}
export function getUser(id: number) {
  return request.get(`/system/user/get?id=${id}`);
}
export function createUser(data: UserVO) {
  return request.post('/system/user/create', data);
}
export function updateUser(data: UserVO) {
  return request.put('/system/user/update', data);
}
export function deleteUser(id: number) {
  return request.delete(`/system/user/delete?id=${id}`);
}
export function exportUser(params: any) {
  return request.download('/system/user/export', params);
}
export function importUserTemplate() {
  return request.download('/system/user/get-import-template');
}
export function resetUserPwd(id: number, password: string) {
  const data = {
    id,
    password
  };
  return request.put('/system/user/update-password', data);
}
export function updateUserStatus(id: number, status: number) {
  const data = {
    id,
    status
  };
  return request.put('/system/user/update-status', data);
}

/**
 * 获取用户精简信息列表
 * @returns 用户简单信息
 */
export function fetchSimpleUserList() {
  return request.get<Auth.UserVo[]>('/system/user/list-all-simple');
}
