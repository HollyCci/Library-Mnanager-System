import { request } from '../request';

/**
 * 获取分析页顶部数据
 * @returns 分析页顶部数据
 */
export function getAnalysisData() {
  return request.get('/library/data/analysis/get-dbTopDada');
}

/**
 * 获取分析页中部数据
 * @returns 分析页中部数据
 */
export function getAnalysisMidData() {
  return request.get('/library/data/analysis/get-dbDataCard');
}

/**
 * 获取可视化界面-图书数据
 * @returns 图书数据
 */
export function getCommonBookData() {
  return request.get('/library/data/common/get-book-data');
}
