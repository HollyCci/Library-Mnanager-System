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
        <!-- 书库名称搜索框 -->
        <n-form-item label="书库名称" path="name" label-width="90px">
          <n-input
            v-model:value="queryParams.name"
            class="!w-240px"
            clearable
            placeholder="请输入书库名称"
            @clear="resetQuery"
            @keyup.enter="handleQuery"
          />
        </n-form-item>
        <n-form-item label="书库代码" path="core" label-width="90px">
          <n-input
            v-model:value="queryParams.core"
            class="!w-240px"
            clearable
            placeholder="请输入书库代码"
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
            placeholder="请选择书库状态"
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
      />
    </n-card>

    <!-- 新增/修改弹窗 -->
    <n-modal v-model:show="fromShow" transform-origin="center">
      <n-card style="width: 600px" title="书库信息" :bordered="false" size="huge" role="dialog" aria-modal="true">
        <template #header-extra><icon-line-md:close class="text-20px" @click="close" /></template>

        <n-form
          ref="formRef"
          v-loading="formLoading"
          :rules="rules"
          :model="fromData"
          label-placement="left"
          label-width="80px"
        >
          <!-- 书库名称输入框 -->
          <n-form-item label="书库名称" path="name" label-width="100">
            <n-input v-model:value="fromData.name" placeholder="请输入书库名称" />
          </n-form-item>
          <n-form-item label="书库代码" path="core" label-width="100">
            <n-input v-model:value="fromData.core" placeholder="请输入书库名称" />
          </n-form-item>
          <!-- 书库状态选择 -->
          <n-form-item label="书库状态" path="status" style="width: 50%" label-width="100">
            <n-select v-model:value="fromData.status" clearable placeholder="请选择书库状态" :options="DictOptions" />
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

    <n-modal
      v-model:show="uploadShow"
      transform-origin="center"
      preset="dialog"
      title="书库导入"
      positive-text="确认"
      negative-text="取消"
      @positive-click="submitForm"
    >
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
// 声明组件名称
defineOptions({ name: 'MainPart' });

// 引入需要的 Vue 3 模块和组件
import { h,reactive, ref, onBeforeMount } from 'vue';
import { NSpace, NButton, NPopconfirm, NTag ,NTime} from 'naive-ui';
import type { DataTableColumns, MessageReactive,FormRules, FormInst } from 'naive-ui';
// 引入其他自定义的工具函数、API等
import { getServiceEnvConfig } from '~/.env-config';
import * as StackApi from '@/service/api/stack';
import { formatDate } from '@/utils/common/formatTime';
import { formRules } from '~/src/utils';
import download from '~/src/utils/common/download';

// 定义书库树形数据列表使用的数据类型
type RowData = {
  id: number;
  name: string;
	picUrl:string;
	core:string;
	creator:number;
	count:number;
	updater:number;
	status:number;
  createTime: number;
	updateTime: number;
};

// 定义分类树形数据列表使用的响应式变量
const loading = ref(true); // 列表的加载中
const exportLoading = ref(false) // 导出的加载中
const list = ref([]); // 列表的数据
const queryFormRef = ref(); // 搜索的表单
const refreshTable = ref(true); // 重新渲染表格状态
const pageCount = ref(0);
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
  name: null,
  status: null,
	core:null,
  pageNo: 1,
  pageSize: 15
});

