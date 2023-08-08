/** 用户相关模块 */
declare namespace Auth {
  /**
   * 用户角色类型(前端静态路由用角色类型进行路由权限的控制)
   * - super: 超级管理员(该权限具有所有路由数据)
   * - admin: 管理员
   * - user: 用户
   */
  type RoleType = 'super_admin' | 'admin' | 'common' | 'user';

  /** 用户信息 */
  interface UserInfo {
    /** 用户所属校区 */
    tenant: number;
    /** 用户id */
    userId: string;
    /** 用户名 */
    userName: string;
    /** 用户角色类型 */
    userRole: RoleType;
  }

  /** 用户简单信息 */
  interface UserVo {
    /** 用户id */
    id: number;
    /** 用户头像url */
    avatar: string;
    /** 用户姓名 */
    nickname: string;
  }

  /** 用户基本信息 */
  interface UserInfoVO {
    /** 用户权限操作信息 */
    permissions: string[];
    /** 用户角色信息 */
    roles: string[];
    /** 用户简单信息 */
    user: UserVo;
  }
}

declare namespace UserManagement {
  interface User extends ApiUserManagement.User {
    /** 序号 */
    index: number;
    /** 表格的key（id） */
    key: string;
  }

  /**
   * 用户性别
   * - 0: 女
   * - 1: 男
   */
  type GenderKey = NonNullable<User['gender']>;

  /**
   * 用户状态
   * - 1: 启用
   * - 2: 禁用
   * - 3: 冻结
   * - 4: 软删除
   */
  type UserStatusKey = NonNullable<User['userStatus']>;
}
