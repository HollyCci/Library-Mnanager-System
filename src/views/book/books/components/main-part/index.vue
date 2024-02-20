<template>
	<n-space :size="16" :wrap="false">
		<n-space :vertical="true" :size="16" style="width: 250px">
			<n-card :bordered="false" class="h-full rounded-8px shadow-sm" hoverable>
				<n-input-group>
					<n-input v-model:value="filterText" placeholder="搜索分类" style="margin-bottom: 20px" @input="onFilterInput">
						<template #prefix>
							<icon-uil-search class="text-20px"/>
						</template>
					</n-input>
				</n-input-group>
				<n-scrollbar style="max-height: 660px" :size="1">
					<t-tree
						ref="treeRef"
						:data="categoryList"
						:line="true"
						expand-on-click-node
						:expand-level="1"
						:keys="categoryTreeProp"
						:filter="handleFilterByText"
						hover
						@click="handleNodeClick"
					></t-tree>
				</n-scrollbar>
				<!--        :filter="handleFilterByText" /> -->
			</n-card>
		</n-space>

		<n-space :vertical="true" :size="16" :wrap="false" style="width: 1280px">
			<n-card :bordered="false" class="h-full rounded-8px shadow-sm" hoverable>
				<n-form ref="queryFormRef" :inline="true" :model="queryParams" label-width="68px" label-placement="left">
					<n-grid :x-gap="12" :y-gap="8" :cols="4" :collapsed="gridCollapsed" :collapsed-rows="1">
						<n-form-item-gi label="图书标题" path="title">
							<n-input
								v-model:value="queryParams.title"
								clearable
								placeholder="请输入图书标题"
								@keyup.enter="handleQuery"
							/>
						</n-form-item-gi>
						<n-form-item label="标准编码" path="isbn">
							<n-input
								v-model:value="queryParams.isbn"
								clearable
								placeholder="请输入图书编码"
								@keyup.enter="handleQuery"
							/>
						</n-form-item>
						<n-form-item-gi label="作者" path="author">
							<n-input
								v-model:value="queryParams.author"
								clearable
								placeholder="请输入作者名字"
								@keyup.enter="handleQuery"
							/>
						</n-form-item-gi>
						<n-form-item-gi label="状态" path="status">
							<n-select
								v-model:value="queryParams.status"
								clearable
								placeholder="请选择图书状态"
								:options="DictOptions"
							/>
						</n-form-item-gi>
						<n-form-item-gi label="创建时间" path="createTime">
							<n-date-picker
								v-model:value="queryParams.createTime"
								type="daterange"
								start-placeholder="开始日期"
								end-placeholder="结束日期"
								clearable
								:default-time="['00:00:00', '23:59:59']"
							/>
						</n-form-item-gi>
						<n-form-item-gi label="出版社" path="publisher">
							<n-input
								v-model:value="queryParams.publisher"
								clearable
								placeholder="请输入图书出版社"
								@keyup.enter="handleQuery"
							/>
						</n-form-item-gi>
						<n-form-item-gi label="索书号" path="callNumber">
							<n-input
								v-model:value="queryParams.callNumber"
								clearable
								placeholder="请输入图书索书号"
								@keyup.enter="handleQuery"
							/>
						</n-form-item-gi>
						<n-form-item-gi label="中图分类" path="classification">
							<n-input
								v-model:value="queryParams.classification"
								clearable
								placeholder="请输入图书中图分类号"
								@keyup.enter="handleQuery"
							/>
						</n-form-item-gi>
					</n-grid>
				</n-form>

				<n-space class="m2">
					<!-- 搜索按钮 -->
					<n-button class="mr3" @click="handleQuery">
						<template #icon>
							<icon-uil-search class="text-20px"/>
						</template>
						搜索
					</n-button>
					<n-button class="mr3" @click="resetQuery">
						<template #icon>
							<icon-iconamoon:restart-bold class="text-20px"/>
						</template>
						重置
					</n-button>
					<n-button class="mr3" plain type="primary" @click="handleCreate">
						<template #icon>
							<icon-fluent:add-12-regular class="text-20px"/>
						</template>
						新增
					</n-button>
					<n-button plain class="mr3" type="success" @click="handleExport">
						<template #icon>
							<icon-uil:import class="text-20px"/>
						</template>
						导出
					</n-button>
					<n-button plain class="mr3" type="warning" @click="handleImport">
						<template #icon>
							<icon-ep:upload class="text-20px"/>
						</template>
						导入
					</n-button>
					<n-switch v-model:value="gridCollapsed" :round="false" class="mr3 mt1.5" @update:value="handCollapsed">
						<template #checked>如果你感觉这些选项不能满足你，那么请点击我</template>
						<template #unchecked>够了，我想让上面简洁一些</template>
					</n-switch>
				</n-space>
			</n-card>
			<n-card :bordered="false" class="h-full rounded-8px shadow-sm" hoverable>
				<n-data-table
					:loading="loading"
					remote
					:data="list"
					:row-key="rowKey"
					:columns="columns"
					:pagination="pagination"
					:scroll-x="2500"
				/>
			</n-card>
		</n-space>
	</n-space>
	<n-modal v-model:show="uploadShow" transform-origin="center" preset="dialog" title="主题词导入">
		<n-upload
			ref="uploadRef"
			multiple
			:default-upload="false"
			directory-dnd
			:action="importUrl + '?updateSupport=' + updateSupport"
			:max="1"
			:headers="uploadHeaders"
			accept=".xlsx, .xls"
			:on-error="submitFormError"
			:on-finish="submitFormSuccess"
		>
			<n-upload-dragger>
				<div style="margin-bottom: 12px">
					<n-icon size="48" :depth="3">
						<icon-line-md:upload-loop/>
					</n-icon>
				</div>
				<n-text style="font-size: 16px">点击或者拖动文件到该区域来上传</n-text>
			</n-upload-dragger>
		</n-upload>
		<n-space justify="center">
			<n-checkbox v-model:checked="updateSupport" class="m2">是否更新已经存在的用户数据</n-checkbox>
		</n-space>
		<n-space justify="center">
			仅允许导入xlsx、xls格式的文件。
			<n-button text type="primary" @click="importTemplate">下载模板</n-button>
		</n-space>
		<template #action>
			<n-button type="primary" @click="submitUploadForm">确定</n-button>
			<n-button @click="closeForm">取消</n-button>
		</template>
	</n-modal>
