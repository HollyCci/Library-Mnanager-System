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
