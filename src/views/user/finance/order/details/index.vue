<template>
  <div class="container">
    <a-card>
      <div style="text-align: center;padding-top: 30px">
        <div v-if="order.status===3">
          <div data-v-c6d2256f="" role="alert" class="arco-alert-success" style="background-color:transparent;">
            <div class="arco-alert-icon">
              <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor"
                   class="arco-icon arco-icon-check-circle-fill" stroke-width="4" stroke-linecap="butt"
                   stroke-linejoin="miter">
                <path fill-rule="evenodd" clip-rule="evenodd"
                      d="M24 44c11.046 0 20-8.954 20-20S35.046 4 24 4 4 12.954 4 24s8.954 20 20 20Zm10.207-24.379a1 1 0 0 0 0-1.414l-1.414-1.414a1 1 0 0 0-1.414 0L22 26.172l-4.878-4.88a1 1 0 0 0-1.415 0l-1.414 1.415a1 1 0 0 0 0 1.414l7 7a1 1 0 0 0 1.414 0l11.5-11.5Z"
                      fill="currentColor" stroke="none"></path>
              </svg>
            </div>
          </div>
          <H1>{{ t('userOrder.status.completed') }}</H1>
          <span style="opacity: 0.6">{{ t('userOrder.status.completed.description') }}</span>
          <br/>
          <br/>
          <br/>
          <a-button type="primary" shape="round" @click="toDocs()">
            <icon-book style="font-size: 18px"/>&nbsp;{{ t('userOrder.button.viewTutorial') }}
          </a-button>
        </div>
        <div v-if="order.status===2">
          <div data-v-c6d2256f="" role="alert" class="arco-alert-warning" style="background-color:transparent;">
            <div class="arco-alert-icon">
              <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor"
                   class="arco-icon arco-icon-exclamation-circle-fill" stroke-width="4" stroke-linecap="butt"
                   stroke-linejoin="miter">
                <path fill-rule="evenodd" clip-rule="evenodd"
                      d="M24 44c11.046 0 20-8.954 20-20S35.046 4 24 4 4 12.954 4 24s8.954 20 20 20Zm-2-11a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1h-2a1 1 0 0 0-1 1v2Zm4-18a1 1 0 0 0-1-1h-2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1V15Z"
                      fill="currentColor" stroke="none"></path>
              </svg>
            </div>
          </div>
          <H1>{{ t('userOrder.status.cancelled') }}</H1>
          <span style="opacity: 0.6">{{ t('userOrder.status.cancelled.timeout') }}</span>
        </div>

        <div v-if="order.status===1">
          <div style="font-size: 180px;margin: 0;padding: 0;height: 120px;position: relative">
            <div style="color: #ff9a6b">
              <icon-caret-up/>
            </div>
            <div style="margin-top: -155px;font-size: 60px;color: white;z-index: 99">
              <icon-exclamation/>
            </div>
          </div>
          <H1>{{ t('userOrder.status.cancelled') }}</H1>
          <span style="opacity: 0.6">{{ t('userOrder.status.cancelled.timeout') }}</span>
        </div>

      </div>
      <br/>
      <br/>
      <br/>
      <div style="line-height: 32px;">
        <h3>{{ t('userOrder.product.info') }}</h3>
        <a-row style="font-size: 16px;">
          <a-col :span="8" style="opacity: 0.4">
            <div>{{ t('userOrder.product.name') }}</div>
            <div>{{ t('userOrder.product.type') }}</div>
            <div>{{ t('userOrder.product.traffic') }}</div>
          </a-col>
          <a-col v-if="order.plan" :span="16">
            <div>{{ order.plan == undefined ? t('userOrder.product.none') : order.plan.name }}</div>
            <div>
              <span v-if="order.period ==='month_price'">{{ t('userOrder.period.month') }}</span>
              <span v-if="order.period ==='quarter_price'">{{ t('userOrder.period.quarter') }}</span>
              <span v-if="order.period ==='half_year_price'">{{ t('userOrder.period.halfYear') }}</span>
              <span v-if="order.period ==='year_price'">{{ t('userOrder.period.year') }}</span>
              <span v-if="order.period ==='two_year_price'">{{ t('userOrder.period.twoYear') }}</span>
              <span v-if="order.period ==='three_year_price'">{{ t('userOrder.period.threeYear') }}</span>
              <span v-if="order.period ==='onetime_price'">{{ t('userOrder.period.oneTime') }}</span>
              <span v-if="order.period ==='reset_price'">{{ t('userOrder.period.resetTraffic') }}</span>
            </div>
            <div>{{ order.plan == undefined ? t('userOrder.product.none') : order.plan.transfer_enable }} GB</div>
          </a-col>
        </a-row>
      </div>
      <br/>
      <br/>
      <br/>
      <div style="line-height: 32px;">
        <h3>{{ t('userOrder.info') }}</h3>
        <a-row style="font-size: 16px;">
          <a-col :span="8" style="opacity: 0.4">
            <div>{{ t('userOrder.info.number') }}</div>
            <div>{{ t('userOrder.info.createTime') }}</div>
          </a-col>
          <a-col v-if="order.trade_no" :span="16">
            <div>{{ order.trade_no }}</div>
            <div>{{ formatTimestamp(order.created_at) }}</div>
          </a-col>
        </a-row>
      </div>

      <br/>
      <br/>
      <br/>
    </a-card>
  </div>
</template>

<script lang="ts" setup>

import {onMounted, ref} from "vue";
import {useRoute, useRouter} from "vue-router";
import {QueryOrderDetails} from "@/api/user/finance/order";
import {defaultFinanceOrder, Order} from "@/api/admin/finance/order";
import {formatTimestamp} from "../../../../../api/admin/public";
import {useI18n} from 'vue-i18n';

const { t } = useI18n();
const route = useRoute()
const router = useRouter()
const order = ref<Order>(defaultFinanceOrder)

const toDocs = () => {
  router.push("/docs")
}

const queryOrderDetails = (trade_no: any) => {
  QueryOrderDetails({trade_no: trade_no}).then(r => {
    order.value = r.data
  })
}
onMounted(() => {
  if (route?.query?.id) {
    queryOrderDetails(route.query.id)
  } else {

  }
})

</script>


<script lang="ts">
export default {
  name: 'UserOrderDetails',
};
</script>

<style scoped lang="less">
.container {
  width: 100%;
  padding: 0 20px 20px 20px;
}

.arco-alert-icon svg {
  font-size: 52px;
  vertical-align: -3px;
}

.arco-alert-icon svg, .arco-alert {
  font-size: 80px;
}
</style>
