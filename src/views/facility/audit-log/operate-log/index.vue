<template>
  <n-space :vertical="true" :size="16">
    <n-card>
      <n-form inline label-width="68px" label-placement="left" :model="queryParams">
        <n-form-item label="系统模块">
          <n-input
            v-model:value="queryParams.module"
            placeholder="请输入系统模块"
            class="w-200px"
            @keyup.enter="handleQuery"
          />
        </n-form-item>
        <n-form-item label="操作人员">
          <n-input
            v-model:value="queryParams.userNickname"
            placeholder="请输入操作人员"
            class="w-200px"
            @keyup.enter="handleQuery"
          />
        </n-form-item>
        <n-form-item label="操作类型">
          <n-select
            v-model:value="queryParams.type"
            placeholder="请选择操作类型"
            clearable
            class="w-200px"
            :options="typeOptions"
            @update:value="handleQuery"
          />
        </n-form-item>
        <n-form-item label="操作状态">
          <n-select
            v-model:value="queryParams.success"
            placeholder="请选择操作状态"
            clearable
            class="w-200px"
            :options="successOptions"
            @update:value="handleQuery"
          />
        </n-form-item>
        <n-form-item label="操作时间">
          <n-date-picker
            v-model:value="queryParams.startTime"
            type="daterange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            clearable
            close-on-select
            :default-time="['00:00:00', '23:59:59']"
            class="!w-340px"
          />
        </n-form-item>
      </n-form>
      <n-space>
        <n-button @click="handleQuery">
          <template #icon>
            <icon-uil-search class="text-20px" />
          </template>
          搜索
        </n-button>
        <n-button @click="resetQuery">
          <template #icon>
            <icon-iconamoon:restart-bold class="text-20px" />
          </template>
          重置
        </n-button>
        <n-button secondary type="success" @click="handleExport">
          <template #icon>
            <icon-uil:import class="text-20px" />
          </template>
          导出
        </n-button>
      </n-space>
    </n-card>
    <n-card>
      <n-data-table remote size="small" :loading="loading" :columns="columns" :data="list" :pagination="pagination" />
    </n-card>
    <n-modal v-model:show="formShow" transform-origin="center">
      <n-card
        style="width: 929px"
        closable
        title="详情"
        :bordered="false"
        size="small"
        role="dialog"
        aria-modal="true"
        @close="formShow = false"
      >
        <n-descriptions bordered label-placement="left" size="small" label-style="width: 120px" :column="1">
          <n-descriptions-item label="日志编号">{{ rowInfo.id }}</n-descriptions-item>
          <n-descriptions-item label="链路追踪">{{ rowInfo.traceId }}</n-descriptions-item>
          <n-descriptions-item label="操作人编号">{{ rowInfo.userId }}</n-descriptions-item>
          <n-descriptions-item label="操作人名字">{{ rowInfo.userNickname }}</n-descriptions-item>
          <n-descriptions-item label="操作人IP">{{ rowInfo.userIp }}</n-descriptions-item>
          <n-descriptions-item label="操作人UA">{{ rowInfo.userAgent }}</n-descriptions-item>
          <n-descriptions-item label="操作模块">{{ rowInfo.module }}</n-descriptions-item>
          <n-descriptions-item label="操作名">{{ rowInfo.name }}</n-descriptions-item>
          <n-descriptions-item label="操作类型">
            <n-tag v-if="rowInfo.type === 1" type="primary">查询</n-tag>
            <n-tag v-if="rowInfo.type === 2" type="success">新增</n-tag>
            <n-tag v-if="rowInfo.type === 3" type="warning">修改</n-tag>
            <n-tag v-if="rowInfo.type === 4" type="error">删除</n-tag>
            <n-tag v-if="rowInfo.type === 5" type="primary">导出</n-tag>
            <n-tag v-if="rowInfo.type === 6" type="primary">导入</n-tag>
            <n-tag v-if="rowInfo.type === 0">其他</n-tag>
          </n-descriptions-item>
          <n-descriptions-item v-if="rowInfo.content" label="操作明细">{{ rowInfo.content }}</n-descriptions-item>
          <n-descriptions-item v-if="rowInfo.exts" label="操作拓展参数">{{ rowInfo.exts }}</n-descriptions-item>
          <n-descriptions-item label="请求URL">
            {{ rowInfo.requestMethod }} {{ rowInfo.requestUrl }}
          </n-descriptions-item>
          <n-descriptions-item label="Java方法名">{{ rowInfo.javaMethod }}</n-descriptions-item>
          <n-descriptions-item label="Java方法参数">{{ rowInfo.javaMethodArgs }}</n-descriptions-item>
          <n-descriptions-item label="操作时间">{{ formatDate(rowInfo.startTime) }}</n-descriptions-item>
          <n-descriptions-item label="执行时长">{{ rowInfo.duration }} ms</n-descriptions-item>
          <n-descriptions-item label="操作结果">
            <n-tag v-if="rowInfo.resultCode === 200" type="success">成功</n-tag>
            <n-tag v-else type="error">失败</n-tag>
          </n-descriptions-item>
          <n-descriptions-item v-if="rowInfo.resultCode === 200" label="结果数据">
            {{ rowInfo.resultData }}
          </n-descriptions-item>
          <n-descriptions-item v-if="rowInfo.resultCode !== 200" label="失败提示">
            {{ rowInfo.resultData }}
          </n-descriptions-item>
        </n-descriptions>
      </n-card>
    </n-modal>
  </n-space>
</template>

<script setup lang="tsx">
/* eslint-disable */
import { reactive, ref, onMounted } from 'vue';
import { NSpace, NButton, NTag } from 'naive-ui';
import type { DataTableColumns } from 'naive-ui';
import * as OperateLogApi from '@/service/api/operateLog';
import { formatDate } from '@/utils/common/formatTime';
import download from '@/utils/common/download';


