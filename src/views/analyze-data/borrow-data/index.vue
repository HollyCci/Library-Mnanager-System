<template>
  <div>
    <n-grid cols="s:1 m:2 l:4" responsive="screen" :x-gap="16" :y-gap="16">
      <n-gi>
        <gradient-bg class="h-100px" :start-color="cardData[0].colors[0]" :end-color="cardData[0].colors[1]">
          <h3 class="text-18px">{{ cardData[0].title }}</h3>
          <div class="flex justify-between pt-12px">
            <svg-icon :icon="cardData[0].icon" class="text-32px" />
            <count-to
              :prefix="cardData[0].unit"
              :start-value="1"
              :end-value="remoteData.borrowCount"
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
              :end-value="remoteData.borrowingCount"
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
              :end-value="remoteData.returnCount"
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
              :end-value="remoteData.overDueCount"
              class="text-30px text-white dark:text-dark"
            />
          </div>
        </gradient-bg>
      </n-gi>
    </n-grid>

    <n-grid :x-gap="16" :y-gap="16" :item-responsive="true" class="mt4">
      <n-grid-item span="0:24 640:240 1024:14	">
        <n-card :bordered="false" class="rounded-8px shadow-sm" hoverable style="background-color: #383546">
          <div ref="borrowDataRef" class="h-330px"></div>
        </n-card>
      </n-grid-item>
      <n-grid-item span="0:24 640:24 1024:10">
        <n-card :bordered="false" class="rounded-8px shadow-sm" hoverable style="background-color: #383546">
          <div ref="borrowTimeTopRef" class="h-330px"></div>
        </n-card>
      </n-grid-item>
    </n-grid>
  </div>
</template>

<script setup lang="ts">
/* eslint-disable */

import { ref, onMounted } from 'vue';
import * as echarts from 'echarts';
import * as DataApi from '@/service/api/data';
import { GradientBg } from './components';

const remoteData = ref({
  borrowCount: 0,
  borrowingCount: 0,
  returnCount: 0,
  overDueCount: 0,
  borrowDataMonths: [],
  borrowDataCounts: [],
  borrowTimeTopNames: [],
  borrowTimeTopTimes: []
});

interface CardData {
  id: string;
  title: string;
  value: number;
  unit: string;
  colors: [string, string];
  icon: string;
}
const cardData: CardData[] = [
  {
    id: 'borrowCount',
    title: '借阅总量',
    value: remoteData.value.borrowCount,
    unit: '',
    colors: ['#fa709a', '#8ec5fc'],
    icon: 'fluent-emoji-flat:open-book'
  },
  {
    id: 'borrowingCount',
    title: '借阅中总量',
    value: 234567.89,
    unit: '',
    colors: ['#6852C8', '#37B8FF'],
    icon: 'noto-v1:books'
  },
  {
    id: 'returnCount',
    title: '已归还总量',
    value: 666666,
    unit: '',
    colors: ['#56cdf3', '#719de3'],
    icon: 'icon-park:triangle-round-rectangle'
  },
  {
    id: 'overDueCount',
    title: '逾期中总量',
    value: 999999,
    unit: '',
    colors: ['#20E2D7', '#fff106'],
    icon: 'guidance:send'
  }
];

const borrowDataRef = ref(null);
const borrowTimeTopRef = ref(null);

let borrowDataChart = null;
let borrowTimeTopChart = null;

const initBorrowDataLine = async () => {
  // 初始化 ECharts
  borrowDataChart = echarts.init(borrowDataRef.value);

	var max = [];
	for (var i=0; i<remoteData.value.borrowDataCounts.length; i++)
	{max.push(500);}

  const borrowDataOption = {
		title: {
			text: "日借阅数据分布",
			left: "center",
			textStyle: {
				color: "#fff",
			},
		},
        tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'shadow'
        }
    },
    grid: {
        top: "19%",
        right: "6%",
        left: "9%",
        bottom: "29%"
    },
    xAxis: [{
            data: remoteData.value.borrowDataMonths,
            axisLine: {
                lineStyle: {
                    color: '#FFFFFF'
                }
            },
            axisLabel: {
                color: '#FFFFFF',
								rotate: 29,
                fontSize: 12
            }
        }
    ],
    yAxis: [{
        max: 500,
        splitLine: {
            show: true
        },
        axisLine: {
            show: false,
            lineStyle: {
                color: '#FFFFFF'
            }
        },
        axisLabel: {
            textStyle: {
                color: '#FFFFFF'
            },
        },
    }],
		dataZoom: [
			{
				show: true,
				height: 12,
				xAxisIndex: [0],
				bottom: "8%",
				start: 80,
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
    series: [{
        name: '数量',
        type: 'pictorialBar',
        symbol: 'rect',
        itemStyle: {
            color: '#10bffc'
        },
        symbolRepeat: true,
        symbolSize: [14, 4],
        symbolMargin: 0.5,
        symbolPosition: 'start',
        z: -20,
        data: remoteData.value.borrowDataCounts,
			},
			{
        name: '',
        type: 'bar',
        barWidth: 19,
        itemStyle: {
            color: 'rgba(0,0,0,0)',
            borderWidth: 2,
            borderColor: '#10bffc',
            padding: 0
        },
        z: -10,
        data: max,
        tooltip:{show:false}
			},
			{
        type: 'line',
        symbol: 'image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAFCAYAAAB1j90SAAABS2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxMzggNzkuMTU5ODI0LCAyMDE2LzA5LzE0LTAxOjA5OjAxICAgICAgICAiPgogPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIi8+CiA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgo8P3hwYWNrZXQgZW5kPSJyIj8+IEmuOgAAADFJREFUGJVjFNj/hwEK/jMQBxgZGBgYWNAFiAUwjcTaBrcEppEk22A2kmobAwMDAwMA74EE3gW8aacAAAAASUVORK5CYII=',
        symbolSize: [14, 6],
        symbolOffset: [0, '-70%'],
        itemStyle: {
            color: 'rgba(0,0,0,0)',
            borderWidth: 2,
            borderColor: '#10bffc',
            padding: 0
        },
        z: -10,
        data: max,
        tooltip:{show:false}
    }]
};
  borrowDataChart.setOption(borrowDataOption);
};

