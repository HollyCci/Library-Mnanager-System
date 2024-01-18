<template>
  <n-space :vertical="true" :size="16">
    <n-card :bordered="false" size="small" class="rounded-8px shadow-sm" hoverable>
      <n-flex>
        <n-h3 prefix="bar">
          <n-text>我的信息</n-text>
        </n-h3>
        <n-grid x-gap="12" y-gap="12" :cols="5">
          <n-gi>
            <icon-iconoir:people-tag class="text-22px mr1 mb1" />
            姓名：{{ userInfo ? userInfo.nickname : '暂无信息' }}
          </n-gi>
          <n-gi>
            <icon-ri:account-box-line class="text-23px mr1 mb1" />
            学号：{{ userInfo ? userInfo.username : '暂无信息' }}
          </n-gi>
          <n-gi>
            <icon-uil:university class="text-20px mb0.9 mr2" />
            学院：{{ userInfo ? userInfo.dept.name : '暂无信息' }}
          </n-gi>
          <n-gi>
            <icon-healthicons:i-training-class-outline class="text-26px mr1" />
            班级：{{ userInfo ? userInfo.sclass.name : '暂无信息' }}
          </n-gi>
          <n-gi>
            <icon-ep:iphone class="text-19px mr1" />
            手机号：{{ userInfo ? userInfo.mobile : '暂无信息' }}
          </n-gi>
          <n-gi>
            <icon-ri:book-line class="text-21px mr1" />
            图书：{{ borrowDetail ? borrowDetail.book.title : '暂无信息' }}
          </n-gi>
          <n-gi>
            <icon-fa-regular:user class="text-20px mr1" />
            作者：{{ borrowDetail ? borrowDetail.book.author : '暂无作者信息' }}
          </n-gi>
          <n-gi>
            <icon-material-symbols:price-change-outline-rounded class="text-26px mr1" />
            价格：{{ borrowDetail ? borrowDetail.book.price : '暂无价格信息' }}
          </n-gi>
          <n-gi>
            <icon-fluent-mdl2:publish-course class="text-21px mr1 ml1" />
            出版社：{{ borrowDetail ? borrowDetail.book.publisher : '暂无出版社信息' }}
          </n-gi>
          <n-gi>
            <icon-fa6-solid:warehouse class="text-21px mr1" />
            馆藏地：{{ borrowDetail ? borrowDetail.bookStack.name : '暂无信息' }}
          </n-gi>
          <n-gi>
            <icon-bx:barcode class="text-23px mr1" />
            条形码：{{ borrowDetail ? borrowDetail.barCode : '暂无信息' }}
          </n-gi>
          <n-gi>
            <icon-fluent:book-number-16-regular class="text-21px mr1" />
            ISBN：{{ borrowDetail ? borrowDetail.book.isbn : '暂无信息' }}
          </n-gi>
          <n-gi>
            <icon-fluent-mdl2:number-field class="text-24px mr1" />
            索书号：{{ borrowDetail ? borrowDetail.book.callNumber : '暂无信息' }}
          </n-gi>
          <n-gi>
            <icon-ic:outline-date-range class="text-24px mr1" />
            出版日期：{{ borrowDetail ? borrowDetail.book.pubDate : '暂无信息' }}
          </n-gi>
          <n-gi>
            <icon-ic:sharp-flight-class class="text-24px mr1" />
            中图分类：{{ borrowDetail ? borrowDetail.book.classification : '暂无中图分类信息' }}
          </n-gi>
        </n-grid>
      </n-flex>

      <n-flex class="mt5">
        <n-h3 prefix="bar">
          <n-text>借阅信息</n-text>
        </n-h3>
        <n-grid x-gap="12" y-gap="12" :cols="5">
          <n-gi span="5">
            <icon-carbon:order-details class="text-24px mr1 mb1" />
            借阅单号：{{ borrowDetail ? borrowDetail.serialNumber : '暂无信息' }}
          </n-gi>
          <n-gi>
            <icon-simple-icons:instatus class="text-23px mr1 mb1" />
            借阅状态：{{ getStatusLabel(borrowDetail ? borrowDetail.status : null) }}
          </n-gi>
          <n-gi>
            <icon-streamline:interface-calendar-check-approve-calendar-check-date-day-month-success
              class="text-22px mr1 mb1"
            />
            借阅日期：{{ formatDate(borrowDetail ? borrowDetail.borrowTime : null) }}
          </n-gi>
          <n-gi>
            <icon-streamline:interface-calendar-favorite-calendar-date-day-favorite-like-month-star
              class="text-22px mr1 mb1"
            />
            借阅天数：{{ borrowDetail && borrowDetail.days ? borrowDetail.days : '暂无信息' }}
          </n-gi>
          <n-gi>
            <icon-streamline:interface-calendar-warning-alter-calendar-caution-date-day-month-notification-warning
              class="text-23px mr1 mb1"
            />
            超时天数：{{ borrowDetail && borrowDetail.overDays ? borrowDetail.overDays : 0 }}
          </n-gi>
          <n-gi>
            <icon-formkit:datetime class="text-23px mr1 mb1" />
            应还日期：{{ formatDate(borrowDetail ? borrowDetail.expectReturnTime : null) }}
          </n-gi>
        </n-grid>
      </n-flex>

      <n-flex class="mt5">
        <n-h3 prefix="bar">
          <n-text>审批信息</n-text>
        </n-h3>
        <n-grid x-gap="12" y-gap="12" :cols="5">
          <n-gi span="4">
            <icon-streamline:interface-id-voice-scan-identification-secure-id-soundwave-sound-voice-brackets-security
              class="text-22px mr1 mb1"
            />
            审批单号：{{ borrowDetail ? borrowDetail.approve.approveId : '暂无信息' }}
          </n-gi>
          <n-gi>
            <icon-icon-park-solid:type-drive class="text-22px mr1 mb1" />
            审批类型：{{ getTypeLabel(borrowDetail ? borrowDetail.approve.type : null) }}
          </n-gi>
          <n-gi span="5">
            <n-timeline>
              <n-timeline-item
                :content="submitApproveTitle"
                :time="borrowDetail ? formatDate(borrowDetail.createTime) : ''"
              />

              <n-timeline-item
                v-if="borrowDetail && borrowDetail.approve.status === -1"
                type="error"
                content="审批驳回"
                :time="borrowDetail ? formatDate(borrowDetail.approve.createTime) : ''"
              />
              <n-timeline-item
                v-if="borrowDetail && borrowDetail.approve.status === 0"
                content="审批中"
                :time="borrowDetail ? formatDate(borrowDetail.approve.createTime) : ''"
              >
                <template #icon>
                  <n-icon>
                    <icon-line-md:loading-loop class="text-22px" color="#646cff" />
                  </n-icon>
                </template>
              </n-timeline-item>
              <n-timeline-item
                v-if="borrowDetail && borrowDetail.approve.status === 1"
                type="success"
                title="审批通过"
                :time="borrowDetail ? formatDate(borrowDetail.approve.createTime) : ''"
              />
              <n-timeline-item
                v-if="borrowDetail && borrowDetail.approve.renew === true"
                type="info"
                title="提交续借审批"
              />
              <n-timeline-item
                v-if="borrowDetail && borrowDetail.approve.renew === true && borrowDetail.status === 1"
                type="success"
                title="续借审批通过"
              />
              <n-timeline-item
                v-if="borrowDetail && borrowDetail.approve.renew === true && borrowDetail.status === -1"
                type="error"
                title="续借审批驳回"
              />
              <n-timeline-item v-if="borrowDetail && borrowDetail.status === 5" type="success" title="已归还" />
              <n-timeline-item v-if="borrowDetail && borrowDetail.status === -3" type="success" title="逾期归还" />
            </n-timeline>
          </n-gi>
          <n-gi>
            <icon-arcticons:remarkable class="text-22px mr1 mb1" />
            审批备注：{{ borrowDetail ? borrowDetail.approve.remark : '暂无信息' }}
          </n-gi>
          <n-gi>
            <icon-fluent:people-edit-20-regular class="text-22px mr1 mb1" />
            审批人：{{ borrowDetail ? borrowDetail.approve.creator : '暂无信息' }}
          </n-gi>
        </n-grid>
      </n-flex>
    </n-card>
  </n-space>
