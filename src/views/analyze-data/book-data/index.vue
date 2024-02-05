<template>
  <div>
    <n-card :bordered="false" class="rounded-8px shadow-sm" hoverable>
      <n-grid cols="s:1 m:2 l:4" responsive="screen" :x-gap="16" :y-gap="16">
        <n-gi>
          <gradient-bg class="h-100px" :start-color="cardData[0].colors[0]" :end-color="cardData[0].colors[1]">
            <h3 class="text-18px">{{ cardData[0].title }}</h3>
            <div class="flex justify-between pt-12px">
              <svg-icon :icon="cardData[0].icon" class="text-32px" />
              <count-to
                :prefix="cardData[0].unit"
                :start-value="1"
                :end-value="remoteData.bookSkuCount"
                class="text-30px text-white dark:text-dark"
              />
            </div>
          </gradient-bg>
        </n-gi>
        <n-gi>
          <gradient-bg class="h-100px" :start-color="cardData[1].colors[0]" :end-color="cardData[1].colors[1]">
            <h3 class="text-18px">{{ cardData[1].title }}</h3>
            <div class="flex justify-between pt-12px">
              <svg-icon :icon="cardData[1].icon" class="text-32px" />
              <count-to
                :prefix="cardData[1].unit"
                :start-value="1"
                :end-value="remoteData.inventoryCount"
                class="text-30px text-white dark:text-dark"
              />
            </div>
          </gradient-bg>
        </n-gi>
        <n-gi>
          <gradient-bg class="h-100px" :start-color="cardData[2].colors[0]" :end-color="cardData[2].colors[1]">
            <h3 class="text-18px">{{ cardData[2].title }}</h3>
            <div class="flex justify-between pt-12px">
              <svg-icon :icon="cardData[2].icon" class="text-32px" />
              <count-to
                :prefix="cardData[2].unit"
                :start-value="1"
                :end-value="remoteData.categoryCount"
                class="text-30px text-white dark:text-dark"
              />
            </div>
          </gradient-bg>
        </n-gi>
        <n-gi>
          <gradient-bg class="h-100px" :start-color="cardData[3].colors[0]" :end-color="cardData[3].colors[1]">
            <h3 class="text-18px">{{ cardData[3].title }}</h3>
            <div class="flex justify-between pt-12px">
              <svg-icon :icon="cardData[3].icon" class="text-32px" />
              <count-to
                :prefix="cardData[3].unit"
                :start-value="1"
                :end-value="remoteData.subjectCount"
                class="text-30px text-white dark:text-dark"
              />
            </div>
          </gradient-bg>
        </n-gi>
      </n-grid>
    </n-card>

    <n-grid :x-gap="16" :y-gap="16" :item-responsive="true" class="mt4">
      <n-grid-item span="0:24 640:24 1024:10">
        <n-card :bordered="false" class="rounded-8px shadow-sm" hoverable style="background-color: #333645">
          <category-data class="h-330px" :category-list="remoteData.subjectList" />
        </n-card>
      </n-grid-item>
      <n-grid-item span="0:24 640:240 1024:6	">
        <n-card :bordered="false" class="rounded-8px shadow-sm" hoverable style="background-color: #333645">
          <subject-data class="h-330px" :subject-list="remoteData.subjectList" />
        </n-card>
      </n-grid-item>
      <n-grid-item span="0:24 640:240 1024:8	">
        <n-card :bordered="false" class="rounded-8px shadow-sm" hoverable style="background-color: #333645">
          <div ref="pubRef" class="h-330px"></div>
        </n-card>
      </n-grid-item>
    </n-grid>
  </div>
</template>
<script setup lang="ts">
/* eslint-disable */

import { ref, onMounted } from "vue";
import { GradientBg, CategoryData, SubjectData } from "./components";
import * as DataApi from "@/service/api/data";
import * as echarts from "echarts";

interface CardData {
  id: string;
  title: string;
  value: number;
  unit: string;
  colors: [string, string];
  icon: string;
}

const remoteData = ref({
  bookSkuCount: 0,
  inventoryCount: 0,
  categoryCount: 0,
  subjectCount: 0,
  subjectList: [
    {
      name: "",
      value: 0,
    },
  ],
  categoryList: [
    {
      name: "",
      value: 0,
    },
  ],
  pubDateYears: [],
  pubDateCounts: [],
});

