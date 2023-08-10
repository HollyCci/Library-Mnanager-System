import axios from 'axios';
import type { AxiosResponse, AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';
import { REFRESH_TOKEN_CODE } from '@/config';
import {
  localStg,
  handleAxiosError,
  handleBackendError,
  handleResponseError,
  handleServiceResult,
  handleAuthorized,
  transformRequestData
} from '@/utils';
import { handleRefreshToken } from './helpers';

type RefreshRequestQueue = (config: AxiosRequestConfig) => void;

const tenantEnable = import.meta.env.VITE_APP_TENANT_ENABLE;
// 需要忽略的提示。忽略后，自动 Promise.reject('error')
const ignoreMsgs = [
  '无效的刷新令牌', // 刷新令牌被删除时，不用提示
  '刷新令牌已过期' // 使用刷新令牌，刷新获取新的访问令牌时，结果因为过期失败，此时需要忽略。否则，会导致继续 401，无法跳转到登出界面
];

/**
 * 封装axios请求类
 * @author Soybean<honghuangdc@gmail.com>
 */
export default class CustomAxiosInstance {
  instance: AxiosInstance;

  backendConfig: Service.BackendResultConfig;

  isRefreshing: boolean;

  retryQueues: RefreshRequestQueue[];

  /**
   *
   * @param axiosConfig - axios配置
   * @param backendConfig - 后端返回的数据配置
   */
  constructor(
    axiosConfig: AxiosRequestConfig,
    backendConfig: Service.BackendResultConfig = {
      codeKey: 'code',
      dataKey: 'data',
      msgKey: 'msg',
      successCode: 200
    }
  ) {
    this.backendConfig = backendConfig;
    this.instance = axios.create(axiosConfig);
    this.setInterceptor();
    this.isRefreshing = false;
    this.retryQueues = [];
  }

  /** 设置请求拦截器 */
  setInterceptor() {
    this.instance.interceptors.request.use(
      async config => {
        const handleConfig = { ...config };
        if (handleConfig.headers) {
          // 数据转换
          const contentType = handleConfig.headers['Content-Type'] as UnionKey.ContentType;
          handleConfig.data = await transformRequestData(handleConfig.data, contentType);
          // 设置token
          handleConfig.headers.Authorization = `Bearer ${localStg.get('accessToken')}`;
          // 设置租户
          if (tenantEnable && tenantEnable === 'true') {
            const tenantId = localStg.get('tenantId');
            if (tenantId) {
              handleConfig.headers['tenant-id'] = tenantId;
            }
          }
        }
        /* eslint-disable */
				//  解决CORS错误
        const params = handleConfig.params || {};
        if (handleConfig.method?.toUpperCase() === 'GET' && params) {
          let url = `${handleConfig.url}?`;
          for (const propName of Object.keys(params)) {
            const value = params[propName];
						if (value !== void 0 && value !== null && typeof value !== 'undefined') {
              if (typeof value === 'object') {
                for (const val of Object.keys(value)) {
                  const param = `${propName}[${val}]`;
                  const subPart = `${encodeURIComponent(param)}=`;
                  url += `${subPart + encodeURIComponent(value[val])}&`;
                }
              } else {
                url += `${propName}=${encodeURIComponent(value)}&`;
              }
            }
          }
          // 给 get 请求加上时间戳参数，避免从缓存中拿数据
          // const now = new Date().getTime()
          // params = params.substring(0, url.length - 1) + `?_t=${now}`
          url = url.slice(0, -1);
          handleConfig.params = {};
          handleConfig.url = url;
        }

        return handleConfig;
      },
      (axiosError: AxiosError) => {
        const error = handleAxiosError(axiosError);
        return handleServiceResult(error, null);
      }
    );
    this.instance.interceptors.response.use(
      (async response => {
        const { status, config } = response;
        if (status === 200 || status < 300 || status === 304) {
          const backend = response.data;
          const { codeKey, dataKey, msgKey, successCode } = this.backendConfig;
          // 请求成功
          if (backend[codeKey] === successCode) {
            return handleServiceResult(null, backend[dataKey]);
          }

          // token失效, 刷新token
          if (REFRESH_TOKEN_CODE.includes(backend[codeKey])) {
            // 原始请求
            const originRequest = new Promise(resolve => {
              this.retryQueues.push((refreshConfig: AxiosRequestConfig) => {
                config.headers.Authorization = refreshConfig.headers?.Authorization;
                resolve(this.instance.request(config));
              });
            });

            if (!this.isRefreshing) {
              this.isRefreshing = true;
              const refreshConfig = await handleRefreshToken(response.config);
              if (refreshConfig) {
                this.retryQueues.map(cb => cb(refreshConfig));
              }
              this.retryQueues = [];
              this.isRefreshing = false;
            }
            if (ignoreMsgs.indexOf(backend[msgKey]) !== -1) {
              this.retryQueues = [];
              this.isRefreshing = false;
              return handleAuthorized();
            }
            return originRequest;
          }

          const error = handleBackendError(backend, this.backendConfig);
          return handleServiceResult(error, null);
        }
        const error = handleResponseError(response);
        return handleServiceResult(error, null);
      }) as (response: AxiosResponse<any, any>) => Promise<AxiosResponse<any, any>>,
      (axiosError: AxiosError) => {
        const error = handleAxiosError(axiosError);
        return handleServiceResult(error, null);
      }
    );
  }
}
