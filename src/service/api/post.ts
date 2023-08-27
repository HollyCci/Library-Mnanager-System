import { request } from '../request';

// 岗位数据的类型定义
export interface PostVO {
  id?: number;
  name: string;
  code: string;
  sort: number;
  status: number;
  remark: string;
  createTime?: Date;
}

/**
 * 查询岗位列表
 * @param params 查询参数
 * @returns 岗位列表数据
 */
export function getPostPage(params: PageParam) {
  return request.get('/system/post/page', { params });
}

/**
 * 获取岗位详情
 * @param id 岗位ID
 * @returns 岗位详情数据
 */
export function getPost(id: number) {
  return request.get(`/system/post/get?id=${id}`);
}

/**
 * 删除指定岗位
 * @param id 岗位ID
 * @returns 删除结果
 */
export function deletePost(id: number) {
  return request.delete(`/system/post/delete?id=${id}`);
}

/**
 * 获取所有岗位的精简信息
 * @returns 所有岗位的精简信息列表
 */
export function getSimplePostList() {
  return request.get('/system/post/list-all-simple');
}

/**
 * 添加岗位
 * @param data 岗位数据
 * @returns 添加结果
 */
export function createPost(data: PostVO) {
  return request.post('/system/post/create', data);
}

/**
 * 修改岗位信息
 * @param params 岗位数据
 * @returns 修改结果
 */
export function updatePost(params: PostVO) {
  return request.put('/system/post/update', params);
}

/**
 * 导出岗位数据
 * @param params 导出参数
 * @returns 导出的岗位数据
 */
export function exportPost(params: any) {
  return request.download('/system/post/export', params);
}
