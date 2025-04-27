<script setup lang="ts">
import {reactive, ref} from "vue";
import {FinanceSubscription, QuerySubscription,} from "@/api/admin/finance/subscription";
import {SaveOrder} from "@/api/admin/finance/order";
import {Message} from "@arco-design/web-vue";
import {GetCurrencySymbol} from "@/utils/comm-config";
import {  useI18n } from "vue-i18n";

const { t } = useI18n();
const subscriptions = ref<FinanceSubscription[]>([])

const props = defineProps(['email'])
const emits = defineEmits(['close'])
const close = () => {
  emits('close')
  Object.keys(orderForm).forEach(k => {
    orderForm[k] = undefined
  })
}
const orderForm = reactive({
  email: props.email,
  plan_id: undefined,
  period: undefined,
  total_amount: 0,
})
const orderFormSubmit = reactive({})
const submitOrder = () => {
  Object.keys(orderForm).forEach(k => {
    orderFormSubmit[k] = orderForm[k]
  })
  orderFormSubmit['total_amount'] = orderForm['total_amount'] * 100
  SaveOrder(orderFormSubmit).then(r => {
    if (r.data) {
      Message.success("提交成功")
      close()
    }
  })
}
const querySubscription = () => {
  QuerySubscription().then(r => {
    subscriptions.value = r.data
  })
}

querySubscription()
</script>

<template>
  <div>
    <a-form layout="vertical" ref="order" :model="orderForm" @submit="submitOrder">
      <a-form-item field="name" :label="t('user.order.email')">
        <a-input v-model="orderForm.email" :placeholder="t('input.placeholder.email')"/>
      </a-form-item>
      <a-form-item field="plan_id" :label="t('user.order.selectSubscription')">
        <a-select v-model="orderForm.plan_id" :placeholder="t('input.placeholder.subscription')">
          <div v-for="(item,index) in subscriptions" :key="index">
            <a-option :value="item.id">{{ item.name }}</a-option>
          </div>
        </a-select>
      </a-form-item>
      <a-form-item field="period" :label="t('user.order.selectPeriod')">
        <a-select :placeholder="t('input.placeholder.period')" v-model="orderForm.period">
          <a-option value="month_price">{{ t('user.order.monthly') }}</a-option>
          <a-option value="quarter_price">{{ t('user.order.quarterly') }}</a-option>
          <a-option value="half_year_price">{{ t('user.order.halfYearly') }}</a-option>
          <a-option value="year_price">{{ t('user.order.yearly') }}</a-option>
          <a-option value="two_year_price">{{ t('user.order.twoYears') }}</a-option>
          <a-option value="three_year_price">{{ t('user.order.threeYears') }}</a-option>
          <a-option value="onetime_price">{{ t('user.order.oneTime') }}</a-option>
          <a-option value="reset_price">{{ t('user.order.resetPackage') }}</a-option>
        </a-select>
      </a-form-item>
      <a-form-item field="name" :label="t('user.order.paymentAmount')">
        <a-input :placeholder="t('input.placeholder.amount')" v-model="orderForm.total_amount" allow-clear>
          <template #append>
            {{GetCurrencySymbol()}}
          </template>
        </a-input>
      </a-form-item>
      <a-form-item>
        <a-space>
          <a-button type="dashed" @click="close">{{ t('button.cancel') }}</a-button>
          <a-button type="primary" html-type="submit">{{ t('button.submit') }}</a-button>
        </a-space>
      </a-form-item>
    </a-form>
  </div>
</template>

<style scoped lang="less">

</style>
