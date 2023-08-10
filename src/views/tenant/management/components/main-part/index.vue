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
        <n-form-item label="租户名" path="name">
          <n-input
            v-model:value="queryParams.name"
            class="!w-240px"
            clearable
            placeholder="请输入租户名称"
            @keyup.enter="handleQuery"
          />
        </n-form-item>

        <n-form-item label="联系人" path="contactName">
          <n-input
            v-model:value="queryParams.contactName"
            class="!w-240px"
            clearable
            placeholder="请输入联系人"
            @keyup.enter="handleQuery"
          />
        </n-form-item>
        <n-form-item label="联系人手机" path="contactMobile" :label-width="105">
          <n-input
            v-model:value="queryParams.contactMobile"
            class="!w-240px"
            clearable
            placeholder="请输入联系人手机"
            @keyup.enter="handleQuery"
          />
        </n-form-item>
        <n-form-item label="租户状态" path="status">
          <n-select
            v-model:value="queryParams.status"
            class="!w-240px"
            clearable
            placeholder="请选择租户状态"
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
      <n-space justify="end" class="m2">
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
        <!-- 导出按钮 -->
        <n-button plain class="mr3" type="success" @click="handleExport">
          <template #icon>
            <icon-uil:import class="text-20px" />
          </template>
          导出
        </n-button>
      </n-space>
    </n-card>

    <n-card :bordered="false" class="h-full rounded-8px shadow-sm" hoverable>
      <n-data-table remote :loading="loading" :data="list" :columns="columns" :pagination="pagination" />
      <template #header-extra><icon-line-md:close class="text-20px" @click="close" /></template>
    </n-card>

    <n-modal v-model:show="fromShow" transform-origin="center">
      <n-card style="width: 600px" title="租户信息" :bordered="false" size="huge" role="dialog" aria-modal="true">
        <n-form
          ref="formRef"
          v-loading="formLoading"
          :rules="rules"
          :model="formData"
          label-placement="left"
          label-width="93px"
        >
          <n-form-item label="租户名称" path="name" required>
            <n-input v-model:value="formData.name" placeholder="请输入租户名称" style="width: 80%" />
          </n-form-item>
          <n-form-item label="租户套餐" path="packageId" required>
            <n-select
              v-model:value="formData.packageId"
              placeholder="请选择租户套餐"
              :options="packageList"
              label-field="name"
              value-field="id"
              key-field="id"
              style="width: 50%"
            />
          </n-form-item>
          <n-form-item label="联系人" path="contactName" required>
            <n-input v-model:value="formData.contactName" placeholder="请输入联系人" style="width: 50%" />
          </n-form-item>
          <n-form-item label="联系人手机" path="contactMobile">
            <n-input v-model:value="formData.contactMobile" maxlength="11" placeholder="请输入联系人手机" />
          </n-form-item>
          <n-form-item v-if="formData.id === undefined" label="用户名称" path="username" required>
            <n-input v-model:value="formData.username" placeholder="请输入用户名称" />
          </n-form-item>
          <n-form-item v-if="formData.id === undefined" label="用户密码" path="password" required>
            <n-input
              v-model:value="formData.password"
              show-password-on="click"
              placeholder="请输入用户密码"
              type="password"
            />
          </n-form-item>
          <n-form-item label="账号额度" path="accountCount" required>
            <n-input-number v-model:value="formData.accountCount" placeholder="请输入账号额度" min="0" />
          </n-form-item>
          <n-form-item label="过期时间" path="expireTime" required>
            <n-date-picker
              v-model:value="formData.expireTime"
              clearable
              placeholder="请选择过期时间"
              type="date"
              value-format="x"
            />
          </n-form-item>
          <n-form-item label="绑定域名" path="domain" required>
            <n-input v-model:value="formData.domain" placeholder="请输入绑定域名" />
          </n-form-item>
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
// @ts-nocheck ts推断不出来 没必要做无谓的转换
// 声明组件名称
defineOptions({ name: 'MainPart' });
// 引入需要的 Vue 3 模块和组件
import { reactive, ref, onMounted } from 'vue';
import { NSpace, NButton, NPopconfirm, NTag } from 'naive-ui';
import type { DataTableColumns, FormRules, FormInst } from 'naive-ui';
import * as TenantApi from '@/service/api/tenant';
import * as TenantPackageApi from '@/service/api/tenantPackage';
import { formatDate } from '@/utils/common/formatTime';
import download from '@/utils/common/download';
import { formRules } from '~/src/utils';

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
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  name: '',
  contactName: '',
  contactMobile: '',
  status: null,
  createTime: null
});

const getList = async () => {
  loading.value = true;
  try {
    const { data } = await TenantApi.fetchTenantPage(queryParams);
    list.value = data.list;
		pagination.page = queryParams.pageNo;
		pagination.pageSize = queryParams.pageSize;
		pagination.itemCount =data.total;
		pageCount.value = Math.ceil(pagination.itemCount / pagination.pageSize)
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
  pageSizes: [10, 20, 30, 50],
  showSizePicker: true,
  showQuickJumper: true,
  prefix({ itemCount }) {
    return `共有 ${itemCount} 条记录`;
  },
  onChange: (page: number) => {
    // console.log(queryParams.pageNo);
    queryParams.pageNo = page;
    // console.log(queryParams.pageNo);
    getList();
  },
  onUpdatePageSize: (pageSize: number) => {
    queryParams.pageSize = pageSize;
    queryParams.pageNo = 1;
    getList();
  }
});
const queryFormRef = ref(); // 搜索的表单
const exportLoading = ref(false); // 导出的加载中
const packageList = ref([]); // 租户套餐列表

