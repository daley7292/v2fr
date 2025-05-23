<template>
  <div class="container">

    <a-card class="menu">
      <!-- 待处理工单提醒 -->
      <a-alert type="warning" v-if="queryData && queryData.ticket_pending_total > 0" style="margin: 10px 0">
        <template #title>
        </template>
        <span>
          {{ $t('dashboard.handle.part1') }} {{ queryData.ticket_pending_total }} {{ $t('dashboard.ticket.handle.part2')
          }}
          <strong style="cursor: pointer;font-weight: bold;color: red"
            @click="toPage(`/user/ticket?status=1`)"> {{
              $t('dashboard.handle.immediately') }} </strong>
        </span>
      </a-alert>
      <!-- 待处理佣金提醒 -->
      <a-alert type="warning" v-if="queryData && queryData.commission_pending_total > 0" style="margin: 10px 0">
        <template #title>
        </template>
        <span>
          {{ $t('dashboard.handle.part1') }} {{ queryData.commission_pending_total }} {{
            $t('dashboard.commission.handle.part2') }}
          <strong style="cursor: pointer;font-weight: bold;color: red"
            @click="toPage(`/subscription/order?commission_status=0`)"> {{ $t('dashboard.handle.immediately') }}
          </strong>
        </span>
      </a-alert>
      <!-- 功能快捷入口区域 -->
      <a-row class="grid-demo">
        <a-col :xs="12" :sm="12" :md="12" :lg="6" :xl="6" :xxl="6">
          <a-card class="card" :bordered="true" @click="toPage(`/system/setting`)">
            <icon-tool />
            <div>{{ $t('dashboard.system.setting') }}</div>
          </a-card>
        </a-col>
        <a-col :xs="12" :sm="12" :md="12" :lg="6" :xl="6" :xxl="6">
          <a-card class="card" :bordered="true" @click="toPage(`/subscription/order`)">
            <icon-list />
            <div>{{ $t('dashboard.order.setting') }}</div>
          </a-card>
        </a-col>
        <a-col :xs="12" :sm="12" :md="12" :lg="6" :xl="6" :xxl="6">
          <a-card class="card" :bordered="true" @click="toPage(`/subscription/subscription`)">
            <icon-lock />
            <div>{{ $t('dashboard.subscription.setting') }}</div>
          </a-card>
        </a-col>
        <a-col :xs="12" :sm="12" :md="12" :lg="6" :xl="6" :xxl="6">
          <a-card class="card" :bordered="true" @click="toPage(`/user/manager`)">
            <icon-user-group />
            <div>{{ $t('dashboard.user.setting') }}</div>
          </a-card>
        </a-col>
      </a-row>

      <!-- 收入统计列表 -->
      <a-list size="large" style="font-weight: 350">
        <a-list-item>
          <span>{{ $t('dashboard.income.today') }}</span>
          <div style="font-size: 56px;font-weight: 200">{{ (queryData ? queryData.day_income / 100:0).toFixed(2) }}<span
              style="font-size: 16px;color: #6C767F">{{GetCurrency()}}</span></div>
        </a-list-item>
        <a-list-item>
          <div class="money">
            <div style="width: 140px">
              <div>{{ (queryData ? queryData.month_income / 100 : 0).toFixed(2) }} {{GetCurrency()}}</div>
              <span>{{ $t('dashboard.income.thismonth') }}</span>
            </div>
            <div style="width: 140px">
              <div>{{ (queryData ? queryData.last_month_income / 100 :0).toFixed(2) }} {{GetCurrency()}}</div>
              <span>{{ $t('dashboard.income.lastmonth') }}</span>
            </div>
            <div style="width: 140px">
              <div>{{ (queryData ? queryData.commission_last_month_payout / 100 :0).toFixed(2)}} {{GetCurrency()}}</div>
              <span>{{ $t('dashboard.commission.lastmonth') }}</span>
            </div>
            <div style="width: 140px">
              <div>{{ queryData ? queryData.month_register_total : $t('dashboard.loading') }}</div>
              <span>{{ $t('dashboard.increaseuser.thismonth') }}</span>
            </div>
          </div>
        </a-list-item>
        <!-- 时段分析组件 -->
        <a-list-item style="overflow: visible">
          <ContentPeriodAnalysis />
        </a-list-item>
        <a-list-item style="overflow: visible">
          <ServerLastRank  />
        </a-list-item>
        <a-list-item style="overflow: visible">
          <ContentYear  />
        </a-list-item>
        <!-- 财务内容组件 -->
        <a-list-item style="overflow: visible">
          <ContentFinances />
        </a-list-item>
