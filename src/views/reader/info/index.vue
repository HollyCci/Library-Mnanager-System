<template>
	<n-space :vertical="true" :size="16">
		<!-- <div
			class="hover:-translate-y-2 group bg-neutral-50 duration-500 w-44 h-44 flex text-neutral-600 flex-col justify-center items-center relative rounded-xl overflow-hidden shadow-md"
		>
			<svg
				viewBox="0 0 200 200"
				xmlns="http://www.w3.org/2000/svg"
				class="absolute blur z-10 fill-red-300 duration-500 group-hover:blur-none group-hover:scale-105"
			>
				<path
					transform="translate(100 100)"
					d="M39.5,-49.6C54.8,-43.2,73.2,-36.5,78.2,-24.6C83.2,-12.7,74.8,4.4,69,22.5C63.3,40.6,60.2,59.6,49.1,64.8C38.1,70,19,61.5,0.6,60.7C-17.9,59.9,-35.9,67,-47.2,61.9C-58.6,56.7,-63.4,39.5,-70,22.1C-76.6,4.7,-84.9,-12.8,-81.9,-28.1C-79,-43.3,-64.6,-56.3,-49.1,-62.5C-33.6,-68.8,-16.8,-68.3,-2.3,-65.1C12.1,-61.9,24.2,-55.9,39.5,-49.6Z"
				></path>
			</svg>

			<div class="z-20 flex flex-col justify-center items-center">
				<span class="font-bold text-6xl ml-2">34+</span>
				<p class="font-bold">Projects</p>
			</div>
		</div> -->

		<n-card title="我的信息" :bordered="false" size="small" class="rounded-8px shadow-sm" hoverable>
			<n-card :bordered="false" class="rounded-8px shadow-sm">
				<div class="flex-y-center justify-between">
					<div class="flex-y-center">
						<icon-local-avatar class="text-70px"/>
						<div class="pl-12px">
							<h3 class="text-18px font-semibold">
								{{ userInfo ? userInfo.nickname + '您好，' + titleTip : '暂无昵称' }}
							</h3>
							<n-flex>
								<n-tag :bordered="false" size="small" class="tag tag-primary border">
									{{ userInfo && userInfo.dept.name ? userInfo.dept.name : '暂无学院信息' }}
								</n-tag>
								<n-tag :bordered="false" size="small" class="tag tag-primary border">
									{{ userInfo && userInfo.sclass.name ? userInfo.sclass.name : '暂无班级信息' }}
								</n-tag>
							</n-flex>
						</div>
					</div>
					<n-space :size="24" :wrap="false">
						<n-statistic
							label="借阅额度"
							:value="userInfo && userInfo.borrowCount ? userInfo.borrowCount - userInfo.borrowedCount : 0"
						>
							<template #prefix>
								<n-icon>
									<icon-fluent:person-available-20-regular class="text-28px mb2"/>
								</n-icon>
							</template>
							<template #suffix>
								<n-text>/ {{ userInfo.borrowCount ? userInfo.borrowCount : 0 }}</n-text>
							</template>
						</n-statistic>
					</n-space>
				</div>
			</n-card>

			<!-- <t-list-item>
				<t-list-item-meta :image="userInfo.avatar ? userInfo.avatar : 'https://tdesign.gtimg.com/site/avatar.jpg'">
					<template #title>
						{{ userInfo ? userInfo.nickname + '同学您好，' + titleTip : '暂无昵称' }}
					</template>
					<template #description>
						<n-grid :x-gap="50" :y-gap="8" :cols="8">
							<n-gi>
								<t-tooltip content="所属学院" theme="light">
									<icon-uil:university class="text-24px mb0.9 mr2" />
								</t-tooltip>
								<t-tag theme="primary">
									{{ userInfo && userInfo.dept.name ? userInfo.dept.name : '暂无学院信息' }}
								</t-tag>
							</n-gi>
							<n-gi span="3">
								<t-tooltip content="所属班级" theme="light">
									<icon-healthicons:i-training-class-outline class="text-28px mr2" />
								</t-tooltip>
								<t-tag theme="primary">
									{{ userInfo && userInfo.sclass.name ? userInfo.sclass.name : '暂无班级信息' }}
								</t-tag>
								<t-tooltip content="剩余借阅额度/借阅额度" theme="light">
									<icon-fluent:person-available-20-regular class="text-28px mr2 ml16" />
								</t-tooltip>
								<t-tag theme="primary">
									{{
										userInfo && userInfo.borrowCount
											? userInfo.borrowCount - userInfo.borrowedCount
											: '暂无消费额度信息'
									}}/{{ userInfo && userInfo.borrowCount ? userInfo.borrowCount : '暂无借阅额度信息' }}
								</t-tag>
							</n-gi>
							<n-gi>
								<t-tooltip content="待取图书" theme="light">
									<icon-guidance:waiting-room class="text-26px mr2 ml3" />
								</t-tooltip>
								<t-tag theme="primary">
									待取：{{ userInfo && userInfo.waitTakeCount !== null ? userInfo.waitTakeCount : 'null' }}
								</t-tag>
							</n-gi>

							<n-gi>
								<t-tooltip content="即将逾期图书总数" theme="light">
									<icon-flat-color-icons:overtime class="text-26px mr2" />
								</t-tooltip>
								<t-tag theme="primary">
									即将逾期：{{ userInfo && userInfo.soonOverdueCount !== null ? userInfo.soonOverdueCount : 'null' }}
								</t-tag>
							</n-gi>

							<n-gi>
								<t-tooltip content="逾期图书总数" theme="light">
									<icon-ri:pass-expired-line class="text-26px mr2" />
								</t-tooltip>
								<t-tag theme="warning">
									逾期中：{{ userInfo && userInfo.overdueCount !== null ? userInfo.overdueCount : 'null' }}
								</t-tag>
							</n-gi>
							<n-gi>
								<t-tooltip content="已归还图书总数" theme="light">
									<icon-material-symbols:assignment-returned-outline class="text-26px mr2" />
								</t-tooltip>
								<t-tag theme="primary">
									已归还：{{ userInfo && userInfo.overReturnCount !== null ? userInfo.overReturnCount : 'null' }}
								</t-tag>
							</n-gi>
						</n-grid>
					</template>
				</t-list-item-meta>
			</t-list-item> -->
		</n-card>

		<n-card title="我的借阅" :bordered="false" size="small" class="rounded-8px shadow-sm" hoverable>
			<n-tabs type="line" default-value="all" @update:value="handleUpdateValue">
				<n-tab-pane name="all" tab="全部记录"/>
				<n-tab-pane name="approve" tab="待取记录"/>
				<n-tab-pane name="borrowing" tab="借阅中"/>
				<n-tab-pane name="renewal" tab="审批驳回"/>
				<n-tab-pane name="due" tab="即将逾期"/>
				<n-tab-pane name="planning" tab="预定记录"/>
				<n-tab-pane name="overdue" tab="逾期记录"/>
				<n-tab-pane name="return" tab="归还记录"/>
			</n-tabs>
			<n-spin :show="dataLoading">
				<transition name="fade-slide" mode="out-in" :appear="true">
					<n-flex>
						<d-card v-for="borrow in borrowedList" :key="borrow.id" v-ripple="{ duration: 500 }" style="width: 380px">
							<template #avatar>
								<d-avatar name="DevUI"/>
							</template>
							<template #title>
								<n-text>{{ borrow.book.title }}</n-text>
							</template>
							<template #subtitle>
								<n-flex>
									<n-text>{{ borrow.book.author }}</n-text>
									<d-tag v-if="borrow.status === 0 || borrow.status === 2" size="18">
										<icon-svg-spinners:180-ring-with-bg class="text-16px mb1 mr1" color="#0052d9"/>
										<n-text type="success" style="color: #0052d9">审批中</n-text>
									</d-tag>
									<d-tag v-if="borrow.status === 1" size="18">
										<icon-svg-spinners:pulse-multiple class="text-18px mb1 mr1" color="#007d65"/>
										<n-text type="success" style="color: #007d65">待取书</n-text>
									</d-tag>
									<d-tag v-if="borrow.status === 3" size="18">
										<icon-svg-spinners:bouncing-ball class="text-18px mb1 mr1" color="#0052d9"/>
										<n-text type="success" style="color: #0052d9">借阅中</n-text>
									</d-tag>
									<d-tag v-if="borrow.status === 4" size="18">
										<icon-svg-spinners:bouncing-ball class="text-18px mb1 mr1" color="#e37318"/>
										<n-text type="success" style="color: #e37318">即将到期</n-text>
									</d-tag>
									<d-tag v-if="borrow.status === 5" size="18">
										<icon-icon-park-twotone:success class="text-16px mb1 mr1" color="#18a058"/>
										<n-text type="success">已归还</n-text>
									</d-tag>
									<d-tag v-if="borrow.status === -1" size="18">
										<icon-streamline:interface-validation-check-circle-checkmark-addition-circle-success-check-validation-add-form
											class="text-14px mb1 mr1"
											color="#d03050"
										/>
										<n-text type="success" style="color: #d03050">审批驳回</n-text>
									</d-tag>
									<d-tag v-if="borrow.status === -2" size="18">
										<icon-svg-spinners:pulse-3 class="text-14px mb1 mr1" color="#d03050"/>
										<n-text type="success" style="color: #d03050">逾期中</n-text>
									</d-tag>
									<d-tag v-if="borrow.status === -3" size="18">
										<icon-mdi:archive-success-outline class="text-16px mb1 mr1" color="#18a058"/>
										<n-text type="success" style="color: #18a058">逾期归还</n-text>
									</d-tag>
									<d-tag v-if="borrow.status === 6" size="18">
										<icon-svg-spinners:180-ring-with-bg class="text-16px mb1 mr1" color="#18a058"/>
										<n-text type="success" style="color: #18a058">预定中</n-text>
									</d-tag>
								</n-flex>
							</template>
							<template #content>
								<n-flex vertical>
									<n-flex>
										<n-tag round :bordered="false">
											<n-text>{{ borrow.barCode }}</n-text>
											<template #avatar>
												<icon-ion:barcode-outline class="text-20px m1"/>
											</template>
										</n-tag>
										<n-tag round :bordered="false">
											<n-text>{{ borrow.bookStack.stackName }}</n-text>
											<template #avatar>
												<icon-fa6-solid:warehouse class="text-16px m1"/>
											</template>
										</n-tag>
									</n-flex>
									<n-tag round :bordered="false" class="text-14px">
										<n-text>{{ borrow.serialNumber }}</n-text>
										<template #avatar>
											<icon-carbon:order-details class="text-20px m1"/>
										</template>
									</n-tag>
									<n-tag round :bordered="false" class="text-14px">
										<n-text>{{ formatDate(borrow.borrowTime) }} - {{ formatDate(borrow.expectReturnTime) }}</n-text>
										<template #avatar>
											<icon-formkit:datetime class="text-20px m1"/>
										</template>
									</n-tag>
								</n-flex>
							</template>
							<template #actions>
								<n-flex>
									<n-button size="small" @click="handleToBorrowDetail(borrow.serialNumber)">查看详情</n-button>
									<n-button
										v-if="borrow.status === 1"
										size="small"
										type="success"
										@click="handleTakeBook(borrow.id, borrow.serialNumber, borrow.book.title)"
									>
										我已取得
									</n-button>
									<n-button
										v-if="borrow.status === 4 || borrow.status === 3"
										size="small"
										type="warning"
										@click="handleRenewalBook(borrow.id, borrow.serialNumber, borrow.book.title)"
									>
										申请续期
									</n-button>
									<n-button
										v-if="borrow.status === -2 || borrow.status === 4 || borrow.status === 3"
										type="info"
										size="small"
										@click="handleReturnBook(borrow.id, borrow.serialNumber, borrow.book.title)"
									>
										归还图书
									</n-button>
								</n-flex>
							</template>
						</d-card>
					</n-flex>
				</transition>

				<n-empty
					v-if="!(borrowedList && borrowedList.length > 0 && !dataLoading)"
					description="什么也没有找到"
				></n-empty>
			</n-spin>
			<n-pagination
				:page="queryParams.pageNo"
				:page-size="queryParams.pageSize"
				:page-count="pageCount"
				:on-update:page="handlePageUpdate"
				class="mt3"
			>
				<template #prefix>共 {{ itemCount }} 项</template>
			</n-pagination>
		</n-card>
		<n-modal v-model:show="formShow" transform-origin="center">
			<n-card style="width: 600px" title="续借图书" :bordered="false" size="huge" role="dialog" aria-modal="true">
				<n-form ref="formRef" :rules="rules" :model="renewalFormData" label-placement="left" label-width="93px">
					<n-form-item label="图书名称" required>
						<n-input v-model:value="renewalFormData.title" disabled style="width: 80%"></n-input>
					</n-form-item>
					<n-form-item label="借阅单号" required>
						<n-input v-model:value="renewalFormData.serialNumber" disabled style="width: 80%"></n-input>
					</n-form-item>
					<n-form-item label="新归还时间" path="newReturnTime" required>
						<n-date-picker
							v-model:value="renewalFormData.newReturnTime"
							type="datetime"
							placeholder="请选择归还时间"
							:is-date-disabled="isDateDisabled"
							:shortcuts="shortcuts"
							placement="bottom-end"
							style="width: 80%"
						>
							<template #footer>同学合理安排借阅时间哦🧡</template>
						</n-date-picker>
					</n-form-item>
					<n-form-item label="续借原因" path="remark" required>
						<n-input
							v-model:value="renewalFormData.remark"
							type="textarea"
							placeholder="请输入续借原因"
							:autosize="{
                minRows: 3,
                maxRows: 5
              }"
							style="width: 80%"
						/>
					</n-form-item>
				</n-form>
				<template #footer>
					<n-space style="float: right">
						<n-button type="primary" @click="submitFrom">确 定</n-button>
						<n-button @click="close">取 消</n-button>
					</n-space>
				</template>
			</n-card>
		</n-modal>
	</n-space>
