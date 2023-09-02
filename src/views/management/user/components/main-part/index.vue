<template>
  <n-space :size="16" :wrap="false">
    <n-space :vertical="true" :size="16">
      <n-card :bordered="false" class="h-full rounded-8px shadow-sm" hoverable>
        <n-input-group>
          <n-input v-model:value="filterText" placeholder="搜索部门" style="margin-bottom: 20px" @input="onFilterInput">
            <template #prefix>
              <icon-uil-search class="text-20px" />
            </template>
          </n-input>
          <!-- <n-button type="primary" ghost @click="resetQuery">重置</n-button> -->
        </n-input-group>
        <!-- <t-input-adornment>
          <t-input v-model="filterText" @change="onFilterInput" />
        </t-input-adornment> -->
        <t-tree
          ref="treeRef"
          :data="deptList"
          expand-on-click-node
          :keys="deptTreeProp"
          :filter="handleFilterByText"
          hover
          @click="handleNodeClick"
        ></t-tree>
        <!--        :filter="handleFilterByText" /> -->
      </n-card>
    </n-space>

    <n-space :vertical="true" :size="16" :wrap="false">
      <n-card :bordered="false" class="h-full rounded-8px shadow-sm" hoverable>
        <n-form
          ref="queryFormRef"
          :inline="true"
          :model="queryParams"
          class="-mb-15px"
          label-width="68px"
          label-placement="left"
        >
          <n-form-item label="用户名称" path="username">
            <n-input
              v-model:value="queryParams.username"
              class="!w-240px"
              clearable
              placeholder="请输入用户名称"
              @keyup.enter="handleQuery"
            />
          </n-form-item>
          <n-form-item label="用户昵称" path="nickname">
            <n-input
              v-model:value="queryParams.nickname"
              class="!w-240px"
              clearable
              placeholder="请输入用户昵称"
              @keyup.enter="handleQuery"
            />
          </n-form-item>
          <n-form-item label="手机号码" path="mobile">
            <n-input
              v-model:value="queryParams.mobile"
              class="!w-240px"
              clearable
              placeholder="请输入手机号码"
              @keyup.enter="handleQuery"
            />
          </n-form-item>
          <n-form-item label="状态" path="status">
            <n-select
              v-model:value="queryParams.status"
              class="!w-240px"
              clearable
              placeholder="请选择用户状态"
              :options="DictOptions"
            />
          </n-form-item>
          <n-form-item label="创建时间" path="createTime">
            <n-date-picker
              v-model:value="queryParams.createTime"
              type="daterange"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              clearable
              :default-time="['00:00:00', '23:59:59']"
              class="!w-340px"
            />
          </n-form-item>
        </n-form>
        <n-space class="m2">
          <!-- 搜索按钮 -->
          <n-button class="mr3" @click="handleQuery">
            <template #icon>
              <icon-uil-search class="text-20px" />
            </template>
            搜索
          </n-button>
          <n-button class="mr3" @click="resetQuery">
            <template #icon>
              <icon-iconamoon:restart-bold class="text-20px" />
            </template>
            重置
          </n-button>
          <n-button class="mr3" plain type="primary" @click="openForm('create')">
            <template #icon>
              <icon-fluent:add-12-regular class="text-20px" />
            </template>
            新增
          </n-button>
          <n-button plain class="mr3" type="success" @click="handleExport">
            <template #icon>
              <icon-uil:import class="text-20px" />
            </template>
            导出
          </n-button>
          <n-button plain class="mr3" type="warning" @click="handleImport">
            <template #icon>
              <icon-ep:upload class="text-20px" />
            </template>
            导入
          </n-button>
        </n-space>
      </n-card>
      <n-card :bordered="false" class="h-full rounded-8px shadow-sm" hoverable style="width: 1330px">
        <n-data-table
          :loading="loading"
          remote
          :data="list"
          :row-key="rowKey"
          :columns="columns"
          :pagination="pagination"
          :scroll-x="1650"
        />
      </n-card>
    </n-space>
  </n-space>
  <n-modal v-model:show="fromShow" transform-origin="center">
    <n-card style="width: 600px" title="用户信息" :bordered="false" size="huge" role="dialog" aria-modal="true">
      <n-form
        ref="formRef"
        v-loading="formLoading"
        :rules="rules"
        :model="formData"
        label-placement="left"
        label-width="93px"
      >
        <n-grid :cols="24" :x-gap="4">
          <n-form-item-gi :span="12" label="用户昵称" path="nickname" required>
            <n-input v-model:value="formData.nickname" placeholder="请输入用户昵称" />
          </n-form-item-gi>
          <n-form-item-gi v-if="formData.id === undefined" :span="12" label="用户名称" path="username" required>
            <n-input v-model:value="formData.username" placeholder="请输入用户名称/学号" />
          </n-form-item-gi>
          <n-form-item-gi :span="12" label="归属部门" path="deptId">
            <n-tree-select
              v-model:value="formData.deptId"
              filterable
              :options="deptList"
              label-field="name"
              key-field="id"
              children-field="children"
              clearable
              placeholder="请选择上级部门"
            />
          </n-form-item-gi>
          <n-form-item-gi :span="12" label="手机号码" path="mobile">
            <n-input v-model:value="formData.mobile" placeholder="请输入手机号码" />
          </n-form-item-gi>
          <n-form-item-gi :span="12" label="邮箱" path="email">
            <n-input v-model:value="formData.email" placeholder="请输入用户邮箱" />
          </n-form-item-gi>
          <n-form-item-gi v-if="formData.id === undefined" :span="12" label="用户密码" required path="password">
            <n-input
              v-model:value="formData.password"
              show-password-on="click"
              type="password"
              placeholder="请输入用户密码"
            />
          </n-form-item-gi>
          <n-form-item-gi :span="8" label="用户性别">
            <n-select v-model:value="formData.sex" :options="SexDictOptions" />
          </n-form-item-gi>
          <n-form-item-gi :span="16" label="归属班级" path="classId">
            <n-tree-select
              v-model:value="formData.classId"
              :options="classList"
              filterable
              label-field="name"
              key-field="id"
              children-field="children"
              clearable
              placeholder="请选择所属班级"
              default-expand-all
            />
          </n-form-item-gi>
          <n-form-item-gi :span="24" label="岗位">
            <n-select
              v-model:value="formData.postIds"
              multiple
              label-field="name"
              value-field="id"
              :options="postList"
              placeholder="请选择所属岗位"
            />
          </n-form-item-gi>
          <n-form-item-gi :span="24" label="备注">
            <n-input
              v-model:value="formData.remark"
              show-count
              :autosize="{
                minRows: 3,
                maxRows: 5
              }"
              type="textarea"
              placeholder="请输入内容"
            />
          </n-form-item-gi>
        </n-grid>
      </n-form>
      <template #footer>
        <n-space style="float: right">
          <n-button type="primary" @click="submitFrom">确 定</n-button>
          <n-button @click="close">取 消</n-button>
        </n-space>
      </template>
    </n-card>
  </n-modal>
  <n-modal v-model:show="fromRoleShow" transform-origin="center">
    <n-card style="width: 600px" title="角色信息" :bordered="false" size="huge" role="dialog" aria-modal="true">
      <n-form ref="formRoleRef" v-loading="formLoading" :model="formRoleData" label-placement="left" label-width="80px">
        <n-form-item label="用户名称" path="username">
          <t-tag theme="primary">{{ formRoleData.username }}</t-tag>
        </n-form-item>
        <n-form-item label="用户昵称" path="nickname">
          <t-tag theme="primary">{{ formRoleData.nickname }}</t-tag>
        </n-form-item>
        <n-form-item label="角色">
          <n-select
            v-model:value="formRoleData.roleIds"
            multiple
            label-field="name"
            key-filed="id"
            value-field="id"
            :options="roleList"
            placeholder="请选择角色"
          />
        </n-form-item>
      </n-form>
      <template #footer>
        <n-space style="float: right">
          <n-button type="primary" @click="submitRole">确 定</n-button>
          <n-button @click="closeRole">取 消</n-button>
        </n-space>
      </template>
    </n-card>
  </n-modal>
