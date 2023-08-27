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
        label-width="60px"
        label-placement="left"
      >
        <!-- 主题词名称搜索框 -->
        <n-form-item label="主题词名称" path="name" label-width="90px">
          <n-input
            v-model:value="queryParams.name"
            class="!w-240px"
            clearable
            placeholder="请输入主题词名称"
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
            placeholder="请选择主题词状态"
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
            <n-button plain type="success" @click="handleExport">
              <template #icon>
                <icon-uil:import class="text-20px" />
              </template>
              导出
            </n-button>
            <n-button plain type="warning" @click="handleImport">
              <template #icon>
                <icon-ep:upload class="text-20px" />
              </template>
              导入
            </n-button>
          </n-space>
        </n-form-item>
      </n-form>
    </n-card>

    <!-- 数据表格区域 -->
    <n-card :bordered="false" class="h-full rounded-8px shadow-sm" hoverable>
      <n-data-table
        v-if="refreshTable"
        remote
        size="small"
        :loading="loading"
        :row-key="rowKey"
        :pagination="pagination"
        :columns="columns"
        :data="list"
        :max-height="540"
      ></n-data-table>
    </n-card>

    <!-- 新增/修改弹窗 -->
    <n-modal v-model:show="fromShow" transform-origin="center">
      <n-card style="width: 600px" title="主题词信息" :bordered="false" size="huge" role="dialog" aria-modal="true">
        <template #header-extra><icon-line-md:close class="text-20px" @click="close" /></template>

        <n-form
          ref="formRef"
          v-loading="formLoading"
          :rules="rules"
          :model="fromData"
          label-placement="left"
          label-width="80px"
        >
          <!-- 主题词名称输入框 -->
          <n-form-item label="主题词名称" path="name" label-width="100">
            <n-input v-model:value="fromData.name" placeholder="请输入主题词名称" />
          </n-form-item>
          <!-- 主题词状态选择 -->
          <n-form-item label="主题词状态" path="status" style="width: 50%" label-width="100">
            <n-select v-model:value="fromData.status" clearable placeholder="请选择主题词状态" :options="DictOptions" />
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
              <icon-line-md:upload-loop />
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
        <n-button type="primary" @click="submitForm">确定</n-button>
        <n-button @click="closeForm">取消</n-button>
      </template>
    </n-modal>
  </n-space>
</template>
<script setup lang="tsx">
/* eslint-disable */
// 禁用 ESLint 检查，避免出现不必要的警告

// 声明组件名称
defineOptions({ name: 'MainPart' });

// 引入需要的 Vue 3 模块和组件
import { h, reactive, ref, onBeforeMount } from 'vue';
import { NSpace, NButton, NPopconfirm, NTag, NTime } from 'naive-ui';
import type { DataTableColumns, MessageReactive, FormRules, FormInst } from 'naive-ui';
// 引入其他自定义的工具函数、API等
import { getServiceEnvConfig } from '~/.env-config'; // 导入获取环境配置的函数
import * as SubjectApi from '@/service/api/subject'; // 导入主题词相关的 API
import { formatDate } from '@/utils/common/formatTime'; // 导入日期格式化函数
import { formRules } from '~/src/utils'; // 导入表单规则
import download from '~/src/utils/common/download'; // 导入下载函数

// 定义主题词树形数据列表使用的数据类型
type RowData = {
  id: number;
  name: string;
  creator: number;
  count: number;
  updater: number;
  status: number;
  createTime: number;
  updateTime: number;
};

// 定义分类树形数据列表使用的响应式变量
const loading = ref(true); // 列表的加载状态，初始为 true 表示正在加载数据
const exportLoading = ref(false); // 导出数据的加载状态，初始为 false
const list = ref<SubjectApi.SubjectVO[]>([]); // 列表的数据，初始为空数组
const queryFormRef = ref(); // 搜索表单的引用
const refreshTable = ref(true); // 控制是否重新渲染表格，初始为 true
const pageCount = ref(0); // 总页数，默认为 0
const rowKey = (row: any) => row.id; // 用于指定行数据的唯一标识字段

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
  name: null, // 主题词名称，默认为空
  status: null, // 主题词状态，默认为空
  pageNo: 1, // 当前页码，默认为 1
  pageSize: 15 // 每页显示数量，默认为 15
});

