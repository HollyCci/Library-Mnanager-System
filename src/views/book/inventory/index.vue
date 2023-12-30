<template>
  <n-space :vertical="true" :size="16">
    <n-gradient-text type="info" :size="16">展示给管理员-库存管理</n-gradient-text>
    <!-- 导入按钮 -->
    <n-button plain class="mr3" type="warning" @click="handleImport">
      <template #icon>
        <icon-ep:upload class="text-20px" />
      </template>
      导入
    </n-button>
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
import { ref ,h} from 'vue'; // 导入 Vue Composition API 中的函数
import { NSpace, NTime, NButton } from 'naive-ui'; // 导入 Naive UI 中的一些组件
import type { MessageReactive } from 'naive-ui'; // 导入 Naive UI 中的一些类型
import { localStg } from '@/utils';
import * as InventoryApi from '@/service/api/inventory'; // 导入库存相关的 API 调用// 导入图书 SKU 相关的 API 调用
import download from '@/utils/common/download'; // 导入文件下载的工具函数// 导入自定义的表单规则
import { getServiceEnvConfig } from '~/.env-config'; // 导入获取环境配置的函数

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
const importUrl = `${url}/library/inventory/import-all`;

// 是否更新已经存在的数据
const updateSupport = ref(0);

// 处理导入按钮点击事件
const handleImport = () => {
  // 设置上传请求的 Header 头
  uploadHeaders.value = {
    Authorization: `Bearer ${localStg.get('accessToken')}`,
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
    keepAliveOnHover: true
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
  let text = `上传成功数量：${data.createNames.length};`;
  for (const name of data.createNames) {
    text += `< ${name} >`;
  }
  text += `更新成功数量：${data.updateNames.length};`;
  for (const name of data.updateNames) {
    text += `< ${name} >`;
  }
  text += `更新失败数量：${Object.keys(data.failureNames).length};`;
  for (const name in data.failureNames) {
    text += `< ${name}: ${data.failureNames[name]} >`;
  }

  // 创建一个通知实例显示导入回执信息
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
            // 关闭通知
            // @ts-ignore
            n.destroy();
          }
        },
        {
          default: () => '已读'
        }
      )
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
}

/**
 * 下载导入模板操作
 */
const importTemplate = async () => {
  // 发起下载模板请求
  const res = await InventoryApi.importInventoryTemplate();

  // 显示下载提示信息
  window.$message?.info('正在下载模板，请稍等...');

  // 使用 download.excel 函数下载 Excel 文件
  // @ts-ignore
  download.excel(res, '库存导入模板.xls');
};
</script>
