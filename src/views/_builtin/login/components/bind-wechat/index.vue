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
    <n-space :vertical="true" size="large">
      <n-button type="primary" size="large" :block="true" :round="true" @click="handleSubmit">
        {{ $t('page.login.common.confirm') }}
      </n-button>
      <n-button size="large" :block="true" :round="true" @click="toLoginModule('pwd-login')">
        {{ $t('page.login.common.back') }}
      </n-button>
    </n-space>
  </n-form>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue';
import type { FormInst } from 'naive-ui';
import { useAuthStore } from '@/store';
import { useRouterPush } from '@/composables';
import { formRules, localStg } from '@/utils';
import { $t } from '@/locales';

const { toLoginModule } = useRouterPush();
const { bindUser } = useAuthStore();
const pollId = ref<string>('');

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

const rules = {
  phone: formRules.phone,
  code: formRules.code
};

async function handleSubmit() {
  await formRef.value?.validate();
  const { tenant, userName, password } = model;
  localStg.set('tenantId', tenant);
  bindUser(userName, password, pollId.value);
}

async function validatePollId() {
  // 从缓存中获取pollId，如果不存在则跳转到密码登录界面；如果存在则验证pollId是否有效。
  const storedPollId = localStg.get('pollId');
  pollId.value = storedPollId ?? ''; // Use empty string if storedPollId is null

  if (!pollId.value) {
    window.$message?.error('扫码请求不存在或服务器缓存被禁用，请重新尝试操作。');
    toLoginModule('pwd-login');
  }
}

onMounted(async () => {
  await validatePollId();
});
</script>

<style scoped></style>
