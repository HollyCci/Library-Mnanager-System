<template>
  <n-space :vertical="true" :size="16">
    <n-card :bordered="false" class="h-full rounded-8px shadow-sm" hoverable>
      <!-- 搜索表单 -->
      <n-form
        ref="queryFormRef"
        :inline="true"
        :model="queryParams"
        class="-mb-15px"
        label-width="68px"
        label-placement="left"
      >
        <n-form-item label="角色名称" path="name">
          <n-input
            v-model:value="queryParams.name"
            class="!w-240px"
            clearable
            placeholder="角色名称"
            @keyup.enter="handleQuery"
          />
        </n-form-item>
        <n-form-item label="角色标识" path="code">
          <n-input
            v-model:value="queryParams.code"
            class="!w-240px"
            clearable
            placeholder="请输入角色标识"
            @keyup.enter="handleQuery"
          />
        </n-form-item>
        <n-form-item label="状态" path="status">
          <n-select
            v-model:value="queryParams.status"
            class="!w-240px"
            clearable
            placeholder="请选择状态"
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
      </n-space>
    </n-card>

    <n-card :bordered="false" class="h-full rounded-8px shadow-sm" hoverable>
      <n-data-table :loading="loading" remote :data="list" :columns="columns" :pagination="pagination" />
      <template #header-extra><icon-line-md:close class="text-20px" @click="close" /></template>
    </n-card>

    <n-modal v-model:show="fromShow" transform-origin="center">
      <n-card style="width: 600px" title="角色信息" :bordered="false" size="huge" role="dialog" aria-modal="true">
        <!-- 角色信息编辑表单 -->
        <n-form
          ref="formRef"
          v-loading="formLoading"
          :rules="rules"
          :model="formData"
          label-placement="left"
          label-width="93px"
        >
          <!-- 角色名称输入框 -->
          <n-form-item label="角色名称" path="name" required>
            <n-input v-model:value="formData.name" placeholder="请输入角色名称" style="width: 50%" />
          </n-form-item>
          <n-form-item label="角色标识" path="code" required>
            <n-input v-model:value="formData.code" placeholder="请输入角色标识" style="width: 50%" />
          </n-form-item>
          <n-form-item label="显示排序" path="sort" required>
            <n-input-number v-model:value="formData.sort" placeholder="请输入显示排序" style="width: 50%" min="0" />
          </n-form-item>
          <n-form-item label="借阅额度" path="borrowCount" required>
            <n-input-number
              v-model:value="formData.borrowCount"
              placeholder="请输入借阅额度"
              style="width: 50%"
              min="0"
            />
          </n-form-item>
          <n-form-item label="角色状态" path="status" required>
            <n-select
              v-model:value="formData.status"
              :options="DictOptions"
              placeholder="请选择状态"
              style="width: 50%"
            ></n-select>
          </n-form-item>
          <n-form-item label="备注" path="remark">
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

    <n-modal v-model:show="fromShowAssignMenu" transform-origin="center" :mask-closable="false">
      <n-card style="width: 600px" title="菜单权限" :bordered="false" size="huge" role="dialog" aria-modal="true">
        <n-form
          ref="formRoleDataRef"
          v-loading="formLoading"
          :rules="rules"
          :model="formRoleData"
          label-placement="left"
          label-width="93px"
        >
          <n-form-item label="角色名称">
            <n-input v-model:value="formRoleData.name" disabled round style="width: 50%" />
          </n-form-item>
          <n-form-item label="角色标识">
            <n-input v-model:value="formRoleData.code" disabled round style="width: 50%" />
          </n-form-item>
          <n-form-item label="菜单权限">
            <n-card>
              <template #header>
                <n-space>
                  <n-switch class="text-14px" @update:value="handleExpand">
                    <template #checked>折叠</template>
                    <template #unchecked>展开</template>
                  </n-switch>
                  <n-switch class="text-14px" @update:value="handleCheck">
                    <template #checked>全不选</template>
                    <template #unchecked>全选</template>
                  </n-switch>
                </n-space>
              </template>

              <t-tree
                ref="treeRef"
                v-model="formRoleData.menuIds"
                v-model:expanded="menuExpand"
                hover
                value-mode="all"
                :keys="treeProps"
                :data="menuOptions"
                checkable
              />
            </n-card>
          </n-form-item>
        </n-form>
        <template #footer>
          <n-space style="float: right">
            <n-button type="primary" @click="submitRoleDataFrom">确 定</n-button>
            <n-button @click="closeRoleDataForm">取 消</n-button>
          </n-space>
        </template>
      </n-card>
    </n-modal>
    <n-modal v-model:show="fromShowPermissionMenu" transform-origin="center">
      <n-card style="width: 600px" title="数据权限" :bordered="false" size="huge" role="dialog" aria-modal="true">
        <n-form ref="formPerRef" v-loading="formLoading" :model="formPerData" label-placement="left" label-width="93px">
          <n-form-item label="角色名称">
            <n-tag type="info" round>{{ formPerData.name }}</n-tag>
          </n-form-item>
          <n-form-item label="角色标识">
            <n-tag type="info" round>{{ formPerData.code }}</n-tag>
          </n-form-item>
          <n-form-item label="权限范围">
            <n-select v-model:value="formPerData.dataScope" :options="DataScopeDict"></n-select>
          </n-form-item>
          <n-form-item v-if="formPerData.dataScope === 2">
            <n-card>
              <template #header>
                <n-space>
                  <n-switch class="text-14px" @update:value="handleExpandPer">
                    <template #checked>折叠</template>
                    <template #unchecked>展开</template>
                  </n-switch>
                  <n-switch class="text-14px" @update:value="handleCheckPer">
                    <template #checked>全不选</template>
                    <template #unchecked>全选</template>
                  </n-switch>
                  <n-popover trigger="hover">
                    <template #trigger>
                      <n-switch v-model:value="checkStrictly" class="text-14px">
                        <template #checked>关闭父子联动</template>
                        <template #unchecked>开启父子联动</template>
                      </n-switch>
                    </template>
                    <span>父子联动:选中父节点，自动选择子节点</span>
                  </n-popover>
                </n-space>
              </template>
              <t-tree
                ref="formPerRef"
                v-model="formPerData.dataScopeDeptIds"
                v-model:expanded="perExpand"
                :check-strictly="checkStrictly"
                hover
                :keys="treeProps"
                :data="deptOptions"
                checkable
              />
            </n-card>
          </n-form-item>
        </n-form>
        <template #footer>
          <n-space style="float: right">
            <n-button type="primary" @click="submitRolePerFrom">确 定</n-button>
            <n-button @click="closeRolePerForm">取 消</n-button>
          </n-space>
        </template>
      </n-card>
    </n-modal>
  </n-space>
