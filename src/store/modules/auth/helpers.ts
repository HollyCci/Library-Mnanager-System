import { localStg } from '@/utils';

/** 获取token */
export function getToken() {
  return localStg.get('accessToken') || '';
}

/** 获取用户信息 */
export function getUserInfo() {
  const emptyInfo: Auth.UserInfoVO = {
    permissions: [],
    roles: [],
    user: {
      id: 0,
      avatar: '',
      nickname: ''
    }
  };
  const userInfoVO: Auth.UserInfoVO = localStg.get('userInfoVO') || emptyInfo;

  return userInfoVO;
}

/** 去除用户相关缓存 */
export function clearAuthStorage() {
  localStg.remove('accessToken');
  localStg.remove('refreshToken');
  localStg.remove('userInfoVO');
}
