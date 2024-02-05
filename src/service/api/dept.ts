import { request } from '../request';

export interface DeptVO {
  id?: number;
  name: string;
  parentId: number;
  status: number;
  sort: number;
  leaderUserId: number;
  phone: string;
  email: string;
  createTime: Date;
}

/**
 * 查询部门列表
 * @param params 查询参数
 * @returns DeptVO
 */
export function fetchDeptPage(params: any) {
  return request.get<DeptVO[]>('/system/dept/list', { params });
}

export function fetchDept(id: number) {
  return request.get<DeptVO>(`/system/dept/get?id=${id}`);
}

/**
 * 删除指定部门
 * @param 部门ID
 * @returns
 */
export function deleteDept(id: number) {
  return request.delete(`/system/dept/delete?id=${id}`);
}

/**
 * 获取所有部门精简信息
 * @returns DeptVO[]
 */
export function fetchSimpleDeptList() {
  return request.get<DeptVO[]>('/system/dept/list-all-simple');
}

/**
 * 添加部门
 * @param data DeptVO
 * @returns
 */
export function createDept(data: DeptVO) {
  return request.post('/system/dept/create', data);
}

/**
 * 修改部门信息
 * @param params DeptVO
 * @returns
 */
export function updateDept(params: DeptVO) {
  return request.put('/system/dept/update', params);
}
