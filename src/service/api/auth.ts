import { request } from '../request';

/**
 * 获取验证码
 * @param phone - 手机号
 * @returns - 返回boolean值表示是否发送成功
 */
export function fetchSmsCode(phone: string) {
  return request.post<boolean>('/getSmsCode', { phone });
}

/**
 * 登录
 * @param userName - 用户名
 * @param password - 密码
 */
export function fetchLogin(tenant: number, username: string, password: string) {
  return request.post<ApiAuth.Token>('/admin-api/system/auth/login', { tenant, username, password });
}

/** 获取用户信息 */
export function fetchUserInfo() {
  return request.get<ApiAuth.UserInfoVO>('/admin-api/system/auth/get-permission-info');
}

/**
 * 获取用户路由数据
 * @param userId - 用户id
 * @description 后端根据用户id查询到对应的角色类型，并将路由筛选出对应角色的路由数据返回前端
 */
export function fetchUserRoutes(userId: number) {
  return request.post<ApiRoute.Route>('/getUserRoutes', { userId });
}

/**
 * 刷新token
 * @param refreshToken
 */
export function fetchUpdateToken(refreshToken: string) {
  return request.post<ApiAuth.Token>(`/admin-api/system/auth/refresh-token?refreshToken=${refreshToken}`);
}

/**
 * 登出
 * @returns 后端boolean，前端待改
 */
export function loginOut() {
  return request.post('/admin-api/system/auth/logout');
}