</template>

<script setup lang="tsx">
/* eslint-disable */
import {ref, reactive, onMounted} from 'vue'; // 导入 Vue Composition API 中的函数
import type {FormRules} from 'naive-ui'; // 导入 Naive UI 中的一些类型
import {routeName} from '@/router';
import {useRouterPush} from '@/composables'; // 导入图书 SKU 相关的 API 调用
import * as ReaderApi from '@/service/api/reader'; // 导入读者相关的 API 调用
import * as UserProfilesApi from '@/service/api/userProfile'; // 导入用户相关的 API 调用
import {formatDate} from '@/utils/common/formatTime';

const {routerPush} = useRouterPush();
const queryParams = reactive({
	status: undefined as number | undefined,
	pageNo: 1,
	pageSize: 12
});
const pageCount = ref(0);
const itemCount = ref(0);
const dataLoading = ref(false);

const borrowedList = ref<any>([]);

const userInfo = ref<any>({
	id: undefined,
	username: '',
	nickname: '',
	avatar: '',
	dept: {
		id: undefined,
		name: ''
	},
	sclass: {
		id: undefined,
		name: ''
	},
	borrowedCount: 0,
	countOverRead: 0,
	countWaitTake: 0,
	countSoonOverdue: 0,
	countOverReturn: 0,
	borrowCount: 0,
	roles: [],
	posts: [],
	socialUser: [],
	email: '',
	mobile: '',
	sex: undefined,
	status: undefined,
	remark: '',
	loginIp: '',
	loginDate: '',
	createTime: ''
});

