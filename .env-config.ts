/** 请求服务的环境配置 */
type ServiceEnv = Record<ServiceEnvType, ServiceEnvConfig>;

/** 不同请求服务的环境配置 */
const serviceEnv: ServiceEnv = {
  dev: {
    // url: 'http://api.t.lihaha.cn/admin-api'
    url: 'http://book.wocc.site/api/admin-api'
    // url: 'http://127.0.0.1:8849/admin-api'
  },
  test: {
    url: 'http://book.wocc.site/api/admin-api'
  },
  prod: {
    url: 'http://book.wocc.site/api/admin-api'
  }
};

/**
 * 获取当前环境模式下的请求服务的配置
 * @param env 环境
 */
export function getServiceEnvConfig(env: ImportMetaEnv): ServiceEnvConfigWithProxyPattern {
  const { VITE_SERVICE_ENV = 'prod' } = env;

  const config = serviceEnv[VITE_SERVICE_ENV];

  return {
    ...config,
    proxyPattern: '/admin-api'
  };
}
