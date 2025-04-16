<script setup lang="ts">
import {reactive} from "vue";
import {Order, FinanceOrderDetails} from "@/api/admin/finance/order";
import {formatTimestamp} from "@/api/admin/public";

const props = defineProps(['data', 'details'])
const orderForm = reactive<Order>(props.data)
const orderDetailsForm = reactive<FinanceOrderDetails>(props.details)
</script>

<template>
  <a-form :model="orderForm">
    <a-form-item label="邮箱">
      {{ orderDetailsForm.email }}
    </a-form-item>
    <a-form-item label="订单号">
      {{ orderForm.trade_no }}
    </a-form-item>
    <a-form-item label="订单周期">
      <span v-if="orderForm.period ==='month_price'">月付</span>
      <span v-if="orderForm.period ==='quarter_price'">季付</span>
      <span v-if="orderForm.period ==='half_year_price'">半年付</span>
      <span v-if="orderForm.period ==='year_price'">年付</span>
      <span v-if="orderForm.period ==='two_year_price'">两年付</span>
      <span v-if="orderForm.period ==='three_year_price'">三年付</span>
      <span v-if="orderForm.period ==='onetime_price'">一次性</span>
      <span v-if="orderForm.period ==='reset_price'">流量重置包</span>
    </a-form-item>
    <a-form-item label="订单状态">
      <span v-if="orderForm.status == 0">待支付</span>
      <span v-if="orderForm.status == 1">已支付</span>
      <span v-if="orderForm.status == 2">已取消</span>
      <span v-if="orderForm.status === 3">已完成</span>
    </a-form-item>
    <a-form-item label="订阅计划">
      {{ orderForm.plan_name }}
    </a-form-item>
    <a-form-item label="回调单号">
      {{ orderForm.callback_no === null ? '-' : orderForm.callback_no }}
    </a-form-item>
    <a-form-item label="支付金额">
      {{ orderForm.total_amount / 100 }}
    </a-form-item>
    <a-form-item label="余额支付">
      {{ orderForm.balance_amount / 100 }}
    </a-form-item>
    <a-form-item label="优惠金额">
      {{ orderForm.discount_amount / 100 }}
    </a-form-item>
    <a-form-item label="退回金额">
      {{ orderForm.refund_amount / 100 }}
    </a-form-item>
    <a-form-item label="折抵金额">
      {{ orderForm.surplus_amount / 100 }}
    </a-form-item>
    <a-form-item label="创建时间">
      {{ formatTimestamp(orderForm.created_at)}}
    </a-form-item>
    <a-form-item label="更新时间">
      {{ formatTimestamp(orderForm.updated_at)}}
    </a-form-item>
  </a-form>
</template>

<style scoped lang="less">

</style>
