import { DialogPlugin } from 'tdesign-vue-next';
import { useAuthStore } from '@/store';
/** 统一失败和成功的请求结果的数据类型 */
export async function handleServiceResult<T = any>(error: Service.RequestError | null, data: any) {
  if (error) {
    const fail: Service.FailedResult = {
      error,
      data: null
    };
    return fail;
  }
  const success: Service.SuccessResult<T> = {
    error: null,
    data
  };
  return success;
}

/** 请求结果的适配器：用于接收适配器函数和请求结果 */
export function adapter<T extends Service.ServiceAdapter>(
  adapterFun: T,
  ...args: Service.MultiRequestResult<Parameters<T>>
): Service.RequestResult<ReturnType<T>> {
  let result: Service.RequestResult | undefined;

  const hasError = args.some(item => {
    const flag = Boolean(item.error);
    if (flag) {
      result = {
        error: item.error,
        data: null
      };
    }
    return flag;
  });

  if (!hasError) {
    const adapterFunArgs = args.map(item => item.data);
    result = {
      error: null,
      data: adapterFun(...adapterFunArgs)
    };
  }

  return result!;
}

/** 用于处理token失效 */
export function handleAuthorized() {
  /* eslint-disable */
	const auth = useAuthStore();
	const confirmDia = DialogPlugin({
		header: '系统提示',
		body: '您的登录身份已过期，若想继续使用请重新登录。',
		confirmBtn: '我已知晓',
		theme: 'warning',
		closeOnOverlayClick: false,
		closeBtn: false,
		// @ts-ignore pros里面有cancelBtn属性，但是报错，暂时忽略
		cancelBtn: null,
		onConfirm: () => {
			auth.resetAuthStore();
			window.location.href = '/login';
			confirmDia.hide();
		}
	});
}
