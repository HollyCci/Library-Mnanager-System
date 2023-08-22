import { request } from '../request';
export interface CategoryVO {
  id?: number;
  name: string;
  picUrl: string;
  parentId: number;
  status: number;
  sort: number;
  createTime: Date;
}

/**
 * 查询分类列表
 * @param params 查询参数
 * @returns CategoryVO
 */
export function fetchCategoryPage(params: PageParam) {
  return request.get('/library/category/list', { params });
}

export function fetchCategory(id: number) {
  return request.get(`/library/category/get?id=${id}`);
}

/**
 * 删除指定部门
 * @param 部门ID
 * @returns
 */
export function deleteCategory(id: number) {
  return request.delete(`/library/category/delete?id=${id}`);
}

/**
 * 获取所有部门精简信息
 * @returns CategoryVO[]
 */
export function fetchSimpleCategoryList() {
  return request.get<CategoryVO[]>('/library/category/list-all-simple');
}

/**
 * 添加部门
 * @param data CategoryVO
 * @returns
 */
export function createCategory(data: CategoryVO) {
  return request.post('/library/category/create', data);
}

/**
 * 修改部门信息
 * @param params CategoryVO
 * @returns
 */
export function updateCategory(params: CategoryVO) {
  return request.put('/library/category/update', params);
}
