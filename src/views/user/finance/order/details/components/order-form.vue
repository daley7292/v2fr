<script setup lang="ts">
import {reactive, ref} from "vue";
import {QuerySubscription,} from "@/api/admin/finance/subscription";
import {defaultFinanceOrder, Order, SaveOrder} from "@/api/admin/finance/order";
import {Message} from "@arco-design/web-vue";
import {GetCurrencySymbol} from "@/utils/comm-config";

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
      <a-form-item field="name" label="用户邮箱">
        <a-input v-model="orderForm.email" placeholder="请输入用户邮箱"/>
      </a-form-item>
      <a-form-item field="plan_id" label="请选择订阅">
        <a-select v-model="orderForm.plan_id">
          <div v-for="(item,index) in subscriptions" :key="index">
            <a-option :value="item.id">{{ item.name }}</a-option>
          </div>
        </a-select>
      </a-form-item>
      <a-form-item field="period" label="流量重置方式">
        <a-select placeholder="请选择周期" v-model="orderForm.period">
          <a-option value="month_price">月付</a-option>
          <a-option value="quarter_price">季付</a-option>
          <a-option value="half_year_price">半年付</a-option>
          <a-option value="year_price">年付</a-option>
          <a-option value="two_year_price">两年付</a-option>
          <a-option value="three_year_price">三年付</a-option>
          <a-option value="onetime_price">一次性</a-option>
          <a-option value="reset_price">流量重置包</a-option>
        </a-select>
      </a-form-item>
      <a-form-item field="name" label="支付金额">
        <a-input placeholder="请输入支付金额" v-model="orderForm.total_amount" allow-clear>
          <template #append>
            {{GetCurrencySymbol()}}
          </template>
        </a-input>
      </a-form-item>
      <a-form-item>
        <a-button @click="close">{{t('button.cancel')}}</a-button>
        <a-button type="primary" html-type="submit">提交</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<style scoped lang="less">

</style>
