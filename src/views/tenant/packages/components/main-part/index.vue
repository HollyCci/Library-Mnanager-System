<template>
  <!-- 搜索表单及操作按钮区域 -->
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
        <!-- 租户名称搜索框 -->
        <n-form-item label="套餐名" path="name">
          <n-input
            v-model:value="queryParams.name"
            class="!w-240px"
            clearable
            placeholder="请输入套餐名"
            @keyup.enter="handleQuery"
          />
        </n-form-item>
        <!-- 租户状态搜索框 -->
        <n-form-item label="套餐状态" path="status">
          <n-select
            v-model:value="queryParams.status"
            class="!w-240px"
            clearable
            placeholder="请选择套餐状态"
            :options="DictOptions"
          />
        </n-form-item>
        <!-- 租户创建时间搜索框 -->
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
        <n-form-item>
          <!-- 搜索按钮 -->
          <n-button class="mr3" @click="handleQuery">
            <template #icon>
              <icon-uil-search class="text-20px" />
            </template>
            搜索
          </n-button>
          <!-- 重置按钮 -->
          <n-button class="mr3" @click="resetQuery">
            <template #icon>
              <icon-iconamoon:restart-bold class="text-20px" />
            </template>
            重置
          </n-button>
          <!-- 新增按钮 -->
          <n-button class="mr3" plain type="primary" @click="openForm('create')">
            <template #icon>
              <icon-fluent:add-12-regular class="text-20px" />
            </template>
            新增
          </n-button>
        </n-form-item>
      </n-form>
    </n-card>

    <n-card :bordered="false" class="h-full rounded-8px shadow-sm" hoverable>
      <n-data-table remote :loading="loading" :data="list" :columns="columns" :pagination="pagination" />
      <template #header-extra><icon-line-md:close class="text-20px" @click="close" /></template>
    </n-card>

    <!-- 套餐信息编辑弹窗 -->
    <n-modal v-model:show="fromShow" transform-origin="center">
      <n-card style="width: 600px" title="套餐信息" :bordered="false" size="huge" role="dialog" aria-modal="true">
        <!-- 租户信息编辑表单 -->
        <n-form
          ref="formRef"
          v-loading="formLoading"
          :model="formData"
          label-placement="left"
          label-width="93px"
          :rules="rules"
        >
          <!-- 租户名称输入框 -->
          <n-form-item label="租户名称" path="name" required>
            <n-input v-model:value="formData.name" placeholder="请输入套餐名称" style="width: 80%" />
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
                v-model="formData.menuIds"
                v-model:expanded="menuExpand"
                hover
                value-mode="all"
                :keys="treeProps"
                :data="menuOptions"
                checkable
              />
            </n-card>
          </n-form-item>
          <!-- 租户状态单选按钮组 -->
          <n-form-item label="租户状态" path="status" required>
            <n-radio-group v-model:value="formData.status">
              <n-radio v-for="item in DictOptions" :key="item.value" :value="item.value">{{ item.label }}</n-radio>
            </n-radio-group>
          </n-form-item>
        </n-form>
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
<script setup lang="tsx">
/* eslint-disable */
// 声明组件名称
defineOptions({ name: 'MainPart' });
// 引入需要的 Vue 3 模块和组件
import { reactive, ref, onMounted } from 'vue';
import { NSpace, NButton, NPopconfirm, NTag } from 'naive-ui';
import type { DataTableColumns, FormRules, FormInst } from 'naive-ui';
import { handleTree } from '@/utils/common/tree';
import * as MenuApi from '@/service/api/menu';
import * as TenantPackageApi from '@/service/api/tenantPackage';
import { formatDate } from '@/utils/common/formatTime';

const loading = ref(false); // 列表的加载中
const list = ref([]); // 列表的数据
const pageCount = ref(0);
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

// 定义搜索表单的参数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  name: '',
  remark: '',
  status: null,
  createTime: null
});

