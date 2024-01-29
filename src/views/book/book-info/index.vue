<template>
  <n-space vertical :size="16">
    <n-card title="书目信息" :bordered="false" size="small" class="rounded-8px shadow-sm" hoverable>
      <n-space :size="16" :wrap="false">
        <!-- 左侧：图书封面 -->
        <n-space :size="16">
          <n-avatar class="mt20" :size="200" src="https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg" />
        </n-space>

        <!-- 右侧：图书信息表单 -->
        <n-space :size="16" :wrap="false">
          <n-form ref="formRef" v-loading="formLoading" :inline="true" :model="formBookData">
            <!-- 使用 n-grid 来布局表单项 -->
            <n-grid :cols="24" :x-gap="50">
              <!-- 图书名称 -->
              <n-form-item-gi :span="5" label="图书名字" path="title" required>
                <n-input
                  v-model:value="formBookData.title"
                  :loading="titleLoading"
                  placeholder="请输入图书名字"
                  @change="handleTitleChange"
                />
              </n-form-item-gi>

              <!-- 作者 -->
              <n-form-item-gi :span="5" label="作者" path="author" required>
                <n-input
                  v-model:value="formBookData.author"
                  :loading="authorLoading"
                  placeholder="请输入图书作者"
                  @change="handleAuthorChange"
                />
              </n-form-item-gi>

              <!-- ISBN -->
              <n-form-item-gi :span="5" label="ISBN" path="isbn" required>
                <n-input
                  v-model:value="formBookData.isbn"
                  :loading="isbnLoading"
                  placeholder="请输入图书标准编码"
                  @change="handleIsbnChange"
                />
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
                  key-field="id"
                  children-field="children"
                  clearable
                  :loading="categoryLoading"
                  placeholder="请选择图书分类"
                  @update:value="handleCategoryChange"
                >
                  <template #action>
                    <n-gradient-text type="info">📣:图书分类较多，您可以输入检索信息快速搜索。</n-gradient-text>
                  </template>
                </n-tree-select>
              </n-form-item-gi>

              <n-form-item-gi :span="5" label="出版社" path="publisher" required>
                <n-input
                  v-model:value="formBookData.publisher"
                  :loading="publisherLoading"
                  placeholder="请输入图书出版社"
                  @change="handlePublisherChange"
                />
              </n-form-item-gi>
              <n-form-item-gi :span="5" label="出版地" path="pubCity">
                <n-input
                  v-model:value="formBookData.pubCity"
                  :loading="pubCityLoading"
                  placeholder="请输入图书出版地"
                  @change="handlePubCityChange"
                />
              </n-form-item-gi>
              <n-form-item-gi :span="5" label="出版国家" path="pubCountry">
                <n-input
                  v-model:value="formBookData.pubCountry"
                  :loading="pubCountryLoading"
                  placeholder="请输入图书出版国家"
                  @change="handlePubCountryChange"
                />
              </n-form-item-gi>
              <n-form-item-gi :span="7" label="主题词" required>
                <n-select
                  v-model:value="formBookData.subjectIds"
                  multiple
                  :loading="subjectLoading"
                  filterable
                  label-field="name"
                  value-field="id"
                  :options="subjectList"
                  placeholder="请为其分配主题词"
                  @update:value="handleSubjectChange"
                >
                  <template #action>
                    <n-gradient-text type="info">📢:主题词信息较多，您可以输入检索信息快速搜索。</n-gradient-text>
                  </template>
                </n-select>
              </n-form-item-gi>
              <n-form-item-gi :span="4" label="出版时间" path="pubDate">
                <n-input-number
                  v-model:value="formBookData.pubDate"
                  placeholder="图书出版时间"
                  @update:value="handlePubDateChange"
                />
              </n-form-item-gi>
              <n-form-item-gi :span="3" label="价格" path="price" required>
                <n-input-number
                  v-model:value="formBookData.price"
                  :show-button="false"
                  :min="0"
                  @update:value="handlePriceChange"
                >
                  <template #prefix>￥</template>
                </n-input-number>
              </n-form-item-gi>
              <n-form-item-gi :span="3" label="页数" path="pages">
                <n-input-number
                  v-model:value="formBookData.pages"
                  :loading="pagesLoading"
                  :show-button="false"
                  @update:value="handlePagesChange"
                >
                  <template #suffix>页</template>
                </n-input-number>
              </n-form-item-gi>
              <n-form-item-gi :span="5" label="索书号" path="callNumber">
                <n-input
                  v-model:value="formBookData.callNumber"
                  :loading="callNumberLoading"
                  placeholder="请输入图书索书号"
                  @change="handleCallNumberChange"
                />
              </n-form-item-gi>
              <n-form-item-gi :span="7" label="中图分类" path="classification">
                <n-input
                  v-model:value="formBookData.classification"
                  :loading="classificationLoading"
                  placeholder="请输入图书所属中图分类"
                  @change="handleClassificationChange"
                />
              </n-form-item-gi>
              <n-form-item-gi :span="12" label="本书摘要" path="abstracts">
                <n-input
                  v-model:value="formBookData.abstracts"
                  type="textarea"
                  maxlength="250"
                  :loading="abstractsLoading"
                  show-count
                  :autosize="{
                    minRows: 2,
                    maxRows: 5
                  }"
                  placeholder="请于此处输入图书摘要信息"
                  @change="handleAbstractsChange"
                />
              </n-form-item-gi>
              <n-form-item-gi :span="10" label="丛编项" path="series">
                <n-input
                  v-model:value="formBookData.series"
                  type="textarea"
                  :loading="seriesLoading"
                  maxlength="50"
                  show-count
                  :autosize="{
                    minRows: 2,
                    maxRows: 5
                  }"
                  placeholder="请于此处输入图书丛编项"
                  @change="handleSeriesChange"
                />
              </n-form-item-gi>
            </n-grid>
          </n-form>
        </n-space>
      </n-space>
    </n-card>

    <n-card title="馆藏信息" :bordered="false" size="small" class="rounded-8px shadow-sm" hoverable>
      <!-- 新增按钮 -->
      <n-button plain type="primary" class="ml1 mb2" @click="openForm('create')">
        <template #icon>
          <icon-fluent:add-12-regular class="text-20px" />
        </template>
        新增
      </n-button>

      <!-- 导出按钮 -->
      <n-button plain class="mr3 ml3" type="success" @click="handleExport">
        <template #icon>
          <icon-uil:import class="text-20px" />
        </template>
        导出
      </n-button>

      <!-- 导入按钮 -->
      <n-button plain class="mr3" type="warning" @click="handleImport">
        <template #icon>
          <icon-ep:upload class="text-20px" />
        </template>
        导入
      </n-button>

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

    <!-- 馆藏信息编辑弹窗 -->
    <n-modal v-model:show="formShow" transform-origin="center">
      <n-card style="width: 600px" title="库存信息" :bordered="false" size="huge" role="dialog" aria-modal="true">
        <!-- 弹窗头部：关闭按钮 -->
        <template #header-extra>
          <icon-line-md:close class="text-20px" @click="formStackClose" />
        </template>

        <!-- 弹窗内容：馆藏信息编辑表单 -->
        <n-form
          ref="formStackRef"
          v-loading="formLoading"
          :rules="rules"
          :model="formStackData"
          label-placement="left"
          label-width="80px"
        >
          <!-- 图书名字展示 -->
          <n-form-item label="图书">
            <n-input v-model:value="formBookData.title" disabled style="width: 80%" />
          </n-form-item>

          <!-- 条形码输入框 -->
          <n-form-item label="条形码" path="barCode">
            <n-input v-model:value="formStackData.barCode" placeholder="请输入图书条形码" style="width: 80%" />
          </n-form-item>

          <!-- 馆藏地址选择 -->
          <n-form-item label="馆藏地址" path="stackId" style="width: 57%">
            <n-select
              v-model:value="formStackData.stackId"
              clearable
              placeholder="请选择馆藏地址"
              :options="stackList"
              label-field="name"
              value-field="id"
              key-field="id"
            />
          </n-form-item>

          <!-- 图书状态选择 -->
          <n-form-item label="图书状态" path="status" style="width: 50%">
            <n-select
              v-model:value="formStackData.status"
              clearable
              placeholder="请选择图书状态"
              :options="DictOptions"
            />
          </n-form-item>

          <!-- 详细地址输入框 -->
          <n-form-item label="详细地址" path="location">
            <n-input
              v-model:value="formStackData.location"
              type="textarea"
              :autosize="{
                minRows: 2,
                maxRows: 5
              }"
              placeholder="请输入详细地址"
            />
          </n-form-item>
        </n-form>

        <!-- 弹窗底部按钮 -->
        <template #footer>
          <n-space style="float: right">
            <n-button type="primary" @click="submitFrom">确 定</n-button>
            <n-button @click="formStackClose">取 消</n-button>
          </n-space>
        </template>
      </n-card>
    </n-modal>

    <n-modal v-model:show="uploadShow" transform-origin="center" preset="dialog" title="库存导入">
      <!-- 文件上传部分 -->
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
        <!-- 文件上传拖拽区域 -->
        <n-upload-dragger>
          <div style="margin-bottom: 12px; width: 333px">
            <n-icon size="48" :depth="3">
              <icon-line-md:upload-loop />
            </n-icon>
          </div>
          <n-text style="font-size: 16px">点击或者拖动文件到该区域来上传</n-text>
        </n-upload-dragger>
      </n-upload>

      <!-- 是否更新已存在的用户数据的选择 -->
      <n-space justify="center">
        <n-checkbox v-model:checked="updateSupport" class="m2">是否更新已经存在的用户数据</n-checkbox>
      </n-space>

      <!-- 文件格式说明和模板下载 -->
      <n-space justify="center">
        仅允许导入xlsx、xls格式的文件。
        <n-button text type="primary" @click="importTemplate">下载模板</n-button>
      </n-space>

      <!-- 底部操作按钮 -->
      <template #action>
        <n-button type="primary" @click="submitUploadForm">确定</n-button>
        <n-button @click="closeUploadForm">取消</n-button>
      </template>
    </n-modal>
  </n-space>
