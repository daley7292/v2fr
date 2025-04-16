<template>
  <div class="container">
    <a-row style="max-width: 1200px;margin: 0 auto">
      <a-col :xs="{span: 24}" :lg="{span: 14}" style="margin-top: 20px;line-height: 28px">
        <a-card :title="t('userSubscriptionDetails.productInfo.title')">
          <a-row>
            <a-col :span="10" style="opacity: 0.5;">
              <div>{{ t('userSubscriptionDetails.productInfo.productName') }}</div>
              <div>{{ t('userSubscriptionDetails.productInfo.typePeriod') }}</div>
              <div>{{ t('userSubscriptionDetails.productInfo.productTraffic') }}</div>
            </a-col>
            <a-col :span="14">
              <div>{{ orderDetail && orderDetail.plan ? orderDetail.plan.name : '' }}</div>
              <div>
                <span v-if="(orderDetail?orderDetail.period:'')=='month_price'">{{ t('userSubscriptionDetails.productInfo.monthPeriod') }}</span>
                <span v-if="(orderDetail?orderDetail.period:'')=='quarter_price'">{{ t('userSubscriptionDetails.productInfo.quarterPeriod') }}</span>
                <span v-if="(orderDetail?orderDetail.period:'')=='half_year_price'">{{ t('userSubscriptionDetails.productInfo.halfYearPeriod') }}</span>
                <span v-if="(orderDetail?orderDetail.period:'')=='year_price'">{{ t('userSubscriptionDetails.productInfo.yearPeriod') }}</span>
                <span v-if="(orderDetail?orderDetail.period:'')=='two_year_price'">{{ t('userSubscriptionDetails.productInfo.twoYearPeriod') }}</span>
                <span v-if="(orderDetail?orderDetail.period:'')=='three_year_price'">{{ t('userSubscriptionDetails.productInfo.threeYearPeriod') }}</span>
                <span v-if="(orderDetail?orderDetail.period:'')=='onetime_price'">{{ t('userSubscriptionDetails.productInfo.oneTimePeriod') }}</span>
              </div>
              <div>{{ orderDetail && orderDetail.plan ? orderDetail.plan.transfer_enable : 0 }}GB</div>
            </a-col>
          </a-row>
        </a-card>
        <br/>
        <a-card :title="t('userSubscriptionDetails.orderInfo.title')">
          <a-row>
            <a-col :span="10" style="opacity: 0.5;">
              <div>{{ t('userSubscriptionDetails.orderInfo.orderNumber') }}</div>
              <div>{{ t('userSubscriptionDetails.orderInfo.oldSubscriptionDeduction') }}</div>
              <div>{{ t('userSubscriptionDetails.orderInfo.refundAmount') }}</div>
              <div>{{ t('userSubscriptionDetails.orderInfo.createdAt') }}</div>
            </a-col>
            <a-col :span="14">
              <div>{{ orderDetail ? orderDetail.trade_no : '' }}</div>
              <div>
                {{ orderDetail ? orderDetail.surplus_amount / 100 : 0 }}
              </div>
              <div>{{ orderDetail ? orderDetail.refund_amount / 100 : 0 }}</div>
              <div>{{ orderDetail ? formatTimestamp(orderDetail.created_at) : '' }}</div>
            </a-col>
          </a-row>
        </a-card>
        <br/>
        <a-card :title="t('userSubscriptionDetails.paymentMethod.title')">
          <a-radio-group v-model="select" style="width: 100%">
            <a-radio v-for="(item,index) in userPayMethod" :value="item.id" :key="index" style="width: 100%">
              <template #radio="{ checked }">
                <div
                  align="start"
                  class="custom-radio-card"
                  :class="{ 'custom-radio-card-checked': checked }"
                >
                  <a-row>
                    <a-col :span="16">
                      {{ item.name }}
                    </a-col>
                    <a-col :span="8" style="text-align: right">
                      <a-image width="30" height="30" :src="item.icon"/>
                    </a-col>
                  </a-row>
                </div>
              </template>
            </a-radio>
          </a-radio-group>
        </a-card>
      </a-col>
      <a-col :xs="{span: 24}" :lg="{span: 8, offset: 1}" style="margin-top: 20px">
        <a-card style="line-height: 36px">
          <h3>{{ t('userSubscriptionDetails.checkout.orderTotal') }}</h3>
          <a-row style="font-size: 1.3rem">
            <a-col :span="16">{{ (orderDetail && orderDetail.plan) ? orderDetail.plan.name : '' }}x
              <span v-if="(orderDetail?orderDetail.period:'')=='month_price'">{{ t('userSubscriptionDetails.productInfo.monthPeriod') }}</span>
              <span v-if="(orderDetail?orderDetail.period:'')=='quarter_price'">{{ t('userSubscriptionDetails.productInfo.quarterPeriod') }}</span>
              <span v-if="(orderDetail?orderDetail.period:'')=='half_year_price'">{{ t('userSubscriptionDetails.productInfo.halfYearPeriod') }}</span>
              <span v-if="(orderDetail?orderDetail.period:'')=='year_price'">{{ t('userSubscriptionDetails.productInfo.yearPeriod') }}</span>
              <span v-if="(orderDetail?orderDetail.period:'')=='two_year_price'">{{ t('userSubscriptionDetails.productInfo.twoYearPeriod') }}</span>
              <span v-if="(orderDetail?orderDetail.period:'')=='three_year_price'">{{ t('userSubscriptionDetails.productInfo.threeYearPeriod') }}</span>
              <span v-if="(orderDetail?orderDetail.period:'')=='onetime_price'">{{ t('userSubscriptionDetails.productInfo.oneTimePeriod') }}</span>
            </a-col>
            <a-col :span="8" style="text-align: right">
              ${{ (orderDetail && orderDetail.plan) ? orderDetail.plan[orderDetail.period] / 100 : 0 }}
            </a-col>
          </a-row>
          <a-divider/>

          <div>
            <div>{{ t('userSubscriptionDetails.checkout.discount') }}</div>
            <div>${{ (orderDetail) ? orderDetail.surplus_amount / 100 : 0 }}</div>
          </div>
          <a-divider/>

          <div>
            <div>{{ t('userSubscriptionDetails.checkout.refund') }}</div>
            <div>${{ (orderDetail) ? orderDetail.refund_amount / 100 : 0 }}</div>
          </div>
          <a-divider/>

          <div>{{ t('userSubscriptionDetails.checkout.total') }}</div>
          <h1>${{ (orderDetail) ? orderDetail.total_amount / 100 : 0 }} {{GetCurrency()}}</h1>
          <a-popconfirm type="warning" position="left" :content="t('userSubscriptionDetails.checkout.warning')"
                        @ok="createOrder">
            <a-button type="primary" style="width: 100%;font-size: 21px">
              <icon-down-circle/>
              {{ t('userSubscriptionDetails.checkout.button') }}
            </a-button>
          </a-popconfirm>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script lang="ts" setup>

