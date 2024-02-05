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
        <!-- 部门名称搜索框 -->
        <n-form-item label="部门名称" path="name">
          <n-input
            v-model:value="queryParams.name"
            class="!w-240px"
            clearable
            placeholder="请输入部门名称"
            @keyup.enter="handleQuery"
          />
        </n-form-item>
        <!-- 状态下拉选择框 -->
        <n-form-item label="状态" path="status">
          <n-select
            v-model:value="queryParams.status"
            class="!w-240px"
            clearable
            placeholder="请选择部门状态"
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
        :columns="columns"
        :data="list"
        :default-expand-all="isExpandAll"
      ></n-data-table>
    </n-card>

    <!-- 新增/修改弹窗 -->
    <n-modal v-model:show="fromShow" transform-origin="center">
      <n-card style="width: 600px" title="部门信息" :bordered="false" size="huge" role="dialog" aria-modal="true">
        <template #header-extra><icon-line-md:close class="text-20px" @click="close" /></template>

        <n-form
          ref="formRef"
          v-loading="formLoading"
          :rules="rules"
          :model="fromData"
          label-placement="left"
          label-width="80px"
        >
          <!-- 上级部门选择 -->
          <n-form-item label="上级部门" path="parentId">
            <n-tree-select
              v-model:value="fromData.parentId"
              :options="deptTree"
              label-field="name"
              key-field="id"
              children-field="children"
              clearable
              style="width: 50%"
              placeholder="请选择上级部门"
              default-expand-all
            ></n-tree-select>
          </n-form-item>
          <!-- 部门名称输入框 -->
          <n-form-item label="部门名称" path="name">
            <n-input v-model:value="fromData.name" placeholder="请输入部门名称" />
          </n-form-item>
          <!-- 显示排序输入框 -->
          <n-form-item label="显示排序" path="sort">
            <n-input-number v-model:value="fromData.sort" min="0" placeholder="请输入排序" />
          </n-form-item>
          <!-- 负责人选择 -->
          <n-form-item label="负责人" path="leaderUserId" style="width: 50%">
            <n-select
              v-model:value="fromData.leaderUserId"
              clearable
              placeholder="请选择负责人"
              :options="userList"
              label-field="nickname"
              value-field="id"
              key-field="id"
            />
          </n-form-item>
          <!-- 联系电话输入框 -->
          <n-form-item label="联系电话" path="phone">
            <n-input v-model:value="fromData.phone" maxlength="11" placeholder="请输入联系电话" />
          </n-form-item>
          <!-- 邮箱输入框 -->
          <n-form-item label="邮箱" path="email">
            <n-input v-model:value="fromData.email" maxlength="50" placeholder="请输入邮箱" />
          </n-form-item>
          <!-- 部门状态选择 -->
          <n-form-item label="部门状态" path="status" style="width: 50%">
            <n-select v-model:value="fromData.status" clearable placeholder="请选择部门状态" :options="DictOptions" />
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
// 声明组件名称
defineOptions({ name: 'MainPart' });

// 引入需要的 Vue 3 模块和组件
import { reactive, ref, onBeforeMount, nextTick } from 'vue';
import { NSpace, NButton, NPopconfirm, NTag } from 'naive-ui';
import type { DataTableColumns, FormRules, FormInst } from 'naive-ui';
// 引入其他自定义的工具函数、API等
import { handleTree } from '@/utils/common/tree';
import * as UserApi from '@/service/api/user';
import * as DeptApi from '@/service/api/dept';
import { formatDate } from '@/utils/common/formatTime';
import { formRules } from '~/src/utils';

// 定义部门树形数据列表使用的数据类型
type RowData = {
  id: number;
  name: string;
  leaderUserId: number;
  parentId: number;
  phone: string;
  email: string;
  sort: number;
  status: number;
  createTime: number;
  children?: RowData[];
};

// 定义部门树形数据列表使用的响应式变量
const loading = ref(true); // 列表的加载中
const list = ref<DeptApi.DeptVO[]>([]); // 列表的数据
const queryFormRef = ref(); // 搜索的表单
const isExpandAll = ref(true); // 是否展开，默认全部展开
const refreshTable = ref(true); // 重新渲染表格状态
const userList = ref<Auth.UserVo[]>([]); // 用户列表

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
  name: null,
  status: null
});