</template>

<script setup lang="tsx">
/* eslint-disable */
import { ref, h, reactive, onMounted } from 'vue';  // 导入 Vue Composition API 中的函数
import { useRoute } from 'vue-router';  // 导入 Vue Router 中的 useRoute 函数
import { NSpace, NTime, NButton, NPopconfirm } from 'naive-ui';  // 导入 Naive UI 中的一些组件
import type { DataTableColumns, MessageReactive, FormRules, FormInst } from 'naive-ui';  // 导入 Naive UI 中的一些类型
import { formatDate } from '@/utils/common/formatTime';  // 导入格式化时间的函数
import * as InventoryApi from '@/service/api/inventory';  // 导入库存相关的 API 调用
import * as BookApi from '@/service/api/bookSku';  // 导入图书 SKU 相关的 API 调用
import download from '@/utils/common/download';  // 导入文件下载的工具函数
import { handleTree } from '@/utils/common/tree';  // 导入处理树状数据的工具函数
import * as CategoryApi from '@/service/api/category';  // 导入图书分类相关的 API 调用
import * as SubjectApi from '@/service/api/subject';  // 导入主题词相关的 API 调用
import * as StackApi from '@/service/api/stack';  // 导入馆藏地址相关的 API 调用
import * as BookRelevance from '@/service/api/bookRelevance';  // 导入图书关联相关的 API 调用
import { formRules } from '~/src/utils';  // 导入自定义的表单规则
import { getServiceEnvConfig } from '~/.env-config';  // 导入获取环境配置的函数