const initBorrowTimeTop = async () => {

	borrowTimeTopChart = echarts.init(borrowTimeTopRef.value);

	var myColor = ['#eb2100', '#eb3600', '#d0570e', '#d0a00e', '#34da62', '#00e9db', '#00c0e9', '#0096f3', '#33CCFF', '#33FFCC'];
	const borrowTimeTopOption = {
    grid: {
        left: '11%',
        top: '12%',
        right: '0%',
        bottom: '8%',
        containLabel: true
    },
    xAxis: [{
        show: true,
    }],
    yAxis: [{
        axisTick: 'none',
        axisLine: 'none',
        offset: '27',
        axisLabel: {
            textStyle: {
                color: '#ffffff',
                fontSize: '16',
            }
        },
        data: remoteData.value.borrowTimeTopNames
    }, {
        axisTick: 'none',
        axisLine: 'none',
        axisLabel: {
            textStyle: {
                color: '#ffffff',
                fontSize: '16',
            }
        },
        data: remoteData.value.borrowTimeTopTimes
    }, {
        name: '借阅时间TOP 7',
        nameGap: '50',
        nameTextStyle: {
            color: '#ffffff',
            fontSize: '16',
        },
        axisLine: {
            lineStyle: {
                color: 'rgba(0,0,0,0)'
            }
        },
        data: [],
    }],
    series: [{
            name: '条',
            type: 'bar',
            yAxisIndex: 0,
            data: remoteData.value.borrowTimeTopTimes,
            label: {
                normal: {
                    show: true,
                    position: 'right',
                    textStyle: {
                        color: '#ffffff',
                        fontSize: '16',
                    }
                }
            },
            barWidth: 12,
            itemStyle: {
                normal: {
                    color: function(params: any) {
                        var num = myColor.length;
                        return myColor[params.dataIndex % num]
                    },
                }
            },
            z: 2
        }, {
            name: '白框',
            type: 'bar',
            yAxisIndex: 1,
            barGap: '-100%',
            data: [99, 99.5, 99.5, 99.5, 99.5, 99.5, 99.5, 99.5, 99.5, 99.5],
            barWidth: 20,
            itemStyle: {
                normal: {
                    color: '#0e2147',
                    barBorderRadius: 5,
                }
            },
            z: 1
        }, {
            name: '外框',
            type: 'bar',
            yAxisIndex: 2,
            barGap: '-100%',
            data: [100, 100, 100, 100, 100, 100, 100, 100, 100, 100],
            barWidth: 24,
            itemStyle: {
                normal: {
                    color: function(params: any) {
                        var num = myColor.length;
                        return myColor[params.dataIndex % num]
                    },
                    barBorderRadius: 5,
                }
            },
            z: 0
        },
        {
            name: '外圆',
            type: 'scatter',
            hoverAnimation: false,
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            yAxisIndex: 2,
            symbolSize: 35,
            itemStyle: {
                normal: {
                    color: function(params: any) {
                        var num = myColor.length;
                        return myColor[params.dataIndex % num]
                    },
                    opacity: 1,
                }
            },
            z: 2
        }
    ]

};
borrowTimeTopChart.setOption(borrowTimeTopOption)
};

onMounted(async () => {
  const res = await DataApi.getCommonBorrowData();
	// @ts-ignore
  remoteData.value = res.data;
  // 日借阅量分布图
  await initBorrowDataLine();
  // 借阅时间排行
  await initBorrowTimeTop();
});
</script>