const titleTip = ref('');

const encourageRead = [
	'少年应有鸿鹄志，当骑骏马踏平川',
	'鲜衣怒马少年时，不负韶华行且知',
	'时人不识凌云木，直待凌云始道高',
	'纸上得来终觉浅，绝知此事要躬行',
	'少年易老学难成，一寸光阴不可轻',
	'古人学问无遗力，少壮工夫老始成',
	'粗缯大步裹天涯，腹有诗书气自华',
	'蹉跎莫遣韶光老，人生唯有读书好',
	'力学如力耕，勤惰尔自如'
];

const loveRead = [
	'读书的目的，不在于取得多大成就，而在于，当你被生活打回原形，陷入泥潭时，给你一种内在的力量。',
	'少年读书如隙中窥月，中年读书如庭中望月，老年读书如台上玩月，皆以阅历之浅深为所得之浅深耳。',
	'我始终相信我读过的所有书都不会白读，它总会在未来日子的某一个场合帮助我表现得更出色，读书是可以给人以力量的，它能给人快乐',
	'读书多了，容颜自然改变。许多时候自己可能以为许多看过的书籍都成过眼烟云，不复记忆，其实他们仍是潜在的。在气质里，在谈吐上，在胸襟的无涯。当然也能显露在生活和文字中。',
	'书读得越多而不假思索，你就会觉得你知道得很多；而当你读书而思考得越多的时候，你就会清楚地看到，你知道得还很少。',
	'读书不是为了拿文凭或者发财，而是成为一个有温度懂情绪会思考的人。',
	'年轻的时候以为不读书不足以了解人生，直到后来才发现，如果不了解人生，是读不懂书的。读书的意义大概就是用生活所感去读书，用读书所得去生活。',
	'读书不是为了雄辩和驳斥，也不是为了轻信和盲从，而是为了思考和权衡',
	'关关难过关关过，前途灿灿亦满满。'
];

