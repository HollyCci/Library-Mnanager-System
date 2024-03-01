<template>
  <n-space :vertical="true" :size="16">
    <n-card :bordered="false" size="small" class="rounded-8px shadow-sm" hoverable>
      <n-form inline label-placement="left" :model="queryParams">
        <n-form-item label="图书名称">
          <n-input
            v-model:value="queryParams.title"
            placeholder="请输入图书名称"
            clearable
            class="w-240px"
            @keyup.enter="handleQuery"
          />
        </n-form-item>
        <n-form-item label="用户名称">
          <n-input
            v-model:value="queryParams.username"
            placeholder="请输入用户名称"
            clearable
            class="w-240px"
            @keyup.enter="handleQuery"
          />
        </n-form-item>
        <n-form-item label="借阅单号">
          <n-input
            v-model:value="queryParams.serialNumber"
            placeholder="请输入借阅单号"
            class="w-240px"
            clearable
            @keyup.enter="handleQuery"
          />
        </n-form-item>
        <n-form-item label="借阅状态">
          <n-select
            v-model:value="queryParams.status"
            placeholder="请选择借阅状态"
            class="w-240px"
            clearable
            :options="statusOptions"
            @update:value="handleQuery"
          />
        </n-form-item>
        <n-form-item label="借阅时间">
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
        <n-button @click="autoApproveBorrowBook">自动审批</n-button>
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
        <n-descriptions bordered label-placement="left" size="small" label-style="width: 180px" :column="1">
          <n-descriptions-item label="借阅编号">{{ rowInfo.id }}</n-descriptions-item>
          <n-descriptions-item label="借阅订单号">{{ rowInfo.serialNumber }}</n-descriptions-item>
          <n-descriptions-item label="借阅图书名/ID">{{ rowInfo.title }}/{{ rowInfo.bookId }}</n-descriptions-item>
          <n-descriptions-item label="借阅图书所属书库">{{ rowInfo.name }}</n-descriptions-item>
          <n-descriptions-item label="图书条形码">{{ rowInfo.barCode }}</n-descriptions-item>
          <n-descriptions-item label="借阅用户账号/昵称">
            {{ rowInfo.username }}/{{ rowInfo.nickname }}
          </n-descriptions-item>
          <n-descriptions-item label="借阅用户所属班级/部门">
            {{ rowInfo.className }}/{{ rowInfo.deptName }}
          </n-descriptions-item>
          <n-descriptions-item label="借阅天数">{{ rowInfo.days }}</n-descriptions-item>
          <n-descriptions-item label="借阅时间">{{ formatDate(rowInfo.borrowTime) }}</n-descriptions-item>
          <n-descriptions-item label="预计归还时间">{{ formatDate(rowInfo.expectReturnTime) }}</n-descriptions-item>
          <n-descriptions-item label="实际归还时间">
            <n-text v-if="rowInfo.actualReturnTime === null">-</n-text>
            {{ formatDate(rowInfo.actualReturnTime) }}
          </n-descriptions-item>
          <n-descriptions-item label="逾期天数">
            <n-text v-if="rowInfo.actualReturnTime === null">-</n-text>
            {{ rowInfo.overDays }}
          </n-descriptions-item>
          <n-descriptions-item label="审批ID">{{ rowInfo.approvalId }}</n-descriptions-item>
        </n-descriptions>
      </n-card>
    </n-modal>
    <n-modal v-model:show="approveShow" transform-origin="center">
      <n-card
        style="width: 600px"
        closable
        title="审批"
        :bordered="false"
        size="small"
        role="dialog"
        aria-modal="true"
        @close="approveShow = false"
      >
        <n-form :rules="rules" :model="remark" label-placement="left" label-width="150px">
          <n-form-item label="图书状态：">
            <t-tag v-if="rowInfo.bookStatus === 0" theme="primary">开启</t-tag>
            <t-tag v-if="rowInfo.bookStatus === 1" theme="danger">关闭</t-tag>
          </n-form-item>
          <n-form-item label="图书所属书库状态：">
            <t-tag v-if="rowInfo.stackStatus === 0" theme="primary">开启</t-tag>
            <t-tag v-if="rowInfo.stackStatus === 1" theme="danger">关闭</t-tag>
          </n-form-item>
          <n-form-item label="图书库存状态：">
            <t-tag v-if="rowInfo.inventoryStatus === 0" theme="primary">可外借</t-tag>
            <t-tag v-if="rowInfo.inventoryStatus === 1" theme="danger">库存不足</t-tag>
          </n-form-item>
          <n-form-item label="审批备注：" path="remark" required>
            <n-input
              ref="inputRef"
              v-model:value="remark.remark"
              clearable
              placeholder="请输入审批备注"
              type="textarea"
              :autosize="{
                minRows: 3,
                maxRows: 5
              }"
              style="width: 90%"
            />
          </n-form-item>
        </n-form>
        <n-space style="float: right">
          <n-button
            type="success"
            :disabled="rowInfo && rowInfo.inventoryStatus !== 0"
            @click="approve(rowInfo.serialNumber, 'approve')"
          >
            通过
          </n-button>
          <n-button type="error" @click="approve(rowInfo.serialNumber, 'refuse')">驳回</n-button>
        </n-space>
      </n-card>
    </n-modal>
  </n-space>