</template>
<script setup lang="tsx">
/* eslint-disable */
// 声明组件名称
defineOptions({ name: 'MainPart' });
// 引入需要的 Vue 3 模块和组件
import { reactive, ref, onMounted } from 'vue';
import { NSpace, NButton, NPopconfirm, NTag } from 'naive-ui';
import type { DataTableColumns, FormRules, FormInst } from 'naive-ui';
import { formatDate } from '@/utils/common/formatTime';
import { handleTree } from '@/utils/common/tree';
import * as RoleApi from '@/service/api/role';
import * as MenuApi from '@/service/api/menu';
import * as DeptApi from '@/service/api/dept'
import * as PermissionApi from '@/service/api/permission'
import download from '@/utils/common/download';

const loading = ref(true) // 列表的加载中
const list = ref([]) // 列表的数据
const pageCount = ref(0);
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  code: '',
  name: '',
	status: null,
	createTime: null
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中
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
// 定义列表的数据行
type RowData = {
	id:number;
	code:string;
	createTime:number;
	name:string;
	remark:string;
	sort:number;
	borrowCount:number;
	status:number;
	tenantId:number;
	type:number
}

// 获取列表数据并更新分页信息
const getList = async () => {
  loading.value = true;
  try {
    const { data } = await RoleApi.fetchRolePage(queryParams);
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

const columns: DataTableColumns<RowData> = [
	{ key: 'id', title: '角色编号', align: 'center' },
  { key: 'name', title: '角色名称', align: 'center' },
	{ key: 'type', title: '角色类型', align: 'center' },
	{ key: 'code', title: '角色标识', align: 'center',render(row){
	return <NTag type='primary'>{row.code}</NTag>
	}},
	{ key: 'sort', title: '显示顺序', align: 'center' },
	{ key: 'borrowCount',
		title:"借阅额度",
		align: 'center',
		render(row){
			return <NTag type='primary'>{row.borrowCount}</NTag>
		}
	},
	{ key: 'remark', title: '备注', align: 'center' },
	{
		key: 'status',
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
    },
	},
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
    key: 'action',
    title: '操作',
    align: 'center',
    minWidth: 110,
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
            编辑
          </NButton>
					<NButton
            text
            color="#007AFF"
            size={'small'}
            onClick={() => {
              openAssignMenuForm(row);
            }}
          >
            菜单权限
          </NButton>
					<NButton
            text
            color="#007AFF"
            size={'small'}
            onClick={() => {
							openDataPermissionForm(row);
            }}
          >
            数据权限
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
]
/** 搜索按钮操作 */
const handleQuery = () => {
  if (queryParams.createTime) {
    // @ts-ignore ts推断不出来
    queryParams.createTime = queryParams.createTime.map(item => formatDate(item));
  }
  queryParams.pageNo = 1;
  getList();
};

/** 重置按钮操作 */
const resetQuery = () => {
  queryParams.pageNo = 1;
  queryParams.name = '';
  queryParams.code = '';
  queryParams.status = null;
  queryParams.createTime = null;
  getList();
};

// 删除按钮操作
const handleDelete = async (id: number) => {
  try {
    window.$dialog?.info({
      title: '系统提示',
      content: '是否确认删除数据项',
      positiveText: '确定',
      negativeText: '取消',
      onPositiveClick: async () => {
        await RoleApi.deleteRole(id);
        await getList();
        window.$message?.success('删除成功');
      }
    });
  } catch (error) {
    console.log(error);
  }
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
        const data = await  RoleApi.exportRole(queryParams)
        // @ts-ignore
        download.excel(data, '角色列表.xls');
      }
    });
  } finally {
    exportLoading.value = false
  }
}

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