</template>

<script setup lang="ts">
/* eslint-disable */
import { ref , onMounted } from 'vue'; // 导入 Vue Composition API 中的函数
import { useRoute } from 'vue-router';
// import type { FormRules } from 'naive-ui'; // 导入 Naive UI 中的一些类型
// import { routeName } from '@/router';
// import { useRouterPush } from '@/composables'; // 导入图书 SKU 相关的 API 调用
import * as ReaderApi from '@/service/api/reader'; // 导入读者相关的 API 调用
import * as UserProfilesApi from '@/service/api/userProfile'; // 导入用户相关的 API 调用
import { formatDate } from '@/utils/common/formatTime';
const route = useRoute();
const querySerialNumber = ref(route.query.serialNumber as string);
const borrowDetail = ref();
const userInfo = ref({
  id: undefined,
  username: '',
  nickname: '',
  avatar: '',
  dept: {
    id: undefined,
    name: ''
  },
  sclass: {
    id: undefined,
    name: ''
  },
  borrowedCount: 0,
  countOverRead: 0,
  countWaitTake: 0,
  countSoonOverdue: 0,
  countOverReturn: 0,
  borrowCount: 0,
  roles: [],
  posts: [],
  socialUser: [],
  email: '',
  mobile: '',
  sex: undefined,
  status: undefined,
  remark: '',
  loginIp: '',
  loginDate: '',
  createTime: ''
});
const submitApproveTitle = ref('');
const remarkContent = ref('');

const getBorrowDetail = async () => {
  const { data } = await ReaderApi.getReaderBorrowDetail(querySerialNumber.value);
  borrowDetail.value = data;
  submitApproveTitle.value = `图书：《${borrowDetail.value.book.title}》— 提交借阅审批`;
  remarkContent.value = borrowDetail.value.approve.remark;
};
const statusDict = [
  {
    label: '已提交借阅审批',
    value: 0
  },
  {
    label: '审批通过',
    value: 1
  },
  {
    label: '已提交续借审批',
    value: 2
  },
  {
    label: '借阅中',
    value: 3
  },
  {
    label: '即将到期',
    value: 4
  },
  {
    label: '已归还',
    value: 5
  },
  {
    label: '预定中',
    value: 6
  },
  {
    label: '审批驳回',
    value: -1
  },
  {
    label: '逾期中',
    value: -2
  },
  {
    label: '逾期归还',
    value: -3
  }
];
const typeDict = [
  {
    label: '正常审批',
    value: 0
  },
  {
    label: '加急审批',
    value: 1
  }
];

const getStatusLabel = (status: number) => {
  const statusItem = statusDict.find(item => item.value === status);
  return statusItem ? statusItem.label : '未知状态';
};

const getTypeLabel = (type: number) => {
  const typeItem = typeDict.find(item => item.value === type);
  return typeItem ? typeItem.label : '未知类型';
};

const getUserInfo = async () => {
  const { data } = await UserProfilesApi.getUserProfile();
  // @ts-ignore
  userInfo.value = data;
};
onMounted(async () => {
  // 获取借阅详情
  await getBorrowDetail();
  // 获取用户信息
  await getUserInfo();
});
</script>

<style scoped></style>