// 使用 useRoute 获取当前路由信息
const route = useRoute();

// 响应式引用，存储列表数据
const list = ref([]);

// 响应式引用，存储图书分类列表
const categoryList = ref([]);

// 响应式引用，存储主题词列表
const subjectList = ref([]);

// 响应式引用，存储馆藏地址列表
const stackList = ref([]);

// 表单加载状态
const formLoading = ref(false); // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用

// 表单类型
const formType = ref(''); // 表单的类型：create - 新增；update - 修改



// loading
const loading = ref(false);  // 数据加载中的标识
const titleLoading = ref(false);  // 图书名字的加载中状态
const exportLoading = ref(false);  // 导出操作的加载中状态
const authorLoading = ref(false);  // 图书作者的加载中状态
const isbnLoading = ref(false);  // 图书标准编码的加载中状态
const publisherLoading = ref(false);  // 图书出版社的加载中状态
const pubCityLoading = ref(false);  // 图书出版地的加载中状态
const pubCountryLoading = ref(false);  // 图书出版国家的加载中状态
const callNumberLoading = ref(false);  // 图书索书号的加载中状态
const classificationLoading = ref(false);  // 图书所属中图分类的加载中状态
const abstractsLoading = ref(false);  // 图书摘要的加载中状态
const pagesLoading = ref(false);  // 图书页数的加载中状态
const categoryLoading = ref(false);  // 图书分类的加载中状态
const subjectLoading = ref(false);  // 主题词的加载中状态
const seriesLoading = ref(false);  // 图书丛编项的加载中状态