/**
 * 搜索表单变量
 */
const queryParams = reactive({
	pageNo: 1,
	pageSize: 10,
	module: '',
	userNickname: '',
	type: null,
	success: null,
	startTime: null
});

/**
 * 操作类型选项
 */
const typeOptions = [
	{
		label: '查询',
		value: 1
	},
	{
		label: '新增',
		value: 2
	},
	{
		label: '修改',
		value: 3
	},
	{
		label: '删除',
		value: 4
	},
	{
		label: '导出',
		value: 5
	},
	{
		label: '导入',
		value: 6
	},
	{
		label: '其他',
		value: 0
	}
];

/**
 * 操作状态选项
 */
const successOptions = [
	{
		label: "成功",
		value: "true"
	},
	{
		label: "失败",
		value: "false"
	}
];


/**
 * 数据项信息类型定义
 */
type RowData = {
	id: number;
	module: string;
	name: string;
	type: number;
	userNickname: string;
	resultCode: number;
	startTime: number;
	duration: number;
};
/**
 * 数据项具体信息
 */
const columns: DataTableColumns<RowData> = [
	{ key: 'id', title: '日志编号', align: "center", width: 80 },
	{ key: 'module', title: '操作模块', align: "center", width: 240 },
	{ key: 'name', title: '操作名', align: "center", width: 180 },

	{
		key: 'type', title: '操作类型', align: "center",
		render: (row: any) => {
			if (row.type === 1) {
				return <NTag type="primary">查询</NTag>
			}
			if (row.type === 2) {
				return <NTag type="success">新增</NTag>
			}
			if (row.type === 3) {
				return <NTag type="warning">修改</NTag>
			}
			if (row.type === 4) {
				return <NTag type="error">删除</NTag>
			}
			if (row.type === 5) {
				return <NTag type='primary'>导出</NTag>
			}
			if (row.type === 6) {
				return <NTag type='primary'>导入</NTag>
			}
			if (row.type === 0) {
				return <NTag>其他</NTag>
			}
		}
	},
	{ key: "userNickname", title: "操作人", align: "center" },
	{
		key: 'resultCode', title: '操作结果', align: 'center', width: 80,
		render: (row: any) => {
			if (row.resultCode === 200) {
				return <NTag type="success">成功</NTag>
			}
			return <NTag type="error">失败</NTag>
		}
	},
	{
		key: 'startTime',
		title: '操作时间',
		align: "center",
		render: (row: any) => {
			return formatDate(row.startTime);
		}
	},
	{ key: 'duration', title: '执行时长', align: "center", width: 80 ,render:(row:any)=>row.duration+' ms'},
	{
		title: '操作',
		key: 'operate',
		align: 'center',
		render: (row: any) => {
			return (
				<NButton color="#007AFF" text size={'small'}
					onClick={() => {
						openForm(row);
					}}>
					详情
				</NButton>
			);
		}
	}
];


const list = ref([]); //列表的数据
const loading = ref(true); //列表的加载中
const pageCount = ref(0);
/**
 * 获取列表数据
 */
const getList = async () => {
	loading.value = true;
	try {
		const { data } = await OperateLogApi.getLoginLogPage(queryParams);
		list.value = data.list;
		pagination.page = queryParams.pageNo;
		pagination.pageSize = queryParams.pageSize;
		pagination.itemCount = data.total;
		pageCount.value = Math.ceil(pagination.itemCount / pagination.pageSize);

	} catch (error) {
		console.log(error);
	} finally {
		loading.value = false;
	}
}

/**
 * 分页功能
 */
const pagination = reactive({
	page: queryParams.pageNo,
	pageCount: pageCount.value,
	pageSize: queryParams.pageSize,
	itemCount: 0,
	pageSizes: [10, 20, 30, 50],
	showSizePicker: true,
	showQuickJumper: true,
	// @ts-ignore
	prefix({ itemCount }) {
		return `共有 ${itemCount} 条记录`;
	},
	onChange: (page: number) => {
		queryParams.pageNo = page;
		getList();
	},
	onUpdatePageSize: (pageSize: number) => {
		queryParams.pageSize = pageSize;
		queryParams.pageNo = 1;
		getList();
	}
});



/**
 * 搜索按钮操作
 */
const handleQuery = async () => {
	if (queryParams.startTime) {
		// @ts-ignore ts推断不出来
		queryParams.startTime = queryParams.startTime.map(item => formatDate(item));
	}
	queryParams.pageNo = 1;
	getList();
}


/**
 * 重置按钮操作
 */
const resetQuery = () => {
	queryParams.pageNo = 1;
	queryParams.module = '';
	queryParams.userNickname = '';
	queryParams.type = null;
	queryParams.success = null;
	queryParams.startTime = null;
	getList();
};



const exportLoading = ref(false); // 导出的加载中
/** 导出按钮操作 */
const handleExport = async () => {
	try {
		window.$dialog?.info({
			title: '系统提示',
			content: '是否确认导出数据项',
			positiveText: '确定',
			negativeText: '取消',
			onPositiveClick: async () => {
				exportLoading.value = true;
				// @ts-ignore
				const data = await OperateLogApi.exportLoginLog(queryParams);
				// @ts-ignore
				download.excel(data, '操作日志.xls');
			}
		});
	} finally {
		exportLoading.value = false;
	}
};


/**
 * 详情页面
 */
const formShow = ref(false); // 表单的显示状态
const rowInfo: any = ref()
async function openForm(row?: any) {
	formShow.value = true; // 打开表单弹窗
	rowInfo.value = row;
}


onMounted(async () => {
	await getList();
});

</script>
