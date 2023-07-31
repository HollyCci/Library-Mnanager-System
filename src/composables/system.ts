import UAParser from 'ua-parser-js';
import { useAuthStore } from '@/store';
import { isArray, isString } from '@/utils';

/** 获取设备信息 */
export function useDeviceInfo() {
  const parser = new UAParser();
  const result = parser.getResult();
  return result;
}

/** 权限判断 */
export function usePermission() {
  const auth = useAuthStore();

  function hasPermission(permission: Auth.RoleType | Auth.RoleType[]) {
    // const { userRole } = auth.userInfoVO.roles;

    // let has = userRole === 'super';
    // if (!has) {
    //   if (isArray(permission)) {
    //     has = (permission as Auth.RoleType[]).includes(userRole);
    //   }
    //   if (isString(permission)) {
    //     has = (permission as Auth.RoleType) === userRole;
    //   }
    // }
    // return has;
    const { roles } = auth.userInfoVO;

    let has = roles.includes('super'); // 使用Array.includes()检查是否拥有'super'身份
    if (!has) {
      if (isArray(permission)) {
        has = (permission as Auth.RoleType[]).some(role => roles.includes(role));
        // 使用Array.some()检查是否拥有传入的任何一个角色
      }
      if (isString(permission)) {
        has = roles.includes(permission as Auth.RoleType);
        // 使用Array.includes()检查是否拥有传入的特定角色
      }
    }
    return has;
  }

  return {
    hasPermission
  };
}
