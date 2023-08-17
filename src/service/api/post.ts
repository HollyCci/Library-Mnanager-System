import { request } from '../request';

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
 * 查询班级列表
 * @param params 查询参数
 * @returns ClassVO
 */
export function getPostPage(params: PageParam) {
  return request.get('/system/post/page', { params });
}

export function getPost(id: number) {
  return request.get(`/system/post/get?id=${id}`);
}

/**
 * 删除指定班级
 * @param 部门ID
 * @returns
 */
export function deletePost(id: number) {
  return request.delete(`/system/post/delete?id=${id}`);
}

/**
 * 获取所有班级精简信息
 * @returns PostVO[]
 */
export function getSimplePostList() {
  return request.get('/system/post/list-all-simple');
}

/**
 * 添加班级
 * @param data PostVO
 * @returns
 */
export function createClass(data: PostVO) {
  return request.post('/system/post/create', data);
}

/**
 * 修改班级信息
 * @param params PostVO
 * @returns
 */
export function updatePost(params: PostVO) {
  return request.put('/system/post/update', params);
}
export function exportPost(params: any) {
  return request.download('/system/post/export', params);
}