const cardData: CardData[] = [
  {
    id: "bookSkuCount",
    title: "书目总量",
    value: remoteData.value.bookSkuCount,
    unit: "",
    colors: ["#fa709a", "#8ec5fc"],
    icon: "fluent-emoji-flat:open-book",
  },
  {
    id: "inventoryCount",
    title: "图书总量",
    value: 234567.89,
    unit: "",
    colors: ["#6852C8", "#37B8FF"],
    icon: "noto-v1:books",
  },
  {
    id: "categoryCount",
    title: "分类总量",
    value: 666666,
    unit: "",
    colors: ["#56cdf3", "#719de3"],
    icon: "icon-park:triangle-round-rectangle",
  },
  {
    id: "subjectCount",
    title: "主题词总量",
    value: 999999,
    unit: "",
    colors: ["#20E2D7", "#fff106"],
    icon: "guidance:send",
  },
];
const pubRef = ref(null);
// @ts-ignore
let pubChart = null;

// 定时更新数据
const app = {
  currentIndex: 60,
};

const initPubLine = async () => {
  // 初始化 ECharts
  pubChart = echarts.init(pubRef.value);

  // 设置 ECharts 配置
  const pubOption = {
    tooltip: {
      trigger: "axis",
      axisPointer: {
        // 坐标轴指示器，坐标轴触发有效
        type: "shadow", // 默认为直线，可选为：'line' | 'shadow'
      },
    },
    grid: {
      left: "2%",
      right: "4%",
      bottom: "14%",
      top: "16%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      data: remoteData.value.pubDateYears,
      axisLine: {
        lineStyle: {
          color: "white",
        },
      },
      axisLabel: {
        // interval: 0,
        // rotate: 40,
        textStyle: {
          fontFamily: "Microsoft YaHei",
        },
      },
    },

    yAxis: {
      type: "value",
      max: "1200",
      axisLine: {
        show: false,
        lineStyle: {
          color: "white",
        },
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: "rgba(255,255,255,0.3)",
        },
      },
      axisLabel: {},
    },
    dataZoom: [
      {
        show: true,
        height: 12,
        xAxisIndex: [0],
        bottom: "8%",
        start: 60,
        end: 100,
        handleIcon:
          "path://M306.1,413c0,2.2-1.8,4-4,4h-59.8c-2.2,0-4-1.8-4-4V200.8c0-2.2,1.8-4,4-4h59.8c2.2,0,4,1.8,4,4V413z",
        handleSize: "110%",
        handleStyle: {
          color: "#d3dee5",
        },
        textStyle: {
          color: "#fff",
        },
        borderColor: "#90979c",
      },
      {
        type: "inside",
        show: true,
        height: 15,
        start: 1,
        end: 35,
      },
    ],
    series: [
      {
        name: "数量",
        type: "bar",
        barWidth: "15%",
        itemStyle: {
          normal: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: "#248ff7",
              },
              {
                offset: 1,
                color: "#6851f1",
              },
            ]),
            barBorderRadius: 11,
          },
        },
        data: remoteData.value.pubDateCounts,
      },
    ],
  };

  // 将配置设置到图表中
  pubChart.setOption(pubOption);
  // 定时更新数据
  setInterval(() => {
    const dataLen = remoteData.value.pubDateCounts.length;

    // 取消之前高亮的图形
    // @ts-ignore
    pubChart.dispatchAction({
      type: "downplay",
      seriesIndex: 0,
      dataIndex: app.currentIndex,
    });

    app.currentIndex = (app.currentIndex + 1) % dataLen;

    // 高亮当前图形
    // @ts-ignore
    pubChart.dispatchAction({
      type: "highlight",
      seriesIndex: 0,
      dataIndex: app.currentIndex,
    });

    // 显示 tooltip
    // @ts-ignore
    pubChart.dispatchAction({
      type: "showTip",
      seriesIndex: 0,
      dataIndex: app.currentIndex,
    });
  }, 1000);
};

onMounted(async () => {
  const res = await DataApi.getCommonBookData();
  // @ts-ignore
  remoteData.value = res.data;
  await initPubLine();
});
</script>



<style scoped></style>