// 定义表格的列及其渲染函数
const columns: DataTableColumns<RowData> = [
  { key: 'id', title: '部门ID' },
  { key: 'name', title: '部门名称' },
  {
    key: 'leader',
    title: '负责人',
    render(row) {
      const leaderUser = userList.value.find(user => user.id === row.leaderUserId);
      const leaderName = leaderUser ? leaderUser.nickname : '';
      return leaderName;
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

// 获取全部用户的粗略信息，用于新增/修改弹窗中的负责人选择及部门负责人的展示
const fetchSimpleUserList = async () => {
  const { error, data } = await UserApi.fetchSimpleUserList();
  if (error) {
    window.$message?.error(error.msg);
  }
  if (data) {
    userList.value = data;
  }
};

// 获取部门列表
const getList = async () => {
  loading.value = true;
  try {
    const res = await DeptApi.fetchDeptPage(queryParams);
    const deptData: DeptApi.DeptVO[] | null = res.data;
    if (deptData !== null) {
      list.value = handleTree(deptData);
    }
  } finally {
    loading.value = false;
  }
};

// 展开/折叠按钮操作
const toggleExpandAll = () => {
  refreshTable.value = false;
  isExpandAll.value = !isExpandAll.value;
  nextTick(() => {
    refreshTable.value = true;
  });
};

// 搜索按钮操作
function handleQuery() {
  getList();
}

// 重置按钮操作
function resetQuery() {
  queryParams.name = null;
  queryParams.status = null;
  handleQuery();
}
// 删除部门
async function handleDelete(id: number) {
  try {
    // 发起删除
    await DeptApi.deleteDept(id);
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
  // 部门新增/修改中表单的数据
  id: undefined,
  title: '',
  parentId: undefined,
  name: undefined,
  sort: undefined,
  leaderUserId: undefined,
  phone: undefined,
  email: undefined,
  status: 0
});
// 表单的校验规则
const rules: FormRules = {
  parentId: formRules.dept,
  sort: formRules.sort,
  phone: formRules.phone,
  name: formRules.deptName,
  email: formRules.email,
  status: formRules.status
};

// 打开弹窗
async function openForm(type: string, id?: number) {
  fromShow.value = true;
  formType.value = type;

  // 如果是修改时设置数据
  if (type === 'update' && id) {
    formLoading.value = true;
    const { error, data } = await DeptApi.fetchDept(id);
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

  // 获取部门列表
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
    const param = fromData.value as unknown as DeptApi.DeptVO;
    if (formType.value === 'create') {
      await DeptApi.createDept(param);
      window.$message?.success('添加成功');
      // 关闭弹窗并刷新列表
      close();
      await getList();
    } else if (formType.value === 'update') {
      const { data } = await DeptApi.updateDept(param);
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
    title: '',
    parentId: undefined,
    name: undefined,
    sort: undefined,
    leaderUserId: undefined,
    phone: undefined,
    email: undefined,
    status: 0
  };
}

// 获取部门数据并处理成树形结构
async function getTree() {
  deptTree.value = [];
  const { error, data } = await DeptApi.fetchSimpleDeptList();

  // 如果发生错误，就没有必要继续执行了
  if (error) {
    window.$message?.error(error.msg);
    return;
  }

  // 设置顶级部门，id为0，对应数据库中的结构
  const dept: Tree = { id: 0, name: '顶级部门', children: [] };
  dept.children = handleTree(data);
  deptTree.value.push(dept);
}

/**
 * 该数据用于初始化列表，防止出现不展开的bug
 */
 const initTempValue = [
  {
    children: [
      {
        name: '',
        parentId: 0,
        sort: 0,
        leaderUserId: 0,
        phone: '',
        email: '',
        status: 0,
        id: 0,
        createTime: 0
      }
    ]
  }
];

/**
 * 提前初始化数据
 * 数据若在onMounted时初始化，会出现属性列表不自动展开的bug
 * 另：树形列表绑定的list必须要有初始值，否则会出现不展开的bug，初始值不能为空，需保留基本且不为空children属性,详情见initTempValue
 */
onBeforeMount(async () => {
  /* eslint-disable */
	// @ts-ignore
  list.value = initTempValue;
  getList();
  fetchSimpleUserList();
});
</script>
