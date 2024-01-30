import { request } from '../request';

/**
 * 用户搜索完成后，点击图书详情，收集用户点击数据
 * @param stamp 搜索特征码
 * @param bookId 点击图书ID
 * @returns null
 */
export function confirmClickView(stamp: string, bookId: number) {
  return request.post('/library/collect/verifyView', { stamp, bookId });
}

/**
 * 用户查看图书详情后，点击借阅，收集用户点击数据
 * @param stamp 搜索特征码
 * @param bookId 借阅图书ID
 * @returns null
 */
export function confirmClickBorrow(stamp: string, bookId: number) {
  return request.post('/library/collect/verifyBorrow', { stamp, bookId });
}
