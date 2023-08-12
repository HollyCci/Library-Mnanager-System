<template>
  <n-space :vertical="true" :size="24">
    <div class="w-full min-h-full">
      <n-spin v-if="!weChatTicket" class="w-full h-360px" size="large" />
      <n-image v-if="weChatTicket" object-fit="fill" :preview-disabled="true" :src="loginSrc()" />
    </div>
    <div class="flex-y-center justify-between">
      <n-button class="flex-1" :block="true" @click="toLoginModule('pwd-login')">
        {{ loginModuleLabels['pwd-login'] }}
      </n-button>
      <div class="w-12px"></div>
      <n-button class="flex-1" :block="true" @click="toLoginModule('code-login')">
        {{ loginModuleLabels['code-login'] }}
      </n-button>
    </div>
  </n-space>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useMessage } from 'naive-ui';
import { loginModuleLabels } from '@/constants';
import { useRouterPush } from '@/composables';
import { fetchWeChatPoll, fetchWeChatTicket } from '~/src/service';
import { useAuthStore, useRouteStore } from '~/src/store';

const message = useMessage();
const { toLoginModule } = useRouterPush();
const { resetRouteStore, initAuthRoute } = useRouteStore();
const auth = useAuthStore();
const pollId = ref<string>('');
const weChatTicket = ref<string>();

const showQrCodeUrl = 'https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=';

const loginSrc = () => {
  return `${showQrCodeUrl}${weChatTicket.value}`;
};

const sleep = (time: number) =>
  new Promise(resolve => {
    setTimeout(resolve, time);
  });

const pollWeChatLogin = async () => {
  try {
    const data = await fetchWeChatPoll({ uuid: pollId.value });

    if (data.data?.type === 6) {
      const { accessToken, refreshToken, userId } = data.data;
      await auth.handleActionAfterLogin({
        accessToken,
        refreshToken,
        userId
      });
      resetRouteStore();
      initAuthRoute();
    } else {
      await sleep(1000);
      pollWeChatLogin();
    }
  } catch (error) {
    message.error(`${error}`);
  }
};
/**
 * 获取登录二维码
 */
const initWeChatTicket = async () => {
  try {
    const response = await fetchWeChatTicket();
    if (response.data) {
      pollId.value = response.data?.uuid;
      weChatTicket.value = response.data?.ticket;
    }

    // 轮训
    pollWeChatLogin();
  } catch (e) {
    message.error(`${e}`);
  }
};

onMounted(() => {
  initWeChatTicket();
});
</script>

<style scoped></style>