// 定义表格的列及其渲染函数
const columns: DataTableColumns<RowData> = [
  { key: 'id', title: '主题词ID',align:'center'},
  { key: 'name', title: '主题词名称名称',align:'center'},
  { key: 'count', title: '主题下图书数目',align:'center' },
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
    },
		align:'center'
  },
	{
		key:"creator",
		title:'创建用户',
		align:'center'
	},
  {
    key: 'createTime',
    title: '创建时间',
    render: (row: any) => {
      return formatDate(row.createTime);
    },
		align:'center'
  },
	{
		key:'updater',
		title:'最后更新用户',
		align:'center'
	},
	{
		key: 'updateTime',
    title: '最后更新时间',
    render: (row: any) => {
      return formatDate(row.updateTime);
    },
		align:'center'
	},
  {
    key: 'action',
    title: '操作',
    align: 'center',
    render: (row: any) => {
      return (
        <NSpace justify={'center'}>
          <NButton
            type="primary"
            ghost
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
              trigger: () => <NButton size={'small'} type='error' ghost>删除</NButton>
            }}
          </NPopconfirm>
        </NSpace>
      );
    }
  }
];

// 获取分类列表的函数
const getList = async () => {
  loading.value = true; // 设置加载状态为 true，表示正在加载数据
  try {
    // 调用 API 获取分类数据
    const { data } = await SubjectApi.fetchSubjectPage(queryParams);
    // 获取返回的分类数据列表
    // @ts-ignore
    const subjectData = data.list;
    // 更新分页器的当前页码和每页显示数量
    pagination.page = queryParams.pageNo;
    pagination.pageSize = queryParams.pageSize;
    // 更新分页器的总记录数
    // @ts-ignore
    pagination.itemCount = data.total;
    console.log('共有记录', pagination.itemCount);
    // 计算总页数并更新到 pageCount 变量中
    pageCount.value = Math.ceil(pagination.itemCount / pagination.pageSize);

    if (subjectData !== null) {
      // 将获取的分类数据更新到列表变量中
      // @ts-ignore
      list.value = subjectData;
    }
  } finally {
    loading.value = false; // 加载完成后，将加载状态设置为 false
  }
};


// 定义分页参数，用于控制分页器的显示及操作
const pagination = reactive({
  page: queryParams.pageNo, // 当前页码
  pageCount: pageCount.value, // 总页数
  pageSize: queryParams.pageSize, // 每页显示数量
  itemCount: 0, // 总记录数
  pageSizes: [10, 20, 30, 50], // 可选的每页显示数量
  showSizePicker: true, // 显示每页显示数量选择器
  showQuickJumper: true, // 显示快速跳转
  // 定义分页器前缀
  // @ts-ignore
  prefix({ itemCount }) {
    return `共有 ${itemCount} 条记录`;
  },
  // 当页码变化时的回调函数
  onChange: (page: number) => {
    queryParams.pageNo = page; // 更新查询参数中的页码
    getList(); // 获取对应页码的数据列表
  },
  // 当每页显示数量变化时的回调函数
  onUpdatePageSize: (pageSize: number) => {
    queryParams.pageSize = pageSize; // 更新查询参数中的每页数量
    queryParams.pageNo = 1; // 重置页码为第一页
    getList(); // 获取第一页的数据列表
  }
});

// 搜索按钮操作，执行查询操作
function handleQuery() {
  getList(); // 获取对应查询参数的数据列表
}

// 重置按钮操作，重置查询参数并执行查询操作
function resetQuery() {
  queryParams.pageNo = 1; // 重置页码为第一页
  queryParams.name = null; // 重置查询名称
  queryParams.status = null; // 重置查询状态
  handleQuery(); // 执行查询操作
}

// 删除分类操作
async function handleDelete(id: number) {
  try {
    // 发起删除请求
    await SubjectApi.deleteSubject(id);
    window.$message?.success('删除成功');
    // 刷新列表
    await getList();
  } catch {
    // 处理删除失败情况
  } finally {
    // 刷新列表
    await getList();
  }
}

// 导出操作
const handleExport = async () => {
  try {
    // 弹出确认框
    window.$dialog?.info({
      title: '系统提示',
      content: '是否确认导出数据项',
      positiveText: '确定',
      negativeText: '取消',
      onPositiveClick: async () => {
        exportLoading.value = true; // 设置导出加载状态为 true
        const data = await SubjectApi.exportSubject(queryParams); // 调用导出 API
        // @ts-ignore
        download.excel(data, '主题词数据.xls'); // 下载导出的 Excel 文件
      }
    });
  } finally {
    exportLoading.value = false; // 设置导出加载状态为 false
  }
}