</template>
<script setup lang="tsx">
/* eslint-disable */
// 禁用 ESLint 检查，避免出现不必要的警告
// 声明组件名称
defineOptions({name: 'MainPart'});
// 引入需要的 Vue 3 模块和组件
import {reactive, h, ref, onMounted} from 'vue';
import {NSpace, NButton, NTime, NInput, NPopconfirm, NModal, NDescriptions, NDescriptionsItem} from 'naive-ui';
import type {DataTableColumns, MessageReactive} from 'naive-ui';
import {routeName} from '@/router';
import {useRouterPush} from '@/composables';
import {formatDate} from '@/utils/common/formatTime';
import {handleTree} from '@/utils/common/tree';
import * as BookSkuApi from '@/service/api/bookSku';
import * as CategoryApi from '@/service/api/category';
import download from '~/src/utils/common/download'; // 导入下载函数
const {routerPush} = useRouterPush();

const loading = ref(true); // 列表的加载中
const exportLoading = ref(false); // 导出的加载中
const pageCount = ref(0);
const list = ref([]); // 列表的数
const gridCollapsed = ref(true);
const queryParams = reactive({
	pageNo: 1,
	pageSize: 10,
	title: '',
	isbn: '',
	publisher: '',
	author: '',
	callNumber: '',
	classification: '',
	status: null,
	categoryId: null,
	createTime: null
});
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

function handleToTabMultiDetail(num: number) {
	routerPush({name: routeName('book_book-info'), query: {num}, hash: '#DEMO_HASH'});
}

function handleCreate() {
	routerPush({name: routeName('book_book-create')});
}

