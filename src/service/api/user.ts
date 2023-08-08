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
 * 获取用户精简信息列表
 * @returns 用户简单信息
 */
export function fetchSimpleUserList() {
  return request.get<Auth.UserVo[]>('/system/user/list-all-simple');
}
