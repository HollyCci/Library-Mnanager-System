import { request } from '../request';

export interface ReaderBookReqVO {
  id: number;
  isbn: string;
  title: string;
  price: number;
  categoryId: number;
  subjectIds: string[];
  publisher: string;
  pubCountry: string;
  pubCity: string;
  pubDate: string;
  pages: number;
  series: string;
  abstracts: string;
  classification: string;
  author: string;
  callNumber: string;
  coreName: string;
}

export interface borrowBookReqVO {
  userId: number;
  bookId: number;
  stackId: number;
  barCode: string;
  returnTime: Date;
}

export interface borrowReturnReqVO {
  id: number;
  serialNumber: string;
}

export interface renewalBookReqVO {
  id: number;
  serialNumber: string;
  newReturnTime: Date;
  remark: string;
}

/**
 * 获取图书列表
 * @param params 分页参数
 * @returns 图书列表
 */
export function getReaderBookSkuPage(params: PageParam) {
  return request.get<any>('/library/reader/book-page', { params });
}

/**
 * 借阅图书
 * @param params 借阅参数
 * @returns 借阅订单号
 */
export function borrowBook(params: borrowBookReqVO) {
  return request.post('/library/reader/book-borrow', params);
}

/**
 * 获取借阅列表
 * @param params 查询参数
 * @returns 借阅列表
 */
export function getReaderBorrowPage(params: PageParam) {
  return request.get<any>('/library/reader/borrow-page', { params });
}

/**
 * 获取借阅逾期列表
 * @param params 查询参数
 * @returns 逾期记录列表
 */
export function getReaderOverDueBorrowPage(params: PageParam) {
  return request.get<any>('/library/reader/overdue-borrow-page', { params });
}

/**
 * 获取借阅已归还列表
 * @param params 查询参数
 * @returns 已归还记录列表
 */
export function getReaderReturnedBorrowPage(params: PageParam) {
  return request.get<any>('/library/reader/returned-borrow-page', { params });
}

/**
 * 归还图书
 * @param data 图书归还参数
 * @returns Boolean
 */
export function returnReaderBorrowBook(data: borrowReturnReqVO) {
  return request.post('/library/reader/book-return', data);
}

/**
 * 确认取书
 * @param data 参数
 * @returns Boolean
 */
export function verifyTakeBook(data: borrowReturnReqVO) {
  return request.post('/library/reader/verify-take-book', data);
}

/**
 * 续借图书
 * @param data 续借参数
 * @returns Boolean
 */
export function renewalBook(data: renewalBookReqVO) {
  return request.post('/library/reader/book-renewal', data);
}

/**
 * 获取用户借阅详情
 * @param serialNumber 订单号
 * @returns 借阅详情
 */
export function getReaderBorrowDetail(serialNumber: string) {
  return request.get(`/library/reader/borrow-detail?serialNumber=${serialNumber}`);
}
