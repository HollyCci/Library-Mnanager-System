<template>
  <n-space :vertical="true" :size="16">
    <n-card :bordered="false" size="small" class="rounded-8px shadow-sm" hoverable>
      <n-form inline label-width="68px" label-placement="left" :model="queryParams">
        <n-grid :x-gap="12" :y-gap="8" :cols="4" :collapsed-rows="1">
          <n-form-item-gi label="用户编号">
            <n-input
              v-model:value="queryParams.userId"
              placeholder="请输入用户编号"
              class="w-200px"
              @keyup.enter="handleQuery"
            />
          </n-form-item-gi>
          <n-form-item-gi label="用户类型">
            <n-select
              v-model:value="queryParams.userType"
              placeholder="请选择用户类型"
              class="w-200px"
              clearable
              :options="userTypeOptions"
              @update:value="handleQuery"
            />
          </n-form-item-gi>
          <n-form-item-gi label="应用名">
            <n-input
              v-model:value="queryParams.applicationName"
              placeholder="请输入应用名"
              class="w-200px"
              @keyup.enter="handleQuery"
            />
          </n-form-item-gi>
          <n-form-item-gi label="异常时间">
            <n-date-picker
              v-model:value="queryParams.exceptionTime"
              type="daterange"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              clearable
              close-on-select
              :default-time="['00:00:00', '23:59:59']"
              class="!w-340px"
            />
          </n-form-item-gi>
          <n-form-item-gi label="处理状态">
            <n-select
              v-model:value="queryParams.processStatus"
              placeholder="请选择处理状态"
              class="w-200px"
              clearable
              :options="statusOptions"
              @update:value="handleQuery"
            />
          </n-form-item-gi>
          <n-form-item-gi>
            <n-button class="m-r-10px" @click="handleQuery">
              <template #icon>
                <icon-uil-search class="text-20px" />
              </template>
              搜索
            </n-button>
            <n-button class="m-r-10px" @click="resetQuery">
              <template #icon>
                <icon-iconamoon:restart-bold class="text-20px" />
              </template>
              重置
            </n-button>
            <n-button class="m-r-10px" secondary type="success" @click="handleExport">
              <template #icon>
                <icon-uil:import class="text-20px" />
              </template>
              导出
            </n-button>
          </n-form-item-gi>
        </n-grid>
      </n-form>
    </n-card>
    <n-card :bordered="false" size="small" class="rounded-8px shadow-sm" hoverable>
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
          <n-descriptions-item label="应用名">{{ rowInfo.applicationName }}</n-descriptions-item>
          <n-descriptions-item label="用户信息">
            {{ rowInfo.userType }}
            <n-tag v-if="rowInfo.userType === 1" type="primary">会员</n-tag>
            <n-tag v-if="rowInfo.userType === 2" type="success">管理员</n-tag>
          </n-descriptions-item>
          <n-descriptions-item label="用户IP">{{ rowInfo.userIp }}</n-descriptions-item>
          <n-descriptions-item label="用户UA">{{ rowInfo.userAgent }}</n-descriptions-item>
          <n-descriptions-item label="请求信息">
            {{ rowInfo.requestMethod }} a{{ rowInfo.requestUrl }}
          </n-descriptions-item>
          <n-descriptions-item label="请求参数">{{ rowInfo.requestParams }}</n-descriptions-item>
          <n-descriptions-item label="异常时间">{{ rowInfo.exceptionTime }} ms</n-descriptions-item>
          <n-descriptions-item label="异常名">{{ rowInfo.exceptionName }}</n-descriptions-item>
          <n-descriptions-item label="异常消息">{{ rowInfo.exceptionMessage }}</n-descriptions-item>
          <n-descriptions-item label="异常类名">{{ rowInfo.exceptionClassName }}</n-descriptions-item>
          <n-descriptions-item label="异常方法名">{{ rowInfo.exceptionMethodName }}</n-descriptions-item>
          <n-descriptions-item label="异常方法具体行">{{ rowInfo.exceptionLineNumber }}</n-descriptions-item>
          <n-descriptions-item label="处理状态">
            <n-tag v-if="rowInfo.processStatus === 0">未处理</n-tag>
            <n-tag v-if="rowInfo.processStatus === 1">已处理</n-tag>
            <n-tag v-if="rowInfo.processStatus === 2">已忽略</n-tag>
          </n-descriptions-item>
          <n-descriptions-item label="处理时间">{{ rowInfo.processTime }} ms</n-descriptions-item>
          <n-descriptions-item label="处理用户编号">{{ rowInfo.processUserId }}</n-descriptions-item>
        </n-descriptions>
      </n-card>
    </n-modal>
  </n-space>
</template>

