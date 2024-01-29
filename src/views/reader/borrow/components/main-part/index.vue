<template>
  <n-space :size="16" :wrap="false">
    <n-space :vertical="true" :size="16" style="width: 250px">
      <n-card :bordered="false" class="h-full rounded-8px shadow-sm" hoverable>
        <n-input-group>
          <n-input v-model:value="filterText" placeholder="搜索分类" style="margin-bottom: 20px" @input="onFilterInput">
            <template #prefix>
              <icon-uil-search class="text-20px" />
            </template>
          </n-input>
        </n-input-group>
        <n-scrollbar style="max-height: 660px" :size="1">
          <t-tree
            ref="treeRef"
            :data="categoryList"
            :line="true"
            expand-on-click-node
            :expand-level="1"
            :keys="categoryTreeProp"
            :filter="handleFilterByText"
            hover
            @click="handleNodeClick"
          ></t-tree>
        </n-scrollbar>
        <!--        :filter="handleFilterByText" /> -->
      </n-card>
    </n-space>

    <n-space :vertical="true" :size="16" :wrap="false" style="width: 1280px">
      <n-card :bordered="false" class="h-full rounded-8px shadow-sm" hoverable>
        <n-form ref="queryFormRef" :inline="true" :model="queryParams" label-width="68px" label-placement="left">
          <n-grid :x-gap="12" :y-gap="8" :cols="4" :collapsed="gridCollapsed" :collapsed-rows="1">
            <n-form-item-gi label="图书标题" path="title">
              <n-input
                v-model:value="queryParams.title"
                clearable
                placeholder="请输入图书标题"
                @keyup.enter="handleQuery"
              />
            </n-form-item-gi>
            <n-form-item label="标准编码" path="isbn">
              <n-input
                v-model:value="queryParams.isbn"
                clearable
                placeholder="请输入图书编码"
                @keyup.enter="handleQuery"
              />
            </n-form-item>
            <n-form-item-gi label="作者" path="author">
              <n-input
                v-model:value="queryParams.author"
                clearable
                placeholder="请输入作者名字"
                @keyup.enter="handleQuery"
              />
            </n-form-item-gi>
            <n-form-item-gi label="出版社" path="publisher">
              <n-input
                v-model:value="queryParams.publisher"
                clearable
                placeholder="请输入图书出版社"
                @keyup.enter="handleQuery"
              />
            </n-form-item-gi>
            <n-form-item-gi label="索书号" path="callNumber">
              <n-input
                v-model:value="queryParams.callNumber"
                clearable
                placeholder="请输入图书索书号"
                @keyup.enter="handleQuery"
              />
            </n-form-item-gi>

            <n-form-item-gi label="中图分类" path="classification">
              <n-input
                v-model:value="queryParams.classification"
                clearable
                placeholder="请输入图书中图分类号"
                @keyup.enter="handleQuery"
              />
            </n-form-item-gi>
            <n-form-item-gi label="ISBN" path="ISBN">
              <n-input
                v-model:value="queryParams.isbn"
                clearable
                placeholder="请输入图书ISBN码"
                @keyup.enter="handleQuery"
              />
            </n-form-item-gi>
          </n-grid>
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

          <n-switch v-model:value="gridCollapsed" :round="false" class="mr3 mt1.5" @update:value="handCollapsed">
            <template #checked>如果你感觉这些选项不能满足你，那么请点击我</template>
            <template #unchecked>够了，我想让上面简洁一些</template>
          </n-switch>
        </n-space>
      </n-card>
      <n-card :bordered="false" class="h-full rounded-8px shadow-sm" hoverable>
        <n-data-table
          :loading="loading"
          remote
          :data="list"
          :row-key="rowKey"
          :columns="columns"
          :pagination="pagination"
          :scroll-x="1700"
        />
      </n-card>
    </n-space>
  </n-space>
