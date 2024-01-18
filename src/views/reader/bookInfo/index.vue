<template>
  <n-space vertical :size="16">
    <n-card title="用户信息" :bordered="false" size="small" class="rounded-8px shadow-sm" hoverable>
      <t-list :split="true">
        <t-list-item>
          <t-list-item-meta image="https://tdesign.gtimg.com/site/avatar.jpg">
            <template #title>
              {{ userInfo ? userInfo.nickname : '暂无昵称' }}
            </template>
            <template #description>
              <n-grid :x-gap="80" :y-gap="8" :cols="4">
                <n-gi>
                  <t-tooltip content="所属学院" theme="light">
                    <icon-uil:university class="text-24px mb0.9 mr2" />
                  </t-tooltip>
                  <t-tag theme="primary">
                    {{ userInfo && userInfo.dept.name ? userInfo.dept.name : '暂无学院信息' }}
                  </t-tag>
                </n-gi>
                <n-gi>
                  <t-tooltip content="所属班级" theme="light">
                    <icon-healthicons:i-training-class-outline class="text-28px mr2" />
                  </t-tooltip>
                  <t-tag theme="primary">
                    {{ userInfo && userInfo.sclass.name ? userInfo.sclass.name : '暂无班级信息' }}
                  </t-tag>
                </n-gi>
                <n-gi>
                  <t-tooltip content="剩余借阅额度/借阅额度" theme="light">
                    <icon-fluent:person-available-20-regular class="text-28px mr2 ml6" />
                  </t-tooltip>
                  <t-tag theme="primary">
                    {{
                      userInfo && userInfo.borrowCount
                        ? userInfo.borrowCount - userInfo.borrowedCount
                        : '暂无消费额度信息'
                    }}/{{ userInfo && userInfo.borrowCount ? userInfo.borrowCount : '暂无借阅额度信息' }}
                  </t-tag>
                </n-gi>
              </n-grid>
            </template>
          </t-list-item-meta>
        </t-list-item>
      </t-list>
    </n-card>
    <n-card title="书目信息" :bordered="false" size="small" class="rounded-8px shadow-sm" hoverable>
      <n-space :size="16" :wrap="false">
        <!-- 左侧：图书封面 -->
        <n-space :size="16">
          <n-avatar class="mt20" :size="200" src="https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg" />
        </n-space>

        <!-- 右侧：图书信息表单 -->
        <n-space :size="16" :wrap="false">
          <n-form v-loading="formLoading" :inline="true" :model="formBookData">
            <!-- 使用 n-grid 来布局表单项 -->
            <n-grid :cols="24" :x-gap="50">
              <!-- 图书名称 -->
              <n-form-item-gi :span="5" label="图书名字" path="title" required>
                <n-input v-model:value="formBookData.title" disabled placeholder="暂无相关信息" />
              </n-form-item-gi>

              <!-- 作者 -->
              <n-form-item-gi :span="5" label="作者" path="author" required>
                <n-input v-model:value="formBookData.author" disabled placeholder="暂无相关信息" />
              </n-form-item-gi>

              <!-- ISBN -->
              <n-form-item-gi :span="5" label="ISBN" path="isbn" required>
                <n-input v-model:value="formBookData.isbn" disabled placeholder="暂无相关信息" />
              </n-form-item-gi>

              <!-- 分类 -->
              <n-form-item-gi :span="7" label="分类" path="categoryId" required>
                <n-tree-select
                  v-model:value="formBookData.categoryId"
                  filterable
                  checkable
                  :options="categoryList"
                  default-expand-all
                  label-field="name"
                  disabled
                  key-field="id"
                  children-field="children"
                  clearable
                  placeholder="暂无相关信息"
                ></n-tree-select>
              </n-form-item-gi>

              <n-form-item-gi :span="5" label="出版社" path="publisher" required>
                <n-input v-model:value="formBookData.publisher" disabled placeholder="暂无相关信息" />
              </n-form-item-gi>
              <n-form-item-gi :span="5" label="出版地" path="pubCity">
                <n-input v-model:value="formBookData.pubCity" disabled placeholder="暂无相关信息" />
              </n-form-item-gi>
              <n-form-item-gi :span="5" label="出版国家" path="pubCountry">
                <n-input v-model:value="formBookData.pubCountry" disabled placeholder="暂无相关信息" />
              </n-form-item-gi>
              <n-form-item-gi :span="7" label="主题词" required>
                <n-select
                  v-model:value="formBookData.subjectIds"
                  multiple
                  filterable
                  disabled
                  label-field="name"
                  value-field="id"
                  :options="subjectList"
                  placeholder="暂无相关信息"
                ></n-select>
              </n-form-item-gi>
              <n-form-item-gi :span="4" label="出版时间" path="pubDate">
                <n-input-number
                  v-model:value="formBookData.pubDate"
                  disabled
                  :show-button="false"
                  placeholder="暂无相关信息"
                />
              </n-form-item-gi>
              <n-form-item-gi :span="3" label="价格" path="price" required>
                <n-input-number
                  v-model:value="formBookData.price"
                  :show-button="false"
                  disabled
                  :min="0"
                  placeholder="暂无信息"
                >
                  <template #prefix>￥</template>
                </n-input-number>
              </n-form-item-gi>
              <n-form-item-gi :span="3" label="页数" path="pages">
                <n-input-number v-model:value="formBookData.pages" :show-button="false" disabled placeholder="暂无信息">
                  <template #suffix>页</template>
                </n-input-number>
              </n-form-item-gi>
              <n-form-item-gi :span="5" label="索书号" path="callNumber">
                <n-input v-model:value="formBookData.callNumber" disabled placeholder="暂无相关信息" />
              </n-form-item-gi>
              <n-form-item-gi :span="7" label="中图分类" path="classification">
                <n-input v-model:value="formBookData.classification" disabled placeholder="暂无相关信息" />
              </n-form-item-gi>
              <n-form-item-gi :span="12" label="本书摘要" path="abstracts">
                <n-input
                  v-model:value="formBookData.abstracts"
                  type="textarea"
                  disabled
                  maxlength="250"
                  placeholder="暂无相关信息"
                  show-count
                  :autosize="{
                    minRows: 2,
                    maxRows: 5
                  }"
                />
              </n-form-item-gi>
              <n-form-item-gi :span="10" label="丛编项" path="series">
                <n-input
                  v-model:value="formBookData.series"
                  type="textarea"
                  maxlength="50"
                  show-count
                  :autosize="{
                    minRows: 2,
                    maxRows: 5
                  }"
                  disabled
                  placeholder="暂无相关信息"
                />
              </n-form-item-gi>
            </n-grid>
          </n-form>
        </n-space>
      </n-space>
    </n-card>

    <n-card title="馆藏信息" :bordered="false" size="small" class="rounded-8px shadow-sm" hoverable>
      <!-- 馆藏信息数据表格 -->
      <n-data-table
        :loading="loading"
        striped
        remote
        :single-line="false"
        :data="list"
        :row-key="rowKey"
        :columns="columns"
        :pagination="pagination"
      />
    </n-card>
    <n-modal v-model:show="formShow" transform-origin="center">
      <n-card style="width: 600px" title="借阅信息" :bordered="false" size="huge" role="dialog" aria-modal="true">
        <n-form
          ref="formRef"
          v-loading="formLoading"
          :rules="rules"
          :model="formData"
          label-placement="left"
          label-width="80px"
        >
          <n-grid :cols="24" :x-gap="1">
            <n-form-item-gi :span="12" label="书名">
              <n-input v-model:value="formBookData.title" disabled placeholder="暂无相关信息" />
            </n-form-item-gi>
            <n-form-item-gi :span="12" label="作者">
              <n-input v-model:value="formBookData.author" disabled placeholder="暂无相关信息" />
            </n-form-item-gi>
            <n-form-item-gi :span="12" label="ISBN">
              <n-input v-model:value="formBookData.isbn" disabled placeholder="暂无相关信息" />
            </n-form-item-gi>
            <n-form-item-gi :span="12" label="索书号">
              <n-input v-model:value="formBookData.callNumber" disabled placeholder="暂无相关信息" />
            </n-form-item-gi>
            <n-form-item-gi :span="12" label="条形码">
              <n-input v-model:value="formData.barCode" disabled placeholder="暂无相关信息" />
            </n-form-item-gi>
            <n-form-item-gi :span="12" label="书库">
              <n-input v-model:value="formData.stack.name" disabled placeholder="暂无相关信息" />
            </n-form-item-gi>
            <n-form-item-gi :span="12" label="借阅人">
              <t-tag theme="primary">{{ userInfo ? userInfo.nickname : '暂无昵称' }}</t-tag>
            </n-form-item-gi>
            <n-form-item-gi :span="12" label="起始时间">
              <t-tag theme="primary">
                <template #content>
                  <n-time time-zone="Asia/Shanghai" format="yyyy-MM-dd HH:mm" />
                </template>
              </t-tag>
            </n-form-item-gi>
            <n-form-item-gi :span="24" label="归还时间" required path="expectReturnTime">
              <n-date-picker
                v-model:value="formData.expectReturnTime"
                type="datetime"
                placeholder="请选择归还时间"
                :is-date-disabled="isDateDisabled"
                :shortcuts="shortcuts"
                placement="bottom-end"
                style="width: 87%"
              >
                <template #footer>同学合理安排借阅时间哦🧡</template>
              </n-date-picker>
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
  </n-space>
