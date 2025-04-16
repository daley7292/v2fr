<template>
  <div class="container">
    <a-row style="max-width: 1200px;margin: 0 auto">
      <a-col :xs="{span: 24}" :lg="{span: 14}" style="margin-top: 20px">
        <a-card>
          <h2>{{ nodeInfo ? nodeInfo.name : '' }}</h2>
          <div v-html="nodeInfo ? nodeInfo.content : ''"></div>
        </a-card>
        <br/>
        <br/>
        <a-card>
          <h4>{{ t('userSubscriptionShop.paymentCycle.title') }}</h4>
          <a-radio-group v-model="select" @change="changeOrder" style="width: 100%">
            <a-radio v-if="nodeInfo&&nodeInfo.month_price" value="month_price"  style="width: 100%">
              <template #radio="{ checked }">
                <div
                  align="start"
                  class="custom-radio-card"
                  :class="{ 'custom-radio-card-checked': checked }"
                >
                  <a-row>
                    <a-col :span="16">{{ t('userSubscriptionShop.period.month') }}</a-col>
                    <a-col :span="8" style="text-align: right">{{GetCurrencySymbol()}}{{ nodeInfo.month_price / 100 }}</a-col>
                  </a-row>
                </div>
              </template>
            </a-radio>
            <a-radio v-if="nodeInfo&&nodeInfo.quarter_price" value="quarter_price" style="width: 100%">
              <template #radio="{ checked }">
                <div
                  align="start"
                  class="custom-radio-card"
                  :class="{ 'custom-radio-card-checked': checked }"
                >
                  <a-row>
                    <a-col :span="16">{{ t('userSubscriptionShop.period.quarter') }}</a-col>
                    <a-col :span="8" style="text-align: right">{{GetCurrencySymbol()}}{{nodeInfo.quarter_price/100}}</a-col>
                  </a-row>
                </div>
              </template>
            </a-radio>
            <a-radio v-if="nodeInfo&&nodeInfo.half_year_price"  value="half_year_price"    style="display: block;width: 100%;">
              <template #radio="{ checked }">
                <div
                  style="display: block;width: 100%;"
                  align="start"
                  class="custom-radio-card"
                  :class="{ 'custom-radio-card-checked': checked }"
                >
                  <a-row >
                    <a-col :span="16">{{ t('userSubscriptionShop.period.halfYear') }}</a-col>
                    <a-col :span="8" style="text-align: right">{{GetCurrencySymbol()}}{{nodeInfo.half_year_price/100}}</a-col>
                  </a-row>
                </div>
              </template>
            </a-radio>
            <a-radio v-if="nodeInfo&&nodeInfo.year_price"  value="year_price" style="width: 100%">
              <template #radio="{ checked }">
                <div
                  align="start"
                  class="custom-radio-card"
                  :class="{ 'custom-radio-card-checked': checked }"
                >
                  <a-row>
                    <a-col :span="16">{{ t('userSubscriptionShop.period.year') }}</a-col>
                    <a-col :span="8" style="text-align: right">{{GetCurrencySymbol()}}{{nodeInfo.year_price/100}}</a-col>
                  </a-row>
                </div>
              </template>
            </a-radio>
            <a-radio v-if="nodeInfo&&nodeInfo.two_year_price"  value="two_year_price" style="width: 100%">
              <template #radio="{ checked }">
                <div
                  align="start"
                  class="custom-radio-card"
                  :class="{ 'custom-radio-card-checked': checked }"
                >
                  <a-row>
                    <a-col :span="16">{{ t('userSubscriptionShop.period.twoYear') }}</a-col>
                    <a-col :span="8" style="text-align: right">{{GetCurrencySymbol()}}{{nodeInfo.two_year_price/100}}</a-col>
                  </a-row>
                </div>
              </template>
            </a-radio>
            <a-radio v-if="nodeInfo&&nodeInfo.three_year_price"  value="three_year_price" style="width: 100%">
              <template #radio="{ checked }">
                <div
                  align="start"
                  class="custom-radio-card"
                  :class="{ 'custom-radio-card-checked': checked }"
                >
                  <a-row >
                    <a-col :span="16">{{ t('userSubscriptionShop.period.threeYear') }}</a-col>
                    <a-col :span="8" style="text-align: right">{{nodeInfo.three_year_price/100}}</a-col>
                  </a-row>
                </div>
              </template>
            </a-radio>
            <a-radio v-if="nodeInfo&&nodeInfo.onetime_price"  value="onetime_price" style="width: 100%">
              <template #radio="{ checked }">
                <div
                  align="start"
                  class="custom-radio-card"
                  :class="{ 'custom-radio-card-checked': checked }"
                >
                  <a-row>
                    <a-col :span="16">{{ t('userSubscriptionShop.period.oneTime') }}</a-col>
                    <a-col :span="8" style="text-align: right">{{GetCurrencySymbol()}}{{nodeInfo.onetime_price/100}}</a-col>
                  </a-row>
                </div>
              </template>
            </a-radio>
          </a-radio-group>
        </a-card>
      </a-col>
      <a-col :xs="{span: 24}" :lg="{span: 8, offset: 1}" style="margin-top: 20px">
        <a-card>
          <a-input-search :placeholder="t('userSubscriptionShop.coupon.placeholder')" v-model="coupon_code"
                          :button-text="t('userSubscriptionShop.coupon.verify')" @change="checkVoucher" search-button/>
        </a-card>
        <br/>
        <br/>
        <a-card style="line-height: 36px">
          <h3>{{ t('userSubscriptionShop.order.total') }}</h3>
          <a-row style="font-size: 1.3rem">
            <a-col :span="16">{{(nodeInfo&&nodeInfo.name)?nodeInfo.name:''}}x
              <span v-if="select=='month_price'">{{ t('userSubscriptionShop.period.month') }}</span>
              <span v-if="select=='quarter_price'">{{ t('userSubscriptionShop.period.quarter') }}</span>
              <span v-if="select=='half_year_price'">{{ t('userSubscriptionShop.period.halfYear') }}</span>
              <span v-if="select=='year_price'">{{ t('userSubscriptionShop.period.year') }}</span>
              <span v-if="select=='two_year_price'">{{ t('userSubscriptionShop.period.twoYear') }}</span>
              <span v-if="select=='three_year_price'">{{ t('userSubscriptionShop.period.threeYear') }}</span>
              <span v-if="select=='onetime_price'">{{ t('userSubscriptionShop.period.oneTime') }}</span>
            </a-col>
            <a-col :span="8" style="text-align: right">{{GetCurrencySymbol()}}{{orderInfo.price}}</a-col>
          </a-row>
          <a-divider/>
          <div>{{ t('userSubscriptionShop.checkout.total') }}</div>
          <h1>{{GetCurrencySymbol()}}{{orderInfo.price-(voucher?voucher/100:0)}} {{GetCurrency()}}</h1>
          <a-popconfirm type="warning" position="left" :content="t('userSubscriptionShop.checkout.warning')" @ok="createOrder">
            <a-button type="primary" style="width: 100%;font-size: 21px">
              <icon-down-circle />{{ t('userSubscriptionShop.checkout.button') }}
            </a-button>
          </a-popconfirm>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script lang="ts" setup>

