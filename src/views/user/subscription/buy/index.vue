<template>
  <div class="container">
    <a-card style="max-width: 1200px;margin: 0 auto;text-align: center;">
      <div style="width: 100%;text-align: left;">
        <h1>{{ t('userSubscriptionBuy.title') }}</h1>
        <a-radio-group type="button" v-model="size" size="large">
          <a-radio value="mini">{{ t('userSubscriptionBuy.filter.all') }}</a-radio>
          <a-radio value="small">{{ t('userSubscriptionBuy.filter.byPeriod') }}</a-radio>
          <a-radio value="medium">{{ t('userSubscriptionBuy.filter.byTraffic') }}</a-radio>
        </a-radio-group>
        <a-row justify="center">
          <a-col :xs="{span: 24, offset: 0}" :lg="{span: 7,offset: ((index==0||index%3==0)?0:1)}"
                 v-for="(item,index) in list">
            <a-card :header-style="{margin:0}" style="min-height: 310px;margin-top: 30px;" class="card-demo" hoverable>
              <template #cover>
                <h3 style="padding: 5px 20px;font-weight: 400">{{ item.name }}</h3>
                <a-alert :show-icon="false">
                  <h2>{{GetCurrencySymbol()}} {{ item.month_price / 100 }}</h2>
                  <div style="opacity: 0.7;margin-left: 5px">
                    <h4 v-if="item.month_price!==undefined&&item.month_price!==null">{{ t('userSubscriptionBuy.period.month') }}</h4>
                    <h4 v-else-if="item.quarter_price!==undefined&&item.quarter_price!==null">{{ t('userSubscriptionBuy.period.quarter') }}</h4>
                    <h4 v-else-if="item.half_year_price!==undefined&&item.half_year_price!==null">{{ t('userSubscriptionBuy.period.halfYear') }}</h4>
                    <h4 v-else-if="item.year_price!==undefined&&item.year_price!==null">{{ t('userSubscriptionBuy.period.year') }}</h4>
                    <h4 v-else-if="item.two_year_price!==undefined&&item.two_year_price!==null">{{ t('userSubscriptionBuy.period.twoYear') }}</h4>
                    <h4 v-else-if="item.three_year_price!==undefined&&item.three_year_price!==null">{{ t('userSubscriptionBuy.period.threeYear') }}</h4>
                    <h4 v-else-if="item.onetime_price!==undefined&&item.onetime_price!==null">{{ t('userSubscriptionBuy.period.oneTime') }}</h4>
                  </div>
                </a-alert>
                <div style="margin: 20px 20px;margin-bottom: 0px;line-height: 30px">
                  <div style="padding: 6px 3px" v-html="getHtml(item.content)"></div>
                  <div>
                    <a-button type="primary" @click="toShop(item)">{{ t('userSubscriptionBuy.button.subscribe') }}</a-button>
                  </div>
                </div>
              </template>
            </a-card>
          </a-col>
        </a-row>
      </div>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
import {onMounted, ref} from "vue";
import {ShopNode} from "@/api/user/subscription/shop";
import {useRouter} from "vue-router";
import { useI18n } from "vue-i18n"; // Add this import
import {GetCurrencySymbol} from "@/utils/comm-config";

const { t } = useI18n(); // Add this line to use the i18n utility

const list = ref([])
const size = ref('mini')
const querySubscription = () => {
  ShopNode().then(r => {
    list.value = r.data
  })
}

const router = useRouter()

const toShop = (value: any) => {
  router.push("/shop?id=" + value.id)
}

const support = '<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" class="arco-icon arco-icon-check-circle" stroke-width="4" stroke-linecap="butt" stroke-linejoin="miter" filter="" data-v-2bc6460e="" style="font-size: 32px;"><path d="m15 22 7 7 11.5-11.5M42 24c0 9.941-8.059 18-18 18S6 33.941 6 24 14.059 6 24 6s18 8.059 18 18Z"></path></svg>'
const notSupport = '<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" class="arco-icon arco-icon-close-circle" stroke-width="4" stroke-linecap="butt" stroke-linejoin="miter" filter="" data-v-2bc6460e="" style="font-size: 32px;"><path d="m17.643 17.643 6.364 6.364m0 0 6.364 6.364m-6.364-6.364 6.364-6.364m-6.364 6.364-6.364 6.364M42 24c0 9.941-8.059 18-18 18S6 33.941 6 24 14.059 6 24 6s18 8.059 18 18Z"></path></svg>'
const getHtml = (value:string)=>{
  if(value.includes("feature")&&value.includes("support")&&value.includes("[{")){
    let html =""
      const arrayParams = JSON.parse(value)
      arrayParams.forEach(v => {
        html=html+'<div style="display: flex;padding: 2px 0;">' +(v['support']?support:notSupport)+'<span>'+v['feature']+'</span>'+'</div>'
      });
      return html
  }else{
    return value
  }
}

onMounted(() => {
  querySubscription()
})
</script>
<script lang="ts">
export default {
  name: 'BuySubscription',
};
</script>

<style scoped lang="less">
.container {
  padding: 20px;
}

.card-demo {
  width: 100%;
  transition-property: all;
}

.card-demo:hover {
  box-shadow: #c9c9c9 1px 1px 12px 1px;
  transform: translateY(-5px);
}

.custom-radio-card {
  padding: 10px 16px;
  border: 1px solid var(--color-border-2);
  border-radius: 4px;
  width: 250px;
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