</template>

<script setup lang="tsx">
/* eslint-disable */
import { ref, h, reactive, onMounted } from 'vue'; // 导入 Vue Composition API 中的函数
import { useRoute } from 'vue-router'; // 导入 Vue Router 中的 useRoute 函数
import { NSpace, NButton, NPopconfirm, NTime } from 'naive-ui'; // 导入 Naive UI 中的一些组件
import type { DataTableColumns, FormRules } from 'naive-ui'; // 导入 Naive UI 中的一些类型
import { routeName } from '@/router';
import { useRouterPush } from '@/composables';
import * as InventoryApi from '@/service/api/inventory'; // 导入库存相关的 API 调用
import * as BookApi from '@/service/api/bookSku'; // 导入图书 SKU 相关的 API 调用
import { handleTree } from '@/utils/common/tree'; // 导入处理树状数据的工具函数
import * as CategoryApi from '@/service/api/category'; // 导入图书分类相关的 API 调用
import * as SubjectApi from '@/service/api/subject'; // 导入主题词相关的 API 调用
import * as ReaderApi from '@/service/api/reader'; // 导入读者相关的 API 调用
import * as UserProfilesApi from '@/service/api/userProfile'; // 导入用户相关的 API 调用

// 使用 useRoute 获取当前路由信息
const route = useRoute();