</template>
<script setup lang="tsx">
/* eslint-disable */
// 禁用 ESLint 检查，避免出现不必要的警告
// 声明组件名称
defineOptions({ name: 'MainPart' });
// 引入需要的 Vue 3 模块和组件
import { reactive, ref, onMounted } from 'vue';
import { NSpace, NButton, NInput, NDescriptions, NDescriptionsItem } from 'naive-ui';
import type { DataTableColumns } from 'naive-ui';
import { routeName } from '@/router';
import { useRouterPush } from '@/composables';
import { handleTree } from '@/utils/common/tree';
import * as ReaderApi from '@/service/api/reader';
import * as CategoryApi from '@/service/api/category';
const { routerPush } = useRouterPush();

const loading = ref(true); // 列表的加载中
const pageCount = ref(0);
const list = ref([]); // 列表的数
const gridCollapsed = ref(true);
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  title: '',
  isbn: '',
  publisher: '',
  author: '',
  callNumber: '',
  classification: '',
  categoryId: null
});
function handleToTabMultiDetail(num: number) {
  routerPush({ name: routeName('reader_book-info'), query: { num }, hash: '#DEMO_HASH' });
}

type RowData = {
  id: number;
  isbn: string;
  title: string;
  price: number;
  categoryId: number;
  subjectIds: string[];
  publisher: string;
  pubCountry: string;
  pubCity: string;
  pubDate: string;
  pages: number;
  series: string;
  abstracts: string;
  classification: string;
  author: string;
  callNumber: string;
  coreName: string;
  category: [id: number, name: string];
  subject: {
    ids: number[];
    names: string[];
  };
};

const categoryList = ref([]); // 树形结构
const handleFilterByText = ref();
const treeRef = ref();
const filterText = ref('');

const categoryTreeProp = {
  value: 'id',
  label: 'name',
  children: 'children'
};

// 定义数据表格key
const rowKey = (rowData: any) => {
  return rowData.id;
};

