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
        <!-- 分类名称搜索框 -->
        <n-form-item label="分类名称" path="name">
          <n-input
            v-model:value="queryParams.name"
            class="!w-240px"
            clearable
            placeholder="请输入分类名称"
            @clear="resetQuery"
            @keyup.enter="handleQuery"
          />
        </n-form-item>
        <!-- 状态下拉选择框 -->
        <n-form-item label="状态" path="status">
          <n-select
            v-model:value="queryParams.status"
            class="!w-240px"
            clearable
            placeholder="请选择分类状态"
            :options="DictOptions"
          />
        </n-form-item>
        <!-- 操作按钮区域 -->
        <n-form-item>
          <n-space>
            <!-- 搜索按钮 -->
            <n-button @click="handleQuery">
              <template #icon>
                <icon-uil-search class="text-20px" />
              </template>
              搜索
            </n-button>
            <!-- 重置按钮 -->
            <n-button @click="resetQuery">
              <template #icon>
                <icon-iconamoon:restart-bold class="text-20px" />
              </template>
              重置
            </n-button>
            <!-- 新增按钮 -->
            <n-button plain type="primary" @click="openForm('create')">
              <template #icon>
                <icon-fluent:add-12-regular class="text-20px" />
              </template>
              新增
            </n-button>
            <!-- 展开/折叠按钮 -->
            <n-button plain type="error" @click="toggleExpandAll">
              <template #icon>
                <icon-ep:sort class="text-20px" />
              </template>
              展开/折叠
            </n-button>
          </n-space>
        </n-form-item>
      </n-form>
    </n-card>

    <!-- 数据表格区域 -->
    <n-card :bordered="false" class="h-full rounded-8px shadow-sm" hoverable>
      <n-data-table
        v-if="refreshTable"
        :loading="loading"
        :row-key="rowKey"
        :columns="columns"
        :default-expanded-row-keys="[1]"
        children-key="children"
        :data="list"
        :max-height="650"
        :default-expand-all="isExpandAll"
      ></n-data-table>
    </n-card>

    <!-- 新增/修改弹窗 -->
    <n-modal v-model:show="fromShow" transform-origin="center">
      <n-card style="width: 600px" title="分类信息" :bordered="false" size="huge" role="dialog" aria-modal="true">
        <template #header-extra><icon-line-md:close class="text-20px" @click="close" /></template>

        <n-form
          ref="formRef"
          v-loading="formLoading"
          :rules="rules"
          :model="fromData"
          label-placement="left"
          label-width="80px"
        >
          <!-- 上级分类选择 -->
          <n-form-item label="上级分类" path="parentId">
            <n-tree-select
              v-model:value="fromData.parentId"
              :options="deptTree"
              label-field="name"
              key-field="id"
              children-field="children"
              clearable
              style="width: 50%"
              placeholder="请选择上级分类"
              default-expand-all
            ></n-tree-select>
          </n-form-item>
          <!-- 分类名称输入框 -->
          <n-form-item label="分类名称" path="name">
            <n-input v-model:value="fromData.name" placeholder="请输入分类名称" />
          </n-form-item>
          <!-- 显示排序输入框 -->
          <n-form-item label="显示排序" path="sort">
            <n-input-number v-model:value="fromData.sort" min="0" placeholder="请输入排序" />
          </n-form-item>
          <!-- 分类状态选择 -->
          <n-form-item label="分类状态" path="status" style="width: 50%">
            <n-select v-model:value="fromData.status" clearable placeholder="请选择分类状态" :options="DictOptions" />
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
import { reactive, ref, onBeforeMount, nextTick } from 'vue';
import { NSpace, NButton, NPopconfirm, NTag, NAvatar } from 'naive-ui';
import type { DataTableColumns, FormRules, FormInst } from 'naive-ui';
// 引入其他自定义的工具函数、API等
import { handleTree } from '@/utils/common/tree';
import * as CategoryApi from '@/service/api/category';
import { formatDate } from '@/utils/common/formatTime';
import { formRules } from '~/src/utils';

// 定义分类树形数据列表使用的数据类型
type RowData = {
  id: number;
  name: string;
  parentId: number;
  sort: number;
	picUrl:string;
	status:number;
  createTime: number;
  children?: RowData[];
};

// 定义分类树形数据列表使用的响应式变量
const loading = ref(true); // 列表的加载中
const list = ref<CategoryApi.CategoryVO[]>([]); // 列表的数据
const queryFormRef = ref(); // 搜索的表单
const isExpandAll = ref(true); // 是否展开，默认全部展开
const refreshTable = ref(true); // 重新渲染表格状态
const rowKey = (row: any) => row.id;
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

