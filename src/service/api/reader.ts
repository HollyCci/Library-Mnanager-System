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