// 获取列表数据并更新分页信息
const getList = async () => {
  loading.value = true;
  try {
    const { data } = await TenantPackageApi.fetchTenantPackagePage(queryParams);
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

const queryFormRef = ref(); // 搜索的表单

// 定义列表的数据行
type RowData = {
  id: number;
  name: string;
  remark: string;
  menuIds: Array<number>;
  status: number;
  createTime: number;
};

// 定义列表的数据列
const columns: DataTableColumns<RowData> = [
  { key: 'id', title: '套餐编号', align: 'center' },
  { key: 'name', title: '套餐名称', align: 'center' },
  {
    key: 'status',
    title: '套餐状态',
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
            修改
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
        await TenantPackageApi.deleteTenantPackage(id);
        await getList();
        window.$message?.success('删除成功');
      }
    });
  } catch (error) {
    console.log(error);
  }
};

// ------------------------------添加/更新套餐信息--------------------------------
const fromShow = ref(false); // 表单的显示状态
const treeRef = ref(); // 菜单树组件 Ref
const menuExpand = ref([]); // 展开/折叠
const formRef = ref<HTMLElement & FormInst>(); // 表单的引用
const formLoading = ref(false); // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref(''); // 表单的类型：create - 新增；update - 修改
const menuOptions = ref<any[]>([]); // 部门树形结构
// 表单的数据
const formData = ref({
  id: undefined,
  name: undefined,
  remark: undefined,
  menuIds: [],
  status: 0
});
// 表单的校验规则
const rules: FormRules = {
  name: [{ required: true, message: '套餐名称不能为空', trigger: 'input' }]
};
const treeProps = {
  value: 'id',
  label: 'name',
  children: 'children'
};

// 菜单展开事件处理
function handleExpand(value: boolean) {
  const idArray = treeRef.value.getItems().map((item: any) => item.value);
  menuExpand.value = value ? idArray : [];
}

// 菜单全选事件处理
function handleCheck(value: boolean) {
  const idArray = treeRef.value.getItems().map((item: any) => item.value);
  formData.value.menuIds = value ? idArray : [];
}

// 打开弹窗
async function openForm(type: string, id?: number) {
  fromShow.value = true;
  formType.value = type;
  const { data } = await MenuApi.getSimpleMenusList();
  // @ts-ignore
  menuOptions.value = handleTree(data);
  // 如果是修改时设置数据
  if (type === 'update' && id) {
    formLoading.value = true;
    try {
      const { data } = await TenantPackageApi.fetchTenantPackage(id);
      if (data) {
        /* eslint-disable */
      // @ts-ignore
      formData.value = data;
    }
		}finally{
			formLoading.value = false;
		}
		// 加载套餐列表
		const {data} =  await TenantPackageApi.fetchTenantPackageList();
	if(data){
		 // @ts-ignore
		packageList.value = data
	}
  }

}

// 提交表单
async function submitFrom(){
	if (!formRef.value) return;
  // 校验表单，验证不通过不会执行后续
  await formRef.value?.validate();
	try{
		const param = formData.value as unknown as TenantPackageApi.TenantPackageVO
		console.log(param);
		if(formType.value === 'create'){
			await TenantPackageApi.createTenantPackage(param);
			window.$message?.success('添加成功');
      // 关闭弹窗并刷新列表
      close();
      await getList();
		}else if (formType.value === 'update') {
      const { data } = await TenantPackageApi.updateTenantPackage(param);
      if (data === true) {
        window.$message?.success('修改成功');
        // 关闭弹窗并刷新列表
        close();
        await getList();
      }
    }
	}finally{
		formLoading.value = false;
	}
}

// 关闭弹窗
function close(){
	fromShow.value = false;
	formData.value={
		id: undefined,
		name: undefined,
		remark:undefined,
		menuIds:[],
		status:0
	}
}

// 在组件挂载时获取列表数据和租户套餐列表
onMounted(async () => {
  await getList();
});



</script>
