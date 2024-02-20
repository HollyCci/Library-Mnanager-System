<template>
	<!-- 整体页面模板开始 -->
	<n-space vertical>
		<!-- 第一个卡片开始：查询条件 -->
		<n-card :bordered="false" class="h-full rounded-8px shadow-sm" hoverable>
			<n-form
				ref="queryFormRef"
				:inline="true"
				:model="queryParams"
				class="-mb-15px"
				label-width="68px"
				label-placement="left"
			>
				<n-form-item label="菜单名称" path="name">
					<n-input
						v-model:value="queryParams.name"
						class="!w-240px"
						clearable
						placeholder="请输入菜单名称"
						@keyup.enter="handleQuery"
					/>
				</n-form-item>
				<n-form-item label="状态" path="status">
					<n-select
						v-model:value="queryParams.status"
						class="!w-240px"
						clearable
						placeholder="请选择菜单状态"
						:options="DictOptions"
					/>
				</n-form-item>
				<n-form-item>
					<n-space>
						<n-button @click="handleQuery">
							<template #icon>
								<icon-uil-search class="text-20px"/>
							</template>
							搜索
						</n-button>
						<n-button @click="resetQuery">
							<template #icon>
								<icon-iconamoon:restart-bold class="text-20px"/>
							</template>
							重置
						</n-button>
						<n-button plain type="primary" @click="openForm('create')">
							<template #icon>
								<icon-fluent:add-12-regular class="text-20px"/>
							</template>
							新增
						</n-button>
						<n-button plain type="error" @click="toggleExpandAll">
							<template #icon>
								<icon-ep:sort class="text-20px"/>
							</template>
							展开/折叠
						</n-button>
						<n-button plain @click="refreshMenu">
							<template #icon>
								<icon-icon-park:refresh class="text-20px"/>
							</template>
							刷新菜单缓存
						</n-button>
					</n-space>
				</n-form-item>
			</n-form>
		</n-card>

		<n-card :bordered="false" class="h-full rounded-8px shadow-sm" hoverable>
			<n-data-table
				v-if="refreshTable"
				:loading="loading"
				:columns="columns"
				:data="list"
				:default-expand-all="isExpandAll"
				:max-height="650"
				children-key="children"
				:row-key="rowKey"
			></n-data-table>
		</n-card>
		<n-modal v-model:show="fromShow" transform-origin="center">
			<n-card style="width: 600px" title="菜单信息" :bordered="false" size="huge" role="dialog" aria-modal="true">
				<n-spin :show="formLoading">
					<n-form ref="formRef" :rules="rules" :model="formData" label-placement="left" label-width="93px">
						<n-form-item label="上级菜单" path="parentId">
							<n-tree-select
								v-model:value="formData.parentId"
								:options="menuTree"
								label-field="name"
								key-field="id"
								:default-expanded-keys="[0]"
								children-field="children"
								clearable
								style="width: 50%"
								placeholder="请选择上级菜单"
							/>
						</n-form-item>
						<n-form-item label="菜单名称" path="title" required>
							<n-input v-model:value="formData.title" class="!w-213px" clearable placeholder="请输入菜单名称"/>
						</n-form-item>
						<n-form-item label="菜单类型" path="type" required>
							<n-radio-group v-model:value="formData.type">
								<n-radio-button
									v-for="dict in SystemMenuTypeEnum"
									:key="dict.value"
									:value="dict.value"
									:label="dict.label"
								/>
							</n-radio-group>
						</n-form-item>
						<n-form-item v-if="formData.type !== 3" label="菜单图标">
							<icon-select v-model:value="formData.icon" :icons="icons" clearable/>
						</n-form-item>

						<n-form-item v-if="formData.type !== 3" label="路由地址" path="path" required>
							<n-input v-model:value="formData.path" style="width: 50%" clearable placeholder="请输入路由地址"/>
						</n-form-item>
						<n-form-item v-if="formData.type !== 3" label="组件布局" path="component" required>
							<n-select
								v-model:value="formData.component"
								clearable
								style="width: 50%"
								placeholder="请选择组件布局"
								:options="componentOptions"
							></n-select>
						</n-form-item>

						<n-form-item v-if="formData.type !== 1" label="权限标识" path="permission" required>
							<n-input v-model:value="formData.permission" clearable placeholder="请输入权限标识"/>
						</n-form-item>
						<n-form-item label="显示排序" path="order" required>
							<n-input-number v-model:value="formData.order" min="0" clearable placeholder="请输入菜单排序位次"/>
						</n-form-item>
						<n-form-item label="重定向" path="href">
							<n-input v-model:value="formData.href" style="width: 50%" clearable placeholder="请输入重定向地址"/>
						</n-form-item>
						<n-space>
							<n-form-item label="菜单状态" path="status">
								<n-radio-group v-model:value="formData.status">
									<n-radio v-for="dict in DictOptions" :key="dict.value" :label="dict.label" :value="dict.value"/>
								</n-radio-group>
							</n-form-item>
							<n-form-item v-if="formData.type !== 3" label="隐藏状态" path="visible">
								<n-radio-group v-model:value="formData.hide">
									<n-radio v-for="dict in keepAliveOptions" :key="dict.key" :label="dict.label" :value="dict.value"/>
								</n-radio-group>
							</n-form-item>
							<n-form-item v-if="formData.type !== 3" label="缓存状态" path="keepAlive">
								<n-radio-group v-model:value="formData.keepAlive">
									<n-radio v-for="dict in keepAliveOptions" :key="dict.key" :label="dict.label" :value="dict.value"/>
								</n-radio-group>
							</n-form-item>
							<n-form-item v-if="formData.type !== 3" label="登录权限" path="requiresAuth">
								<n-radio-group v-model:value="formData.requireAuth">
									<n-radio v-for="dict in keepAliveOptions" :key="dict.key" :label="dict.label" :value="dict.value"/>
								</n-radio-group>
							</n-form-item>
							<n-form-item v-if="formData.type !== 3" label="不可关闭" path="affix">
								<n-radio-group v-model:value="formData.affix">
									<n-radio v-for="dict in keepAliveOptions" :key="dict.key" :label="dict.label" :value="dict.value"/>
								</n-radio-group>
							</n-form-item>
						</n-space>
					</n-form>
				</n-spin>
				<!-- 弹窗底部按钮 -->
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
<script lang="tsx" setup>
/* eslint-disable */
defineOptions({name: 'TopPart'});
import {ref, reactive, onBeforeMount, nextTick} from 'vue';
import {NSpace, NButton, NPopconfirm, NTag} from 'naive-ui';
import type {DataTableColumns, FormInst, FormRules} from 'naive-ui';
import * as MenuApi from '@/service/api/menu';
import {handleTree} from '@/utils/common/tree';
import {formRules} from '~/src/utils';
import {icons} from './icons';

