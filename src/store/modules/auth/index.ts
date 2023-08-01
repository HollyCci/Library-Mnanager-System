import { unref, nextTick } from 'vue';
import { defineStore } from 'pinia';
import { router } from '@/router';
import { fetchLogin, fetchUserInfo } from '@/service';
import { useRouterPush } from '@/composables';
import { localStg } from '@/utils';
import { $t } from '@/locales';
import { useTabStore } from '../tab';
import { useRouteStore } from '../route';
import { getToken, getUserInfo, clearAuthStorage } from './helpers';

interface AuthState {
  /** 用户信息 */
  userInfoVO: Auth.UserInfoVO;
  /** 用户token */
  accessToken: string;
  /** 登录的加载状态 */
  loginLoading: boolean;
}

export const useAuthStore = defineStore('auth-store', {
  state: (): AuthState => ({
    userInfoVO: getUserInfo(),
    accessToken: getToken(),
    loginLoading: false
  }),
  getters: {
    /** 是否登录 */
    isLogin(state) {
      return Boolean(state.accessToken);
    }
  },
  actions: {
    /** 重置auth状态 */
    resetAuthStore() {
      const { toLogin } = useRouterPush(false);
      const { resetTabStore } = useTabStore();
      const { resetRouteStore } = useRouteStore();
      const route = unref(router.currentRoute);

      clearAuthStorage();
      this.$reset();

      if (route.meta.requiresAuth) {
        toLogin();
      }

      nextTick(() => {
        resetTabStore();
        resetRouteStore();
      });
    },
    /**
     * 处理登录后成功或失败的逻辑
     * @param backendToken - 返回的token
     */
    async handleActionAfterLogin(backendToken: ApiAuth.Token) {
      const route = useRouteStore();
      const { toLoginRedirect } = useRouterPush(false);

      const loginSuccess = await this.loginByToken(backendToken);

      if (loginSuccess) {
        await route.initAuthRoute();

        // 跳转登录后的地址
        toLoginRedirect();

        // 登录成功弹出欢迎提示
        if (route.isInitAuthRoute) {
          window.$notification?.success({
            title: $t('page.login.common.loginSuccess'),
            content: $t('page.login.common.welcomeBack', { userName: this.userInfoVO.user.nickname }),
            duration: 3000
          });
        }

        return;
      }

      // 不成功则重置状态
      this.resetAuthStore();
    },
    /**
     * 根据token进行登录
     * @param backendToken - 返回的token
     */
    async loginByToken(backendToken: ApiAuth.Token) {
      let successFlag = false;

      // 先把token存储到缓存中(后面接口的请求头需要token)
      const { accessToken, refreshToken } = backendToken;
      localStg.set('accessToken', accessToken);
      localStg.set('refreshToken', refreshToken);

      // 获取用户信息
      const { data } = await fetchUserInfo();
      if (data) {
        // 成功后把用户信息存储到缓存中
        localStg.set('userInfoVO', data);

        // 更新状态
        this.userInfoVO = data;
        this.accessToken = accessToken;

        successFlag = true;
      }

      return successFlag;
    },

    /**
     * 登录
     * @param userName - 用户名
     * @param password - 密码
     */
    async login(tenant: number, userName: string, password: string) {
      this.loginLoading = true;

      window.$message?.loading('登录中....请耐心等待☕', {
        duration: 500
      });
      const { data } = await fetchLogin(tenant, userName, password);
      if (data) {
        await this.handleActionAfterLogin(data);
      }
      this.loginLoading = false;
      //
    },
    /**
     * 更换用户权限(切换账号)
     * @param userRole
     */
    async updateUserRole(userRole: Auth.RoleType) {
      const { resetRouteStore, initAuthRoute } = useRouteStore();

      const accounts: Record<Auth.RoleType, { tenant: number; userName: string; password: string }> = {
        super_admin: {
          tenant: 1,
          userName: 'Super',
          password: 'super123'
        },
        admin: {
          tenant: 1,
          userName: 'Admin',
          password: 'admin123'
        },
        user: {
          tenant: 1,
          userName: 'User01',
          password: 'user01123'
        },
        common: {
          tenant: 1,
          userName: 'Common01',
          password: 'common123'
        }
      };
      const { tenant, userName, password } = accounts[userRole];
      const { data } = await fetchLogin(tenant, userName, password);
      if (data) {
        await this.loginByToken(data);
        resetRouteStore();
        initAuthRoute();
      }
    }
  }
});