// 定义表格的列及其渲染函数
const columns: DataTableColumns<RowData> = [
  { key: 'id', title: '书库ID',align:'center'},
  { key: 'name', title: '书库名称名称',align:'center'},
	{ key:'core',title:'书库代码',align:'center',render(row){return <NTag type="primary">{row.core}</NTag>}},
  { key: 'count', title: '书库下图书数目',align:'center' },
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

// 获取分类列表
const getList = async () => {
  loading.value = true;
  try {
    const {data} = await StackApi.fetchStackPage(queryParams);
		// @ts-ignore
    const subjectData = data.list;
		pagination.page = queryParams.pageNo;
    pagination.pageSize = queryParams.pageSize;
		// @ts-ignore
    pagination.itemCount = data.total;
		console.log('共有记录',pagination.itemCount);
    pageCount.value = Math.ceil(pagination.itemCount / pagination.pageSize);
    if (subjectData !== null) {
      // @ts-ignore
      list.value = subjectData
    }
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


// 搜索按钮操作
function handleQuery() {
  getList();
}

// 重置按钮操作
function resetQuery() {
  queryParams.pageNo = 1;
  queryParams.name = null;
	queryParams.core = null;
  queryParams.status = null;
  handleQuery();
}
// 删除分类
async function handleDelete(id: number) {
  try {
    // 发起删除
    await StackApi.deleteStack(id);
    window.$message?.success('删除成功');
    // 刷新列表
    await getList();
  } catch {
  } finally {
    // 刷新列表
    await getList();
  }
}

const handleExport = async ()=>{
	try{
		window.$dialog?.info({
      title: '系统提示',
      content: '是否确认导出数据项',
      positiveText: '确定',
      negativeText: '取消',
      onPositiveClick: async () => {
				exportLoading.value=true
				const data = await StackApi.exportStack(queryParams)
				// @ts-ignore
				download.excel(data,'书库数据.xls');
      }
    });
	}finally{
		exportLoading.value=false;
	}
}



// -----------------------------------------------------------------------------------
// 用于新增/修改弹窗的响应式变量
const fromShow = ref(false); // 表单的显示状态
const formLoading = ref(false); // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref(''); // 表单的类型：create - 新增；update - 修改
const formRef = ref<HTMLElement & FormInst>(); // 表单的引用
const fromData = ref({
  // 分类新增/修改中表单的数据
  id: undefined,
	core:undefined,
  name: undefined,
  status: 0
});
// 表单的校验规则
const rules: FormRules = {

  name: [{ required: true, trigger: ['blur', 'input'], message: '请输入书库名称' }],
  status: formRules.status
};

// 打开弹窗
async function openForm(type: string, id?: number) {
  fromShow.value = true;
  formType.value = type;

  // 如果是修改时设置数据
  if (type === 'update' && id) {
    formLoading.value = true;
    const { error, data } = await StackApi.fetchStack(id);
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
    const param = fromData.value as unknown as StackApi.StackVO;
    if (formType.value === 'create') {
      await StackApi.createStack(param);
      window.$message?.success('添加成功');
      // 关闭弹窗并刷新列表
      close();
      await getList();
    } else if (formType.value === 'update') {
      const { data } = await StackApi.updateStack(param);
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
		core:undefined,
    name: undefined,
    status: 0
  };
}

// -----------------------------------------------------------------------------------
import {localStg} from '@/utils';
const uploadShow = ref(false); // 上传弹窗的显示状态
const {url} = getServiceEnvConfig(import.meta.env);
const importUrl = url + '/library/stack/import'; // 上传的地址
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

const submitForm = async ()=>{
	uploadFormLoading.value = true
  // @ts-ignore
  msgReactive = window.$message?.create('数据处理中...请稍后',{
    type:'loading',
    keepAliveOnHover: true,
  })
	uploadRef.value?.submit()
}

/** 上传错误提示 */
const submitFormError = (): void => {
	window.$message?.error('上传失败，请您重新上传！')
  uploadFormLoading.value = false
}

/** 上传成功回掉 */
const submitFormSuccess = (response:any)=>{
	const res = JSON.parse(response.event.target.response);
	if(res.code !== 200){
		window.$message?.error(res.msg)
		uploadFormLoading.value = false
		return
	}
  // @ts-ignore
  msgReactive.type='success';
  // @ts-ignore
  msgReactive.content='导入成功'
	// 拼接提示语
	const data = res.data;
  let text = '上传成功数量：' + data.createNames.length + ';'
  for (let name of data.createNames) {
    text += '< ' + name + ' >'
  }
	text += '更新成功数量：' + data.updateNames.length + ';'
  for (const name of data.updateNames) {
    text += '< ' + name + ' >'
  }
	text += '更新失败数量：' + Object.keys(data.failureNames).length + ';'
  for (const name in data.failureNames) {
    text += '< ' + name + ': ' + data.failureNames[name] + ' >'
  }
	const n =window.$notification?.create({
		title: '导入回执',
		content: text,
    meta:()=>
      h(
        NTime
      )
    ,
		action: () =>
			h(
         NButton,
         {
          text: true,
          type: 'primary',
          onClick: () => {
						// @ts-ignore
            n.destroy()
          }
          },
          {
          default: () => '已读'
          }
        )
	})
	closeForm();
}

const closeForm = ()=>{
	uploadShow.value = false;
	getList()
}
/** 下载模板操作 */
const importTemplate = async () => {
  const res = await StackApi.importStackTemplate()
	window.$message?.info("正在下载模板，请稍等...");
	// @ts-ignore
  download.excel(res, '书库导入模版.xls')
}

onBeforeMount(async () => {
  getList();
});
</script>
