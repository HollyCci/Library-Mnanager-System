import type { AxiosRequestConfig } from 'axios';
import { useAuthStore } from '@/store';
import { localStg } from '@/utils';
import { fetchUpdateToken } from '../api';

/**
 * 刷新token
 * @param axiosConfig - token失效时的请求配置
 */
export async function handleRefreshToken(axiosConfig: AxiosRequestConfig) {
  const { resetAuthStore } = useAuthStore();
  const refreshToken = localStg.get('refreshToken') || '';
  const response = await fetchUpdateToken(refreshToken);
  if (response && response.data) {
    localStg.set('accessToken', response.data.accessToken);
    localStg.set('refreshToken', response.data.refreshToken);

    const config = { ...axiosConfig };
    if (config.headers) {
      config.headers.Authorization = response.data.accessToken;
    }
    return config;
  }

  resetAuthStore();
  return null;
}
