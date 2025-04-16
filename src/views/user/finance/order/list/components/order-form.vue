<script setup lang="ts">
import {reactive, ref} from "vue";
import {QuerySubscription,} from "@/api/admin/finance/subscription";
import {defaultFinanceOrder, Order, SaveOrder} from "@/api/admin/finance/order";
import {Message} from "@arco-design/web-vue";
import { useI18n } from "vue-i18n";
import {GetCurrencySymbol} from "@/utils/comm-config";

const { t } = useI18n();
const subscriptions = ref<Order[]>([])

const props = defineProps(['data'])
const emits = defineEmits(['close'])
const close = () => {
  emits('close')
  Object.keys(orderForm).forEach(k => {
    orderForm[k] = undefined
  })
}
const orderForm = reactive(defaultFinanceOrder)
const orderFormSubmit = reactive<any>({})
const submitOrder = () => {
  Object.keys(orderForm).forEach(k => {
    orderFormSubmit[k] = orderForm[k]
  })
  orderFormSubmit['total_amount'] = orderForm['total_amount'] * 100
  SaveOrder(orderFormSubmit).then(r => {
    if (r.data) {
      Message.success(t('orderForm.message.success'));
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
      <a-form-item field="name" :label="t('orderForm.email.label')">
        <a-input v-model="orderForm.email" :placeholder="t('orderForm.email.placeholder')"/>
      </a-form-item>
      <a-form-item field="plan_id" :label="t('orderForm.plan.label')">
        <a-select v-model="orderForm.plan_id">
          <div v-for="(item,index) in subscriptions" :key="index">
            <a-option :value="item.id">{{ item.name }}</a-option>
          </div>
        </a-select>
      </a-form-item>
      <a-form-item field="period" :label="t('orderForm.period.label')">
        <a-select :placeholder="t('orderForm.period.placeholder')" v-model="orderForm.period">
          <a-option value="month_price">{{ t('orderForm.period.month') }}</a-option>
          <a-option value="quarter_price">{{ t('orderForm.period.quarter') }}</a-option>
          <a-option value="half_year_price">{{ t('orderForm.period.halfYear') }}</a-option>
          <a-option value="year_price">{{ t('orderForm.period.year') }}</a-option>
          <a-option value="two_year_price">{{ t('orderForm.period.twoYear') }}</a-option>
          <a-option value="three_year_price">{{ t('orderForm.period.threeYear') }}</a-option>
          <a-option value="onetime_price">{{ t('orderForm.period.oneTime') }}</a-option>
          <a-option value="reset_price">{{ t('orderForm.period.resetTraffic') }}</a-option>
        </a-select>
      </a-form-item>
      <a-form-item field="name" :label="t('orderForm.amount.label')">
        <a-input :placeholder="t('orderForm.amount.placeholder')" v-model="orderForm.total_amount" allow-clear>
          <template #append>
            {{ GetCurrencySymbol() }}
          </template>
        </a-input>
      </a-form-item>
      <a-form-item>
        <a-button @click="close">{{ t('button.cancel') }}</a-button>
        <a-button type="primary" html-type="submit">{{ t('orderForm.button.submit') }}</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>
<style scoped lang="less">

</style>