import {useRoute, useRouter} from "vue-router";
import {CreateUserOrder, ShopNode, UserCouponCheck} from "@/api/user/subscription/shop";
import {onMounted, reactive, ref} from "vue";
import { useI18n } from "vue-i18n";
import {GetCurrency,GetCurrencySymbol} from "@/utils/comm-config";

const { t } = useI18n();
const select = ref('')
const nodeInfo = ref()
const route = useRoute()
const router = useRouter()
const types = ['month_price','quarter_price','half_year_price','year_price','two_year_price','three_year_price','onetime_price']
const queryPlan = () => {

  if (route.query.id) {
    ShopNode({id: route.query.id}).then(r => {
      nodeInfo.value = r.data
      types.forEach(v=>{
        if (nodeInfo.value[v]&&nodeInfo.value[v]>0){
          select.value = v
          orderInfo.price =nodeInfo.value[v]/100
        }
      })
    })


  }
}
const orderInfo = reactive({
  name:'',
  price:'',
})
const changeOrder = (value:string)=>{
  orderInfo.price =nodeInfo.value[value]/100
}

const createOrder = ()=>{
  CreateUserOrder({plan_id:nodeInfo.value.id,period:select.value,coupon_code:coupon_code.value}).then(r=>{
    if (r.data){
        router.push("details?trade_no="+r.data)
    }
  })
}
const coupon_code = ref()
const voucher =ref()
const checkVoucher =(value:string)=>{
  if (value){
    UserCouponCheck({code:value,plan_id:nodeInfo.value.id}).then(r=>{
      voucher.value = r.data.value
    })
  }
}
onMounted(() => {
  queryPlan()

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