const loading = ref(false); // 列表的加载中
const list = ref<AuthRoute.Route[]>([]); // 列表数据
// 查询参数
const queryParams = reactive({
	name: '',
	status: null
});
const queryFormRef = ref<HTMLElement & FormInst>(); // 搜索的表单
const isExpandAll = ref(true); // 是否展开，默认全部折叠
const refreshTable = ref(true); // 重新渲染表格状态rue
const menuTree = ref(); // 树形结构
const switchLoading = ref(false); // 缓存页面的开关状态
// 字典
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
// 缓存开关字典
const keepAliveOptions = [
	{
		label: '开启',
		value: true,
		key: 1
	},
	{
		label: '关闭',
		value: false,
		key: 0
	}
];
// 布局字典
const componentOptions = [
	{
		label: '基础布局',
		value: 'basic'
	},
	{
		label: '空白布局',
		value: 'blank'
	},
	{
		label: '多级路由布局',
		value: 'multi'
	},
	{
		label: '自身布局',
		value: 'self'
	}
];

// 表单行数据
const columns: DataTableColumns = [
	{key: 'meta.title', title: '菜单管理', align: 'left'},
	{
		key: 'meta.icon',
		title: '图标',
		render: (row: any) => {
			const {icon} = row.meta;
			return <svg-icon class="text-20px" icon={icon}/>;
		}
	},
	{key: 'meta.order', title: '排序', align: 'center'},
	{key: 'meta.permission', title: '权限标识', align: 'center'},
	{key: 'path', title: '路由路径', width: 180, align: 'center'},
	{key: 'meta.title', title: '菜单名称', align: 'center'},
	{
		key: 'meta.keepAlive',
		title: '缓存页面',
		align: 'center',
		render(row) {
			// return <NSwitch value={row.meta.keepAlive} onChange={(value) => handleKeepAlive(row,row.id,value)}/>;
			/* eslint-disable */
			// @ts-ignore
			return <n-switch value={row.meta.keepAlive} onChange={(value) => handleKeepAlive(row, row.id, value)}/>;
		}
	},
	{
		key: 'meta.activeMenu',
		title: '状态',
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
		key: 'action',
		title: '操作',
		align: 'center',
		width: 200,
		fixed: 'right',
		render: (row: any) => {
			return (
				<NSpace justify={'center'}>
					<NButton
						text
						color="#8a2be2"
						size={'small'}
						onClick={() => {
							openForm('update', row.id);
						}}
					>
						修改
					</NButton>
					<NButton
						text
						color="#646cff"
						size={'small'}
						onClick={() => {
							openForm('update', undefined, row.id);
						}}
					>
						新增
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

// 必须要有rowKey，不然点击打开会全部打开
const rowKey = (row: any) => row.id;

// 获取列表数据
const getList = async () => {
	loading.value = true;
	try {
		const res = await MenuApi.getMenuList(queryParams);
		const MenuData = res.data;
		if (MenuData) {
			/* eslint-disable */
			// @ts-ignore 忽略类型检查，肯定是有值的，因为做了防止bug的处理，结构多少有点不一样
			list.value = MenuData;
		}
	} finally {
		loading.value = false;
	}
};

/** 搜索按钮操作 */
const handleQuery = () => {
	console.log(queryParams);
	getList();
};

// 重置按钮操作
const resetQuery = () => {
	queryParams.name = '';
	queryParams.status = null;
	getList();
};

// 展开/折叠按钮操作
const toggleExpandAll = () => {
	loading.value = true;
	setTimeout(() => {
		refreshTable.value = false;
		isExpandAll.value = !isExpandAll.value;
		nextTick(() => {
			refreshTable.value = true;
		});
		loading.value = false;
	}, 400); // 延迟一下，不然数据多的话会有卡顿，影响体验
}

/** 刷新菜单缓存按钮操作 */
const refreshMenu = async () => {
	try {
		// await message.confirm('即将更新缓存刷新浏览器！', '刷新菜单缓存')
		// // 清空，从而触发刷新
		// wsCache.delete(CACHE_KEY.ROLE_ROUTERS)
		// 暂时用不到，因为根本没做缓存....
		// 刷新浏览器
		location.reload()
	} catch {
	}
}

// 删除按钮操作
const handleDelete = async (id: number) => {
	try {
		window.$dialog?.info({
			title: '系统提示',
			content: '是否确认删除数据项',
			positiveText: '确定',
			negativeText: '取消',
			onPositiveClick: async () => {
				await MenuApi.deleteMenu(id);
				await getList();
				window.$message?.success('删除成功');
			}
		});
	} catch (error) {
		console.log(error);
	}
};


// ------------------------------------- model相关操作 -------------------------------------
const fromShow = ref(false); // 表单的显示状态
const formLoading = ref(true) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formRef = ref<HTMLElement & FormInst>(); // 表单的引用
const formData = ref({
	id: 0,
	name: '',
	permission: '',
	title: '',
	href: null,
	type: 1,
	order: null,
	parentId: 0,
	path: '',
	icon: '',
	component: null,
	status: 0,
	hide: false,
	affix: null,
	keepAlive: true,
	requireAuth: true
})

// 菜单类型字典
const SystemMenuTypeEnum = [
	{
		label: '目录',
		value: 1
	},
	{
		label: '菜单',
		value: 2
	},
	{
		label: '按钮',
		value: 3
	}
]

// 表单的校验规则
const rules: FormRules = {
	title: [{required: true, message: '菜单名称不能为空', trigger: 'input'}],
	path: formRules.routerPath,
	requireAuth: formRules.radioStatus,
	component: [{required: true, message: '组件名称不能为空', trigger: 'change'}],
	order: [{type: 'number', required: true, message: '排序不能为空', trigger: 'change'}],
};

// 更新缓存设置
async function handleKeepAlive(row: any, id: number, keepAlive: boolean) {
	formData.value.id = id;
	formData.value.keepAlive = keepAlive;
	switchLoading.value = true;
	try {
		await MenuApi.updateKeepAlive(id, keepAlive);
		await getList();
	} finally {
		switchLoading.value = false;
	}
}

// 获取菜单树形结构
async function getTree() {
	menuTree.value = [];
	const {data} = await MenuApi.getSimpleMenusList();
	const menu: Tree = {id: 0, name: '主类目', children: []};
	// @ts-ignore
	menu.children = handleTree(data);
	menuTree.value.push(menu);
	console.log(menuTree.value);

}

// 打开弹窗
async function openForm(type: string, id?: number, parentId?: number) {
	formLoading.value = true;
	fromShow.value = true;
	formType.value = type;
	if (parentId) {
		formData.value.parentId = parentId;
	}
	if (type === 'update' && id) {
		formLoading.value = true;
		const {data} = await MenuApi.getMenu(id);
		// @ts-ignore
		formData.value = data;
		// @ts-ignore 特殊处理order 回头可以优化
		formData.value.order = data.sort;
	}
	// 获取菜单列表
	await getTree()
	formLoading.value = false;
}

// 提交表单
async function submitFrom() {
	formLoading.value = true;
	// 校验表单
	if (!formRef) return
	// @ts-ignore
	await formRef.value.validate()
	// 默认name处理方式
	formData.value.name = formData.value.path.replace(/\//g, "_").substring(1);
	// 提交表单
	try {
		const param = formData.value;
		if (formType.value === 'create') {

		} else if (formType.value === 'update') {
			await MenuApi.updateMenu(param);
			close();
			await getList();
		}
	} finally {
		formLoading.value = false;
	}
}

// 关闭弹窗
function close() {
	fromShow.value = false;
	formData.value = {
		id: 0,
		name: '',
		permission: '',
		title: '',
		href: null,
		type: 1,
		order: null,
		parentId: 0,
		path: '',
		icon: '',
		component: null,
		status: 0,
		hide: false,
		affix: null,
		keepAlive: true,
		requireAuth: true
	}
}

// ------------------------------------- model相关操作 -------------------------------------
onBeforeMount(async () => {
	// @ts-ignore
	// list.value = initTempValue;
	getList()
});

/** 离奇的bug值必须初始化，不然无法全部打开 bug已修复 和表格rowKey childrenKey有关 */
// const initTempValue = [
//   {
//     id: 0,
//     name: '',
//     component: '',
//     parentId: 0,
//     path: '',
//     redirect: '',
//     meta: {
//       activeMenu: null,
//       affix: null,
//       hide: null,
//       i18nTitle: null,
//       icon: '',
//       keepAlive: false,
//       localIcon: '',
//       multiTab: null,
//       order: 0,
//       permission: '',
//       requiresAuth: null,
//       singleLayout: null,
//       title: ''
//     },
//     children: [
//       {
//         id: 0,
//         name: '',
//         component: '',
//         parentId: 0,
//         path: '',
//         redirect: '',
//         meta: {
//           activeMenu: null,
//           affix: null,
//           hide: null,
//           i18nTitle: null,
//           icon: '',
//           keepAlive: false,
//           localIcon: '',
//           multiTab: null,
//           order: 0,
//           permission: '',
//           requiresAuth: null,
//           singleLayout: null,
//           title: ''
//         }
//       }
//     ]
//   }
// ];

/** 离奇的bug之页面首页加载后第一次执行该方法无效，需预先执行以下 */
toggleExpandAll();
</script>

