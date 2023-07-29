import { request } from '../request';

const baseUrl = 'https://api.lihaha.cn/api/v1';

export const fetchCOSSecretTmp = async () => {
  const data = await request.get<ApiSystem.COSTmpSecret>(`${baseUrl}/auth/cos/secret/tmp`);
  console.log('data', data);
  return data;
};
