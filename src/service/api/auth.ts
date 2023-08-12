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
  return request.post<ApiAuth.Token>('/system/auth/login', { tenant, username, password });
}

/** 获取用户信息 */
export function fetchUserInfo() {
  return request.get<ApiAuth.UserInfoVO>('/system/auth/get-permission-info');
}

/** 获取微信二维码 */
export function fetchWeChatTicket() {
  return request.get<ApiAuth.WeChatTicket>('/system/auth/wechat-ticket');
}

/** 微信轮训登录 */
export function fetchWeChatPoll(params: { uuid: string }) {
  return request.get<ApiAuth.WeChatPoll>('/system/auth/wechat-poll', { params });
}

/**
 * 获取用户路由数据
 * @param userId - 用户id
 * @description 后端根据用户id查询到对应的角色类型，并将路由筛选出对应角色的路由数据返回前端
 */
// export function fetchUserRoutes(userId: number) {
//   return request.post<ApiRoute.Route>('/system/getUserRoutes', { userId });
// }

/**
 * 获取用户路由数据，无需参数传入，后端根据上下文获取
 */
export function fetchUserRoutes() {
  return request.get<ApiRoute.Route>('/system/auth/list-menus');
}

/**
 * 刷新token
 * @param refreshToken
 */
export function fetchUpdateToken(refreshToken: string) {
  return request.post<ApiAuth.Token>(`/system/auth/refresh-token?refreshToken=${refreshToken}`);
}

/**
 * 登出
 * @returns 后端boolean，前端待改
 */
export function loginOut() {
  return request.post('/system/auth/logout');
}
