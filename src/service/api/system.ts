const baseUrl = 'https://api.lihaha.cn/api/v1';

export const fetchCOSSecretTmp = async () => {
  // const data = await request.get<ApiSystem.COSTmpSecret>();
  const data = await (await fetch(`${baseUrl}/auth/cos/secret/tmp`)).json();
  return data;
};