// -----------------------------------------------------------------------------------
// 表单的显示状态，控制新增/修改弹窗的显示与隐藏
const fromShow = ref(false);

// 表单的加载状态，用于控制数据加载中以及提交按钮的禁用
const formLoading = ref(false);

// 表单的类型，create 表示新增，update 表示修改
const formType = ref('');

// 表单的引用，用于操作表单元素
const formRef = ref<HTMLElement & FormInst>();

// 表单的数据，包括 id、name 和 status
const fromData = ref({
  id: undefined,
  name: undefined,
  status: 0
});

// 表单的校验规则
const rules: FormRules = {
  name: [{ required: true, trigger: ['blur', 'input'], message: '请输入主题词名称' }],
  status: formRules.status // 这里可能是从 formRules 中获取的校验规则
};

// 打开弹窗操作，根据类型和ID决定是新增还是修改
async function openForm(type: string, id?: number) {
  fromShow.value = true; // 打开弹窗
  formType.value = type; // 设置表单类型

  // 如果是修改操作，根据ID获取数据并填充到表单中
  if (type === 'update' && id) {
    formLoading.value = true; // 设置数据加载状态为 true
    const { error, data } = await SubjectApi.fetchSubject(id);

    if (error) {
      window.$message?.error(error.msg); // 显示错误提示
    }

    if (data) {
      // 将从 API 获取的数据填充到表单数据中
			// @ts-ignore
      fromData.value = data;
    }

    formLoading.value = false; // 数据加载完成后设置状态为 false
  }
}


// 提交表单操作
async function submitFrom() {
  // 如果表单引用不存在，直接返回
  if (!formRef.value) return;

  // 校验表单，验证不通过不会执行后续操作
  await formRef.value?.validate();

  // 开始提交表单，设置表单加载状态为 true
  formLoading.value = true;
  try {
    // 从表单中获取数据并转换为接口需要的数据格式
    const param = fromData.value as unknown as SubjectApi.SubjectVO;

    if (formType.value === 'create') {
      // 调用创建主题词的接口
      await SubjectApi.createSubject(param);

      // 显示成功提示信息
      window.$message?.success('添加成功');

      // 关闭弹窗并刷新列表
      close();
      await getList();
    } else if (formType.value === 'update') {
      // 调用更新主题词的接口
      const { data } = await SubjectApi.updateSubject(param);

      if (data === true) {
        // 显示成功提示信息
        window.$message?.success('修改成功');

        // 关闭弹窗并刷新列表
        close();
        await getList();
      }
    }
  } finally {
    // 无论成功还是失败，最终将表单加载状态设为 false
    formLoading.value = false;
  }
}

// 关闭弹窗操作
function close() {
  // 隐藏表单弹窗
  fromShow.value = false;

  // 重置表单数据
  fromData.value = {
    id: undefined,
    name: undefined,
    status: 0
  };
}


// -----------------------------------------------------------------------------------
import {localStg} from '@/utils';
const uploadShow = ref(false); // 上传弹窗的显示状态
const {url} = getServiceEnvConfig(import.meta.env);
const importUrl = url + '/library/subject/import'; // 上传的地址
const updateSupport = ref(0) // 是否更新已经存在的数据
const uploadHeaders = ref() // 上传 Header 头
const uploadRef = ref()
const uploadFormLoading = ref(false);// 表单加载中
const handleImport = () => {
		// 提交请求
		uploadHeaders.value = {
		Authorization: 'Bearer '+ localStg.get('accessToken'),
		'tenant-id': localStg.get('tenantId')
	}
	uploadShow.value = true;
}

let msgReactive: MessageReactive | null = null;

/**
 * 提交表单操作
 */
const submitForm = async () => {
  uploadFormLoading.value = true;

  // 创建加载中提示信息
  // @ts-ignore
  msgReactive = window.$message?.create('数据处理中...请稍后', {
    type: 'loading',
    keepAliveOnHover: true,
  });

  // 提交上传表单
  uploadRef.value?.submit();
};

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
  const res = await SubjectApi.importSubjectTemplate();

  // 显示下载提示信息
  window.$message?.info("正在下载模板，请稍等...");

  // 使用 download.excel 函数下载 Excel 文件
  // @ts-ignore
  download.excel(res, '主题词导入模版.xls');
};

/**
 * 在组件挂载之前获取列表数据
 */
onBeforeMount(async () => {
  // 调用获取列表数据的方法
  getList();
});

</script>