</template>
<script setup lang="tsx">
/* eslint-disable */
// 声明组件名称
defineOptions({ name: 'MainPart' });
// 引入需要的 Vue 3 模块和组件
import { reactive, ref,  onMounted } from 'vue';
import { NSpace, NButton, NAvatar, NDropdown, NInput, NModal, NDescriptions, NDescriptionsItem } from 'naive-ui';
import type { DataTableColumns, FormRules, FormInst } from 'naive-ui';
import { formatDate } from '@/utils/common/formatTime';
import download from '@/utils/common/download';
import { formRules } from '~/src/utils';
import { handleTree } from '@/utils/common/tree';
import * as DeptApi from '@/service/api/dept';
import * as UserApi from '@/service/api/user';
import * as PermissionApi from '@/service/api/permission';
import * as ClassApi from '@/service/api/class'
import * as PostApi from '@/service/api/post'
import * as RoleApi from '@/service/api/role'
import { MessagePlugin } from 'tdesign-vue-next';

const loading = ref(true) // 列表的加载中
const exportLoading = ref(false) // 导出的加载中
const pageCount = ref(0);
const list = ref([]) // 列表的数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  username: '',
	nickname:'',
  mobile: '',
  status: null,
  deptId: null,
  createTime: null
})
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
const SexDictOptions = [
	{
		label:'男',
		value:1
	},
	{
		label:'女',
		value:2
	}
]
type RowData = {
	id:number;
	username:string;
	nickname:string;
	remark:string;
	deptId:number;
	classId:number;
	postIds:string[];
	email:string;
	mobile:string;
	sex:number;
	avatar:string;
	status:number;
	borrowedCount:number;
	loginIp:string;
	loginDate:string;
	createTime:number;
	dept:[
		id:number,
		name:string
	],
	class:[
		id:number,
		name:string
	]
}