const getUserInfo = async () => {
	const {data} = await UserProfilesApi.getUserProfile();
	// @ts-ignore
	userInfo.value = data;
	if (data !== null && data.nickname !== null) {
		if (data.overReadCount >= 1) {
			titleTip.value = `您已经阅读了 ${data.overReadCount} 本书，不错的成绩！`;
		}
		if (data.overReadCount === 0) {
			// 随机从encourageRead获取一个
			titleTip.value = `${encourageRead[Math.floor(Math.random() * encourageRead.length)]}。快开始借阅第一本书把！`;
		}
	}

	// 随机从loveRead获取一个
	window.$message?.info(loveRead[Math.floor(Math.random() * loveRead.length)], {
		showIcon: false,
		closable: true,
		duration: 8000
	});
};

const formShow = ref(false);
const formRef = ref();
const renewalFormData = ref({
	id: 0,
	serialNumber: '',
	title: '',
	newReturnTime: null,
	remark: ''
});

const isDateDisabled = (ts: number) => {
	const selectedDate = new Date(ts);
	const currentDate = new Date();
	currentDate.setHours(0, 0, 0, 0); // 重置时间部分为0，只比较日期

	const maxSelectableDate = new Date();
	maxSelectableDate.setDate(currentDate.getDate() + 30); // 设置最大可选择日期为今天加上30天

	return selectedDate < currentDate || selectedDate > maxSelectableDate;
};

