import { request } from '../request';

// 定义班级的接口类型
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
 * 分页获取班级列表
 * @param params 分页参数
 * @returns 分页数据
 */
export function fetchClassPage(params: PageParam) {
  return request.get('/system/class/list', { params });
}

/**
 * 获取特定班级
 * @param id 班级的ID
 * @returns 班级数据
 */
export function fetchClass(id: number) {
  return request.get(`/system/class/get?id=${id}`);
}

/**
 * 删除指定班级
 * @param id 班级的ID
 * @returns 请求结果
 */
export function deleteClass(id: number) {
  return request.delete(`/system/class/delete?id=${id}`);
}

/**
 * 获取所有班级的精简信息
 * @returns 所有班级的精简信息
 */
export function fetchSimpleClassList() {
  return request.get<ClassVO[]>('/system/class/list-all-simple');
}

/**
 * 添加班级
 * @param data 班级数据
 * @returns 请求结果
 */
export function createClass(data: ClassVO) {
  return request.post('/system/class/create', data);
}

/**
 * 修改班级信息
 * @param params 班级数据
 * @returns 请求结果
 */
export function updateClass(params: ClassVO) {
  return request.put('/system/class/update', params);
}