// 响应式引用，存储列表数据
const list = ref([]);

const formRef = ref();

// 响应式引用，存储图书分类列表
const categoryList = ref([]);

// 响应式引用，存储主题词列表
const subjectList = ref([]);

const userInfo = ref({
  id: undefined,
  username: '',
  nickname: '',
  dept: {
    id: undefined,
    name: ''
  },
  sclass: {
    id: undefined,
    name: ''
  },
  borrowedCount: 0,
  borrowCount: 0,
  roles: [],
  posts: [],
  socialUser: [],
  email: '',
  mobile: '',
  sex: undefined,
  avatar: '',
  status: undefined,
  remark: '',
  loginIp: '',
  loginDate: '',
  createTime: ''
});

// 表单加载状态
const formLoading = ref(false); // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用

// loading
const loading = ref(false); // 数据加载中的标识

const receiveBookId = ref(); // 用于存储接收的图书ID
const formShow = ref(false); // 表单的显示状态，控制表单的显示和隐藏
const pageCount = ref(0); // 分页的总页数

// 响应式引用，存储表单数据
const formBookData = ref({
  title: '',
  picUrl: '',
  isbn: '',
  price: 0.0,
  categoryId: '',
  subjectIds: [],
  callNumber: '',
  publisher: '',
  pubCity: '',
  pubCountry: '',
  pubDate: 0,
  pages: 0,
  series: '',
  abstracts: '',
  author: '',
  classification: '',
  coreName: 'BOOK',
  status: 0
});

// 响应式引用，存储查询参数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  bookId: 0,
  stackId: null,
  barCode: ''
});

