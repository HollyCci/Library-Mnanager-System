<template>
  <n-card :bordered="false" class="h-full rounded-8px shadow-sm">
    <n-grid cols="s:1 m:2 l:4" responsive="screen" :x-gap="16" :y-gap="16">
      <!-- <n-grid-item v-for="item in cardData" :key="item.id">
        <gradient-bg class="h-100px" :start-color="item.colors[0]" :end-color="item.colors[1]">
          <h3 class="text-16px">{{ item.title }}</h3>
          <div class="flex justify-between pt-12px">
            <svg-icon :icon="item.icon" class="text-32px" />
            <count-to
              :prefix="item.unit"
              :start-value="1"
              :end-value="item.value"
              class="text-30px text-white dark:text-dark"
            />
          </div>
        </gradient-bg>
      </n-grid-item> -->
      <n-gi>
        <gradient-bg class="h-100px" :start-color="cardData[0].colors[0]" :end-color="cardData[0].colors[1]">
          <h3 class="text-16px">{{ cardData[0].title }}</h3>
          <div class="flex justify-between pt-12px">
            <svg-icon :icon="cardData[0].icon" class="text-32px" />
            <count-to
              :prefix="cardData[0].unit"
              :start-value="1"
              :end-value="dataShow.visitCount"
              class="text-30px text-white dark:text-dark"
            />
          </div>
        </gradient-bg>
      </n-gi>
      <n-gi>
        <gradient-bg class="h-100px" :start-color="cardData[1].colors[0]" :end-color="cardData[1].colors[1]">
          <h3 class="text-16px">{{ cardData[1].title }}</h3>
          <div class="flex justify-between pt-12px">
            <svg-icon :icon="cardData[1].icon" class="text-32px" />
            <count-to
              :prefix="cardData[1].unit"
              :start-value="1"
              :end-value="dataShow.bookCount"
              class="text-30px text-white dark:text-dark"
            />
          </div>
        </gradient-bg>
      </n-gi>
      <n-gi>
        <gradient-bg class="h-100px" :start-color="cardData[2].colors[0]" :end-color="cardData[2].colors[1]">
          <h3 class="text-16px">{{ cardData[2].title }}</h3>
          <div class="flex justify-between pt-12px">
            <svg-icon :icon="cardData[2].icon" class="text-32px" />
            <count-to
              :prefix="cardData[2].unit"
              :start-value="1"
              :end-value="dataShow.inventoryCount"
              class="text-30px text-white dark:text-dark"
            />
          </div>
        </gradient-bg>
      </n-gi>
      <n-gi>
        <gradient-bg class="h-100px" :start-color="cardData[3].colors[0]" :end-color="cardData[3].colors[1]">
          <h3 class="text-16px">{{ cardData[3].title }}</h3>
          <div class="flex justify-between pt-12px">
            <svg-icon :icon="cardData[3].icon" class="text-32px" />
            <count-to
              :prefix="cardData[3].unit"
              :start-value="1"
              :end-value="dataShow.borrowCount"
              class="text-30px text-white dark:text-dark"
            />
          </div>
        </gradient-bg>
      </n-gi>
    </n-grid>
  </n-card>
</template>

<script setup lang="tsx">
/* eslint-disable */
import { onMounted, ref } from 'vue';
import * as dataApi from '@/service/api/data';
import { GradientBg } from './components';

defineOptions({ name: 'DashboardAnalysisDataCard' });

interface CardData {
  id: string;
  title: string;
  value: number;
  unit: string;
  colors: [string, string];
  icon: string;
}

const dataShow = ref({
  visitCount: 0,
  bookCount: 0,
  inventoryCount: 0,
  borrowCount: 0
});

const cardData: CardData[] = [
  {
    id: 'visit',
    title: '访问量',
    value: dataShow.value.visitCount,
    unit: '',
    colors: ['#ec4786', '#b955a4'],
    icon: 'ant-design:bar-chart-outlined'
  },
  {
    id: 'amount',
    title: '藏书量',
    value: dataShow.value.bookCount,
    unit: '',
    colors: ['#865ec0', '#5144b4'],
    icon: 'octicon:book-24'
  },
  {
    id: 'download',
    title: '库存量',
    value: dataShow.value.inventoryCount,
    unit: '',
    colors: ['#56cdf3', '#719de3'],
    icon: 'material-symbols:inventory-2-outline'
  },
  {
    id: 'trade',
    title: '借阅量',
    value: dataShow.value.borrowCount,
    unit: '',
    colors: ['#fcbc25', '#f68057'],
    icon: 'ant-design:trademark-circle-outlined'
  }
];

const getData = async () => {
  try {
    const { data } = await dataApi.getAnalysisData();
    // @ts-ignore
    dataShow.value = data;
  } catch (error) {
    console.log(error);
  }
};

onMounted(async () => {
  await getData();
});
</script>

<style scoped></style>
