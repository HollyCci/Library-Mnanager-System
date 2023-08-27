import { request } from '../request';

// 定义图书分类的接口类型
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
 * 分页获取图书分类列表
 * @param params 分页参数
 * @returns 分页数据
 */
export function fetchCategoryPage(params: PageParam) {
  return request.get('/library/category/list', { params });
}

/**
 * 获取特定图书分类
 * @param id 图书分类的ID
 * @returns 图书分类数据
 */
export function fetchCategory(id: number) {
  return request.get(`/library/category/get?id=${id}`);
}

/**
 * 删除指定图书分类
 * @param id 图书分类的ID
 * @returns 请求结果
 */
export function deleteCategory(id: number) {
  return request.delete(`/library/category/delete?id=${id}`);
}

/**
 * 获取所有图书分类的精简信息
 * @returns 所有图书分类的精简信息
 */
export function fetchSimpleCategoryList() {
  return request.get<CategoryVO[]>('/library/category/list-all-simple');
}

/**
 * 添加图书分类
 * @param data 图书分类数据
 * @returns 请求结果
 */
export function createCategory(data: CategoryVO) {
  return request.post('/library/category/create', data);
}

/**
 * 修改图书分类信息
 * @param params 图书分类数据
 * @returns 请求结果
 */
export function updateCategory(params: CategoryVO) {
  return request.put('/library/category/update', params);
}