const deptList = ref([]) // 树形结构
const handleFilterByText = ref();
const classList = ref([]) // 树形结构
const postList = ref([])
const treeRef = ref()
const filterText=ref('');

const deptTreeProp = {
	value:'id',
	label:'name',
	children:'children'
}


const buttonOptions = [
	{
		label: '删除',
		key: 'handleDelete'
	},
	{
		label: '重置密码',
		key:'handleResetPwd'
	},
	{
		label:'分配角色',
		key:'handleRole'
	}
]

// 定义数据表格key
const rowKey = (rowData:any)=>{
	return rowData.id;
}

const columns: DataTableColumns<RowData> = [
	{
      type: 'expand',
      renderExpand: (rowData) => {
        return (
					<NDescriptions labelPlacement='left' bordered column={1} size='small' labelAlign='center' labelStyle={'width:200px;text:center'}>
						<NDescriptionsItem label='备注' >
							{rowData.remark?<t-tag theme="primary" variant="outline">{rowData.remark}</t-tag>:<t-tag theme="warning" variant="outline">无任何信息</t-tag>}
						</NDescriptionsItem>
						<NDescriptionsItem label='借阅额度已使用'>
							<t-tag theme="primary" variant="outline">{rowData.borrowedCount}次</t-tag>
						</NDescriptionsItem>
						<NDescriptionsItem label='最后登录IP'>
							{rowData.loginIp?<t-tag theme="primary" variant="outline">{rowData.loginIp}</t-tag>:<t-tag theme="warning" variant="outline">从未登陆过</t-tag>}
						</NDescriptionsItem>
						<NDescriptionsItem label='最后登录时间'>
							{rowData.loginDate?<t-tag theme="primary" variant="outline">{formatDate(rowData.loginDate)}</t-tag>:<t-tag theme="warning" variant="outline">从未登陆过</t-tag>}
						</NDescriptionsItem>
					</NDescriptions>
				)
      }
    },
	{ key: 'id', title: '用户编号', align: 'center',width:100 },
	{ key: 'username', title: '用户名称', align: 'center',width:150 },
	{ key:'avatar',
		title:'用户头像',
		align:'center',
		width:80,
	 	render(row){
			return<NAvatar src={row.avatar?row.avatar:'https://tdesign.gtimg.com/site/avatar.jpg'}></NAvatar>
		}},
	{ key: 'nickname', title: '用户昵称', align: 'center',width:100 },
	{ key:'sex',
		title:'性别',
		width:60,
		render:(row:any)=>{
			if (row.sex === 1){
				return '男'
			}
			if (row.sex === 2){
				return '女'
			}
			return '未知'
		}
	},
	{ key: 'sclass.name', title: '班级', align: 'center',width:200 },
	{ key: 'dept.name', title: '部门', align: 'center',width:180 },
	{ key: 'mobile', title: '手机号码', align: 'center' ,width:120},
	{
		key: 'status',
		title: '状态',
		align: 'center',
		render(row){
		return <n-switch value={row.status===0} onChange={(value:boolean) => handleStatusChange(row,value)}/>
		}
	},
	{ key:'email',title:'电子邮箱',align:'center',width:185},
	{ key: 'createTime',
	 title: '创建时间',
	 align: 'center' ,
    width: 180,
    render: (row: any) => {
      return formatDate(row.createTime);
    },

	},
	{
    key: 'action',
    title: '操作',
    align: 'center',
		width:150,
		render:(row:any)=>{
			return(
				<NSpace justify={'center'}>
						<NButton
            text
            color="#8a2be2"
            size={'small'}
            onClick={() => {
              openForm('update', row.id);
            }}
          >
            编辑
          </NButton>
					<NDropdown options={buttonOptions} onSelect={(key)=>{
						handleCommand(row,key)
						}}>
						<NButton
            text
            color="#007AFF"
            size={'small'}
          >
            更多选择
          </NButton>
					</NDropdown>
				</NSpace>
			)
		},
		fixed:'right'
	}
]