const shortcuts = {
	'7天': () => new Date().getTime() + 24 * 60 * 60 * 1000 * 7,
	'15天': () => new Date().getTime() + 24 * 60 * 60 * 1000 * 15,
	'30天': () => new Date().getTime() + 24 * 60 * 60 * 1000 * 30
};

const getUserBorrowInfo = async () => {
	dataLoading.value = true;
	const {data} = await ReaderApi.getReaderBorrowPage(queryParams);
	borrowedList.value = data.list;
	itemCount.value = data.total;
	pageCount.value = Math.ceil(itemCount.value / queryParams.pageSize);
	dataLoading.value = false;
}

const getUserOverdueBorrowInfo = async () => {
	restQueryParams();
	dataLoading.value = true;
	const {data} = await ReaderApi.getReaderOverDueBorrowPage(queryParams);
	borrowedList.value = data.list;
	itemCount.value = data.total;
	pageCount.value = Math.ceil(itemCount.value / queryParams.pageSize);
	dataLoading.value = false;
}

const getUserReturnedBorrowInfo = async () => {
	restQueryParams();
	dataLoading.value = true;
	const {data} = await ReaderApi.getReaderReturnedBorrowPage(queryParams);
	borrowedList.value = data.list;
	itemCount.value = data.total;
	pageCount.value = Math.ceil(itemCount.value / queryParams.pageSize);
	dataLoading.value = false;
}

