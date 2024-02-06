<template>
  <n-flex>
    <n-grid :x-gap="16" :y-gap="16" :item-responsive="true">
      <n-grid-item span="0:24 640:24 1024:6">
        <n-card :bordered="false" class="rounded-8px shadow-sm">
          <div ref="hobbyRef" class="w-full h-330px"></div>
        </n-card>
      </n-grid-item>
      <n-grid-item span="0:24 640:240 1024:18	">
        <n-card :bordered="false" class="rounded-8px shadow-sm">
          <div ref="lineRef" class="h-330px"></div>
        </n-card>
      </n-grid-item>
    </n-grid>
  </n-flex>
</template>

<script setup lang="ts">
/* eslint-disable */
import { onMounted, ref } from "vue";
import type { Ref } from "vue";
import * as dataApi from "@/service/api/data";
import { type ECOption, useEcharts } from "@/composables";
import * as echarts from "echarts";

defineOptions({ name: "DashboardAnalysisDataCard" });

const hobbyRef = ref(null);
let hobbyChart = null;

const dataCard = ref({
  subject: [
    {
      value: 0,
      name: "",
    },
  ],
  approveWeekList: [],
  successWeekList: [],
  dueWeekList: [],
  dueSoonWeekList: [],
  returnedWeekList: [],
});

const lineOptions = ref<ECOption>({
  tooltip: {
    trigger: "axis",
    axisPointer: {
      type: "cross",
      label: {
        backgroundColor: "#6a7985",
      },
    },
  },
  title: {
    text: "本周借阅数据分析",
  },
  legend: {
    data: [
      "审批订单量",
      "借阅成功量",
      "即将到期量",
      "借阅逾期量",
      "归还图书量",
    ],
  },
  grid: {
    left: "3%",
    right: "4%",
    bottom: "3%",
    containLabel: true,
  },
  toolbox: {
    feature: {
      saveAsImage: {},
    },
  },
  xAxis: {
    type: "category",
    boundaryGap: false,
    data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  },
  yAxis: {
    type: "value",
  },
  series: [
    {
      color: "#37a2da",
      name: "审批订单量",
      type: "line",
      smooth: true,
      // stack: 'Total',
      areaStyle: {
        color: {
          type: "linear",
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            {
              offset: 0.25,
              color: "#37a2da",
            },
            {
              offset: 1,
              color: "#fff",
            },
          ],
        },
      },
      emphasis: {
        focus: "series",
      },
      data: [],
    },
    {
      color: "#9fe6b8",
      name: "借阅成功量",
      type: "line",
      smooth: true,
      // stack: 'Total',
      areaStyle: {
        color: {
          type: "linear",
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            {
              offset: 0.25,
              color: "#9fe6b8",
            },
            {
              offset: 1,
              color: "#fff",
            },
          ],
        },
      },
      emphasis: {
        focus: "series",
      },
      data: [],
    },
    {
      color: "#fedb5c",
      name: "即将到期量",
      type: "line",
      smooth: true,
      // stack: 'Total',
      areaStyle: {
        color: {
          type: "linear",
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            {
              offset: 0.25,
              color: "#fedb5c",
            },
            {
              offset: 1,
              color: "#fff",
            },
          ],
        },
      },
      emphasis: {
        focus: "series",
      },
      data: [],
    },
    {
      color: "#fb7293",
      name: "借阅逾期量",
      type: "line",
      smooth: true,
      // stack: 'Total',
      areaStyle: {
        color: {
          type: "linear",
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            {
              offset: 0.25,
              color: "#fb7293",
            },
            {
              offset: 1,
              color: "#fff",
            },
          ],
        },
      },
      emphasis: {
        focus: "series",
      },
      data: [],
    },
    {
      color: "#e7bcf3",
      name: "归还图书量",
      type: "line",
      smooth: true,
      // stack: 'Total',
      areaStyle: {
        color: {
          type: "linear",
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            {
              offset: 0.25,
              color: "#e7bcf3",
            },
            {
              offset: 1,
              color: "#fff",
            },
          ],
        },
      },
      emphasis: {
        focus: "series",
      },
      data: [],
    },
  ],
}) as Ref<ECOption>;
const { domRef: lineRef } = useEcharts(lineOptions);

const getData = async () => {
  const { data } = await dataApi.getAnalysisMidData();
  // @ts-ignore
  dataCard.value = data;
  // @ts-ignore
  lineOptions.value.series[0].data = dataCard.value.approveWeekList;
  // @ts-ignore
  lineOptions.value.series[1].data = dataCard.value.successWeekList;
  // @ts-ignore
  lineOptions.value.series[2].data = dataCard.value.dueSoonWeekList;
  // @ts-ignore
  lineOptions.value.series[3].data = dataCard.value.dueWeekList;
  // @ts-ignore
  lineOptions.value.series[4].data = dataCard.value.returnedWeekList;
};

const initHobbyData = async () => {
  hobbyChart = echarts.init(hobbyRef.value);

  const hobbyOption = {
    title: {
      text: "本周读者爱好分析",
    },
    tooltip: {
      trigger: "item",
      formatter: "{a} <br/>{b} : {c} ({d}%)",
    },
    series: [
      {
        name: "本周读者爱好分析",
        type: "pie",
        radius: [22, 110],
        center: ["50%", "50%"],
        roseType: "radius",
        itemStyle: {
          borderRadius: 5,
        },
        label: {
          show: false,
        },

        data: dataCard.value.subject,
      },
    ],
  };

  hobbyChart.setOption(hobbyOption);
};

onMounted(async () => {
  await getData();
  await initHobbyData();
});
</script>

<style scoped></style>