/** 获取用户列表 */
const getList = async () => {
  loading.value = true;

  // 先获取部门树
  await getTree();

  try {
    const { data } = await UserApi.getUserPage(queryParams);
    list.value = data.list;
    pagination.page = queryParams.pageNo;
    pagination.pageSize = queryParams.pageSize;
    pagination.itemCount = data.total;
    pageCount.value = Math.ceil(pagination.itemCount / pagination.pageSize);
  } finally {
    loading.value = false;
  }
};

/** 获取部门树 */
const getTree = async () => {
  const { data } = await DeptApi.fetchSimpleDeptList();
  deptList.value = [];
  // @ts-ignore
  deptList.value.push(...handleTree(data));
  console.log(deptList.value);
};

/** 处理用户状态变化 */
const handleStatusChange = async (row: any, value: boolean) => {
  const text = value ? '启用' : '停用';
  window.$dialog?.info({
    title: '提示',
    content: '您确定要' + text + '"' + row.nickname + '"用户吗?',
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: async () => {
      await UserApi.updateUserStatus(row.id, value ? 0 : 1);
      await getList();
    }
  });
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
const handleNodeClick = async  (node:any )=>{
	queryParams.deptId = node.node.data.id;
	await getList()
}

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
  queryParams.username = '';
	queryParams.nickname = '';
  queryParams.mobile = '';
  queryParams.status = null;
	queryParams.deptId = null;
  queryParams.createTime = null;
	getList();
};