const receiveBookId = ref();  // 用于存储接收的图书ID
const formShow = ref(false);  // 表单的显示状态，控制表单的显示和隐藏
const pageCount = ref(0);  // 分页的总页数

// 响应式引用，存储表单数据
const formBookData = ref({
  title: '',
	picUrl:'',
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
  { key: 'location', title: '详细地址', align: 'center', width: 100 ,render:(row:any)=>{return(row.location?row.location:<t-tag theme="warning" variant="outline">暂无信息</t-tag>)}},
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
    key: 'createTime',
    title: '创建时间',
    align: 'center',
    width: 100,
    render: (row: any) => {
      return formatDate(row.createTime);
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

// 定义数据表格key
const rowKey = (rowData: any) => {
  return rowData.id;
};

const pagination = reactive({
  page: queryParams.pageNo,  // 当前页数，使用查询参数中的 pageNo
  pageCount: pageCount.value,  // 总页数，使用之前定义的 pageCount 变量
  pageSize: queryParams.pageSize,  // 每页显示的条目数，使用查询参数中的 pageSize
  itemCount: 0,  // 总条目数，默认为 0，需要在获取数据后更新
  pageSizes: [10, 20, 30, 50],  // 可选的每页条目数选项
  showSizePicker: true,  // 是否显示每页条目数选择器
  showQuickJumper: true,  // 是否显示快速跳转到页码输入框

  // 前缀文本函数，显示共有多少条记录
  // @ts-ignore
  prefix({ itemCount }) {
    return `共有 ${itemCount} 条记录`;
  },

  // 当页码改变时触发的回调函数
  onChange: (page: number) => {
    queryParams.pageNo = page;  // 更新查询参数中的当前页数
    getList();  // 调用获取数据的函数
  },

  // 当每页条目数改变时触发的回调函数
  onUpdatePageSize: (pageSize: number) => {
    queryParams.pageSize = pageSize;  // 更新查询参数中的每页条目数
    queryParams.pageNo = 1;  // 重置当前页数为第一页
    getList();  // 调用获取数据的函数
  }
});


// 获取库存数据
const getList = async () => {
  loading.value = true;  // 开始加载数据，设置 loading 为 true
  try {
    const { data } = await InventoryApi.getInventoryPage(queryParams);  // 调用 API 获取库存数据

    // 对返回的库存数据进行处理，更新 list 响应式引用
    list.value = data.list.map((item: any) => {
      return {
        ...item,
        callNumber: formBookData.value.callNumber  // 添加 callNumber 字段
      };
    });

    // 更新分页信息
    pagination.page = queryParams.pageNo;
    pagination.pageSize = queryParams.pageSize;
    pagination.itemCount = data.total;
    pageCount.value = Math.ceil(pagination.itemCount / pagination.pageSize);
  } finally {
    loading.value = false;  // 数据加载完成，设置 loading 为 false
  }
};

// 获取图书数据
const getBookData = async () => {
  const { data } = await BookApi.getBookSku(receiveBookId.value);  // 调用 API 获取图书数据
  // @ts-ignore
  formBookData.value = data;  // 更新 formBookData 响应式引用
};

// 获取图书分类数据
const getCategoryData = async () => {
  const { data } = await CategoryApi.fetchSimpleCategoryList();  // 调用 API 获取图书分类数据
  // @ts-ignore
  categoryList.value.push(...handleTree(data));  // 更新 categoryList 响应式引用
};

// 获取主题词数据
const getSubjectData = async () => {
  const { data } = await SubjectApi.fetchSimpleSubjectList();  // 调用 API 获取主题词数据
  // @ts-ignore
  subjectList.value = data;  // 更新 subjectList 响应式引用
};

// 图书标题更改时的回调函数
async function handleTitleChange (value: string) {
	titleLoading.value = true;
	try{
		const {data} = await BookApi.updateBookTitle(parseInt(receiveBookId.value),value);
		if (data === true){
			window.$message?.success('修改成功:图书名字已更新为 "'+value+'"')
		}
	}finally{
		titleLoading.value = false;
	}
};

// 图书作者更改时的回调函数
async function handleAuthorChange (value: string) {
	authorLoading.value = true;
	try{
		const {data} = await BookApi.updateBookAuthor(parseInt(receiveBookId.value),value);
		if (data === true){
			window.$message?.success('修改成功:图书作者已更新为 "'+value+'"');
		}
	}finally{
		authorLoading.value = false;
	}
};

// 图书ISBN更改时的回调函数
async function handleIsbnChange (value: string) {
	isbnLoading.value = true;
	try{
		const {data} = await BookApi.updateBookIsbn(parseInt(receiveBookId.value),value);
		if (data === true){
			window.$message?.success('修改成功:图书标准编码已更新为 "'+value+'"');
		}
	}finally{
		isbnLoading.value = false;
	}
};

// 图书出版社更改时的回调函数
async function handlePublisherChange (value: string) {
	publisherLoading.value = true;
	try{
		const {data} = await BookApi.updateBookPublisher(parseInt(receiveBookId.value),value);
		if (data === true){
			window.$message?.success('修改成功:图书出版社已更新为 "'+value+'"');
		}
	}finally{
		publisherLoading.value = false;
	}
};

// 图书出版地更改时的回调函数
async function handlePubCityChange (value: string) {
	pubCityLoading.value = true;
	try{
		const {data} = await BookApi.updateBookPubCity(parseInt(receiveBookId.value),value);
		if (data === true){
			window.$message?.success('修改成功:图书出版地已更新为 "'+value+'"');
		}
	}finally{
		pubCityLoading.value = false;
	}
};

// 图书出版国家更改时的回调函数
async function handlePubCountryChange (value: string) {
	pubCountryLoading.value = true;
	try{
		const {data} = await BookApi.updateBookPubCountry(parseInt(receiveBookId.value),value);
		if (data === true){
			window.$message?.success('修改成功:图书出版国家已更新为 "'+value+'"');
		}
	}finally{
		pubCountryLoading.value = false;
	}
};

// 图书出版时间更改时的回调函数
async function handlePubDateChange (value: number | null) {
	if(value === null){
		return;
	}
	const {data} = await BookApi.updateBookPubDate(parseInt(receiveBookId.value),value);
	if (data === true){
		window.$message?.success('修改成功:图书出版时间已更新为 "'+value+'"');
	}
};

// 图书价格更改时的回调函数
async function handlePriceChange (value: number | null) {
	if(value === null){
		return;
	}
	const {data} = await BookApi.updateBookPrice(parseInt(receiveBookId.value),value);
	if (data === true){
		window.$message?.success('修改成功:图书价格已更新为 "'+value+'"元');
	}
};

// 图书页数更改时的回调函数
async function handlePagesChange (value: number | null) {
	if(value === null){
		return;
	}
	pagesLoading.value = true;
	try{
		const {data} = await BookApi.updateBookPages(parseInt(receiveBookId.value),value);
		if (data === true){
		window.$message?.success('修改成功:图书页数已更新为 "'+value+'"页');
		}
	}finally{
	pagesLoading.value = false;
	}
};

// 图书索书号更改时的回调函数
async function handleCallNumberChange (value: string) {
	callNumberLoading.value = true;
	try{
		const {data} = await BookApi.updateBookCallNumber(parseInt(receiveBookId.value),value);
		if (data === true){
			window.$message?.success('修改成功:图书索书号已更新为 "'+value+'"');
		}
	}finally{
		callNumberLoading.value = false;
	}
};

// 图书所属中图分类更改时的回调函数
async function handleClassificationChange (value: string) {
	classificationLoading.value = true;
	try{
		const {data} = await BookApi.updateBookClassification(parseInt(receiveBookId.value),value);
		if (data === true){
			window.$message?.success('修改成功:图书所属中图分类已更新为 "'+value+'"');
		}
	}finally{
		classificationLoading.value = false;
	}
};

// 图书摘要更改时的回调函数
async function handleAbstractsChange (value: string) {
	abstractsLoading.value = true;
	try{
		const {data} = await BookApi.updateBookAbstracts(parseInt(receiveBookId.value),value);
		if (data === true){
			window.$message?.success('修改成功:图书摘要已更新为 "'+value+'"');
		}
	}finally{
		abstractsLoading.value = false;
	}
};

// 图书丛编项更改时的回调函数
async function handleSeriesChange (value: string) {
	seriesLoading.value = true;
	try{
		const {data} = await BookApi.updateBookSeries(parseInt(receiveBookId.value),value);
		if (data === true){
			window.$message?.success('修改成功:图书丛编项已更新为 "'+value+'"');
		}
	}finally{
		seriesLoading.value = false;
	}
};

// 图书分类更改时的回调函数
async function handleCategoryChange (value: number) {
	categoryLoading.value = true;
	const param = {
		bookId: parseInt(receiveBookId.value),
		categoryId: value
	}
	try{
		const {data} = await BookRelevance.assignBookCategory(param);
		if (data === true){
		window.$message?.success('修改成功:图书分类成功 ');
		}
	}finally{
		categoryLoading.value = false;
	}
};

// 图书主题词更改时的回调函数
async function handleSubjectChange(value:number){
	subjectLoading.value = true;
	const param = {
		bookId: parseInt(receiveBookId.value),
		subjectIds: value
	}
	try{
		// @ts-ignore subjectIds为数组，可以忽略类型检查
		const {data} = await BookRelevance.assignBookSubject(param);
		if (data === true){
			window.$message?.success('修改成功:图书主题词已更新成功');
		}
	}finally{
		subjectLoading.value = false;
	}
}

// function handleToTab() {
//   routerPush({ name: routeName('function_tab') });
// }

// ==================== 弹窗相关 ====================
const formStackRef = ref<HTMLElement & FormInst>(); // 表单的引用
const formStackData = ref({
  id: undefined,
  bookId: 0,
  barCode: '',
  stackId: undefined,
  location: '',
  status: 0
});

// 图书状态字典
const DictOptions = [
  {
    label: '可外借',
    value: 0
  },
  {
    label: '库存不足',
    value: 1
  },
  {
    label: '展示图书(不可外借)',
    value: 2
  },
  {
    label: '采购中',
    value: 3
  },
  {
    label: '下架',
    value: 4
  },
  {
    label: '促销处理',
    value: -1
  }
];

const rules: FormRules = {
  barCode: formRules.barCode,
  stackId: [
    { required: true, type: 'number', message: '请选择馆藏地址', trigger: 'change' }
    // 可以继续添加其它验证规则
  ]
};


/**
 * 异步函数：获取馆藏地址数据
 */
 const getStackData = async () => {
  try {
    // 从 API 获取简化的馆藏地址列表数据
    const { data } = await StackApi.fetchSimpleStackList();
    // 将获取的数据赋值给 stackList 变量，用于展示馆藏地址选项
    // @ts-ignore
    stackList.value = data;
  } catch (error) {
    console.error('获取馆藏地址数据失败:', error);
  }
};

/**
 * 异步函数：打开图书库存信息表单
 * @param {string} type - 表单类型：'create' - 新增；'update' - 修改
 * @param {number} id - 图书库存信息的 ID（仅在修改时有效）
 */
async function openForm(type: string, id?: number) {
  // 设置表单类型
  formType.value = type;
  // 显示表单
  formShow.value = true;

  if (type === 'update') {
    // 如果是修改操作，加载数据之前显示加载状态
    formLoading.value = true;
    try {
      // 从 API 获取指定图书库存信息
      // @ts-ignore
      const { data } = await InventoryApi.getInventory(id);
      // 将获取的数据赋值给 formStackData 变量，用于表单的填充
      // @ts-ignore
      formStackData.value = data;
    } finally {
      // 加载状态结束
      formLoading.value = false;
    }
  }

  // 设置 formStackData 的图书 ID，用于关联表单与图书
  formStackData.value.bookId = parseInt(receiveBookId.value);

  try {
    // 获取馆藏地址数据
    await getStackData();
  } catch (error) {
    console.error('获取馆藏地址数据失败:', error);
  }
}


/**
 * 异步函数：提交表单数据
 */
 async function submitFrom() {
  // 检查 formStackRef 是否存在，如果不存在则返回
  if (!formStackRef.value) return;

  // 校验表单数据，如果验证不通过，则不执行后续操作
  await formStackRef.value?.validate();

  // 开始提交表单数据，显示加载状态
  formLoading.value = true;
  try {
    // 将表单数据转换为接口需要的格式
    // @ts-ignore
    const param = formStackData.value as unknown as InventoryApi.InventoryVO;

    if (formType.value === 'create') {
      // 发送 API 请求以创建库存记录
      // @ts-ignore
      const { code } = await InventoryApi.createInventory(param);
      if (code === 200) {
        window.$message?.success('添加成功');
      }
    } else if (formType.value === 'update') {
      // 发送 API 请求以更新库存记录
      const { data } = await InventoryApi.updateInventory(param);
      if (data === true) {
        window.$message?.success('修改成功');
      }
    }

    // 操作完成后关闭弹窗，并刷新分类列表和库存数据列表
    formStackClose();
    await getCategoryData();
    await getList();
  } finally {
    // 不管是否成功，结束加载状态
    formLoading.value = false;
  }
}

/**
 * 函数：关闭库存信息表单
 */
const formStackClose = () => {
  // 隐藏表单
  formShow.value = false;

  // 重置表单数据为初始值
  formStackData.value = {
    id: undefined,
    bookId: receiveBookId.value,
    barCode: '',
    stackId: undefined,
    location: '',
    status: 0
  };
};


/**
 * 异步函数：处理导出操作
 */
 const handleExport = async () => {
  try {
    // 弹出确认对话框，确认是否导出数据项
    window.$dialog?.info({
      title: '系统提示',
      content: '是否确认导出数据项',
      positiveText: '确定',
      negativeText: '取消',
      onPositiveClick: async () => {
        // 在确认点击后，显示导出加载状态
        exportLoading.value = true;

        // 发送 API 请求以导出数据
        const data = await InventoryApi.exportInventory(queryParams);

        // 调用下载工具下载导出的 Excel 文件，文件名为 '主题词数据.xls'
        // @ts-ignore
        download.excel(data, '图书'+formBookData.value.title+'的库存数据.xls');
      }
    });
  } finally {
    // 无论成功与否，操作结束后，恢复导出加载状态
    exportLoading.value = false;
  }
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
        await InventoryApi.deleteInventoryPage(id);
        await getList();
        window.$message?.success('删除成功');
      }
    });
  } catch (error) {
    console.log(error);
  }
};