const fromShow = ref(false); // 表单的显示状态
const formRef = ref<HTMLElement & FormInst>(); // 表单的引用
const formLoading = ref(false); // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref(''); // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  name: '',
  code: '',
  sort: null,
  status: 0,
	borrowCount:null,
  remark: ''
})


const rules: FormRules = {
	name: [{ required: true, message: '请输入角色名称', trigger: 'input' }],
	code: [{ required: true, message: '请输入角色标识', trigger: 'input' }],
	sort: [{ required: true,type:"number" ,message: '请输入显示顺序', trigger: 'change' }],
}

async function openForm(type: string, id?: number) {
	fromShow.value = true;
  formType.value = type;

  // 如果是修改时设置数据
  if (type === 'update' && id) {
    formLoading.value = true;
    try {
      const { data } = await RoleApi.fetchRole(id);
      if (data) {
        /* eslint-disable */
      // @ts-ignore
      formData.value = data;
    }
		}finally{
			formLoading.value = false;
		}
  }
}

async function submitFrom(){
	if (!formRef.value) return;
  // 校验表单，验证不通过不会执行后续
  await formRef.value?.validate();
	try{
		const param = formData.value as unknown as RoleApi.RoleVO
		if(formType.value === 'create'){
			await RoleApi.createRole(param);
			window.$message?.success('添加成功');
		}else if (formType.value === 'update') {
      const { data } = await RoleApi.updateRole(param);
      if (data === true) {
        window.$message?.success('修改成功');
      }
    }
	}finally{
		formLoading.value = false;
		close();
    await getList();
	}
}

// 关闭弹窗
function close(){
	fromShow.value = false;
	formData.value={
		id: undefined,
		borrowCount:null,
		name: '',
  	code: '',
 	  sort: null,
  	status: 0,
 	  remark: ''
	}
}

const menuOptions = ref<any[]>([]) // 菜单树形结构
const treeRef = ref() // 菜单树组件 Ref
const formRoleDataRef = ref<HTMLElement & FormInst>(); // 表单的引用
const menuExpand = ref([]) // 展开/折叠
const fromShowAssignMenu = ref(false) // 菜单权限弹窗
const formRoleData = ref({
  id: 0,
  name: '',
  code: '',
  menuIds: []
})
const  treeProps  = {
	value:'id',
	label:'name',
	children:'children'
}

