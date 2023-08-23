import { request } from '../request';
export interface SubjectVO {
  id?: number;
  name: string;
  count: number;
  status: number;
  creator: string;
  createTime: Date;
  updater: string;
  updateTime: Date;
}
/**
 * 查询主题词列表
 * @param params 查询参数
 * @returns SubjectVO
 */
export function fetchSubjectPage(params: PageParam) {
  return request.get('/library/subject/page', { params });
}

/**
 * 根据ID查询主题词
 * @param id 主题词ID
 * @returns 主题词详情
 */
export function fetchSubject(id: number) {
  return request.get(`/library/subject/get?id=${id}`);
}

/**
 * 删除指定主题词
 * @param 主题词ID
 * @returns
 */
export function deleteSubject(id: number) {
  return request.delete(`/library/subject/delete?id=${id}`);
}

/**
 * 获取所有主题词精简信息
 * @returns SubjectVO[]
 */
export function fetchSimpleSubjectList() {
  return request.get<SubjectVO[]>('/library/subject/list-all-simple');
}

/**
 * 添加主题词
 * @param data SubjectVO
 * @returns
 */
export function createSubject(data: SubjectVO) {
  return request.post('/library/subject/create', data);
}

/**
 * 修改主题词信息
 * @param params SubjectVO
 * @returns
 */
export function updateSubject(params: SubjectVO) {
  return request.put('/library/subject/update', params);
}

/**
 * 导出主题词
 * @param params
 * @returns 二进制流
 */
export function exportSubject(params: any) {
  return request.download('/library/subject/export', params);
}

/**
 * 获取主题词导入模板
 * @returns 二进制流
 */
export function importSubjectTemplate() {
  return request.download('library/subject/get-import-template');
}
