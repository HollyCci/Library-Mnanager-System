import type { Ref } from 'vue';
import type { FormItemRule } from 'naive-ui';
import { REGEXP_CODE_SIX, REGEXP_EMAIL, REGEXP_PHONE, REGEXP_PWD, REGEXP_ROUTER_PATH } from '@/config';

/** 创建自定义错误信息的必填表单规则 */
export const createRequiredFormRule = (message = '不能为空'): FormItemRule => ({ required: true, message });

export const requiredFormRule = createRequiredFormRule();

/** 表单规则 */
interface CustomFormRules {
  /** 手机号码 */
  phone: FormItemRule[];
  /** 密码 */
  pwd: FormItemRule[];
  /** 验证码 */
  code: FormItemRule[];
  /** 邮箱 */
  email: FormItemRule[];
  /** 用户名 */
  username: FormItemRule[];
  /** 上级部门 */
  dept: FormItemRule[];
  /** 部门名称 */
  deptName: FormItemRule[];
  /** 排序设计 */
  sort: FormItemRule[];
  /** 状态 */
  status: FormItemRule[];
  /** 租户名称 */
  tenantName: FormItemRule[];
  /** 租户套餐 */
  packageId: FormItemRule[];
  /** 联系人名称 */
  contactName: FormItemRule[];
  /** 租户额度 */
  accountCount: FormItemRule[];
  /** 过期时间 */
  expireTime: FormItemRule[];
  /** 绑定域名 */
  domain: FormItemRule[];
  /** 路由路径 */
  routerPath: FormItemRule[];
  /** 通用单选 */
  radioStatus: FormItemRule[];
}

/** 表单规则 */
export const formRules: CustomFormRules = {
  phone: [
    createRequiredFormRule('请输入手机号码'),
    { pattern: REGEXP_PHONE, message: '手机号码格式错误', trigger: 'input' }
  ],
  pwd: [
    createRequiredFormRule('请输入密码'),
    { pattern: REGEXP_PWD, message: '密码为6-18位数字/字符/符号，至少2种组合', trigger: 'input' }
  ],
  code: [
    createRequiredFormRule('请输入验证码'),
    { pattern: REGEXP_CODE_SIX, message: '验证码格式错误', trigger: 'input' }
  ],
  email: [{ pattern: REGEXP_EMAIL, message: '邮箱格式错误', trigger: 'blur' }],
  username: [{ required: true, message: '请输入用户名', trigger: 'input' }],
  dept: [
    {
      type: 'number',
      required: true,
      trigger: ['blur', 'change'],
      message: '请选择上级部门'
    }
  ],
  deptName: [{ required: true, trigger: ['blur', 'input'], message: '请输入部门名称' }],
  sort: [
    {
      type: 'number',
      required: true,
      trigger: ['blur', 'change'],
      message: '显示排序不能为空'
    }
  ],
  status: [
    {
      type: 'number',
      required: true,
      trigger: ['blur', 'change'],
      message: '状态设置不能为空'
    }
  ],
  tenantName: [{ required: true, message: '请输入租户名称', trigger: 'input' }],
  packageId: [
    {
      type: 'number',
      required: true,
      trigger: ['blur', 'change'],
      message: '请选择租户套餐'
    }
  ],
  contactName: [{ required: true, message: '联系人姓名不能为空', trigger: 'input' }],
  accountCount: [
    {
      type: 'number',
      required: true,
      trigger: ['blur', 'change'],
      message: '租户额度不能为空'
    }
  ],
  expireTime: [{ type: 'number', required: true, trigger: ['blur', 'change'], message: '请选择过期时间' }],
  domain: [
    {
      required: true,
      message: '绑定域名不能为空',
      trigger: 'input'
    }
  ],
  routerPath: [
    createRequiredFormRule('路由地址不能为空'),
    { pattern: REGEXP_ROUTER_PATH, message: '路由地址必须以/开头', trigger: 'input' }
  ],
  radioStatus: [
    {
      trigger: 'blur',
      message: '请选择对应状态'
    }
  ]
};

/** 是否为空字符串 */
function isBlankString(str: string) {
  return str.trim() === '';
}

/** 获取确认密码的表单规则 */
export function getConfirmPwdRule(pwd: Ref<string>) {
  const confirmPwdRule: FormItemRule[] = [
    { required: true, message: '请输入确认密码' },
    {
      validator: (rule, value) => {
        if (!isBlankString(value) && value !== pwd.value) {
          return Promise.reject(rule.message);
        }
        return Promise.resolve();
      },
      message: '输入的值与密码不一致',
      trigger: 'input'
    }
  ];
  return confirmPwdRule;
}

/** 获取图片验证码的表单规则 */
export function getImgCodeRule(imgCode: Ref<string>) {
  const imgCodeRule: FormItemRule[] = [
    { required: true, message: '请输入验证码' },
    {
      validator: (rule, value) => {
        if (!isBlankString(value) && value !== imgCode.value) {
          return Promise.reject(rule.message);
        }
        return Promise.resolve();
      },
      message: '验证码不正确',
      trigger: 'blur'
    }
  ];
  return imgCodeRule;
}
