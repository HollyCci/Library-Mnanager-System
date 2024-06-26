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

    <n-grid :x-gap="16" :y-gap="16" :item-responsive="true" class="mt4">
      <n-grid-item span="0:24 640:24 1024:10">
        <n-card :bordered="false" class="rounded-8px shadow-sm" hoverable style="background-color: #383546">
          <category-data class="h-330px" :category-list="remoteData.categoryList" />
        </n-card>
      </n-grid-item>
      <n-grid-item span="0:24 640:240 1024:6	">
        <n-card :bordered="false" class="rounded-8px shadow-sm" hoverable style="background-color: #383546">
          <subject-data class="h-330px" :subject-list="remoteData.subjectList" />
        </n-card>
      </n-grid-item>
      <n-grid-item span="0:24 640:240 1024:8	">
        <n-card :bordered="false" class="rounded-8px shadow-sm" hoverable style="background-color: #383546">
          <div ref="pubRef" class="h-330px"></div>
        </n-card>
      </n-grid-item>
    </n-grid>

    <n-grid :x-gap="16" :y-gap="16" :item-responsive="true" class="mt4">
      <n-grid-item span="0:24 640:24 1024:8">
        <n-card :bordered="false" class="rounded-8px shadow-sm" hoverable style="background-color: #383546">
          <div ref="bookTopRef" class="h-450px"></div>
        </n-card>
      </n-grid-item>
      <n-grid-item span="0:24 640:240 1024:8">
        <n-card :bordered="false" class="rounded-8px shadow-sm" hoverable style="background-color: #383546">
          <div ref="renewTopRef" class="h-450px"></div>
        </n-card>
      </n-grid-item>
      <n-grid-item span="0:24 640:240 1024:8	">
        <n-card :bordered="false" class="rounded-8px shadow-sm" hoverable style="background-color: #383546">
          <div ref="searchTopRef" class="h-450px"></div>
        </n-card>
      </n-grid-item>
    </n-grid>
  </div>
</template>
<script setup lang="ts">
/* eslint-disable */

import {ref, onMounted} from "vue";
import {GradientBg, CategoryData, SubjectData} from "./components";
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
	bookTopNames: [],
	bookTopCount: [],
	renewBookNames: [],
	renewBookCount: [],
	searchBookNames: [],
	searchBookCount: [],
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
const bookTopRef = ref(null);
const renewTopRef = ref(null);
const searchTopRef = ref(null);

// @ts-ignore
let pubChart = null;
let bookTopChart = null;
let renewTopChart = null;
let searchTopChart = null;

// 定时更新数据
const app = {
	currentIndex: 60,
};

const initPubLine = async () => {
	// 初始化 ECharts
	pubChart = echarts.init(pubRef.value);

	// 设置 ECharts 配置
	const pubOption = {
		title: {
			text: "图书出版日期分布",
			left: "center",
			textStyle: {
				color: "#fff",
			},
		},
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

const initBookTop = async () => {
	var bookTopName = remoteData.value.bookTopNames;
	var bookTopValue = remoteData.value.bookTopCount;
	var bookTopMax: any = []; //背景按最大值
	for (let i = 0; i < bookTopValue.length; i++) {
		bookTopMax.push(bookTopValue[0]);
	}
	bookTopChart = echarts.init(bookTopRef.value);

	const bookTopOption = {
		title: {
			text: "热门借阅图书排行",
			left: "center",
			textStyle: {
				color: "#fff",
			},
		},
		grid: {
			left: "2%",
			right: "2%",
			bottom: "1%",
			top: "10%",
			containLabel: true,
		},
		tooltip: {
			trigger: "axis",
			axisPointer: {
				type: "none",
			},
			formatter: function (params: any) {
				return params[0].name + " : " + params[0].value + "次";
			},
		},
		xAxis: {
			show: false,
			type: "value",
		},
		yAxis: [
			{
				type: "category",
				inverse: true,
				axisLabel: {
					show: false,
					textStyle: {
						color: "#fff",
					},
				},
				splitLine: {
					show: false,
				},
				axisTick: {
					show: false,
				},
				axisLine: {
					show: false,
				},
				data: bookTopName,
			},
			{
				type: "category",
				inverse: true,
				axisTick: "none",
				axisLine: "none",
				show: true,
				axisLabel: {
					textStyle: {
						color: "#ffffff",
						fontSize: "12",
					},
				},
				data: bookTopValue,
			},
		],
		series: [
			{
				name: "值",
				type: "bar",
				zlevel: 1,
				itemStyle: {
					normal: {
						barBorderRadius: 30,
						color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
							{
								offset: 0,
								color: "rgb(57,89,255,1)",
							},
							{
								offset: 1,
								color: "rgb(46,200,207,1)",
							},
						]),
					},
				},
				barWidth: 20,
				data: bookTopValue,
				label: {
					normal: {
						color: "#ffffff",
						show: true,
						position: [0, "-16px"],
						textStyle: {
							fontSize: 14,
						},
						formatter: function (a: any, b: any) {
							return a.name;
						},
					},
				},
			},
			{
				name: "背景",
				type: "bar",
				barWidth: 20,
				barGap: "-100%",
				data: bookTopMax,
				itemStyle: {
					normal: {
						color: "rgba(24,31,68,1)",
						barBorderRadius: 30,
					},
				},
			},
		],
	};

	bookTopChart.setOption(bookTopOption);
};

