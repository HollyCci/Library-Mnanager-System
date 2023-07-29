<template>
  <n-space :vertical="true" :size="16">
    <main class="container max-w-screen-md">
      <div>
        <div class="flex w-full items-center justify-center">
          <label
            for="dropzone-file"
            class="dark:hover:bg-bray-800 flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-1 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-600"
          >
            <template v-if="previewImage">
              <img class="m-1 h-full w-full rounded-lg" :src="previewImage" width="100" height="100" alt="" />
            </template>
            <template v-else>
              <div class="flex flex-col items-center justify-center pb-6 pt-5">
                <svg
                  aria-hidden="true"
                  class="mb-3 h-10 w-10 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  ></path>
                </svg>
                <p class="mb-2 text-sm text-gray-500 dark:text-gray-400">
                  <span class="font-semibold">Click to upload</span>
                </p>
                <p class="text-xs text-gray-500 dark:text-gray-400">accept=image/*</p>
              </div>
              <input id="dropzone-file" type="file" class="hidden" accept="image/*" @change="handleInputChange" />
            </template>
          </label>
        </div>
        <br />
        <div class="h-2.5 w-full rounded-full bg-gray-200 dark:bg-gray-700">
          <div class="h-2.5 rounded-full bg-blue-600" :style="{ width: progress + '%' }"></div>
        </div>
        <br />
        <button
          type="button"
          class="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          @click="handleFileUpload"
        >
          Upload
        </button>
      </div>
    </main>
  </n-space>
</template>

<script setup lang="ts">
defineOptions({ name: 'UploadCard' });
import { ref, reactive, onMounted } from 'vue';
import { useMessage } from 'naive-ui';
import COS from 'cos-js-sdk-v5';
import { fetchCOSSecretTmp } from '@/service';

const message = useMessage();
const file = ref(null);
const images = reactive([]);
const previewImage = ref();
const progress = ref(0);
const cosRef = ref<COS>();

const initCOSTmpSecret = () => {
  cosRef.value = new COS({
    getAuthorization(_options, callback) {
      // console.log('_options', _options);
      fetchCOSSecretTmp()
        .then(({ data }) => {
          console.log('fetchCOSSecretTmp-data', data);
          const credentials = data?.credentials;
          if (!data || !credentials) {
            message.error(`credentials invalid:\n${JSON.stringify(data, null, 2)}`);
            return;
          }
          callback({
            TmpSecretId: credentials.tmpSecretId,
            TmpSecretKey: credentials.tmpSecretKey,
            SecurityToken: credentials.sessionToken,
            StartTime: data.startTime,
            ExpiredTime: data.expiredTime
          });
        })
        .catch(error => {
          message.error(error);
        });
    }
  });
};

const handleFileUpload = () => {
  if (!file.value) return;

  const cos = cosRef.value;

  const domain = 'https://static.lihaha.cn/';
  const UUID = crypto.randomUUID();
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const Key = `images/${UUID}${file.value.name.slice(file.value.name.lastIndexOf('.'))}`;

  cos?.uploadFile(
    {
      Bucket: 'lihaha-cn-web-static-1256651264',
      Region: 'ap-shanghai',
      Key,
      Body: file.value,
      SliceSize: 1024 * 1024 * 3,
      onProgress(info) {
        const percent = parseInt(`${info.percent * 10000}`, 10) / 100;
        const speed = parseInt(`${(info.speed / 1024 / 1024) * 100}`, 10) / 100;
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        message.info(`进度：${percent}%; 速度：${speed}Mb/s;`, info);
        progress.value = percent;
      },
      onTaskReady(taskId) {
        message.info(taskId);
      },
      onFileFinish(err, _data, options) {
        message.info(`${options.Key}上传${err ? '失败' : '完成'}`);
      }
    },
    (err, _data) => {
      if (err) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        message.error(err);
      } else {
        // images.push(`${domain}${Key}`);
        // localStorage.setItem('local-images', JSON.stringify(images));
        // mutation.mutate();
        file.value = null;
        previewImage.value = null;
        message.info(`${domain}${Key}`);
      }
    }
  );
};

const handleInputChange = (event: Event) => {
  progress.value = 0;
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const selectedFile = event?.target?.files?.[0];
  if (!selectedFile) return;
  file.value = selectedFile;

  const reader = new FileReader();

  // eslint-disable-next-line @typescript-eslint/no-shadow
  reader.onload = event => {
    previewImage.value = event?.target?.result?.toString() || null;
  };

  reader.readAsDataURL(selectedFile);
};

onMounted(() => {
  if (!images.length) {
    // images.push(...JSON.parse(localStorage.getItem('local-images') || '[]'));
  }

  initCOSTmpSecret();
});
</script>