// 定义搜索表单的响应式变量
const queryParams = reactive({
  title: '',
  name: null,
  status: null,
  pageNo: 1,
  pageSize: 100
});

// 定义表格的列及其渲染函数
const columns: DataTableColumns<RowData> = [
  { key: 'id', title: '分类ID' },
  { key: 'name', title: '分类名称' },
	{
		key:'picUrl',title:'分类封面图',
		render(row){
			return<NAvatar src={row.picUrl?row.picUrl:'https://tdesign.gtimg.com/site/avatar.jpg'}></NAvatar>
		}
	},
  { key: 'sort', title: '排序' },
  {
    key: 'status',
    title: '状态',
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
    render: (row: any) => {
      return formatDate(row.createTime);
    }
  },
  {
    key: 'action',
    title: '操作',
    align: 'center',
    render: (row: any) => {
      return (
        <NSpace justify={'center'}>
          <NButton
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
              trigger: () => <NButton size={'small'}>删除</NButton>
            }}
          </NPopconfirm>
        </NSpace>
      );
    }
  }
];

// 获取分类列表
const getList = async () => {
  loading.value = true;
  try {
    const res = await CategoryApi.fetchCategoryPage(queryParams);
    const categoryData = res.data;
    if (categoryData !== null) {
      // @ts-ignore
      list.value = handleTree(categoryData);
    }
  } finally {
    loading.value = false;
  }
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
  }, 300); // 延迟一下，不然数据多的话会有卡顿，影响体验
};

// 搜索按钮操作
function handleQuery() {
  getList();
}

// 重置按钮操作
function resetQuery() {
  queryParams.pageNo = 1;
  queryParams.name = null;
  queryParams.status = null;
  handleQuery();
}
// 删除分类
async function handleDelete(id: number) {
  try {
    // 发起删除
    await CategoryApi.deleteCategory(id);
    window.$message?.success('删除成功');
    // 刷新列表
    await getList();
  } catch {
  } finally {
    // 刷新列表
    await getList();
  }
}

// -----------------------------------------------------------------------------------
// 用于新增/修改弹窗的响应式变量
const fromShow = ref(false); // 表单的显示状态
const formLoading = ref(false); // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref(''); // 表单的类型：create - 新增；update - 修改
const deptTree = ref(); // 树形结构
const formRef = ref<HTMLElement & FormInst>(); // 表单的引用
const fromData = ref({
  // 分类新增/修改中表单的数据
  id: undefined,
  parentId: undefined,
  name: undefined,
  sort: undefined,
  status: 0
});
// 表单的校验规则
const rules: FormRules = {
  parentId: [
    {
      type: 'number',
      required: true,
      trigger: ['blur', 'change'],
      message: '请选择上级分类'
    }
  ],
  sort: formRules.sort,
  name: [{ required: true, trigger: ['blur', 'input'], message: '请输入分类名称' }],
  status: formRules.status
};

// 打开弹窗
async function openForm(type: string, id?: number) {
  fromShow.value = true;
  formType.value = type;

  // 如果是修改时设置数据
  if (type === 'update' && id) {
    formLoading.value = true;
    const { error, data } = await CategoryApi.fetchCategory(id);
    if (error) {
      window.$message?.error(error.msg);
    }
    if (data) {
      /* eslint-disable */
      // @ts-ignore
      fromData.value = data;
    }
    formLoading.value = false;
  }

  // 获取分类列表
  await getTree();
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
    const param = fromData.value as unknown as CategoryApi.CategoryVO;
    if (formType.value === 'create') {
      await CategoryApi.createCategory(param);
      window.$message?.success('添加成功');
      // 关闭弹窗并刷新列表
      close();
      await getList();
    } else if (formType.value === 'update') {
      const { data } = await CategoryApi.updateCategory(param);
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

// 关闭弹窗
function close() {
  fromShow.value = false;
  fromData.value = {
    id: undefined,
    parentId: undefined,
    name: undefined,
    sort: undefined,
    status: 0
  };
}

// 获取分类数据并处理成树形结构
async function getTree() {
  deptTree.value = [];
  const { error, data } = await CategoryApi.fetchSimpleCategoryList();

  // 如果发生错误，就没有必要继续执行了
  if (error) {
    window.$message?.error(error.msg);
    return;
  }

	deptTree.value.push(...handleTree(data))
}


onBeforeMount(async () => {
  getList();
	toggleExpandAll()
});
</script>
