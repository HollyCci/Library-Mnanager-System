<template>
	<n-space :vertical="true" :size="16">
		<n-card :bordered="false" class="h-full rounded-8px shadow-sm" hoverable>
			<!-- 搜索表单 -->
			<n-form ref="queryFormRef" :inline="true" class="-mb-15px" label-width="68px" label-placement="left">
				<n-form-item label="岗位名称" path="name">
					<n-input
						v-model:value="queryParams.name"
						class="!w-200px"
						clearable
						placeholder="请输入岗位名称"
						@keyup.enter="handleQuery"
					/>
				</n-form-item>
				<n-form-item label="岗位编码" path="name">
					<n-input
						v-model:value="queryParams.code"
						class="!w-200px"
						clearable
						placeholder="请输入岗位编码"
						@keyup.enter="handleQuery"
					/>
				</n-form-item>
				<n-form-item label="状态" path="name">
					<n-select
						v-model:value="queryParams.status"
						class="!w-200px"
						clearable
						placeholder="请选择状态"
						:options="DictOptions"
						@keyup.enter="handleQuery"
					/>
				</n-form-item>
				<!-- 搜索按钮 -->
				<n-form-item>
					<n-button @click="handleQuery">
						<template #icon>
							<icon-uil-search class="text-20px"/>
						</template>
						搜索
					</n-button>
				</n-form-item>
				<n-form-item>
					<n-button @click="resetQuery">
						<template #icon>
							<icon-iconamoon:restart-bold class="text-20px"/>
						</template>
						重置
					</n-button>
				</n-form-item>
				<n-form-item>
					<n-button strong secondary type="info" @click="openForm('create')">
						<template #icon>
							<icon-fluent:add12-regular class="text-20px"/>
						</template>
						新增
					</n-button>
				</n-form-item>
				<n-form-item>
					<n-button strong secondary type="success" @click="handleExport">
						<template #icon>
							<icon-uil:import class="text-20px"/>
						</template>
						导出
					</n-button>
				</n-form-item>
			</n-form>
		</n-card>
		<n-card :bordered="false" class="h-full rounded-8px shadow-sm" hoverable>
			<n-data-table v-if="refreshTable" :loading="loading" :columns="columns" :data="list" :pagination="pagination"/>
		</n-card>

		<n-modal v-model:show="formShow" :on-mask-click="close" transform-origin="center">
			<n-card style="width: 600px" title="班级信息" :bordered="false" size="huge" role="dialog" aria-modal="true">
				<!-- 岗位编辑表单 -->
				<n-form
					ref="formRef"
					v-loading="formLoading"
					:rules="rules"
					:model="formData"
					label-placement="left"
					label-width="93px"
				>
					<!-- 班级搜索 -->
					<n-form-item label="岗位名称" path="name" required>
						<n-input v-model:value="formData.name" placeholder="请输入岗位名称" style="width: 80%"/>
					</n-form-item>
					<n-form-item label="岗位编码" path="code" required>
						<n-input v-model:value="formData.code" placeholder="请输入岗位编码" style="width: 80%"/>
					</n-form-item>
					<n-form-item label="岗位状态" path="status" required>
						<n-select
							v-model:value="formData.status"
							:options="DictOptions"
							placeholder="请选择状态"
							style="width: 50%"
						></n-select>
					</n-form-item>
					<n-form-item label="显示排序" path="sort" required>
						<n-input-number v-model:value="formData.sort" placeholder="请输入显示排序" style="width: 50%" min="0"/>
					</n-form-item>
					<n-form-item label="岗位备注" path="remark">
						<n-input
							v-model:value="formData.remark"
							placeholder="请输入备注"
							type="textarea"
							clearable
							style="width: 80%"
							:autosize="{
                minRows: 1,
                maxRows: 5
              }"
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
import {reactive, ref, onMounted} from 'vue';
import {NSpace, NButton, NPopconfirm, NTag, NScrollbar} from 'naive-ui';
import type {DataTableColumns, FormRules, FormInst} from 'naive-ui';
import * as PostApi from '@/service/api/post';
import {formatDate} from '@/utils/common/formatTime';
import download from '@/utils/common/download';

const loading = ref(true);
const list = ref<PostApi.PostVO[]>([]);
const pageCount = ref(0);
const refreshTable = ref(true);
const exportLoading = ref(false); // 导出的加载中


const formRef = ref<HTMLElement & FormInst>(); // 表单的引用
const formShow = ref(false); // 表单的显示状态
const formType = ref(''); // 表单的类型：create - 新增；update - 修改
const formLoading = ref(false); // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formData = ref({
	id: '',
	name: '',
	code: '',
	sort: null,
	remark: '',
	status: 0,
	createTime: ''
});

type RowData = {
	id: number;
	name: string;
	code: string;
	sort: number;
	remark: string;
	status: number;
	createTime: number;
};

// 定义状态字典
const DictOptions = [
	{
		label: '开启',
		value: 0
	},
	{
		label: '关闭',
		value: 1
	}
];