const columns: DataTableColumns<RowData> = [
  {
    type: 'expand',
    renderExpand: rowData => {
      return (
        <NSpace>
          <NDescriptions
            labelPlacement="left"
            bordered
            column={1}
            size="small"
            labelAlign="center"
            labelStyle={'width:200px;text:center'}
            contentStyle={'width:1800px'}
          >
            <NDescriptionsItem label="摘要">
              {rowData.abstracts ? (
                <t-tag max-width="1000" title={rowData.abstracts} theme="primary" variant="outline">
                  {rowData.abstracts}
                </t-tag>
              ) : (
                <t-tag theme="warning" variant="outline">
                  暂无摘要
                </t-tag>
              )}
            </NDescriptionsItem>
            <NDescriptionsItem label="丛编项">
              {rowData.series ? (
                <t-tag theme="primary" variant="outline">
                  {rowData.series}
                </t-tag>
              ) : (
                <t-tag theme="warning" variant="outline">
                  暂无信息
                </t-tag>
              )}
            </NDescriptionsItem>
          </NDescriptions>
          <NDescriptions
            labelPlacement="left"
            bordered
            column={3}
            size="small"
            labelAlign="center"
            labelStyle={'width:200px;text:center'}
            contentStyle={'width:220px'}
          >
            <NDescriptionsItem label="图书主题词">
              <NSpace>
                {rowData.subject.names.map(name => (
                  <t-tag theme="primary" variant="outline">
                    {name}
                  </t-tag>
                ))}
              </NSpace>
            </NDescriptionsItem>
            <NDescriptionsItem label="图书页数">
              {rowData.pages ? (
                <t-tag theme="primary" variant="outline">
                  {rowData.pages}
                </t-tag>
              ) : (
                <t-tag theme="warning" variant="outline">
                  暂无信息
                </t-tag>
              )}
            </NDescriptionsItem>
            <NDescriptionsItem label="类型代码">
              {rowData.coreName ? (
                <t-tag theme="primary" variant="outline">
                  {rowData.coreName}
                </t-tag>
              ) : (
                <t-tag theme="warning" variant="outline">
                  暂无信息
                </t-tag>
              )}
            </NDescriptionsItem>
            <NDescriptionsItem label="出版时间">
              {rowData.pubDate ? (
                <t-tag theme="primary" variant="outline">
                  {rowData.pubDate}
                </t-tag>
              ) : (
                <t-tag theme="warning" variant="outline">
                  暂无信息
                </t-tag>
              )}
            </NDescriptionsItem>
            <NDescriptionsItem label="出版地区">
              {rowData.pubCity ? (
                <t-tag theme="primary" variant="outline">
                  {rowData.pubCity}
                </t-tag>
              ) : (
                <t-tag theme="warning" variant="outline">
                  暂无信息
                </t-tag>
              )}
            </NDescriptionsItem>
            <NDescriptionsItem label="出版国家">
              {rowData.pubCountry ? (
                <t-tag theme="primary" variant="outline">
                  {rowData.pubCountry}
                </t-tag>
              ) : (
                <t-tag theme="warning" variant="outline">
                  暂无信息
                </t-tag>
              )}
            </NDescriptionsItem>
          </NDescriptions>
        </NSpace>
      );
    }
  },
  { key: 'id', title: '图书编号', align: 'center', width: 100 },
  { key: 'isbn', title: '图书标码', align: 'center', width: 160 },
  { key: 'title', title: '名字', align: 'center', width: 200 },
  { key: 'author', title: '作者', align: 'center', width: 100 },
  { key: 'category.name', title: '分类', align: 'center', width: 200 },
  { key: 'price', title: '价格', align: 'center', width: 80 },
  { key: 'callNumber', title: '索书号', align: 'center', width: 140 },
  { key: 'classification', title: '中图分类', align: 'center', width: 90 },
  { key: 'publisher', title: '出版社', align: 'center', width: 150 },
  {
    key: 'action',
    title: '操作',
    align: 'center',
    width: 80,
    render: (row: any) => {
      return (
        <NSpace justify={'center'}>
          <NButton
            text
            color="#8a2be2"
            size={'small'}
            onClick={() => {
              handleToTabMultiDetail(row.id);
            }}
          >
            查看
          </NButton>
        </NSpace>
      );
    },
    fixed: 'right'
  }
];

const getList = async () => {
  loading.value = true;
  await getTree();
  try {
    const { data } = await ReaderApi.getReaderBookSkuPage(queryParams);
    list.value = data.list;
    pagination.page = queryParams.pageNo;
    pagination.pageSize = queryParams.pageSize;
    pagination.itemCount = data.total;
    pageCount.value = Math.ceil(pagination.itemCount / pagination.pageSize);
  } finally {
    loading.value = false;
  }
};

const getTree = async () => {
  const { data } = await CategoryApi.fetchSimpleCategoryList();
  categoryList.value = [];
  // @ts-ignore
  categoryList.value.push(...handleTree(data));
};

// 展开更多查询条件
const handCollapsed = (value: boolean) => {
  gridCollapsed.value = value;
  console.log(gridCollapsed.value);
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
const handleNodeClick = async (node: any) => {
  queryParams.categoryId = node.node.data.id;
  await getList();
};

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.pageNo = 1;
  getList();
};

// 重置按钮操作
const resetQuery = () => {
  queryParams.pageNo = 1;
  queryParams.title = '';
  queryParams.isbn = '';
  queryParams.publisher = '';
  queryParams.author = '';
  queryParams.callNumber = '';
  queryParams.classification = '';
  queryParams.categoryId = null;
  getList();
};

// 分类搜索过滤
const onFilterInput = () => {
  // @ts-ignore
  handleFilterByText.value = node => node.data.name.indexOf(filterText.value) >= 0;
};

// 在组件挂载时获取列表数据
onMounted(async () => {
  await getList();
});
</script>