const initRenewTop = async () => {
	var renewTopName = remoteData.value.renewBookNames;
	var renewTopValue = remoteData.value.renewBookCount;
	var bookTopMax: any = []; //背景按最大值
	for (let i = 0; i < renewTopValue.length; i++) {
		bookTopMax.push(renewTopValue[0]);
	}
	renewTopChart = echarts.init(renewTopRef.value);

	const renewTopOption = {
		title: {
			text: "热门续借图书排行",
			left: "center",
			textStyle: {
				color: "#fff",
			},
		},
		grid: {
			left: "2%",
			right: "2%",
			bottom: "1%",
			top: "5%",
			containLabel: true,
		},
		tooltip: {
			trigger: "axis",
			axisPointer: {
				type: "none",
			},
			formatter: function (params: any) {
				return params[0].name + " : " + params[0].value + "次";
			},
		},
		xAxis: {
			show: false,
			type: "value",
		},
		yAxis: [
			{
				type: "category",
				inverse: true,
				axisLabel: {
					show: false,
					textStyle: {
						color: "#fff",
					},
				},
				splitLine: {
					show: false,
				},
				axisTick: {
					show: false,
				},
				axisLine: {
					show: false,
				},
				data: renewTopName,
			},
			{
				type: "category",
				inverse: true,
				axisTick: "none",
				axisLine: "none",
				show: true,
				axisLabel: {
					textStyle: {
						color: "#ffffff",
						fontSize: "12",
					},
				},
				data: renewTopValue,
			},
		],
		series: [
			{
				name: "值",
				type: "bar",
				itemStyle: {
					normal: {
						barBorderRadius: 5,
						color: new echarts.graphic.LinearGradient(1, 0, 0, 0, [
							{offset: 0, color: "#956FD4"},
							{offset: 1, color: "#3EACE5"},
						]),
					},
				},
				barWidth: 20,
				data: renewTopValue,
				label: {
					normal: {
						color: "#ffffff",
						show: true,
						position: [0, "-16px"],
						textStyle: {
							fontSize: 14,
						},
						formatter: function (a: any, b: any) {
							return a.name;
						},
					},
				},
			},
			{
				name: "背景",
				type: "bar",
				barGap: "-100%",
				barWidth: 10,
				itemStyle: {
					normal: {
						barBorderRadius: 5,
						color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
							{offset: 0, color: "rgba(156,107,211,0.5)"},
							{offset: 0.2, color: "rgba(156,107,211,0.3)"},
							{offset: 1, color: "rgba(156,107,211,0)"},
						]),
					},
				},
				z: -12,
				data: bookTopMax,
			},
		],
	};

	renewTopChart.setOption(renewTopOption);
};

const initSearchTop = async () => {
	var searchTopName = remoteData.value.searchBookNames;
	var searchTopValue = remoteData.value.searchBookCount;
	var bookTopMax: any = []; //背景按最大值
	for (let i = 0; i < searchTopValue.length; i++) {
		bookTopMax.push(searchTopValue[0]);
	}
	searchTopChart = echarts.init(searchTopRef.value);

	const searchTopOption = {
		title: {
			text: "热门检索图书排行",
			left: "center",
			textStyle: {
				color: "#fff",
			},
		},
		grid: {
			left: "2%",
			right: "2%",
			bottom: "1%",
			top: "5%",
			containLabel: true,
		},
		tooltip: {
			trigger: "axis",
			axisPointer: {
				type: "none",
			},
			formatter: function (params: any) {
				return params[0].name + " : " + params[0].value + "次";
			},
		},
		xAxis: {
			show: false,
			type: "value",
		},
		yAxis: [
			{
				type: "category",
				inverse: true,
				axisLabel: {
					show: false,
					textStyle: {
						color: "#fff",
					},
				},
				splitLine: {
					show: false,
				},
				axisTick: {
					show: false,
				},
				axisLine: {
					show: false,
				},
				data: searchTopName,
			},
			{
				type: "category",
				inverse: true,
				axisTick: "none",
				axisLine: "none",
				show: true,
				axisLabel: {
					textStyle: {
						color: "#ffffff",
						fontSize: "12",
					},
				},
				data: searchTopValue,
			},
		],
		series: [
			{
				name: "值",
				type: "bar",
				zlevel: 1,
				itemStyle: {
					normal: {
						color: {
							type: "linear",
							x: 1,
							y: 0,
							x2: 0,
							y2: 1,
							colorStops: [
								{
									offset: 0,
									color: "#00d386", // 0% 处的颜色
								},
								{
									offset: 1,
									color: "#0076fc", // 100% 处的颜色
								},
							],
							globalCoord: false, // 缺省为 false
						},
						barBorderRadius: 15,
					},
				},
				barWidth: 20,
				data: searchTopValue,
				label: {
					normal: {
						color: "#ffffff",
						show: true,
						position: [0, "-16px"],
						textStyle: {
							fontSize: 14,
						},
						formatter: function (a: any, b: any) {
							return a.name;
						},
					},
				},
			},
			{
				name: "背景",
				type: "bar",
				barWidth: 20,
				barGap: "-100%",
				data: bookTopMax,
				itemStyle: {
					normal: {
						color: "rgba(24,31,68,1)",
						barBorderRadius: 30,
					},
				},
			},
		],
	};
	searchTopChart.setOption(searchTopOption);
};
onMounted(async () => {
	const res = await DataApi.getCommonBookData();
	// @ts-ignore
	remoteData.value = res.data;
	// 图书出版日期分布图
	await initPubLine();
	// 图书热门借阅排行
	await initBookTop();
	// 图书热门续借排行
	await initRenewTop();
	// 图书热门搜索排行
	await initSearchTop();
});
</script>


<style scoped></style>
