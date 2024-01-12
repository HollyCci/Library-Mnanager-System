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
/* eslint-disable */
import { ref, onMounted } from "vue";
import { useMessage } from "naive-ui";
import { loginModuleLabels } from "@/constants";
import { useRouterPush } from "@/composables";
import { fetchWeChatPoll, fetchWeChatTicket } from "~/src/service";
import { useAuthStore, useRouteStore } from "~/src/store";
import { BIND_USER } from "~/src/config";
import {localStg } from '@/utils';

const message = useMessage();
const { toLoginModule } = useRouterPush();
const { resetRouteStore, initAuthRoute } = useRouteStore();
const auth = useAuthStore();
const pollId = ref<string>("");
const weChatTicket = ref<string>();

const showQrCodeUrl = "https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=";
const loginSrc = () => {
	return `${showQrCodeUrl}${weChatTicket.value}`;
};

const pollStatusEnum = {
	// 初始化二维码(未扫码)
	init: 0,
	// 扫码成功
	scanSuccess: 1,
	// 登录成功
	loginSuccess: 2,
	// 未绑定平台
	unBind: 3,
	// 二维码失效
	invalid: 4,
};

const sleep = (time: number) =>
	new Promise((resolve) => {
		setTimeout(resolve, time);
	});

const pollFlag = ref<boolean>(false); // 轮询标志
let retryCount = 0; // 失败轮询次数
const MAX_RETRY_COUNT = 5; // 失败轮询次数
const UNBIND_CODE = 1002000011; // 未绑定平台code
// 轮训微信QR状态
const pollWeChatLogin = async () => {
	try {
		// 如果轮询标志为真，则开始轮训
		if (!pollFlag.value) {
			return;
		}

		const data = await fetchWeChatPoll({ uuid: pollId.value });

		if (data.error != null && data.error?.code !== 200) {
			retryCount += 1;

			// 未绑定平台
			if(data.error?.code === UNBIND_CODE){
				localStg.set('pollId', pollId.value)
				toLoginModule(BIND_USER)
			}

			// 异常时轮训次数超过最大次数
			if (retryCount > MAX_RETRY_COUNT) {
				pollFlag.value = false;
				return;
			}

		}

		// 扫码成功
		if (data.data?.status === pollStatusEnum.loginSuccess) {
			const { accessToken, refreshToken, userId } = data.data;
			await auth.handleActionAfterLogin({
				accessToken,
				refreshToken,
				userId,
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
		pollFlag.value = true;
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
