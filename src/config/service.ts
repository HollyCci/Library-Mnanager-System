/** 请求超时时间 */
export const REQUEST_TIMEOUT = 60 * 1000;

/** 错误信息的显示时间 */
export const ERROR_MSG_DURATION = 3 * 1000;

/** 默认的请求错误code */
export const DEFAULT_REQUEST_ERROR_CODE = 'DEFAULT';

/** 默认的请求错误文本 */
export const DEFAULT_REQUEST_ERROR_MSG = '请求错误~';

/** 请求超时的错误code(为固定值：ECONNABORTED) */
export const REQUEST_TIMEOUT_CODE = 'ECONNABORTED';

/** 请求超时的错误文本 */
export const REQUEST_TIMEOUT_MSG = '请求超时~';

/** 网络不可用的code */
export const NETWORK_ERROR_CODE = 'NETWORK_ERROR';

/** 网络不可用的错误文本 */
export const NETWORK_ERROR_MSG = '网络不可用~';

/** 请求不成功各种状态的错误 */
export const ERROR_STATUS = {
  400: '400: 请求参数不正确',
  401: '401: 用户未登录',
  403: '403: 没有该操作权限~',
  404: '404: 请求未找到~',
  405: '405: 请求方法不正确~',
  423: '423: 请求失败，请稍后重试',
  429: '429: 请求过于频繁，请稍后重试',
  408: '408: 网络请求超时~',
  500: '500: 服务器内部错误~',
  501: '501: 服务器未实现请求功能~',
  502: '502: 错误网关~',
  503: '503: 服务不可用~',
  504: '504: 网关超时~',
  505: '505: http版本不支持该请求~',
  900: '重复请求，请稍后充实',
  [DEFAULT_REQUEST_ERROR_CODE]: DEFAULT_REQUEST_ERROR_MSG
};

/** 不弹出错误信息的code */
export const NO_ERROR_MSG_CODE: (string | number)[] = [];

/** token失效需要刷新token的code(这里的66666只是个例子，需要将后端表示token过期的code填进来) */
export const REFRESH_TOKEN_CODE: (string | number)[] = [401];
