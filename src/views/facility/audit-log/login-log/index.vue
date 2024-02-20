<template>
  <n-space :vertical="true" :size="16">
    <n-card>
      <n-form inline label-placement="left" :model="queryParams">
        <n-form-item label="用户名称">
          <n-input
            v-model:value="queryParams.username"
            placeholder="请输入用户名称"
            class="w-240px"
            @keyup.enter="handleQuery"
          />
        </n-form-item>
        <n-form-item label="登录地址">
          <n-input
            v-model:value="queryParams.userIp"
            placeholder="请输入登录地址"
            class="w-240px"
            @keyup.enter="handleQuery"
          />
        </n-form-item>
        <n-form-item label="登录时间">
          <n-date-picker
            v-model:value="queryParams.createTime"
            type="daterange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            clearable
            close-on-select
            :default-time="['00:00:00', '23:59:59']"
            class="!w-340px"
          />
        </n-form-item>
        <n-form-item>
          <n-button @click="handleQuery">
            <template #icon>
              <icon-uil-search class="text-20px" />
            </template>
            搜索
          </n-button>
        </n-form-item>
        <n-form-item>
          <n-button @click="resetQuery">
            <template #icon>
              <icon-iconamoon:restart-bold class="text-20px" />
            </template>
            重置
          </n-button>
        </n-form-item>
        <n-form-item>
          <n-button secondary type="success" @click="handleExport">
            <template #icon>
              <icon-uil:import class="text-20px" />
            </template>
            导出
          </n-button>
        </n-form-item>
      </n-form>
    </n-card>
    <n-card :bordered="false" class="h-full rounded-8px shadow-sm" hoverable>
      <n-data-table remote :loading="loading" :columns="columns" :data="list" :pagination="pagination" />
    </n-card>
    <n-modal v-model:show="formShow" transform-origin="center">
      <n-card
        style="width: 600px"
        closable
        title="详情"
        :bordered="false"
        size="huge"
        role="dialog"
        aria-modal="true"
        @close="formShow = false"
      >
        <n-descriptions bordered label-placement="left" label-style="width: 120px" :column="1">
          <n-descriptions-item label="日志编号">{{ rowInfo.id }}</n-descriptions-item>
          <n-descriptions-item label="操作类型">
            <n-tag v-if="rowInfo.logType === 100" type="primary">账号登录</n-tag>
            <n-tag v-if="rowInfo.logType === 101" type="primary">社交登录</n-tag>
            <n-tag v-if="rowInfo.logType === 103" type="primary">手机登录</n-tag>
            <n-tag v-if="rowInfo.logType === 104" type="primary">短信登录</n-tag>
            <n-tag v-if="rowInfo.logType === 200">主动退出</n-tag>
            <n-tag v-if="rowInfo.logType === 202" type="warning">强制退出</n-tag>
          </n-descriptions-item>
          <n-descriptions-item label="用户名称">{{ rowInfo.username }}</n-descriptions-item>
          <n-descriptions-item label="登录地址">{{ rowInfo.userIp }}</n-descriptions-item>
          <n-descriptions-item label="浏览器">{{ rowInfo.userAgent }}</n-descriptions-item>
          <n-descriptions-item label="执行结果">
            <n-tag v-if="rowInfo.result === 0" type="success">成功</n-tag>
            <n-tag v-if="rowInfo.result === 1" type="error">失败</n-tag>
          </n-descriptions-item>
          <n-descriptions-item label="执行日期">{{ formatDate(rowInfo.createTime) }}</n-descriptions-item>
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
import * as LoginLogApi from '@/service/api/loginLog';
import { formatDate } from '@/utils/common/formatTime';
import download from '@/utils/common/download';


/**
 * 搜索表单变量
 */
const queryParams = reactive({
	pageNo: 1,
	pageSize: 10,
	username: '',
	userIp: '',
	status: null,
	createTime: null
});


/**
 * 数据项信息类型定义
 */
type RowData = {
	id: number;
	logType: number;
	username: string;
	userIp: string;
	userAgent: string;
	result: number;
	createTime: number;
};
/**
 * 数据项具体信息
 */
const columns: DataTableColumns<RowData> = [
	{ key: 'id', title: '日志编号', align: "center", width:80 },
	{
		key: 'logType', title: '操作类型', align: "center",
		render: (row: any) => {
			if (row.logType === 100) {
				return <NTag type="primary">账号登录</NTag>
			}
			if (row.logType === 101) {
				return <NTag type="primary">社交登录</NTag>
			}
			if (row.logType === 103) {
				return <NTag type="primary">手机登录</NTag>
			}
			if (row.logType === 104) {
				return <NTag type="primary">短信登录</NTag>
			}
			if (row.logType === 200) {
				return <NTag>主动退出</NTag>
			}
			if (row.logType === 202) {
				return <NTag type="warning">强制退出</NTag>
			}
		}
	},
	{ key: 'username', title: '用户名称', align: 'center', width:125 },
	{ key: 'userIp', title: '登录地址', align: 'center', width:125  },
	{ key: 'userAgent', title: '浏览器', align: 'center' },
	{
		key: 'result', title: '执行结果', align: 'center', width:80,
		render: (row: any) => {
			if (row.result === 0) {
				return <NTag type="success">成功</NTag>
			}
			if (row.result === 1) {
				return <NTag type="error">失败</NTag>
			}
		}
	},
	{
		key: 'createTime',
		title: '执行日期',
		align: "center",
		render: (row: any) => {
			return formatDate(row.createTime);
		}
	},
	{
		title: '操作',
		key: 'operate',
		align: 'center',
		render: (row: any) => {
			return (
				<NButton color="#ff69b4" text size={'small'}
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
		const { data } = await LoginLogApi.getLoginLogPage(queryParams);
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
	if (queryParams.createTime) {
		// @ts-ignore ts推断不出来
		queryParams.createTime = queryParams.createTime.map(item => formatDate(item));
	}
	queryParams.pageNo = 1;
	getList();
}


/**
 * 重置按钮操作
 */
const resetQuery = () => {
	queryParams.pageNo = 1;
	queryParams.username = '';
	queryParams.userIp = '';
	queryParams.status = null;
	queryParams.createTime = null;
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
				const data = await LoginLogApi.exportLoginLog(queryParams);
				// @ts-ignore
				download.excel(data, '登录日志.xls');
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
const rowInfo:any = ref()
async function openForm(row?: any) {
	formShow.value = true; // 打开表单弹窗
	rowInfo.value = row;
}

onMounted(async () => {
	await getList();
});

</script>







