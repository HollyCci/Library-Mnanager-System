<template>
  <n-space :vertical="true" :size="16">
    <n-card :bordered="false" class="h-full rounded-8px shadow-sm" hoverable>
      <n-form ref="queryFormRef" inline label-width="85px" label-placement="left" :model="queryParams">
        <n-form-item label="用户编号">
          <n-input v-model:value="queryParams.userId" placeholder="请输入用户编号" @keyup.enter="handleQuery" />
        </n-form-item>
        <!-- <n-form-item label="用户类型">
          <n-select v-model:value="queryParams.type" class="!w-200px" placeholder="请选择用户类型" :options="options" />
        </n-form-item> -->
        <n-form-item label="客户端编号">
          <n-input v-model:value="queryParams.clientId" placeholder="请输入客户端编号" @keyup.enter="handleQuery" />
        </n-form-item>
        <n-form-item>
          <n-button @click="handleQuery">
            <template #icon>
              <icon-uil-search class="text-20px" />
            </template>
            搜索
          </n-button>
        </n-form-item>
        <n-form-item>
          <n-button @click="resetQuery">
            <template #icon>
              <icon-iconamoon:restart-bold class="text-20px" />
            </template>
            重置
          </n-button>
        </n-form-item>
      </n-form>
    </n-card>
    <n-card :bordered="false" class="h-full rounded-8px shadow-sm" hoverable>
      <n-data-table :loading="loading" :columns="columns" :data="list" :pagination="pagination" />
    </n-card>
  </n-space>
</template>
<script lang="tsx" setup>
/* eslint-disable */
import { reactive, ref, onMounted } from 'vue';
import { NSpace, NButton, NPopconfirm } from 'naive-ui';
import type { DataTableColumns } from 'naive-ui';
import { formatDate } from '@/utils/common/formatTime';
import * as Oauth2Api from '@/service/api/oauth2';

/**
 * 搜索表单变量
 */
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  userId: '',
  type: '',
  clientId: ''
});

/**
 * 用户类型选项
 */
// const options = [
//   {
//     label: '管理员',
//     value: 0
//   }
// ];

/**
 * 数据项信息
 */
type RowData = {
  accessToken: string;
  refreshToken: string;
  userId: number;
  type: number;
  expiresTime: number;
  createTime: number;
};

const columns: DataTableColumns<RowData> = [
  { key: 'accessToken', title: '访问令牌', align: "center" },
  { key: 'refreshToken', title: '刷新令牌',
		align: "center" },
  { key: 'userId', title: '用户编号', align: "center" },
  // { key: 'userType', title: '用户类型',	align: "center" },
  {
		key: 'expiresTime',
		title: '过期时间',
		align: "center",
		render: (row: any) => {
      return formatDate(row.expiresTime);
    }
	},
  {
    key: 'createTime',
    title: '创建时间',
		align:"center",
    render: (row: any) => {
      return formatDate(row.createTime);
    }
  },
  {
    title: '操作',
    key: 'operate',
    align: 'center',
    render: (row: any) => {
      return (
        <NSpace justify={'center'}>
          <NPopconfirm
            onPositiveClick={() => {
              handleDelete(row.accessToken);
            }}
          >
            {{
              default: () => '是否确认强制退出该用户',
              trigger: () => (
                <NButton color="#ff69b4" text size={'small'}>
                  强退
                </NButton>
              )
            }}
          </NPopconfirm>
        </NSpace>
      );
    }
  }
];
/**
 * 获取列表数据并更新分页信息
 */
const loading = ref(true); // 列表的加载中
const list = ref([]); //列表的数据
const pageCount = ref(0);
const getList = async () => {
  loading.value = true;
  try {
    const { data } = await Oauth2Api.getAccessTokenPage(queryParams);
    list.value = data.list;
		pagination.page = queryParams.pageNo;
    pagination.pageSize = queryParams.pageSize;
    pagination.itemCount = data.total;
    pageCount.value = Math.ceil(pagination.itemCount / pagination.pageSize);
  } catch (error) {
    console.log(error);
  } finally {
    loading.value = false;
  }
};
/**
 * 分页功能
 */
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
/**
 * 搜索按钮操作
 */
const handleQuery = async () => {
	queryParams.pageNo = 1;
  getList();
}

/**
 * 重置按钮操作
 */
const resetQuery = () => {
  queryParams.pageNo = 1;
	queryParams.userId = '';
  queryParams.type = '';
	queryParams.clientId = '';
  getList();
};

/**
 * 强退按钮操作
 */
const handleDelete = async (accessToken:string) => {
	try {
		const {data} =await Oauth2Api.deleteAccessToken(accessToken);
		if(data === true){
			window.$message?.success("强退用户成功");
		}
		await getList();
  } catch (error) {
    console.log(error);
  }
}



onMounted(async () => {
  await getList();
});
</script>