import {useRoute, useRouter} from "vue-router";
import {
  UserOrderCheck,
  UserOrderCheckout,
  UserOrderDetails,
  UserPaymentMethod,
  UserPayMethod
} from "@/api/user/subscription/shop";
import {onMounted, ref} from "vue";
import {formatTimestamp} from "@/api/admin/public";
import { useI18n } from "vue-i18n";
import {GetCurrency} from "@/utils/comm-config";

const { t } = useI18n();

const select = ref()
const route = useRoute()
const router = useRouter()

const orderDetail = ref()
const queryOrder = () => {
  if (route?.query?.trade_no) {
    UserOrderDetails({trade_no: route.query.trade_no}).then(r => {
      orderDetail.value = r.data
    })
  }
}

const userPayMethod = ref<UserPayMethod[]>()

const payMethod = () => {
  UserPaymentMethod().then(r => {
    userPayMethod.value = r.data
    if (userPayMethod.value && userPayMethod.value.length > 0) {
      select.value = userPayMethod.value[0].id
    }
  })
}

const userOrderCheck = () => {
  if (route?.query?.trade_no) {
    UserOrderCheck({trade_no: route.query.trade_no}).then(r => {
      if (r.data && r.data > 0) {
        router.push("/order/details?id=" + route.query.trade_no)
      }
    })
  }
}

const userOrderCheckTask = async () => {
  setTimeout(() => {
    userOrderCheck()
    userOrderCheckTask()
  }, 3000)
}

const types = ['month_price', 'quarter_price', 'half_year_price', 'year_price', 'two_year_price', 'three_year_price', 'onetime_price']

const toPage = (url: string) => {
  let page = router.resolve({
    name: url,
  })
  window.open(page.href, '_blank');
}

const createOrder = () => {
  UserOrderCheckout({trade_no: orderDetail.value.trade_no, method: select.value}).then(r => {
    if (r.data && r.data != 1) {
      toPage(r.data)
    }
  })
}

onMounted(() => {
  queryOrder()
  payMethod()
  userOrderCheckTask()
})
</script>
<script lang="ts">
export default {
  name: 'SubscriptionStatus',
};
</script>

<style scoped lang="less">
.arco-space-item {
  display: grid;
  width: 100%;
}

.container {
  padding: 20px;
}

.custom-radio-card {
  font-size: 18px;
  padding: 20px 16px;
  border: 1px solid var(--color-border-2);
  width: 100%;
  box-sizing: border-box;
}

.custom-radio-card-mask {
  height: 14px;
  width: 14px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 100%;
  border: 1px solid var(--color-border-2);
  box-sizing: border-box;
}

.custom-radio-card-mask-dot {
  width: 8px;
  height: 8px;
  border-radius: 100%;
}

.custom-radio-card-title {
  color: var(--color-text-1);
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 8px;
}

.custom-radio-card:hover,
.custom-radio-card-checked,
.custom-radio-card:hover .custom-radio-card-mask,
.custom-radio-card-checked .custom-radio-card-mask {
  border-color: rgb(var(--primary-6));
}

.custom-radio-card-checked {
  background-color: var(--color-primary-light-1);
}

.custom-radio-card:hover .custom-radio-card-title,
.custom-radio-card-checked .custom-radio-card-title {
  color: rgb(var(--primary-6));
}

.custom-radio-card-checked .custom-radio-card-mask-dot {
  background-color: rgb(var(--primary-6));
}
</style>
