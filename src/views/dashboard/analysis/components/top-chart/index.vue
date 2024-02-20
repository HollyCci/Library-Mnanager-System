<template>
	<n-grid :x-gap="16" :y-gap="16" :item-responsive="true">
		<n-grid-item span="0:24 640:240 1024:5">
			<n-card :bordered="false" class="rounded-8px shadow-sm">
				<div class="w-full h-360px py-12px">
					<p class="text-#aaa">馆内藏书量</p>
					<count-to
						:start-value="1"
						:end-value="dataShow.inventoryCount ? dataShow.inventoryCount : -1"
						class="pt-32px text-24px font-bold"
					/>
					<p class="text-#aaa pt-32px">图书借阅次数</p>
					<count-to
						:start-value="1"
						:end-value="dataShow.borrowCount ? dataShow.borrowCount : -1"
						class="pt-32px text-24px font-bold"
					/>
					<p class="text-#aaa pt-32px">图书浏览次数</p>
					<count-to
						:start-value="1"
						:end-value="dataShow.visitCount ? dataShow.visitCount : -1"
						class="pt-32px text-24px font-bold"
					/>
					<p class="text-#aaa pt-32px">图书搜索次数</p>
					<count-to
						:start-value="1"
						:end-value="dataShow.searchCount ? dataShow.searchCount : -1"
						class="pt-32px text-24px font-bold"
					/>
				</div>
			</n-card>
		</n-grid-item>
		<n-grid-item span="0:24 640:24 1024:11">
			<n-card :bordered="false" class="rounded-8px shadow-sm">
				<div ref="lineRef" class="w-full h-360px"></div>
			</n-card>
		</n-grid-item>
		<n-grid-item span="0:24 640:24 1024:8">
			<n-card :bordered="false" class="rounded-8px shadow-sm">
				<n-text class="text-17px font-extrabold">本周借阅图书排行</n-text>
				<n-list class="w-full h-333px" :show-divider="false">
					<n-list-item v-for="book in dataShow.bookRanks" :key="book.bookId">
						<n-flex justify="space-between">
							<n-ellipsis style="max-width: 290px">
								{{ book.bookName }}
							</n-ellipsis>
							<n-text style="font-weight: bold">{{ book.borrowCount }}</n-text>
						</n-flex>
						<n-progress
							type="line"
							gradient="linear-gradient(90deg, red 0%, green 50%, blue 100%)"
							:percentage="(book.borrowCount / dataShow.maxBorrowCount) * 100"
							:show-indicator="false"
							processing
						/>
					</n-list-item>
				</n-list>
			</n-card>
		</n-grid-item>
	</n-grid>
</template>

<script setup lang="ts">
/* eslint-disable */
import {ref, onMounted} from 'vue';
import type {Ref} from 'vue';
import {type ECOption, useEcharts} from '@/composables';
import * as dataApi from '@/service/api/data';

defineOptions({name: 'DashboardAnalysisTopCard'});
const dataShow = ref({
	visitCount: -1,
	searchCount: -1,
	inventoryCount: -1,
	borrowCount: -1,
	totalBorrowCounts: 0,
	maxBorrowCount: 0,
	bookRanks: [{
		bookId: 0,
		bookName: '',
		borrowCount: 0
	}],
	dayBorrowTimes: [],
	dayBorrowCounts: [],
	dayReturnCounts: []
});
let currentIndex = 12;

const lineOptions = ref<ECOption>({
	tooltip: {
		trigger: 'axis',
		axisPointer: {
			type: 'cross',
			label: {
				backgroundColor: '#6a7985'
			}
		}
	},
	legend: {
		data: ['借阅量', '归还量']
	},
	grid: {
		left: '3%',
		right: '4%',
		bottom: '3%',
		containLabel: true
	},
	xAxis: [
		{
			type: 'category',
			boundaryGap: false,
			data: []
		}
	],
	yAxis: [
		{
			type: 'value'
		}
	],
	series: [
		{
			color: '#8e9dff',
			name: '借阅量',
			type: 'line',
			smooth: true,

			areaStyle: {
				color: {
					type: 'linear',
					x: 0,
					y: 0,
					x2: 0,
					y2: 1,
					colorStops: [
						{
							offset: 0.25,
							color: '#8e9dff'
						},
						{
							offset: 1,
							color: '#fff'
						}
					]
				}
			},
			emphasis: {
				focus: 'series'
			},
			data: []
		},
		{
			color: '#26deca',
			name: '归还量',
			type: 'line',
			smooth: true,

			areaStyle: {
				color: {
					type: 'linear',
					x: 0,
					y: 0,
					x2: 0,
					y2: 1,
					colorStops: [
						{
							offset: 0.25,
							color: '#26deca'
						},
						{
							offset: 1,
							color: '#fff'
						}
					]
				}
			},
			emphasis: {
				focus: 'series'
			},
			data: []
		}
	]
}) as Ref<ECOption>;
const {domRef: lineRef} = useEcharts(lineOptions);


const getData = async () => {
	try {
		const {data} = await dataApi.getAnalysisData();
		// @ts-ignore
		dataShow.value = data;
		for (let i = 0; i < currentIndex; i++) {
			// @ts-ignore
			lineOptions.value.xAxis[0].data.push(dataShow.value.dayBorrowTimes[i])
			// @ts-ignore
			lineOptions.value.series[0].data.push(dataShow.value.dayBorrowCounts[i])
			// @ts-ignore
			lineOptions.value.series[1].data.push(dataShow.value.dayReturnCounts[i])
		}
	} catch (error) {
		console.log(error);
	}
};


setInterval(function () {
	if (currentIndex < dataShow.value.dayBorrowTimes.length) {
		// @ts-ignore
		lineOptions.value.xAxis[0].data.push(dataShow.value.dayBorrowTimes[currentIndex]);
		// @ts-ignore
		lineOptions.value.series[0].data.push(dataShow.value.dayBorrowCounts[currentIndex]);
		// @ts-ignore
		lineOptions.value.series[1].data.push(dataShow.value.dayReturnCounts[currentIndex]);
		// @ts-ignore
		lineOptions.value.xAxis[0].data.shift();
		// @ts-ignore
		lineOptions.value.series[0].data.shift();
		// @ts-ignore
		lineOptions.value.series[1].data.shift();
		currentIndex++;
	}
}, 1500)


onMounted(() => {
	getData();
})


</script>

<style scoped></style>
