<template>
  <n-grid :x-gap="16" :y-gap="16" :item-responsive="true">
    <n-grid-item span="0:24 640:24 1024:8">
      <n-card title="时间线" :bordered="false" class="h-full rounded-8px shadow-sm">
        <n-timeline>
          <n-timeline-item v-for="item in timelines" :key="item.type" v-bind="item" />
        </n-timeline>
      </n-card>
    </n-grid-item>
    <n-grid-item span="0:24 640:24 1024:16">
      <n-card title="表格" :bordered="false" class="h-full rounded-8px shadow-sm">
        <n-data-table size="small" :columns="columns" :data="tableData" />
      </n-card>
    </n-grid-item>
  </n-grid>
</template>

<script setup lang="ts">
import { h } from 'vue';
import { NTag } from 'naive-ui';

defineOptions({ name: 'DashboardAnalysisBottomPart' });

interface TimelineData {
  type: 'default' | 'info' | 'success' | 'warning' | 'error';
  title: string;
  content: string;
  time: string;
}

interface TableData {
  key: number;
  name: string;
  age: number;
  address: string;
  tags: string[];
}

const timelines: TimelineData[] = [
  { type: 'default', title: '李*平', content: '还书成功', time: '2023-9-13 20:46' },
  { type: 'success', title: '王*山', content: '借阅成功', time: '2023-9-11 18:46' },
  { type: 'error', title: '张*花', content: '借阅逾期中', time: '2023-9-11 06:46' },
  { type: 'warning', title: '陈*平', content: '借阅即将逾期', time: '2023-9-10 10:46' },
  { type: 'info', title: '黄*飞', content: '待取书', time: '2023-9-19 20:46' }
];

const columns = [
  {
    title: 'Name',
    key: 'name'
  },
  {
    title: 'Age',
    key: 'age'
  },
  {
    title: 'Address',
    key: 'address'
  },
  {
    title: 'Tags',
    key: 'tags',
    render(row: TableData) {
      const tags = row.tags.map(tagKey => {
        return h(
          NTag,
          {
            style: {
              marginRight: '6px'
            },
            type: 'info'
          },
          {
            default: () => tagKey
          }
        );
      });
      return tags;
    }
  }
];

const tableData: TableData[] = [
  {
    key: 0,
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
    tags: ['nice', 'developer']
  },
  {
    key: 1,
    name: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park',
    tags: ['wow']
  },
  {
    key: 2,
    name: 'Joe Black',
    age: 32,
    address: 'Sidney No. 1 Lake Park',
    tags: ['cool', 'teacher']
  },
  {
    key: 3,
    name: 'Soybean',
    age: 25,
    address: 'China Shenzhen',
    tags: ['handsome', 'programmer']
  },
  {
    key: 4,
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
    tags: ['nice', 'developer']
  },
  {
    key: 5,
    name: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park',
    tags: ['wow']
  },
  {
    key: 6,
    name: 'Joe Black',
    age: 32,
    address: 'Sidney No. 1 Lake Park',
    tags: ['cool', 'teacher']
  }
];
</script>

<style scoped></style>
