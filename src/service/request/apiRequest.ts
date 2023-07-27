import { getServiceEnvConfig } from '~/.env-config';
import { createRequest } from './request';

const { url, proxyPattern } = getServiceEnvConfig(import.meta.env);

const isHttpProxy = import.meta.env.VITE_HTTP_PROXY === 'Y';

const isMock = import.meta.env.VITE_PROD_MOCK === 'Y';

const request = isMock
  ? createRequest({ baseURL: '/mock' })
  : createRequest({ baseURL: isHttpProxy ? proxyPattern : url });

export { request };