const rules: FormRules = {
	name: [{required: true, message: '请输入岗位名称', trigger: 'input'}],
	grade: [{required: true, message: '请输入岗位编码', trigger: 'input'}],
	code: [{required: true, message: '请输入岗位备注', trigger: 'input'}],
	sort: [{required: true, type: 'number', message: '请输入显示顺序', trigger: 'change'}]
};

// 定义搜索表单的响应式变量
const queryParams = reactive({
	code: '',
	name: '',
	status: null,
	pageNo: 1,
	pageSize: 10
});
const columns: DataTableColumns<RowData> = [
	{title: '岗位编号', key: 'id', align: 'center'},
	{title: '岗位名称', key: 'name', align: 'center'},
	{
		title: '岗位编码',
		key: 'code',
		align: 'center'
	},
	{title: '岗位顺序', key: 'sort', align: 'center'},
	{
		title: '岗位备注',
		key: 'remark',
		align: 'left',
		titleAlign: 'center',
		width: '360px',
		render(row) {
			return <NScrollbar style="max-height: 40px">{row.remark}</NScrollbar>;
		}
	},
	{
		title: '状态',
		key: 'status',
		align: 'center',
		render(row) {
			if (row.status === 0) {
				return <NTag type="primary">开启</NTag>;
			}
			if (row.status === 1) {
				return <NTag type="error">关闭</NTag>;
			}
			return <NTag type="warning">非法</NTag>;
		}
	},
	{
		title: '创建时间',
		key: 'createTime',
		align: 'center',
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
				<NSpace justify={'center'}>
					<NButton
						text
						color="#8a2be2"
						size={'small'}
						onClick={() => {
							openForm('update', row.id, row);
						}}
					>
						编辑
					</NButton>
					<NPopconfirm
						onPositiveClick={() => {
							handleDelete(row.id);
						}}
					>
						{{
							default: () => '确认删除',
							trigger: () => (
								<NButton color="#ff69b4" text size={'small'}>
									删除
								</NButton>
							)
						}}
					</NPopconfirm>
				</NSpace>
			);
		}
	}
];

// 获取列表数据并更新分页信息
const getList = async () => {
	loading.value = true;
	try {
		const {data} = await PostApi.getPostPage(queryParams);
		// @ts-ignore
		list.value = data.list;
		pagination.page = queryParams.pageNo;
		pagination.pageSize = queryParams.pageSize;
		// @ts-ignore
		pagination.itemCount = data.total;
		pageCount.value = Math.ceil(pagination.itemCount / pagination.pageSize);
	} catch (error) {
		console.log(error);
	} finally {
		loading.value = false;
	}
};

const pagination = reactive({
	page: queryParams.pageNo,
	pageCount: pageCount.value,
	pageSize: queryParams.pageSize,
	itemCount: 0,
	pageSizes: [10, 20, 30, 50],
	showSizePicker: true,
	showQuickJumper: true,
	// @ts-ignore
	prefix({itemCount}) {
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


/** 搜索按钮操作 */
const handleQuery = () => {
	queryParams.pageNo = 1;
	getList();
};

/** 重置按钮操作 */
const resetQuery = () => {
	queryParams.pageNo = 1;
	queryParams.name = '';
	queryParams.code = '';
	queryParams.status = null;
	getList();
};

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
				const data = await PostApi.exportPost(queryParams);
				// @ts-ignore
				download.excel(data, '岗位列表.xls');
			}
		});
	} finally {
		exportLoading.value = false;
	}
};

// 编辑键操作
async function openForm(type: string, id?: number, row?: any) {
	formShow.value = true;
	formType.value = type;
	// 如果是修改时设置数据
	if (type === 'update' && id) {
		formLoading.value = true;
		try {
			const {data} = await PostApi.getPost(id);
			if (data) {
				/* eslint-disable */
				// @ts-ignore
				formData.value = data;
			}
		} finally {
			formLoading.value = false;
		}
	}
}

// 删除键操作
const handleDelete = async (id: number) => {
	try {
		window.$dialog?.info({
			title: '系统提示',
			content: '是否确认删除数据项',
			positiveText: '确定',
			negativeText: '取消',
			onPositiveClick: async () => {
				await PostApi.deletePost(id);
				await getList();
				window.$message?.success('删除成功');
			}
		});
	} catch (error) {
		console.log(error);
	}
};


async function submitFrom() {
	if (!formRef.value) return;
	// 校验表单，验证不通过不会执行后续
	await formRef.value?.validate();
	try {
		const param = formData.value as unknown as PostApi.PostVO
		if (formType.value === 'create') {
			await PostApi.createPost(param);
			window.$message?.success('添加岗位：' + param.name + ' 成功');
		} else if (formType.value === 'update') {
			const {data} = await PostApi.updatePost(param);
			if (data === true) {
				window.$message?.success('修改岗位：' + param.name + ' 信息成功');
			}
		}
	} finally {
		formLoading.value = false;
		close();
		await getList();
	}
}


// 关闭弹窗
function close() {
	formShow.value = false;
	formData.value = {
		id: '',
		name: '',
		code: '',
		sort: null,
		remark: '',
		status: 0,
		createTime: ''
	}
}


onMounted(async () => {
	await getList();
});
</script>
