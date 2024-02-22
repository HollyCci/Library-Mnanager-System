<template>
  <n-watermark
    :content="content"
    cross
    selectable
    :font-size="14"
    :line-height="16"
    :width="292"
    :height="228"
    :font-weight="200"
    :x-offset="12"
    :y-offset="28"
    :rotate="-14"
  >
    <router-view v-slot="{ Component, route }">
      <transition
        :name="theme.pageAnimateMode"
        mode="out-in"
        :appear="true"
        @before-leave="app.setDisableMainXScroll(true)"
        @after-enter="app.setDisableMainXScroll(false)"
      >
        <keep-alive :include="routeStore.cacheRoutes">
          <component
            :is="Component"
            v-if="app.reloadFlag"
            :key="route.fullPath"
            :class="{ 'p-16px': showPadding }"
            class="flex-grow bg-#f6f9f8 dark:bg-#101014 transition duration-300 ease-in-out"
          />
        </keep-alive>
      </transition>
    </router-view>
  </n-watermark>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useAppStore, useRouteStore, useThemeStore } from '@/store';
import { localStg } from '@/utils';

const content = ref('');

defineOptions({ name: 'GlobalContent' });

interface Props {
  /** 显示padding */
  showPadding?: boolean;
}

withDefaults(defineProps<Props>(), {
  showPadding: true
});

const app = useAppStore();
const theme = useThemeStore();
const routeStore = useRouteStore();

onMounted(() => {
  const userInfoVO = localStg.get('userInfoVO');
  if (userInfoVO !== undefined && userInfoVO?.user !== undefined && userInfoVO.user.username !== null) {
    content.value = userInfoVO.user.nickname + userInfoVO.user.username;
  }
});
</script>

<style scoped></style>