// 定义行数据类型
type RowData = {
  id: number;
  bookId: number;
  stackId: number;
  barCode: string;
  location: string;
  status: number;
  createTime: Date;
  stack: [id: number, name: number];
};

// 列配置
const columns: DataTableColumns<RowData> = [
  { key: 'callNumber', title: '索书号', align: 'center', width: 100 },
  { key: 'barCode', title: '条形码', align: 'center', width: 100 },
  { key: 'stack.name', title: '馆藏地址', align: 'center', width: 80 },
  {
    key: 'location',
    title: '详细地址',
    align: 'center',
    width: 100,
    render: (row: any) => {
      return row.location ? (
        row.location
      ) : (
        <t-tag theme="warning" variant="outline">
          暂无信息
        </t-tag>
      );
    }
  },
  {
    key: 'status',
    title: '图书状态',
    align: 'center',
    width: 50,
    render: (row: any) => {
      const statusMappings = {
        '-1': { text: '促销处理中', theme: 'danger' },
        '3': { text: '采购中', theme: 'primary', variant: 'light' },
        '4': { text: '下架', theme: 'danger', variant: 'light-outline' },
        '2': { text: '展示图书(暂不外借)', theme: 'success' },
        '1': { text: '外借中', theme: 'warning' },
        '0': { text: '在架', theme: 'primary' },
        default: { text: '未知状态', theme: 'danger', variant: 'light-outline' }
      };
      // @ts-ignore
      const statusInfo = statusMappings[row.status] || statusMappings.default;
      return (
        <t-tag theme={statusInfo.theme} variant={statusInfo.variant}>
          {statusInfo.text}
        </t-tag>
      );
    }
  },
  {
    key: 'action',
    title: '操作',
    width: 100,
    align: 'center',
    render: (row: any) => {
      return (
        <NSpace justify={'center'}>
          <NPopconfirm
            onPositiveClick={() => {
              handleBorrow(row.id);
            }}
          >
            {{
              default: () => `您要借阅的书为"${formBookData.value.title}",借阅条形码为：${row.barCode},是否确认借阅？`,
              trigger: () => (
                <NButton size={'small'} disabled={row.status === 1} color="#8a2be2">
                  借阅
                </NButton>
              )
            }}
          </NPopconfirm>
        </NSpace>
      );
    }
  }
];

// 定义数据表格key
const rowKey = (rowData: any) => {
  return rowData.id;
};

const pagination = reactive({
  page: queryParams.pageNo, // 当前页数，使用查询参数中的 pageNo
  pageCount: pageCount.value, // 总页数，使用之前定义的 pageCount 变量
  pageSize: queryParams.pageSize, // 每页显示的条目数，使用查询参数中的 pageSize
  itemCount: 0, // 总条目数，默认为 0，需要在获取数据后更新
  pageSizes: [10, 20, 30, 50], // 可选的每页条目数选项
  showSizePicker: true, // 是否显示每页条目数选择器
  showQuickJumper: true, // 是否显示快速跳转到页码输入框

  // 前缀文本函数，显示共有多少条记录
  // @ts-ignore
  prefix({ itemCount }) {
    return `共有 ${itemCount} 条记录`;
  },

  // 当页码改变时触发的回调函数
  onChange: (page: number) => {
    queryParams.pageNo = page; // 更新查询参数中的当前页数
    getList(); // 调用获取数据的函数
  },

  // 当每页条目数改变时触发的回调函数
  onUpdatePageSize: (pageSize: number) => {
    queryParams.pageSize = pageSize; // 更新查询参数中的每页条目数
    queryParams.pageNo = 1; // 重置当前页数为第一页
    getList(); // 调用获取数据的函数
  }
});

// 获取库存数据
const getList = async () => {
  loading.value = true; // 开始加载数据，设置 loading 为 true
  try {
    const { data } = await InventoryApi.getInventoryPage(queryParams); // 调用 API 获取库存数据

    // 对返回的库存数据进行处理，更新 list 响应式引用
    list.value = data.list.map((item: any) => {
      return {
        ...item,
        callNumber: formBookData.value.callNumber // 添加 callNumber 字段
      };
    });

    // 更新分页信息
    pagination.page = queryParams.pageNo;
    pagination.pageSize = queryParams.pageSize;
    pagination.itemCount = data.total;
    pageCount.value = Math.ceil(pagination.itemCount / pagination.pageSize);
  } finally {
    loading.value = false; // 数据加载完成，设置 loading 为 false
  }
};