type RowData = {
	id: number;
	isbn: string;
	title: string;
	price: number;
	categoryId: number;
	subjectIds: string[];
	publisher: string;
	pubCountry: string;
	pubCity: string;
	pubDate: string;
	pages: number;
	series: string;
	abstracts: string;
	classification: string;
	author: string;
	callNumber: string;
	coreName: string;
	status: number;
	createTime: Date;
	category: [id: number, name: string];
	subject: {
		ids: number[];
		names: string[];
	};
};

const categoryList = ref([]); // 树形结构
const handleFilterByText = ref();
const treeRef = ref();
const filterText = ref('');


const categoryTreeProp = {
	value: 'id',
	label: 'name',
	children: 'children'
};

// 定义数据表格key
const rowKey = (rowData: any) => {
	return rowData.id;
};

const columns: DataTableColumns<RowData> = [
	{
		type: 'expand',
		renderExpand: rowData => {
			return (
				<NSpace>
					<NDescriptions
						labelPlacement="left"
						bordered
						column={1}
						size="small"
						labelAlign="center"
						labelStyle={'width:200px;text:center'}
						contentStyle={'width:2240px'}
					>
						<NDescriptionsItem label="摘要">
							{rowData.abstracts ? (
								<t-tag theme="primary" variant="outline">
									{rowData.abstracts}
								</t-tag>
							) : (
								<t-tag theme="warning" variant="outline">
									暂无摘要
								</t-tag>
							)}
						</NDescriptionsItem>
						<NDescriptionsItem label="丛编项">
							{rowData.series ? (
								<t-tag theme="primary" variant="outline">
									{rowData.series}
								</t-tag>
							) : (
								<t-tag theme="warning" variant="outline">
									暂无信息
								</t-tag>
							)}
						</NDescriptionsItem>
					</NDescriptions>
					<NDescriptions
						labelPlacement="left"
						bordered
						column={3}
						size="small"
						labelAlign="center"
						labelStyle={'width:200px;text:center'}
						contentStyle={'width:220px'}
					>
						<NDescriptionsItem label="图书主题词">
							<NSpace>
								{rowData.subject.names.map(name => (
									<t-tag theme="primary" variant="outline">
										{name}
									</t-tag>
								))}
							</NSpace>
						</NDescriptionsItem>
						<NDescriptionsItem label="图书页数">
							{rowData.pages ? (
								<t-tag theme="primary" variant="outline">
									{rowData.pages}
								</t-tag>
							) : (
								<t-tag theme="warning" variant="outline">
									暂无信息
								</t-tag>
							)}
						</NDescriptionsItem>
						<NDescriptionsItem label="类型代码">
							{rowData.coreName ? (
								<t-tag theme="primary" variant="outline">
									{rowData.coreName}
								</t-tag>
							) : (
								<t-tag theme="warning" variant="outline">
									暂无信息
								</t-tag>
							)}
						</NDescriptionsItem>
						<NDescriptionsItem label="出版时间">
							{rowData.pubDate ? (
								<t-tag theme="primary" variant="outline">
									{rowData.pubDate}
								</t-tag>
							) : (
								<t-tag theme="warning" variant="outline">
									暂无信息
								</t-tag>
							)}
						</NDescriptionsItem>
						<NDescriptionsItem label="出版地区">
							{rowData.pubCity ? (
								<t-tag theme="primary" variant="outline">
									{rowData.pubCity}
								</t-tag>
							) : (
								<t-tag theme="warning" variant="outline">
									暂无信息
								</t-tag>
							)}
						</NDescriptionsItem>
						<NDescriptionsItem label="出版国家">
							{rowData.pubCountry ? (
								<t-tag theme="primary" variant="outline">
									{rowData.pubCountry}
								</t-tag>
							) : (
								<t-tag theme="warning" variant="outline">
									暂无信息
								</t-tag>
							)}
						</NDescriptionsItem>
					</NDescriptions>
				</NSpace>
			);
		}
	},
	{key: 'id', title: '图书编号', align: 'center', width: 100},
	{key: 'isbn', title: '图书标码', align: 'center', width: 160},
	{key: 'title', title: '名字', align: 'center', width: 200},
	{key: 'author', title: '作者', align: 'center', width: 100},
	{key: 'category.name', title: '分类', align: 'center', width: 200},
	{key: 'price', title: '价格', align: 'center', width: 80},
	{key: 'callNumber', title: '索书号', align: 'center', width: 140},
	{key: 'classification', title: '中图分类', align: 'center', width: 90},
	{key: 'publisher', title: '出版社', align: 'center', width: 150},
	{key: 'creator', title: '创建人', align: 'center', width: 100},
	{
		key: 'createTime',
		title: '创建时间',
		align: 'center',
		width: 180,
		render: (row: any) => {
			return formatDate(row.createTime);
		}
	},
	{
		key: 'updater',
		title: '最后更新人',
		align: 'center',
		width: 100,
		render: (row: any) => {
			return row.updater ? row.updater : '暂无更新';
		}
	},
	{
		key: 'createTime',
		title: '最后更新时间',
		align: 'center',
		width: 180,
		render: (row: any) => {
			return formatDate(row.updateTime);
		}
	},
	{
		key: 'status',
		title: '状态',
		align: 'center',
		width: 90,
		render(row) {
			return <n-switch value={row.status === 0} onChange={(value: boolean) => handleStatusChange(row, value)}/>;
		},
		fixed: 'right'
	},
	{
		key: 'action',
		title: '操作',
		align: 'center',
		width: 150,
		render: (row: any) => {
			return (
				<NSpace justify={'center'}>
					<NButton
						text
						color="#8a2be2"
						size={'small'}
						onClick={() => {
							handleToTabMultiDetail(row.id);
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
		},
		fixed: 'right'
	}
];

const getList = async () => {
	loading.value = true;
	await getTree();
	try {
		const {data} = await BookSkuApi.getBookSkuPage(queryParams);
		list.value = data.list;
		pagination.page = queryParams.pageNo;
		pagination.pageSize = queryParams.pageSize;
		pagination.itemCount = data.total;
		pageCount.value = Math.ceil(pagination.itemCount / pagination.pageSize);
	} finally {
		loading.value = false;
	}
};

const getTree = async () => {
	const {data} = await CategoryApi.fetchSimpleCategoryList();
	categoryList.value = [];
	// @ts-ignore
	categoryList.value.push(...handleTree(data));
};

// 更新图书状态回调
const handleStatusChange = async (row: any, value: boolean) => {
	const text = value ? '启用' : '停用';
	window.$dialog?.info({
		title: '提示',
		content: `您确定要${text}"${row.title}"图书吗吗?`,
		positiveText: '确定',
		negativeText: '取消',
		onPositiveClick: async () => {
			await BookSkuApi.updateBookStatus(row.id, value ? 0 : 1)
			await getList();
		}
	});
};

// 展开更多查询条件
const handCollapsed = (value: boolean) => {
	gridCollapsed.value = value;
};
// 定义分页参数

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
const handleNodeClick = async (node: any) => {
	queryParams.categoryId = node.node.data.id;
	await getList();
};

/** 搜索按钮操作 */
const handleQuery = () => {
	if (queryParams.createTime) {
		// @ts-ignore ts推断不出来
		queryParams.createTime = queryParams.createTime.map(item => formatDate(item));
	}
	queryParams.pageNo = 1;
	getList();
};

// 重置按钮操作
const resetQuery = () => {
	queryParams.pageNo = 1;
	queryParams.title = '';
	queryParams.isbn = '';
	queryParams.publisher = '';
	queryParams.author = '';
	queryParams.callNumber = '';
	queryParams.classification = '';
	queryParams.status = null;
	queryParams.categoryId = null;
	queryParams.createTime = null;
	getList();
};

/** 删除按钮操作 */
const handleDelete = async (id: number) => {
	try {
		window.$dialog?.info({
			title: '提示',
			content: '您确定要本书吗?删除后对应的库存、分类、主题词等所有相关信息都会消失!',
			positiveText: '确定',
			negativeText: '取消',
			onPositiveClick: async () => {
				const {data} = await BookSkuApi.deleteBookSku(id);
				if (data === true) {
					window.$message?.success('删除成功');
				}
				await getList();
			}
		});
	} catch {
	}
};

// 分类搜索过滤
const onFilterInput = () => {
	// @ts-ignore
	handleFilterByText.value = node => node.data.name.indexOf(filterText.value) >= 0;
};

// 导出图书数据
const handleExport = async () => {
	try {
		window.$dialog?.info({
			title: '系统提示',
			content: '是否确认导出数据项',
			positiveText: '确定',
			negativeText: '取消',
			onPositiveClick: async () => {
				exportLoading.value = true;
				const data = await BookSkuApi.exportBookSku(queryParams);
				console.log(data);
				// @ts-ignore
				download.excel(data, '图书数据.xls');
			}
		});
	} finally {
		exportLoading.value = false;
	}
};

import {getServiceEnvConfig} from '~/.env-config'; // 导入获取环境配置的函数
import {localStg} from '@/utils';

const uploadShow = ref(false); // 上传弹窗的显示状态
const {url} = getServiceEnvConfig(import.meta.env);
const importUrl = url + '/library/book/import'; // 上传的地址
const updateSupport = ref(0) // 是否更新已经存在的数据
const uploadHeaders = ref() // 上传 Header 头
const uploadRef = ref()
const uploadFormLoading = ref(false);// 表单加载中
const handleImport = () => {
	// 提交请求
	uploadHeaders.value = {
		Authorization: 'Bearer ' + localStg.get('accessToken'),
		'tenant-id': localStg.get('tenantId')
	}
	uploadShow.value = true;
};

let msgReactive: MessageReactive | null = null;

const submitUploadForm = async () => {
	uploadFormLoading.value = true;
	// 创建加载中提示信息
	// @ts-ignore
	msgReactive = window.$message?.create('数据处理中...请稍后', {
		type: 'loading',
		keepAliveOnHover: true,
	});

	// 提交上传表单
	uploadRef.value?.submit();
}

/**
 * 上传错误提示
 */
const submitFormError = (): void => {
	window.$message?.error('上传失败，请您重新上传！');
	uploadFormLoading.value = false;
};

/**
 * 上传成功回调
 */
const submitFormSuccess = (response: any) => {
	// 解析响应数据
	const res = JSON.parse(response.event.target.response);

	// 判断响应状态码
	if (res.code !== 200) {
		window.$message?.error(res.msg);
		uploadFormLoading.value = false;
		return;
	}

	// 设置加载提示为成功状态
	// @ts-ignore
	msgReactive.type = 'success';
	// @ts-ignore
	msgReactive.content = '导入成功';

	// 拼接提示语
	const data = res.data;
	let text = '上传成功数量：' + data.createNames.length + ';';
	for (let name of data.createNames) {
		text += '< ' + name + ' >';
	}
	text += '更新成功数量：' + data.updateNames.length + ';';
	for (const name of data.updateNames) {
		text += '< ' + name + ' >';
	}
	text += '更新失败数量：' + Object.keys(data.failureNames).length + ';';
	for (const name in data.failureNames) {
		text += '< ' + name + ': ' + data.failureNames[name] + ' >';
	}

	// 创建通知消息
	const n = window.$notification?.create({
		title: '导入回执',
		content: text,
		meta: () => h(NTime),
		action: () =>
			h(
				NButton,
				{
					text: true,
					type: 'primary',
					onClick: () => {
						// @ts-ignore
						n.destroy();
					},
				},
				{
					default: () => '已读',
				}
			),
	});

	// 关闭上传弹窗
	closeForm();
};

/**
 * 关闭上传弹窗操作
 */
const closeForm = () => {
	uploadShow.value = false;
	// 获取最新列表数据
	getList();
};

/**
 * 下载模板操作
 */
const importTemplate = async () => {
	// 发起下载模板请求
	const res = await BookSkuApi.importBookSkuTemplate();

	// 显示下载提示信息
	window.$message?.info("正在下载模板，请稍等...");

	// 使用 download.excel 函数下载 Excel 文件
	// @ts-ignore
	download.excel(res, '图书导入模版.xls');
};

// 在组件挂载时获取列表数据
onMounted(async () => {
	await getList();
});
</script>