</template>

<script setup lang="tsx">
/* eslint-disable */
import { reactive, ref, onMounted } from 'vue';
import { NSpace, NButton, NPopselect, NText, InputInst } from 'naive-ui';
import type { DataTableColumns, FormRules } from 'naive-ui';
import { formatDate } from '@/utils/common/formatTime';
import * as BorrowApi from '@/service/api/borrow';

/**
 * 搜索表单变量
 */
 const queryParams = reactive({
	pageNo: 1,
	pageSize: 10,
	title:"",
	username: '',
	serialNumber: '',
	status: null,
	createTime: null
});

/**
 * 借阅状态选项
 */
const statusOptions = [
	{
		label: "提交审批",
		value: 0
	},
	{
		label: "审批通过",
		value: 1
	},
	{
		label: "审批驳回",
		value: -1
	},
	{
		label: "提交续期审批",
		value: 2
	},
	{
		label: "借阅中",
		value: 3
	},
	{
		label: "即将到期",
		value: 4
	},
	{
		label: "已归还",
		value: 5
	},
	{
		label: "逾期中",
		value: -2
	},
	{
		label: "逾期归还",
		value: -3
	},
	{
		label: "预定",
		value: 6
	}
]


/**
 * 数据项信息类型定义
 */
 type RowData = {
	id: number;
	serialNumber: string;
	title: string;
	status:number;
	name:string;
	barCode: string;
	username: string;
	borrowTime: number;
};
/**
 * 数据项具体信息
 */
