import { request } from '../request';
export interface ClassVO {
  id?: number;
  name: string;
  grade: string;
  type: number;
  status: number;
  sort: number;
  leaderUserId: number;
  phone: string;
  email: string;
  createTime: Date;
}

/**
 * 查询班级列表
 * @param params 查询参数
 * @returns ClassVO
 */
export function fetchClassPage(params: PageParam) {
  return request.get('/system/class/list', { params });
}

export function fetchClass(id: number) {
  return request.get(`/system/class/get?id=${id}`);
}

/**
 * 删除指定班级
 * @param 部门ID
 * @returns
 */
export function deleteClass(id: number) {
  return request.delete(`/system/class/delete?id=${id}`);
}

/**
 * 获取所有班级精简信息
 * @returns ClassVO[]
 */
export function fetchSimpleClassList() {
  return request.get('/system/class/list-all-simple');
}

/**
 * 添加班级
 * @param data ClassVO
 * @returns
 */
export function createClass(data: ClassVO) {
  return request.post('/system/class/create', data);
}

/**
 * 修改班级信息
 * @param params ClassVO
 * @returns
 */
export function updateClass(params: ClassVO) {
  return request.put('/system/class/update', params);
}
