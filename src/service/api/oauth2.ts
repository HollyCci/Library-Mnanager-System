import { request } from '../request';

/**
 * 获取访问令牌列表
 * @param params 分页参数
 * @returns 访问令牌列表
 */
export function getAccessTokenPage(params: PageParam) {
  return request.get<any>('/system/oauth2-token/page', { params });
}

/**
 * 强制退出指定用户
 * @param id 用户的ID
 * @returns 请求结果
 */
export function deleteAccessToken(accessToken: string) {
  return request.delete(`/system/oauth2-token/delete?accessToken=${accessToken}`);
}