import { localStg } from '@/utils';

// 上传弹窗的显示状态
const uploadShow = ref(false);

// 上传 Header 头
const uploadHeaders = ref();

// 获取环境配置中的 URL
const { url } = getServiceEnvConfig(import.meta.env);

// 上传表单的引用
const uploadRef = ref();

// 上传表单加载状态
const uploadFormLoading = ref(false);

// 上传的地址
const importUrl = url + '/library/inventory/import';

// 是否更新已经存在的数据
const updateSupport = ref(0);

// 处理导入按钮点击事件
const handleImport = () => {
  // 设置上传请求的 Header 头
  uploadHeaders.value = {
    Authorization: 'Bearer ' + localStg.get('accessToken'),
    'tenant-id': localStg.get('tenantId')
  };

  // 显示上传弹窗
  uploadShow.value = true;
};

// 创建一个用于显示处理中消息的 MessageReactive 实例
let msgReactive: MessageReactive | null = null;

// 提交上传表单
const submitUploadForm = async () => {
  // 设置表单加载状态
  uploadFormLoading.value = true;

  // 创建一个加载中消息
	// @ts-ignore
  msgReactive = window.$message?.create('数据处理中...请稍后', {
    type: 'loading',
    keepAliveOnHover: true,
  });

  // 调用上传表单的 submit 方法
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
 * 上传成功回调函数
 * @param response - 上传成功的响应
 */
const submitFormSuccess = (response: any) => {
  // 解析响应为 JSON 对象
  const res = JSON.parse(response.event.target.response);

  // 如果响应的状态码不是 200，则显示错误消息
  if (res.code !== 200) {
    window.$message?.error(res.msg);
    uploadFormLoading.value = false;
    return;
  }

  // 设置消息为成功类型
  // @ts-ignore
  msgReactive.type = 'success';
  // @ts-ignore
  msgReactive.content = '导入成功';

  // 拼接上传回执的提示信息
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

  // 创建一个通知实例显示导入回执信息
  const n = window.$notification?.create({
    title: '导入回执',
    content: text,
    meta: () => h(NTime),
    action: () =>
      h(NButton, {
        text: true,
        type: 'primary',
        onClick: () => {
          // 关闭通知
          // @ts-ignore
          n.destroy();
        }
      }, {
        default: () => '已读'
      })
  });

  // 关闭上传弹窗
  closeUploadForm();
};

/**
 * 关闭上传弹窗并重置状态
 */
async function closeUploadForm() {
  uploadShow.value = false;
  uploadFormLoading.value = false;
  updateSupport.value = 0;
  // 刷新数据列表和图书信息
  await getList();
  await getBookData();
}


/**
 * 下载导入模板操作
 */
 const importTemplate = async () => {
  // 发起下载模板请求
  const res = await InventoryApi.importInventoryTemplate();

  // 显示下载提示信息
  window.$message?.info("正在下载模板，请稍等...");

  // 使用 download.excel 函数下载 Excel 文件
  // @ts-ignore
  download.excel(res, '库存导入模板.xls');
};

// 在组件挂载时获取列表数据
onMounted(async () => {
  // 从路由参数中获取图书 ID 并设置接收的图书 ID
  receiveBookId.value = route.query.num;

  // 设置查询参数的图书 ID
  queryParams.bookId = parseInt(receiveBookId.value);

  // 获取图书数据、分类数据、主题数据和列表数据
  await getBookData();
  await getCategoryData();
  await getSubjectData();
  await getList();
});


</script>

<style scoped></style>
