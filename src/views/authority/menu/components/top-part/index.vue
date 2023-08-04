<template>
  <n-space vertical>
    <n-card :bordered="false" class="h-full rounded-8px shadow-sm" hoverable>
      <n-form
        ref="queryFormRef"
        :inline="true"
        :model="queryParams"
        class="-mb-15px"
        label-width="68px"
        label-placement="left"
      >
        <n-form-item label="菜单名称" path="name">
          <n-input
            v-model="queryParams.name"
            class="!w-240px"
            clearable
            placeholder="请输入菜单名称"
            @keyup.enter="handleQuery"
          />
        </n-form-item>
        <n-form-item label="状态" path="status">
          <n-select
            v-model="queryParams.status"
            class="!w-240px"
            clearable
            placeholder="请选择菜单状态"
            :options="DictOptions"
          />
        </n-form-item>
        <n-form-item>
          <n-space>
            <n-button @click="handleQuery">
              <template #icon>
                <icon-uil-search class="text-20px" />
              </template>
              搜索
            </n-button>
            <n-button>
              <template #icon>
                <icon-iconamoon:restart-bold class="text-20px" />
              </template>
              重置
            </n-button>
            <n-button plain type="primary">
              <template #icon>
                <icon-fluent:add-12-regular class="text-20px" />
              </template>
              新增
            </n-button>
            <n-button plain type="error">
              <template #icon>
                <icon-ep:sort class="text-20px" />
              </template>
              展开/折叠
            </n-button>
            <n-button plain>
              <template #icon>
                <icon-icon-park:refresh class="text-20px" />
              </template>
              刷新菜单缓存
            </n-button>
          </n-space>
        </n-form-item>
      </n-form>
    </n-card>

    <n-card :bordered="false" class="h-full rounded-8px shadow-sm" hoverable>
      <n-data-table
        :columns="columns"
        :data="dataRef"
        :cascade="false"
        allow-checking-not-loaded
        :default-expand-all="isExpandAll"
      ></n-data-table>
    </n-card>
  </n-space>
</template>
<script lang="ts" setup>
defineOptions({ name: 'TopPart' });
import { ref, reactive } from 'vue';
import type { FormInst, DataTableColumns } from 'naive-ui';

// const list = ref<any>([]); // 列表的数据
const queryParams = reactive({
  name: undefined,
  status: undefined
});
const queryFormRef = ref<HTMLElement & FormInst>(); // 搜索的表单
const isExpandAll = ref(false); // 是否展开，默认全部折叠
// const refreshTable = ref(true); // 重新渲染表格状态

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

const columns: DataTableColumns = [{ type: 'selection' }, { key: 'example', title: 'Example' }];
const dataRef = ref([
  { key: 'p1', example: 'p1', isLeaf: false },
  { key: 'p2', example: 'p2', isLeaf: false },
  { key: 'p3', example: 'p3', isLeaf: false }
]);

/** 搜索按钮操作 */
const handleQuery = () => {
  // getList();
};
</script>