const columns: DataTableColumns<RowData> = [
	{ key: 'id', title: '借阅编号', align: "center", width: 80 },
	{ key: 'serialNumber', title: '借阅订单号', align: "center", width: 260 },
	{ key: 'title', title: '借阅图书名', align: "center", width: 220 },
	{ key: 'status', title: '借阅状态', align: "center", width: 80,
		render: (row: any) => {
			if(row.status == 0) return <NButton type='primary' onClick={() => { approveBorrowBook(row); }}>提交审批</NButton>
			if(row.status == 1) return <NPopselect value={row.status} options={statusOptions} scrollable onUpdateValue={(value) => {
						update(row.id, value, 1)}}>
				<NButton  secondary type="success">审批通过</NButton></NPopselect>
			if(row.status == -1) return <t-tag theme='success' variant="light">审批驳回</t-tag>
			if(row.status == 2) return <NButton type="primary">提交续期审批</NButton>
			if(row.status == 3) return <t-tag theme='success' variant="light">借阅中</t-tag>
			if(row.status == 4) return <t-tag theme='success' variant="light">即将到期</t-tag>
			if(row.status == 5) return <t-tag theme='success' variant="light">已归还</t-tag>
			if(row.status == -2) return <t-tag theme='success' variant="light">逾期中</t-tag>
			if(row.status == -3) return <t-tag theme='success' variant="light">逾期归还</t-tag>
			if(row.status == 6) return <NButton secondary >预定</NButton>
		}
	},
	{ key: 'name', title: '借阅图书所属书库', align: "center", width: 140 },
	{ key: 'barCode', title: '借阅图书条形码', align: "center", width: 120 },
	{ key: 'username', title: '借阅用户账号', align: "center", width: 160 },
	{
		key: "borrowTime", title: '借阅时间', align: 'center', width: 160,
		render: (row: any) => {
			return formatDate(row.borrowTime);
		}
	},
	{
		title: '操作',
		key: 'operate',
		align: 'center',
		width: 120,
		render: (row: any) => {
			return (
				<NSpace justify={'center'}>
					<NButton color="#007AFF" text size={'small'}
				onClick={() => {
              openForm(row);
            }}>
					详情
				</NButton>
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
		const { data } = await BorrowApi.getBorrowPage(queryParams);
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
	queryParams.serialNumber = '';
	queryParams.username = '';
	queryParams.title = '';
	queryParams.status = null;
	queryParams.createTime = null;
	getList();
};

/**
 * 自动审批按钮操作
 */
const autoApproveBorrowBook = () => {
	const data = BorrowApi.autoApproveBorrowBook();
	console.log(data);
	if(data){
		window.$message?.success("已自动审批" + data + "条数据")
	}
	getList();
};

/**
 * 人工审批
 */
 const approveShow = ref(false); // 表单的显示状态
 const approveBorrowBook = (row?: any) => {
	approveShow.value = true;
	rowInfo.value = row;
 }
 const inputRef =  ref<InputInst | null>(null);
 const remark = reactive({
	remark: null
});
 const rules: FormRules = {
	remark: [{type: 'string', required: true, trigger: ['blur', 'change'], message: '请填写审批备注！'}]
};
 // 审批通过与驳回
 const approve = async (serialNumber: string, type: string) => {
	console.log(remark.remark)
	if(remark.remark == null)
	{
		console.log(remark.remark+"aaa")
		inputRef.value?.focus();
		inputRef.value?.blur();
		return ;
	}
	if(type == "refuse"){
		await BorrowApi.refuseBorrowBook(serialNumber, remark.remark);
		window.$message?.success("驳回成功！")
	}
	else{
		BorrowApi.approveBorrowBook(serialNumber, remark.remark);
		window.$message?.success("审批通过成功！");
	}
	approveShow.value = false;
	remark.remark = null;
	getList();
 }



// const exportLoading = ref(false); // 导出的加载中
// /** 导出按钮操作 */
// const handleExport = async () => {
// 	try {
// 		window.$dialog?.info({
// 			title: '系统提示',
// 			content: '是否确认导出数据项',
// 			positiveText: '确定',
// 			negativeText: '取消',
// 			onPositiveClick: async () => {
// 				exportLoading.value = true;
// 				// @ts-ignore
// 				const data = await LoginLogApi.exportLoginLog(queryParams);
// 				// @ts-ignore
// 				download.excel(data, '登录日志.xls');
// 			}
// 		});
// 	} finally {
// 		exportLoading.value = false;
// 	}
// };




/**
 * 详情页面
 */
const formShow = ref(false); // 表单的显示状态
const rowInfo:any = ref()
async function openForm(row?: any) {
	formShow.value = true; // 打开表单弹窗
	rowInfo.value = row;
}


/**
 * 更新状态操作
 */
 const update = async (id: number, status: any, before: number) => {
	BorrowApi.updateBorrowStatus(id, status);
	await getList();
};

onMounted(async () => {
	await getList();
});

</script>


