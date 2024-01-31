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
        <n-form-item label="班级名称" path="name">
          <n-input
            v-model:value="queryParams.name"
            class="!w-240px"
            clearable
            placeholder="请输入班级名称"
            @keyup.enter="handleQuery"
          />
        </n-form-item>
        <n-form-item label="班级年级" path="grade">
          <n-input
            v-model:value="queryParams.grade"
            class="!w-240px"
            clearable
            placeholder="请输入班级年级 如2020级"
            @keyup.enter="handleQuery"
          />
        </n-form-item>
        <n-form-item label="班级类型" path="type">
          <n-select
            v-model:value="queryParams.type"
            class="!w-240px"
            clearable
            placeholder="请选择班级类型"
            :options="TypeOptions"
          />
        </n-form-item>
        <n-form-item label="负责人" path="leaderUserId">
          <n-select
            v-model:value="queryParams.leaderUserId"
            class="!w-240px"
            clearable
            placeholder="请选择班级负责人"
            :options="LeaderUserOptions"
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
      <n-data-table
        :loading="loading"
        remote
        :data="list"
        :columns="columns"
        :row-key="rowKey"
        :pagination="pagination"
      />
      <template #header-extra><icon-line-md:close class="text-20px" @click="close" /></template>
    </n-card>

    <n-modal v-model:show="fromShow" :on-mask-click="close" transform-origin="center">
      <n-card style="width: 600px" title="班级信息" :bordered="false" size="huge" role="dialog" aria-modal="true">
        <!-- 班级编辑表单 -->
        <n-form
          ref="formRef"
          v-loading="formLoading"
          :rules="rules"
          :model="formData"
          label-placement="left"
          label-width="93px"
        >
          <!-- 班级搜索 -->
          <n-form-item label="班级名称" path="name" required>
            <n-input v-model:value="formData.name" placeholder="请输入班级名称" style="width: 80%" />
          </n-form-item>
          <n-form-item label="班级年级" path="grade" required>
            <n-input v-model:value="formData.grade" placeholder="请输入班级年级" style="width: 80%" />
          </n-form-item>
          <n-form-item label="班级类型" path="type" required>
            <n-select
              v-model:value="formData.type"
              :options="TypeOptions"
              placeholder="请选择班级类型"
              style="width: 80%"
            />
          </n-form-item>
          <n-form-item label="班级负责人" path="leaderUsername" required>
            <n-input
              v-model:value="formData.leaderUsername"
              placeholder="请输入用户账号"
              style="width: 80%"
              @change="handleValidUserId"
            />
          </n-form-item>
          <n-form-item label="班级状态" path="status" required>
            <n-select
              v-model:value="formData.status"
              :options="DictOptions"
              placeholder="请选择状态"
              style="width: 50%"
            ></n-select>
          </n-form-item>
          <n-form-item label="显示排序" path="sort" required>
            <n-input-number v-model:value="formData.sort" placeholder="请输入显示排序" style="width: 50%" min="0" />
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
  </n-space>
</template>

<script setup lang="tsx">
/* eslint-disable */
// 声明组件名称
defineOptions({ name: 'MainPart' });
// 引入需要的 Vue 3 模块和组件
import { reactive, ref, onMounted } from 'vue';
import { NSpace, NButton, NPopconfirm, NTag, NDescriptions, NDescriptionsItem } from 'naive-ui';
import type { DataTableColumns, FormRules, FormInst } from 'naive-ui';
import { formatDate } from '@/utils/common/formatTime';
import * as ClassApi from '@/service/api/class';
import * as UserApi from '@/service/api/user';
import download from '@/utils/common/download';

const loading = ref(true); // 列表的加载中
const list = ref([]); // 列表的数据
const pageCount = ref(0);
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  name: '',
  grade: '',
  type: null,
  leaderUserId: null,
  status: null
});
const queryFormRef = ref(); // 搜索的表单
const exportLoading = ref(false); // 导出的加载中
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
const TypeOptions = [
  {
    label: '本科',
    value: 0
  },
  {
    label: '专科',
    value: 1
  },
  {
    label: '专升本',
    value: 2
  }
];
const LeaderUserOptions = ref(undefined);
// 定义列表的数据行
type RowData = {
  id: number;
  grade: string;
  type: number;
  leaderUserId: number;
  leaderUser: {
    id: number;
    username: string;
    nickname: string;
    mobile: string;
  };
  name: string;
  remark: string;
  sort: number;
  status: number;
  createTime: number;
};


// 获取列表数据并更新分页信息
const getList = async () => {
  loading.value = true;
  try {
    const { data } = await ClassApi.fetchClassPage(queryParams);
    // @ts-ignore
    list.value = data.list;
    pagination.page = queryParams.pageNo;
    pagination.pageSize = queryParams.pageSize;
    // @ts-ignore
    pagination.itemCount = data.total;
    pageCount.value = Math.ceil(pagination.itemCount / pagination.pageSize);
    // 收集所有负责人不为空的ID和nickname
    // @ts-ignore
    LeaderUserOptions.value = data.list
      .filter((item: any) => item.leaderUser)
      .map((item: any) => {
        return {
          label: item.leaderUser.nickname,
          value: item.leaderUser.id
        };
      });
  } catch (error) {
    console.log(error);
  } finally {
    loading.value = false;
  }
};

