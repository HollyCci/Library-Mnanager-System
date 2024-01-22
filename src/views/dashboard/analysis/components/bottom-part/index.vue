<template>
  <n-grid :x-gap="16" :y-gap="16" :item-responsive="true">
    <n-grid-item span="0:24 640:24 1024:6">
      <!-- <n-card title="最近借阅记录" :bordered="false" class="h-full rounded-8px shadow-sm">
        <n-timeline>
          <n-timeline-item v-for="item in timelines" :key="item.type" v-bind="item" />
        </n-timeline>
      </n-card> -->
    </n-grid-item>
    <n-grid-item span="0:24 640:24 1024:18">
      <n-card :bordered="false" class="h-full rounded-8px shadow-sm">
        <!-- <div ref="barRef" class="h-400px"></div> -->
      </n-card>
    </n-grid-item>
  </n-grid>
</template>

<script setup lang="ts">
// import { ref } from 'vue';
// import type { Ref } from 'vue';
// import { type ECOption, useEcharts } from '@/composables';
defineOptions({ name: 'DashboardAnalysisBottomPart' });

// interface TimelineData {
//   type: 'default' | 'info' | 'success' | 'warning' | 'error';
//   title: string;
//   content: string;
//   time: string;
// }

// const timelines: TimelineData[] = [
//   { type: 'default', title: '李*平', content: '还书成功', time: '2023-9-13 20:46' },
//   { type: 'success', title: '王*山', content: '借阅成功', time: '2023-9-11 18:46' },
//   { type: 'error', title: '张*花', content: '借阅逾期中', time: '2023-9-11 06:46' },
//   { type: 'warning', title: '陈*平', content: '借阅即将逾期', time: '2023-9-10 10:46' },
//   { type: 'info', title: '黄*飞', content: '待取书', time: '2023-9-19 20:46' }
// ];

// const barOptions = ref<ECOption>({
//   tooltip: {
//     trigger: 'axis',
//     axisPointer: {
//       type: 'cross',
//       label: {
//         backgroundColor: '#6a7985'
//       }
//     }
//   },
//   dataset: [
//     {
//       dimensions: ['stackName', 'stackCount'],
//       source: [
//         ['五项工程书库', 852],
//         ['文学书库', 8981],
//         ['教材样本库', 234],
//         ['图书样本库', 740],
//         ['经济书库', 4399],
//         ['红色书库', 1470],
//         ['综合书库', 3702],
//         ['政法书库', 3008],
//         ['密集书库4', 20722],
//         ['图书样本书库', 808],
//         ['综合书库3', 5636]
//       ]
//     },
//     {
//       transform: {
//         type: 'sort',
//         config: { dimension: 'stackCount', order: 'desc' }
//       }
//     }
//   ],
//   xAxis: {
//     type: 'category',
//     axisLabel: { interval: 0, rotate: -300 }
//   },
//   yAxis: {},
//   series: [
//     {
//       type: 'bar',
//       color: '#8378ea',
//       encode: { x: 'stackName', y: 'stackCount' },
//       showBackground: false,
//       datasetIndex: 1,
//       barGap: 100,
//       itemStyle: {
//         borderRadius: [40, 40, 0, 0]
//       }
//     }
//   ]
// }) as Ref<ECOption>;
// const { domRef: barRef } = useEcharts(barOptions);
</script>

<style scoped></style>
