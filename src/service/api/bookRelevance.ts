import { request } from '../request';

// 定义图书分配分类所需的请求数据类型
export interface BookAssignCategoryReqVO {
  bookId: number;
  categoryId: number;
}

// 定义图书分配主题词所需的请求数据类型
export interface BookAssignSubjectReqVO {
  bookId: number;
  subjectIds: number[];
}

/**
 * 赋予图书分类
 * @param data 赋予图书分类的请求数据
 * @returns 请求结果
 */
export function assignBookCategory(data: BookAssignCategoryReqVO) {
  return request.post('/library/book-relevance/assign-book-category', data);
}

/**
 * 赋予图书主题词
 * @param data 赋予图书主题词的请求数据
 * @returns 请求结果
 */
export function assignBookSubject(data: BookAssignSubjectReqVO) {
  return request.post('/library/book-relevance/assign-book-subject', data);
}