const columns: DataTableColumns<RowData> = [
  {
    type: 'expand',
    renderExpand: rowData => {
      return (
        <NDescriptions
          labelPlacement="left"
          bordered
          column={1}
          size="small"
          labelAlign="center"
          labelStyle={'width:80px;text:center'}
        >
          <NDescriptionsItem label="备注">
            {rowData.remark ? (
              <t-tag theme="primary" variant="outline">
                {rowData.remark}
              </t-tag>
            ) : (
              <t-tag theme="warning" variant="outline">
                无任何信息
              </t-tag>
            )}
          </NDescriptionsItem>
        </NDescriptions>
      );
    }
  },
  { key: 'id', title: '班级编号', align: 'center' },
  { key: 'name', title: '班级名称', align: 'center' },
  { key: 'grade', title: '班级年级', align: 'center' },
  {
    key: 'type',
    title: '班级类型',
    align: 'center',
    render(row: any) {
      if (row.type === 0) {
        return <n-tag type="primary">本科</n-tag>;
      }
      if (row.type === 1) {
        return <n-tag type="primary">专科</n-tag>;
      }
      if (row.type === 2) {
        return <n-tag type="primary">专升本</n-tag>;
      }
      return <n-tag type="warning">数据非法</n-tag>;
    }
  },
  { key: 'sort', title: '显示顺序', align: 'center' },
  {
    key: 'leaderUser.nickname',
    title: '负责人',
    align: 'center',
    render(row: any) {
      return row.leaderUser ? (
        <t-tag theme="primary">{row.leaderUser.nickname}</t-tag>
      ) : (
        <t-tag theme="warning">暂无分配</t-tag>
      );
    }
  },
  {
    key: 'phone',
    title: '负责人电话',
    align: 'center',
    render(row: any) {
      return row.phone ? row.phone : '无';
    }
  },
  {
    key: 'email',
    title: '班级邮箱',
    align: 'center',
    render(row: any) {
      return row.email ? row.email : '无';
    }
  },

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
              openForm('update', row.id, row);
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
    }
  }
];
/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.pageNo = 1;
  getList();
};

/** 重置按钮操作 */
const resetQuery = () => {
  queryParams.pageNo = 1;
  queryParams.name = '';
  queryParams.grade = '';
  queryParams.leaderUserId = null;
  queryParams.status = null;
  queryParams.type = null;
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
        await ClassApi.deleteClass(id);
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
        const data = await ClassApi.exportClass(queryParams);
        // @ts-ignore
        download.excel(data, '班级列表.xls');
      }
    });
  } finally {
    exportLoading.value = false;
  }
};

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

// 必须要有rowKey，不然点击打开会全部打开
const rowKey = (row: any) => row.id;
const fromShow = ref(false); // 表单的显示状态
const formRef = ref<HTMLElement & FormInst>(); // 表单的引用
const formLoading = ref(false); // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref(''); // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  name: '',
  grade: '',
  sort: null,
  type: 0,
  leaderUsername: '',
  leaderUserId: null,
  email: '',
  phone: '',
  status: 0,
  remark: ''
});

const rules: FormRules = {
  name: [{ required: true, message: '请输入班级名称', trigger: 'input' }],
  grade: [{ required: true, message: '请输入班级年级', trigger: 'input' }],
  leaderUsername: [{ required: true, message: '请输入班级负责人账号', trigger: 'input' }],
  code: [{ required: true, message: '请输入角色标识', trigger: 'input' }],
  sort: [{ required: true, type: 'number', message: '请输入显示顺序', trigger: 'change' }]
};

async function openForm(type: string, id?: number, row?: any) {
  fromShow.value = true;
  formType.value = type;
  // 如果是修改时设置数据
  if (type === 'update' && id) {
    formLoading.value = true;
    try {
      const { data } = await ClassApi.fetchClass(id);
      if (data) {
        /* eslint-disable */
      // @ts-ignore
      formData.value = data;
			if(row.leaderUser){
				formData.value.leaderUsername = row.leaderUser.username;
			}

    }
		}finally{
			formLoading.value = false;
		}
  }
}

const handleValidUserId  = async () => {
	if(!formData.value.leaderUsername) return;
	const {data} = await UserApi.getUserByUsername(formData.value.leaderUsername)
	// @ts-ignore
	if(data.id !== null){
		// @ts-ignore
		window.$message?.info(`您选择的班级负责人信息为：账号:${data.username}、姓名：${data.nickname}，请核查信息是否正确！`)
		// @ts-ignore
		formData.value.leaderUserId = data.id;
		// @ts-ignore
		formData.value.email = data.email;
		// @ts-ignore
		formData.value.phone = data.mobile;
	}else{
		formData.value.leaderUserId = null
		window.$message?.error('用户不存在,请重新输入！');
	}
}


async function submitFrom(){
	if (!formRef.value) return;
  // 校验表单，验证不通过不会执行后续
  await formRef.value?.validate();
	try{
		const param = formData.value as unknown as ClassApi.ClassVO
		if(formType.value === 'create'){
			await ClassApi.createClass(param);
			window.$message?.success('添加班级：'+param.name+' 成功');
		}else if (formType.value === 'update') {
      const { data } = await ClassApi.updateClass(param);
      if (data === true) {
        window.$message?.success('修改班级：'+param.name+' 信息成功');
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
		grade:'',
		name: '',
		leaderUsername:'',
		leaderUserId:null,
  	type:0,
		phone:'',
		email:'',
 	  sort: null,
  	status: 0,
 	  remark: ''
	}
}



onMounted(async () => {
  await getList();

});



</script>