const isDateDisabled = (ts: number) => {
  const selectedDate = new Date(ts);
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0); // 重置时间部分为0，只比较日期

  const maxSelectableDate = new Date();
  maxSelectableDate.setDate(currentDate.getDate() + 30); // 设置最大可选择日期为今天加上30天

  return selectedDate < currentDate || selectedDate > maxSelectableDate;
};

const rules: FormRules = {
  expectReturnTime: [{ type: 'number', required: true, trigger: ['blur', 'change'], message: '请选择归还时间' }]
};

const shortcuts = {
  '7天': () => new Date().getTime() + 24 * 60 * 60 * 1000 * 7,
  '15天': () => new Date().getTime() + 24 * 60 * 60 * 1000 * 15,
  '30天': () => new Date().getTime() + 24 * 60 * 60 * 1000 * 30
};

const getUserInfo = async () => {
  const { data } = await UserProfilesApi.getUserProfile();
  // @ts-ignore
  userInfo.value = data;
};

// 获取图书数据
const getBookData = async () => {
  const { data } = await BookApi.getBookSku(receiveBookId.value); // 调用 API 获取图书数据
  // @ts-ignore
  formBookData.value = data; // 更新 formBookData 响应式引用
};

// 获取图书分类数据
const getCategoryData = async () => {
  const { data } = await CategoryApi.fetchSimpleCategoryList(); // 调用 API 获取图书分类数据
  // @ts-ignore
  categoryList.value.push(...handleTree(data)); // 更新 categoryList 响应式引用
};

// 获取主题词数据
const getSubjectData = async () => {
  const { data } = await SubjectApi.fetchSimpleSubjectList(); // 调用 API 获取主题词数据
  // @ts-ignore
  subjectList.value = data; // 更新 subjectList 响应式引用
};

// function handleToTab() {
//   routerPush({ name: routeName('function_tab') });
// }

const formData = ref({
  bookId: 0,
  stackId: 0,
  userId: 0,
  stack: {
    id: 0,
    name: ''
  },
  barCode: '',
  expectReturnTime: null
});
const handleBorrow = async (id: number) => {
  const { data } = await InventoryApi.getInventory(id);
  // @ts-ignore
  formData.value = data;
  formShow.value = true;
};

const { routerPush } = useRouterPush();
const handleToBorrowDetail = (serialNumber: string) => {
  routerPush({ name: routeName('reader_borrowDetail'), query: { serialNumber } });
};

async function submitFrom() {
  if (!formRef.value) return;
  await formRef.value.validate();
  // @ts-ignore
  formData.value.userId = userInfo.value.id;
  // 提交表单
  loading.value = true;
  try {
    const param = formData.value as unknown as ReaderApi.borrowBookReqVO;
    const { data } = await ReaderApi.borrowBook(param);
    if (data !== null) {
      window.$notification?.create({
        title: '借阅成功',
        content: `您的借阅申请已提交，请等待管理员审核，审核通过后即可领书。借阅流水号为:${data}`,
        meta: () => h(NTime),
        action: () =>
          h(
            NButton,
            {
              text: true,
              type: 'primary',
              onClick: () => {
                // @ts-ignore
                handleToBorrowDetail(data);
              }
            },
            {
              default: () => '查看详情'
            }
          )
      });
    }
    close();
    await getList();
    await getUserInfo();
  } finally {
    loading.value = false;
  }
}

const close = () => {
  formShow.value = false;
  formData.value.expectReturnTime = null;
};

// 在组件挂载时获取列表数据
onMounted(async () => {
  // 从路由参数中获取图书 ID 并设置接收的图书 ID
  receiveBookId.value = route.query.num;

  // 设置查询参数的图书 ID
  queryParams.bookId = parseInt(receiveBookId.value);

  // 获取图书数据、分类数据、主题数据和列表数据
  await getUserInfo();
  await getBookData();
  await getCategoryData();
  await getSubjectData();
  await getList();
});
</script>

<style scoped></style>
