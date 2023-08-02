<template>
  <n-form ref="formRef" :model="model" :rules="rules" size="large" :show-label="false">
    <n-form-item path="tenant">
      <n-select
        v-model:value="model.tenant"
        :options="options"
        clearable
        placeholder="$t('page.login.common.tenantPlaceholder')"
      >
        <template #action>
          <n-gradient-text type="danger" class="text-17px font-bold">
            <icon-twemoji:growing-heart />
            <icon-twemoji:growing-heart />
            永远热爱郑州工商学院~
          </n-gradient-text>
        </template>
      </n-select>
    </n-form-item>
    <n-form-item path="userName">
      <n-input v-model:value="model.userName" :placeholder="$t('page.login.common.userNamePlaceholder')">
        <template #prefix>
          <icon-line-md:account class="text-25px" />
        </template>
      </n-input>
    </n-form-item>
    <n-form-item path="password">
      <n-input
        v-model:value="model.password"
        type="password"
        show-password-on="click"
        :placeholder="$t('page.login.common.passwordPlaceholder')"
      >
        <template #prefix>
          <icon-line-md:text-box class="text-25px" />
        </template>
      </n-input>
    </n-form-item>
    <n-space :vertical="true" :size="24">
      <div class="flex-y-center justify-between">
        <n-checkbox v-model:checked="rememberMe">{{ $t('page.login.pwdLogin.rememberMe') }}</n-checkbox>
        <n-button :text="true" @click="toLoginModule('reset-pwd')">
          {{ $t('page.login.pwdLogin.forgetPassword') }}
        </n-button>
      </div>
      <n-button
        type="primary"
        size="large"
        :block="true"
        :round="true"
        :loading="auth.loginLoading"
        @click="handleSubmit"
      >
        {{ $t('page.login.common.confirm') }}
      </n-button>
      <div class="flex-y-center justify-between">
        <n-button class="flex-1" :block="true" @click="toLoginModule('code-login')">
          {{ loginModuleLabels['code-login'] }}
        </n-button>
        <div class="w-12px"></div>
        <n-button class="flex-1" :block="true" @click="toLoginModule('register')">
          {{ loginModuleLabels.register }}
        </n-button>
      </div>
    </n-space>
    <!-- <other-account @login="handleLoginOtherAccount" /> -->
  </n-form>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import type { FormInst, FormRules } from 'naive-ui';
import { loginModuleLabels } from '@/constants';
import { useAuthStore } from '@/store';
import { useRouterPush } from '@/composables';
import { formRules, localStg } from '@/utils';
// import { OtherAccount } from './components';

const auth = useAuthStore();
const { login } = useAuthStore();
const { toLoginModule } = useRouterPush();

const formRef = ref<HTMLElement & FormInst>();

const model = reactive({
  tenant: 1,
  userName: 'admin',
  password: 'admin123'
});

const options = [
  {
    label: '郑州工商学院-郑州校区',
    value: 1
  },
  {
    label: '郑州工商学院-兰考校区',
    value: 2
  }
];

const rules: FormRules = {
  userName: formRules.username,
  password: formRules.pwd
};

const rememberMe = ref(false);

async function handleSubmit() {
  await formRef.value?.validate();

  const { tenant, userName, password } = model;

  localStg.set('tenantId', tenant);
  login(tenant, userName, password);
}

// function handleLoginOtherAccount(param: { tenant: number; userName: string; password: string }) {
//   const { tenant, userName, password } = param;
//   login(tenant, userName, password);
// }
</script>

<style scoped></style>
