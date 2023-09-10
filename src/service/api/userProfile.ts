import { request } from '../request';

export interface ProfileDept {
  id: number;
  name: string;
}
export interface ProfileClass {
  id: number;
  name: string;
}
export interface ProfileRole {
  id: number;
  name: string;
}
export interface ProfilePost {
  id: number;
  name: string;
}
export interface SocialUser {
  id: number;
  type: number;
  openid: string;
  token: string;
  rawTokenInfo: string;
  nickname: string;
  avatar: string;
  rawUserInfo: string;
  code: string;
  state: string;
}
export interface UserProfileVO {
  id: number;
  username: string;
  nickname: string;
  dept: ProfileDept;
  class: ProfileClass;
  borrowedCount: number;
  roles: ProfileRole[];
  posts: ProfilePost[];
  socialUsers: SocialUser[];
  email: string;
  mobile: string;
  sex: number;
  avatar: string;
  status: number;
  remark: string;
  loginIp: string;
  loginDate: Date;
  createTime: Date;
}

/**
 * 获取登录用户信息
 * @returns 登录用户信息
 */
export function getUserProfile() {
  return request.get<any>('/system/user/profile/get');
}
