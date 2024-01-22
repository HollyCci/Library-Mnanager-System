import { request } from '../request';

export function getAnalysisData() {
  return request.get('/library/data/analysis/get-dbTobDada');
}