<script setup lang="tsx">
/* eslint-disable */
import { reactive, ref, onMounted } from 'vue';
import { NSpace, NButton, NTag, NPopconfirm } from 'naive-ui';
import type { DataTableColumns } from 'naive-ui';
import * as ErrorLogApi from '@/service/api/errorLog';
import { formatDate } from '@/utils/common/formatTime';
import download from '@/utils/common/download';


/**
 * 搜索表单变量
 */
const queryParams = reactive({
	pageNo: 1,
	pageSize: 10,
	userId: '',
	userType: null,
	applicationName: '',
	exceptionTime: null,
	processStatus: null
});



/**
 * 用户类型选项
 */
const userTypeOptions = [
	{
		label: "会员",
		value: 1
	},
	{
		label: "管理员",
		value: 2
	}
];


/**
* 用户类型选项
*/
const statusOptions = [
	{
		label: "未处理",
		value: 0
	},
	{
		label: "已处理",
		value: 1
	},
	{
		label: "已忽略",
		value: 2
	}
];

/**
 * 数据项信息类型定义
 */
type RowData = {
	id: number;
	userId: number;
	userType: number;
	applicationName: string;
	requestMethod: string;
	requestUrl: string;
	exceptionTime: number;
	processStatus: number;
};
/**
 * 数据项具体信息
 */
const columns: DataTableColumns<RowData> = [
	{ key: 'id', title: '日志编号', align: "center" },
	{ key: 'userId', title: '用户编号', align: "center" },
	{
		key: 'userType', title: '用户类型', align: "center",
		render: (row: any) => {
			if (row.userType === 1) {
				return <NTag type='primary'>会员</NTag>
			}
			if (row.userType === 2) {
				return <NTag type='success'>管理员</NTag>
			}
		}
	},
	{
		key: 'applicationName', title: '应用名', align: "center",
	},
	{ key: "requestMethod", title: "请求方法", align: "center" },
	{ key: 'requestUrl', title: '请求地址', align: 'center' },
	{
		key: 'exceptionTime',
		title: '异常发生时间',
		align: "center",
		render: (row: any) => {
			return formatDate(row.exceptionTime);
		}
	},
	{
		key: 'processStatus', title: '处理状态', align: 'center',
		render: (row: any) => {
			if (row.processStatus === 0) {
				return <NTag type='error'>未处理</NTag>
			}
			if (row.processStatus === 1) {
				return <NTag type='success'>已处理</NTag>
			}
			if (row.processStatus === 2) {
				return <NTag type='primary'>已忽略</NTag>
			}
		}
	},
	{
		title: '操作',
		key: 'operate',
		align: 'center',
		render: (row: any) => {
			return (
				<NSpace>
					<NButton color="#007AFF" text size={'small'}
						onClick={() => {
							openForm(row);
						}}>
						详细
					</NButton>
					<NPopconfirm
						onPositiveClick={() => {
							handleProcessStatus(row.id, 1);
						}}
					>
						{{
							default: () => `您确定要改为已处理吗？`,
							trigger: () => (
								<NButton size={'small'} text color="#007AFF">
									已处理
								</NButton>
							)
						}}
					</NPopconfirm>
					<NPopconfirm
						onPositiveClick={() => {
							handleProcessStatus(row.id, 2);
						}}
					>
						{{
							default: () => `您确定要改为已忽略吗？`,
							trigger: () => (
								<NButton size={'small'} text color="#007AFF">
									已忽略
								</NButton>
							)
						}}
					</NPopconfirm>
				</NSpace>
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
		const { data } = await ErrorLogApi.getApiErrorLogPage(queryParams);
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
	if (queryParams.exceptionTime) {
		// @ts-ignore ts推断不出来
		queryParams.exceptionTime = queryParams.exceptionTime.map(item => formatDate(item));
	}
	queryParams.pageNo = 1;
	getList();
}


/**
 * 重置按钮操作
 */
const resetQuery = () => {
	queryParams.pageNo = 1;
	queryParams.userId = '';
	queryParams.userType = null;
	queryParams.applicationName = '';
	queryParams.exceptionTime = null;
	queryParams.processStatus = null;
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
				const data = await ErrorLogApi.exportApiErrorLogExcel(queryParams);
				// @ts-ignore
				download.excel(data, '异常日志.xls');
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



/**
 * 更新异常日志数据
 * @param id 编号
 * @param processStatus 处理状态
 */
const handleProcessStatus = async (id: number, processStatus: number) => {
	const {data} = await ErrorLogApi.updateApiErrorLogProcess(id, processStatus);
	if(data != null)
			window.$message?.create("修改成功！");
	else window.$message?.create("修改失败！");
	getList();
};


onMounted(async () => {
	await getList();
});


</script>