<!--        <a-list-item style="overflow: visible">-->
<!--          <ContentWeek  />-->
<!--        </a-list-item>-->
        <a-list-item style="overflow: visible">
          <ContentOrder  />
        </a-list-item>
        <!-- 在线情况统计 -->
        <a-list-item>
          <a-card :title="$t('dashboard.onlinePresence.title')" :bordered="false">
            <a-row :gutter="16">
              <a-col :xs="12" :sm="8" :md="8" :lg="4" :xl="4">
                <a-statistic :title="$t('dashboard.onlinePresence.currentOnline')"
                  :value="onlinePresence?.statistics?.current_online || 0" :loading="!onlinePresence" />
              </a-col>
              <a-col :xs="12" :sm="8" :md="8" :lg="4" :xl="4">
                <a-statistic :title="$t('dashboard.onlinePresence.todayOnline')"
                  :value="onlinePresence?.statistics?.today_online || 0" :loading="!onlinePresence" />
              </a-col>
              <a-col :xs="12" :sm="8" :md="8" :lg="4" :xl="4">
                <a-statistic :title="$t('dashboard.onlinePresence.threeDaysOnline')"
                  :value="onlinePresence?.statistics?.three_days_online || 0" :loading="!onlinePresence" />
              </a-col>
              <a-col :xs="12" :sm="8" :md="8" :lg="4" :xl="4">
                <a-statistic :title="$t('dashboard.onlinePresence.sevenDaysOnline')"
                  :value="onlinePresence?.statistics?.seven_days_online || 0" :loading="!onlinePresence" />
              </a-col>
              <a-col :xs="12" :sm="8" :md="8" :lg="4" :xl="4">
                <a-statistic :title="$t('dashboard.onlinePresence.fifteenDaysOnline')"
                  :value="onlinePresence?.statistics?.fifteen_days_online || 0" :loading="!onlinePresence" />
              </a-col>
              <a-col :xs="12" :sm="8" :md="8" :lg="4" :xl="4">
                <a-statistic :title="$t('dashboard.onlinePresence.thirtyDaysOnline')"
                  :value="onlinePresence?.statistics?.thirty_days_online || 0" :loading="!onlinePresence" />
              </a-col>
            </a-row>
            <a-divider style="margin: 16px 0" />
            <div class="last-updated">
              {{ $t('dashboard.lastUpdated') }}: {{ onlinePresence?.last_updated || $t('dashboard.loading') }}
            </div>
          </a-card>
        </a-list-item>


        <!--        <a-list-item>Beijing Volcengine Technology Co., Ltd.</a-list-item>-->
        <!--        <a-list-item>China Beijing Bytedance Technology Co., Ltd.</a-list-item>-->
      </a-list>
    </a-card>

  </div>
</template>
<style lang="less" scoped>
.container {
  margin: 20px;
}

/* 金额显示样式 */
.money {
  font-size: 16px;
  display: flex;
}

.money span {
  color: #6C767F;
}

/* 警告信息样式 */
.warning {
  margin: 20px;
  color: #74290e;
  height: 46px;
  line-height: 46px;
  padding: 0 10px 0 10px;
  border-radius: 1px;
  font-size: 15px;
  background-color: #f9dcd1;
  ;
}

/* 图标样式 */
.arco-icon {
  color: #165DFF;
  font-size: 38px;
}


/* 卡片样式 */
.card {
  height: 120px;
  line-height: 35px;
  text-align: center;
}
.grid-demo{
  font-weight: bold;
}
/* 卡片悬停效果 */
.card:hover {
  box-shadow: #d1cdcd 0px 6px 20px 3px;
}

.last-updated {
  text-align: right;
  color: #86909c;
  font-size: 12px;
}
</style>


<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { Income, queryIncome, getOnlinePresence } from '@/api/admin/dashboard/dashboard';
import ContentYear from "@/views/admin/dashboard/workplace/components/content-year.vue";
import ContentWeek from "@/views/admin/dashboard/workplace/components/content-week.vue";
import ContentOrder from "@/views/admin/dashboard/workplace/components/content-order.vue";
import ContentFinances from "@/views/admin/dashboard/workplace/components/content-finances.vue";
import ContentPeriodAnalysis from "@/views/admin/dashboard/workplace/components/content-period-analysis.vue";
import { useRouter } from "vue-router";
import { adminUrl } from "@/utils/admin-url";
import { Message } from "@arco-design/web-vue";
import {GetCurrency} from "@/utils/comm-config";
import ServerLastRank from "@/views/admin/dashboard/workplace/components/server-last-rank.vue";

const router = useRouter()
// 页面跳转方法
const toPage = (url: string) => {
  router.push(url)
}
// 收入数据引用
const queryData = ref<Income>();
// 在线状态数据引用
const onlinePresence = ref();

// 组件挂载时获取数据
onMounted(() => {
  // 获取收入数据
  queryIncome().then(res => {
    queryData.value = res.data;
  })
  // 获取在线状态数据
  getOnlinePresence().then(res => {
    if (res?.data) {
      onlinePresence.value = res.data;
    } else {
      Message.error({
        content: res.message
      });
    }
  })
});
</script>
<script lang="ts">
export default {
  name: 'Dashboard', // 如果希望keep-alive的include属性生效，必须命名该组件
};
</script>