/** 操作分发 */
const handleCommand = ( row: any,key: string) => {
  switch (key) {
    case 'handleDelete':
      handleDelete(row.id)
      break
    case 'handleResetPwd':
	  handleResetPwd(row)
      break
    case 'handleRole':
      handleRole(row)
      break
    default:
      break
  }
}

/** 删除按钮操作 */
const handleDelete = async (id: number) => {
  try {
    window.$dialog?.info({
      title: '提示',
      content: '您确定要删除该用户吗?',
      positiveText: '确定',
      negativeText: '取消',
      onPositiveClick: async () => {
        await UserApi.deleteUser(id);
        window.$message?.success('删除成功');
        await getList();
      }
    });
  } catch {}
};

const password = ref(''); // 存储新密码
const passwordLoading = ref(false); // 密码重置的加载状态

/** 重置密码 */
const handleResetPwd = async (row: UserApi.UserVO) => {
  try {
    window.$message?.warning("提示：您正在更改" + row.nickname + "的密码，请在文本框输入新的密码。");
    window.$dialog?.info({
      title: '系统提示',
      content: () => {
        return (
          <NInput
            loading={passwordLoading.value}
            type='password'
            onInput={handleChange}
            allow-input="noSideSpace"
            clearable
            placeholder={"请输入新密码"}>
          </NInput>
        );
      },
      positiveText: '确定',
      negativeText: '取消',
      onPositiveClick: async () => {
        passwordLoading.value = true;
        const { data } = await UserApi.resetUserPwd(row.id, password.value);
        if (data) {
          window.$message?.success('密码重置成功');
        }
        passwordLoading.value = true;
      }
    });
  } catch (error) {
    console.error('An error occurred:', error);
  }
};

const handleChange = (value: string) => {
  password.value = value; // 更新新密码
};

/** 过滤输入操作 */
const onFilterInput = () => {
  // @ts-ignore
  handleFilterByText.value = node => node.data.name.indexOf(filterText.value) >= 0;
};

/** 导出数据操作 */
const handleExport = async () => {
  try {
    window.$dialog?.info({
      title: '系统提示',
      content: '是否确认导出数据项',
      positiveText: '确定',
      negativeText: '取消',
      onPositiveClick: async () => {
        exportLoading.value = true;
        const data = await UserApi.exportUser(queryParams);
        // @ts-ignore
        download.excel(data, '用户数据.xls');
      }
    });
  } finally {
    exportLoading.value = false;
  }
};

/** 导入数据操作（待开发） */
const handleImport = () => {
  MessagePlugin.loading('导入数据功能暂未开放');
};


// =================================
const fromShow = ref(false); // 表单的显示状态
const formRef = ref<HTMLElement & FormInst>(); // 表单的引用
const formLoading = ref(false); // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref(''); // 表单的类型：create - 新增；update - 修改
const formData = ref({
  nickname: '',
  classId: '',
  deptId: '',
  mobile: '',
  email: '',
  id: undefined,
  username: '',
  password: '',
  sex: undefined,
  postIds: [],
  remark: '',
  status: 0,
  roleIds: []
}); // 表单的数据

const rules: FormRules = {
  nickname: [{ required: true, message: '用户昵称不能为空', trigger: 'blur' }],
  mobile: formRules.phone,
  email: formRules.email,
  username: formRules.username,
  password: formRules.pwd
}; // 表单的校验规则

async function openForm(type: string, id?: number) {
  fromShow.value = true; // 打开表单弹窗
  formType.value = type; // 设置表单类型

  // 如果是修改时设置数据
  if (type === 'update' && id) {
    formLoading.value = true; // 开始数据加载
    try {
      const { data } = await UserApi.getUser(id); // 获取用户数据
      if (data) {
        // @ts-ignore
        formData.value = data; // 设置表单数据
      }
    } finally {
      formLoading.value = false; // 结束数据加载
    }
  }

  // 加载班级列表
  const { data } = await ClassApi.fetchSimpleClassList();
  // @ts-ignore
  classList.value = data;

  // 加载岗位列表
  const res = await PostApi.getSimplePostList();
  // @ts-ignore
  postList.value = res.data;
}