type RowData = {
  id: number;
  name: string;
  accountCount: number;
  contactName: string;
  contactMobile: string;
  status: number;
  packageId: number;
  domain: string;
  createTime: number;
  expireTime: number;
};
const columns: DataTableColumns<RowData> = [
  { key: 'id', title: '租户编号', align: 'center' },
  { key: 'name', title: '租户名称', align: 'center' },
  {
    key: 'packageId',
    title: '租户套餐',
    align: 'center',
    render({ packageId }) {
      if (packageId === 0) {
        return <NTag type="primary">系统租户</NTag>;
      }
      const packageItem = packageList.value.find(item => item.id === packageId);
      if (packageItem) {
        return <NTag type="success">{packageItem.name}</NTag>;
      }
      return <NTag type="error">null</NTag>;
    }
  },
  { key: 'contactName', title: '联系人', align: 'center' },
  { key: 'contactMobile', title: '联系人手机', align: 'center' },
  {
    key: 'accountCount',
    title: '账号额度',
    align: 'center',
    render(row) {
      return <NTag type="primary">{row.accountCount}</NTag>;
    }
  },
  { key: 'expireTime', title: '到期时间', align: 'center', width: 180 },
  { key: 'domain', title: '绑定域名', align: 'center', width: 200 },
  {
    key: 'status',
    title: '租户状态',
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



const getPackageList = async ()=>{
	const {data} =  await TenantPackageApi.fetchTenantPackageList();
	if(data){
		 // @ts-ignore
		packageList.value = data
	}
}
/** 搜索按钮操作 */
const handleQuery = () => {
	if(queryParams.createTime){
		// @ts-ignore ts推断不出来
		queryParams.createTime = queryParams.createTime.map((item) => formatDate(item))
	}
  queryParams.pageNo = 1
  getList()
}

/** 重置按钮操作 */
const resetQuery = () => {
	queryParams.pageNo = 1
	queryParams.name = ''
	queryParams.contactName = ''
	queryParams.contactMobile = ''
	queryParams.status = null
	queryParams.createTime = null
	getList()
}

const handleDelete = async(id:number)=>{
	try{
		window.$dialog?.info({
			title: '系统提示',
			content: '是否确认删除数据项',
			positiveText: '确定',
			negativeText: '取消',
			onPositiveClick: async () => {
				await TenantApi.deleteTenant(id);
				await getList();
				window.$message?.success('删除成功');
			}
		});
	}catch(error){
		console.log(error);
	}
}

/** 导出按钮操作 */
const handleExport = async () => {
	try{
		window.$dialog?.info({
      title: '系统提示',
      content: '是否确认导出数据项',
      positiveText: '确定',
      negativeText: '取消',
      onPositiveClick: async () => {
				exportLoading.value = true;
				const data = await TenantApi.exportTenant(queryParams);
				console.log(data);
				download.excel(data, '租户列表.xlsx');
      }
    });
	}finally{
		exportLoading.value = false;
	}
}

// ------------------------------
const fromShow = ref(false); // 表单的显示状态
const formRef = ref<HTMLElement & FormInst>(); // 表单的引用
const formLoading = ref(false); // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref(''); // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  name: undefined,
  packageId: undefined,
  contactName: undefined,
  contactMobile: undefined,
  accountCount: undefined,
  expireTime: undefined,
  domain: undefined,
	status:0
})
const rules: FormRules = {
	name:formRules.tenantName,
	packageId:formRules.packageId,
	contactName:formRules.contactName,
	status:formRules.status,
	contactMobile:formRules.phone,
	accountCount:formRules.accountCount,
	expireTime:formRules.expireTime,
	domain:formRules.domain,
	username:formRules.username,
	password:formRules.pwd
};

// 打开弹窗
async function openForm(type: string, id?: number) {
  fromShow.value = true;
  formType.value = type;

  // 如果是修改时设置数据
  if (type === 'update' && id) {
    formLoading.value = true;
		try{
			const { data } = await TenantApi.fetchTenant(id);
			console.log();
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

async function submitFrom(){
	console.log(packageList.value);
	console.log(formData.value);
	if (!formRef.value) return;
  // 校验表单，验证不通过不会执行后续
  await formRef.value?.validate();
	try{
		const param = formData.value as unknown as TenantApi.TenantVO
		if(formType.value === 'create'){
			await TenantApi.createTenant(param);
			window.$message?.success('添加成功');
      // 关闭弹窗并刷新列表
      close();
      await getList();
		}else if (formType.value === 'update') {
      const { data } = await TenantApi.updateTenant(param);
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
onMounted(async () => {
  await getList();
	await getPackageList()
});

function close(){
	fromShow.value = false;
	formData.value={
		id: undefined,
		name: undefined,
		packageId: undefined,
		contactName: undefined,
		contactMobile: undefined,
		accountCount: undefined,
		expireTime: undefined,
		domain: undefined,
		status:0
	}
}

</script>