const getUserBorrowInfoByTabs = async (status: number) => {
	restQueryParams();
	queryParams.status = status;
	await getUserBorrowInfo();
}

const handlePageUpdate = (page: number) => {
	queryParams.pageNo = page;
	getUserBorrowInfo();
};

const handleReturnBook = async (id: number, serialNumber: string, title: string) => {
	const data = {
		id,
		serialNumber
	} as unknown as ReaderApi.borrowReturnReqVO;
	window.$dialog?.info({
		title: '图书归还',
		content: `您确定要归还的图书是：《${title}》吗？`,
		positiveText: '确定',
		negativeText: '取消',
		onPositiveClick: async () => {
			const res = await ReaderApi.returnReaderBorrowBook(data);
			if (res.data === true) {
				window.$message?.success(`图书${title}归还成功！`);
			}
			await getUserBorrowInfo();
		}
	});
};

const handleTakeBook = async (id: number, serialNumber: string, title: string) => {
	const param = {
		id,
		serialNumber
	} as unknown as ReaderApi.borrowReturnReqVO;
	window.$dialog?.info({
		title: '图书领取',
		content: `您确定已经领取了图书：《${title}》吗？`,
		positiveText: '确定',
		negativeText: '取消',
		onPositiveClick: async () => {
			const {data} = await ReaderApi.verifyTakeBook(param);
			if (data === true) {
				window.$message?.success(`图书${title}取书成功！`);
			}
			await getUserBorrowInfo();
		}
	});
};

const handleRenewalBook = async (id: number, serialNumber: string, title: string) => {
	renewalFormData.value.id = id;
	renewalFormData.value.serialNumber = serialNumber;
	renewalFormData.value.title = title;
	formShow.value = true;
};

const handleUpdateValue = async (tabName: string) => {
	switch (tabName) {
		case 'all':
			restQueryParams();
			getUserBorrowInfo();
			break;
		case 'approve':
			await getUserBorrowInfoByTabs(1);
			break;
		case 'borrowing':
			await getUserBorrowInfoByTabs(3);
			break;
		case 'renewal':
			await getUserBorrowInfoByTabs(-1);
			break;
		case 'due':
			await getUserBorrowInfoByTabs(4);
			break;
		case 'planning':
			await getUserBorrowInfoByTabs(6);
			break;
		case 'overdue':
			await getUserOverdueBorrowInfo();
			break;
		case 'return':
			await getUserReturnedBorrowInfo();
			break;
	}
}

const restQueryParams = () => {
	queryParams.status = undefined;
	queryParams.pageNo = 1;
	queryParams.pageSize = 12;
}
const rules: FormRules = {
	newReturnTime: [{type: 'number', required: true, trigger: ['blur', 'change'], message: '请选择归还时间'}]
};

const close = () => {
	formShow.value = false;
	renewalFormData.value.newReturnTime = null;
	renewalFormData.value.remark = '';
};

async function submitFrom() {
	if (!formRef.value) return;
	await formRef.value.validate;

	try {
		const param = renewalFormData.value as unknown as ReaderApi.renewalBookReqVO;
		const {data} = await ReaderApi.renewalBook(param);
		if (data === true) {
			window.$message?.success(`图书${renewalFormData.value.title}续借成功，请同学合理安排阅读时间~`);
		}
	} finally {
		getUserBorrowInfo();
		close();
	}
}

const handleToBorrowDetail = (serialNumber: string) => {
	routerPush({name: routeName('reader_borrow-detail'), query: {serialNumber}});
};

onMounted(async () => {
	// 获取用户信息
	await getUserInfo();
	// 获取用户借阅信息
	await getUserBorrowInfo();
});
</script>
<style scoped>
.tag {
	color: aliceblue;
	margin: 0;
	font-size: 12px;
	height: 24px;
	display: inline-flex;
	box-sizing: border-box;
	flex-direction: row;
	align-items: center;
	border: 3px solid transparent;
	white-space: nowrap;
	font-family: 'Ping Fang SC', 'Microsoft YaHei', 'Helvetica', 'Arial', sans-serif;
}

.tag-primary {
	background-color: #0052d9;
}
</style>
