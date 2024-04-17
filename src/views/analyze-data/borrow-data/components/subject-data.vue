<template>
  <div ref="subjectRef"></div>
</template>
<script setup lang="ts">
/* eslint-disable */
import {computed, ref, onMounted} from "vue";
import {CustomChart} from "echarts/charts";
import {type ECOption, useEcharts} from "@/composables";
import * as echarts from "echarts/core";

echarts.use([CustomChart]);

interface CommonData {
	name?: string;
	value?: number;
}

interface Props {
	subjectList?: CommonData[];
}

const subjectOptions = ref<ECOption>({
	title: {
		text: "图书主题词占比",
		left: "center",
		textStyle: {
			color: "#fff",
		},
	},
	tooltip: {
		trigger: "item",
		formatter: "{a} <br/>{b} : {c} 本",
	},
	series: [
		{
			name: "热门主题词",
			type: "pie",
			animationDuration: 2500,
			radius: ["20%", "63%"],
			center: ["50%", "50%"],
			roseType: "radius",
			label: {
				show: false,
			},
			emphasis: {
				label: {
					show: false,
				},
			},
			itemStyle: {
				shadowBlur: 1,
				shadowColor: "2",
				shadowOffsetX: 5,
				shadowOffsetY: 5,
			},
			data: [],
		},
		{
			name: "ring5",
			// @ts-ignore
			type: "custom",
			coordinateSystem: "none",
			renderItem(params: any, api: any) {
				return {
					type: "arc",
					shape: {
						cx: api.getWidth() / 2,
						cy: api.getHeight() / 2,
						r: (Math.min(api.getWidth(), api.getHeight()) / 2) * 0.7,
					},
					style: {
						stroke: "#8383FA",
						fill: "transparent",
						lineWidth: 1,
					},
					silent: true,
				};
			},
			data: [0],
		},
		{
			name: "ring5",
			// @ts-ignore
			type: "custom",
			coordinateSystem: "none",
			renderItem(params: any, api: any) {
				return {
					type: "arc",
					shape: {
						cx: api.getWidth() / 2,
						cy: api.getHeight() / 2,
						r: (Math.min(api.getWidth(), api.getHeight()) / 2) * 0.8,
					},
					style: {
						stroke: "#8383FA",
						fill: "transparent",
						lineWidth: 2,
					},
					silent: true,
				};
			},
			data: [0],
		},
		{
			name: "ring5",
			// @ts-ignore
			type: "custom",
			coordinateSystem: "none",
			renderItem(params: any, api: any) {
				return {
					type: "arc",
					shape: {
						cx: api.getWidth() / 2,
						cy: api.getHeight() / 2,
						r: (Math.min(api.getWidth(), api.getHeight()) / 2) * 0.71,
						startAngle: (0 * Math.PI) / 180,
						endAngle: (60 * Math.PI) / 180,
					},
					style: {
						stroke: "#8383FA",
						fill: "transparent",
						lineWidth: 8,
					},
					silent: true,
				};
			},
			data: [0],
		},
		{
			name: "ring5",
			// @ts-ignore
			type: "custom",
			coordinateSystem: "none",
			renderItem(params: any, api: any) {
				return {
					type: "arc",
					shape: {
						cx: api.getWidth() / 2,
						cy: api.getHeight() / 2,
						r: (Math.min(api.getWidth(), api.getHeight()) / 2) * 0.71,
						startAngle: (90 * Math.PI) / 180,
						endAngle: (150 * Math.PI) / 180,
					},
					style: {
						stroke: "#8383FA",
						fill: "transparent",
						lineWidth: 8,
					},
					silent: true,
				};
			},
			data: [0],
		},
		{
			name: "ring5",
			// @ts-ignore
			type: "custom",
			coordinateSystem: "none",
			renderItem(params: any, api: any) {
				return {
					type: "arc",
					shape: {
						cx: api.getWidth() / 2,
						cy: api.getHeight() / 2,
						r: (Math.min(api.getWidth(), api.getHeight()) / 2) * 0.71,
						startAngle: (180 * Math.PI) / 180,
						endAngle: (240 * Math.PI) / 180,
					},
					style: {
						stroke: "#8383FA",
						fill: "transparent",
						lineWidth: 8,
					},
					silent: true,
				};
			},
			data: [0],
		},
		{
			name: "ring5",
			// @ts-ignore
			type: "custom",
			coordinateSystem: "none",
			renderItem(params: any, api: any) {
				return {
					type: "arc",
					shape: {
						cx: api.getWidth() / 2,
						cy: api.getHeight() / 2,
						r: (Math.min(api.getWidth(), api.getHeight()) / 2) * 0.71,
						startAngle: (270 * Math.PI) / 180,
						endAngle: (330 * Math.PI) / 180,
					},
					style: {
						stroke: "#8383FA",
						fill: "transparent",
						lineWidth: 8,
					},
					silent: true,
				};
			},
			data: [0],
		},
		{
			name: "ring5",
			// @ts-ignore
			type: "custom",
			coordinateSystem: "none",
			renderItem(params: any, api: any) {
				return {
					type: "arc",
					shape: {
						cx: api.getWidth() / 2,
						cy: api.getHeight() / 2,
						r: (Math.min(api.getWidth(), api.getHeight()) / 2) * 0.12,
					},
					style: {
						stroke: "#8383FA",
						fill: "transparent",
						lineWidth: 20,
					},
					silent: true,
				};
			},
			data: [0],
		},
		{
			name: "ring5",
			// @ts-ignore
			type: "custom",
			coordinateSystem: "none",
			renderItem(params: any, api: any) {
				return {
					type: "arc",
					shape: {
						cx: api.getWidth() / 2,
						cy: api.getHeight() / 2,
						r: (Math.min(api.getWidth(), api.getHeight()) / 2) * 0.06,
					},
					style: {
						stroke: "#8383FA",
						fill: "transparent",
						lineWidth: 10,
					},
					silent: true,
				};
			},
			data: [0],
		},
	],
});
const props = defineProps<Props>();
// @ts-ignore
const {domRef: subjectRef} = useEcharts(subjectOptions);
onMounted(async () => {
	// @ts-ignore
	subjectOptions.value.series[0].data = computed(() => {
		return props.subjectList;
	});
});
</script>