async function openAssignMenuForm (row:  RoleApi.RoleVO){
	fromShowAssignMenu.value = true;
	const {data} = await MenuApi.getSimpleMenusList()
	// @ts-ignore
	menuOptions.value = handleTree(data)
	formRoleData.value.id = row.id
	formRoleData.value.name = row.name
	formRoleData.value.code = row.code
	formLoading.value = true
	try{
		const {data} = await PermissionApi.getRoleMenuList(row.id)
		// @ts-ignore
		formRoleData.value.menuIds = data
	}finally{
			formLoading.value = false

		}
}

async function submitRoleDataFrom() {
  if (!formRoleDataRef.value) return;
	formLoading.value = true;
	try{
		const data = {
			roleId: formRoleData.value.id,
			menuIds:[
          ...formRoleData.value.menuIds
			]
		}
		await PermissionApi.assignRoleMenu(data)
		window.$message?.success('修改成功');
		closeRoleDataForm()
	}finally{
		formLoading.value = false;
	}
}

function closeRoleDataForm(){
	fromShowAssignMenu.value = false;
	formRoleData.value = {
		id: 0,
		name: '',
		code: '',
		menuIds: []
	}
  menuExpand.value=[]
}

function handleExpand(value:boolean){
	const idArray  = treeRef.value.getItems().map((item:any)=>item.value);
	menuExpand.value = value ? idArray : [];
}

function handleCheck(value:boolean){
	const idArray = treeRef.value.getItems().map((item:any)=>item.value)
	formRoleData.value.menuIds=	value ? idArray:[]
}



// ===================================
const fromShowPermissionMenu = ref(false)
const formPerRef = ref() // 表单 Ref
const deptOptions = ref<any[]>([]) // 部门树形结构
const checkStrictly = ref(true) // 是否严格模式，即父子不关联
const perExpand = ref([])
const formPerData = reactive({
  id: 0,
  name: '',
  code: '',
  dataScope: undefined,
  dataScopeDeptIds: []
})
const DataScopeDict = [
  {
    label:'全部数据权限',
    value:1
  },
  {
    label:'指定部门数据权限',
    value:2
  },
  {
    label:'本部门数据权限',
    value:3
  }
  ,
  {
    label:'本部门及以下数据权限',
    value:4
  },
  {
    label:'仅本人数据权限',
    value:5
  }
]


async function openDataPermissionForm(row: RoleApi.RoleVO){
  fromShowPermissionMenu.value = true
	const {data} = await DeptApi.fetchSimpleDeptList();
	// @ts-ignore
	deptOptions.value = handleTree(data);
	console.log(deptOptions.value);
		// @ts-ignore
	formPerData.dataScope = row.dataScope;
		// @ts-ignore
	formPerData.dataScopeDeptIds = row.dataScopeDeptIds;
	formPerData.id = row.id
  formPerData.name = row.name
  formPerData.code = row.code
}

function handleExpandPer(value:boolean){
	const idArray = formPerRef.value.getItems().map((item:any)=>item.value);
	perExpand.value = value ? idArray : [];
}

function handleCheckPer(value:boolean){
	const idArray = formPerRef.value.getItems().map((item:any)=>item.value)
	formPerData.dataScopeDeptIds = value ? idArray : []
}

async function submitRolePerFrom(){
	formLoading.value = true;
	try{
		const data={
			roleId:	formPerData.id,
			dataScope:formPerData.dataScope,
			dataScopeDeptIds:
			formPerData.dataScope !== 2
			? []
			: formPerData.dataScopeDeptIds
		}
			// @ts-ignore
		await PermissionApi.assignRoleDataScope(data)
		window.$message?.success('更新成功')
		closeRolePerForm()
	}finally{
		formLoading.value=false
	}
}

function closeRolePerForm(){
	fromShowPermissionMenu.value=false
	formPerData.id=0
	formPerData.dataScope=undefined
	formPerData.code=''
	formPerData.name=''
	formPerData.dataScopeDeptIds=[]

}
// 在组件挂载时获取列表数据和租户套餐列表
onMounted(async () => {
  await getList();
});



</script>
