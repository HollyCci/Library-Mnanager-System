import { request } from '../request';
export interface BookSkuVO {
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
  status: number;
  createTime: Date;
}
/**
 * 获取图书列表分页
 * @param params 分页请求
 * @returns BookSkuVO[]
 */
export function getBookSkuPage(params: PageParam) {
  return request.get<any>('/library/book/page', { params });
}

/**
 * 根据ID获取图书详情
 * @param id 图书ID
 * @returns BookSkuVO
 */
export function getBookSku(id: number) {
  return request.get(`/library/book/get?id=${id}`);
}

/**
 * 创建图书信息
 * @param data 图书信息
 * @returns 图书编号
 */
export function createBookSku(data: BookSkuVO) {
  return request.post('/library/book/create', data);
}

/**
 * 更新图书信息
 * @param data 图书信息
 * @returns Boolean
 */
export function updateBookSku(data: BookSkuVO) {
  return request.put('/library/book/update', data);
}

/**
 * 删除图书
 * @param id 图书ID
 * @returns Boolean
 */
export function deleteBookSku(id: number) {
  return request.delete(`/library/book/delete?id=${id}`);
}

/**
 * 导出图书信息
 * @param params 请求参数
 * @returns 二进制流
 */
export function exportBookSku(params: any) {
  return request.download('/library/book/export', { params });
}

/**
 * 获取图书导入模板
 * @returns 二进制流
 */
export function importBookSkuTemplate() {
  return request.download('/library/book/get-import-template');
}

/**
 * 更新图书状态
 * @param id 图书ID
 * @param status 状态
 * @returns 更新状态结果
 */
export function updateBookStatus(id: number, status: number) {
  const data = {
    id,
    status
  };
  return request.put('/library/book/update-status', data);
}

/**
 * 更新图书标题
 * @param id 图书ID
 * @param title 图书标题
 * @returns Boolean
 */
export function updateBookTitle(id: number, title: string) {
  return request.put(`/library/book/update-title?id=${id}&title=${title}`);
}

/**
 * 更新图书作者
 * @param id 图书ID
 * @param author 图书作者
 * @returns Boolean
 */
export function updateBookAuthor(id: number, author: string) {
  return request.put(`/library/book/update-author?id=${id}&author=${author}`);
}

/**
 * 更新图书ISBN
 * @param id 图书ID
 * @param isbn  ISBN码
 * @returns Boolean
 */
export function updateBookIsbn(id: number, isbn: string) {
  return request.put(`/library/book/update-isbn?id=${id}&isbn=${isbn}`);
}
/**
 * 更新图书出版社
 * @param id 图书ID
 * @param publisher 图书出版社
 * @returns Boolean
 */
export function updateBookPublisher(id: number, publisher: string) {
  return request.put(`/library/book/update-publisher?id=${id}&publisher=${publisher}`);
}

/**
 * 更新图书出版日期
 * @param id 图书ID
 * @param pubDate 图书出版日期
 * @returns Boolean
 */
export function updateBookPubDate(id: number, pubDate: number) {
  return request.put(`/library/book/update-pubDate?id=${id}&pubDate=${pubDate}`);
}

/**
 * 更新图书出版地
 * @param id 图书ID
 * @param pubCity 图书出版地
 * @returns Boolean
 */
export function updateBookPubCity(id: number, pubCity: string) {
  return request.put(`/library/book/update-pubCity?id=${id}&pubCity=${pubCity}`);
}

/**
 * 更新图书出版国家
 * @param id 图书ID
 * @param pubCountry 图书出版国家
 * @returns Boolean
 */
export function updateBookPubCountry(id: number, pubCountry: string) {
  return request.put(`/library/book/update-pubCountry?id=${id}&pubCountry=${pubCountry}`);
}

/**
 * 更新图书价格
 * @param id 图书ID
 * @param price 图书价格
 * @returns Boolean
 */
export function updateBookPrice(id: number, price: number) {
  return request.put(`/library/book/update-price?id=${id}&price=${price}`);
}

/**
 * 更新图书页数
 * @param id 图书ID
 * @param pages 图书页数
 * @returns Boolean
 */
export function updateBookPages(id: number, pages: number) {
  return request.put(`/library/book/update-pages?id=${id}&pages=${pages}`);
}

/**
 * 更新图书索书号
 * @param id 图书ID
 * @param callNumber 图书索书号
 * @returns Boolean
 */
export function updateBookCallNumber(id: number, callNumber: string) {
  return request.put(`/library/book/update-callNumber?id=${id}&callNumber=${callNumber}`);
}

/**
 * 更新中图分类号
 * @param id 图书ID
 * @param classification 中图分类好
 * @returns Boolean
 */
export function updateBookClassification(id: number, classification: string) {
  return request.put(`/library/book/update-classification?id=${id}&classification=${classification}`);
}
/**
 * 更新图书丛编项
 * @param id 图书ID
 * @param series 图书丛编项
 * @returns Boolean
 */
export function updateBookSeries(id: number, series: string) {
  return request.put(`/library/book/update-series?id=${id}&series=${series}`);
}

/**
 * 更新图书摘要
 * @param id 图书ID
 * @param abstracts 图书摘要
 * @returns Boolean
 */
export function updateBookAbstracts(id: number, abstracts: string) {
  return request.put(`/library/book/update-abstracts?id=${id}&abstracts=${abstracts}`);
}