// 提交表单
async function submitFrom() {
  if (!formRef.value) return;
  // 校验表单，验证不通过不会执行后续
  await formRef.value?.validate();
  // 提交表单
  formLoading.value = true;
  try {
    // 从表单中获取数据并转换为接口需要的数据格式
    const param = formData.value as unknown as UserApi.UserVO;
    if (formType.value === 'create') {
      await UserApi.createUser(param);
      window.$message?.success('添加成功');
      // 关闭弹窗并刷新列表
      close();
      await getList();
    } else if (formType.value === 'update') {
      const { data } = await UserApi.updateUser(param);
      if (data === true) {
        window.$message?.success('修改成功');
        // 关闭弹窗并刷新列表
        close();
        await getList();
      }
    }
  } finally {
    formLoading.value = false;
  }
}

// 关闭表单弹窗
function close() {
  fromShow.value = false; // 关闭表单弹窗
  formData.value = {
    nickname: '',
    classId: '',
    deptId: '',
    mobile: '',
    email: '',
    id: undefined,
    username: '',
    password: '',
    sex: undefined,
    postIds: [],
    remark: '',
    status: 0,
    roleIds: []
  }; // 重置表单数据
}


// 声明表单引用
const formRoleRef = ref(); // 表单 Ref

// 角色分配弹窗的显示状态
const fromRoleShow = ref(false);

// 角色列表
const roleList = ref([]);

// 角色分配表单数据
const formRoleData = ref({
  id: undefined, // 用户ID
  nickname: '', // 用户昵称
  username: '', // 用户名
  roleIds: [] // 角色ID数组
});

// 处理角色分配操作
const handleRole = async (row: any) => {
  fromRoleShow.value = true; // 打开角色分配弹窗
  formRoleData.value.id = row.id; // 设置用户ID
  formRoleData.value.username = row.username; // 设置用户名
  formRoleData.value.nickname = row.nickname; // 设置用户昵称
  formLoading.value = true; // 开始加载数据
  try {
    const { data } = await PermissionApi.getUserRoleList(row.id); // 调用接口获取用户拥有的角色数组
    // @ts-ignore
    formRoleData.value.roleIds = data; // 设置角色分配表单的角色ID数组
  } finally {
    formLoading.value = false; // 结束加载数据
  }
  // 获取角色列表
  const res = await RoleApi.fetchSimpleRoleList(); // 调用接口获取角色列表
  // @ts-ignore
  roleList.value = res.data; // 设置角色列表数据
}

// 提交角色分配表单
const submitRole = async () => {
  if (!formRoleRef.value) return; // 如果角色分配表单引用不存在，直接返回
  formLoading.value = true; // 开始提交，设置加载状态为 true
  try {
    const { data } = await PermissionApi.assignUserRole({
			// @ts-ignore
      userId: formRoleData.value.id, // 获取角色分配表单中的用户ID
      roleIds: formRoleData.value.roleIds // 获取角色分配表单中的角色ID数组
    });

    if (data) {
      window.$message?.info('更新成功'); // 显示更新成功的提示信息
    }
    closeRole(); // 关闭角色分配弹窗
    await getList(); // 更新列表数据
  } finally {
    formLoading.value = false; // 结束提交，设置加载状态为 false
  }
}

// 关闭角色分配弹窗
const closeRole = () => {
  fromRoleShow.value = false; // 将角色分配弹窗的显示状态设置为 false
  formRoleData.value = {
    id: undefined,
    nickname: '',
    username: '',
    roleIds: []
  }; // 重置角色分配表单的数据
}

// 在组件挂载时获取列表数据和租户套餐列表
onMounted(async () => {
  await getList(); // 获取列表数据
});



</script>
