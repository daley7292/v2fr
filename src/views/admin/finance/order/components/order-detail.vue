<script setup lang="ts">
import { reactive } from "vue";
import { Order } from "@/api/admin/finance/order";
import { formatTimestamp } from "@/api/admin/public";
import { adminUrl } from "@/utils/admin-url";
import { useI18n } from 'vue-i18n';

// 使用i18n实现国际化
const { t } = useI18n();
// 定义组件Props，接收'data'和'details'作为输入
const props = defineProps(['data', 'details'])
// 创建响应式订单表单数据
const orderForm = reactive<Order>(props.data)
// 创建响应式订单详情表单数据
const orderDetailsForm = reactive<Order>(props.details)
</script>

<template>
  <!-- 订单详情表单 -->
  <a-form :model="orderForm">
    <!-- 用户邮箱，点击可跳转到用户管理页面 -->
    <a-form-item :label="t('orderDetail.label.email')">
      <router-link :to="`/${adminUrl}/user/manager?email=${orderDetailsForm?.email}`">{{ orderDetailsForm?.email }}</router-link>
    </a-form-item>
    <!-- 订单编号 -->
    <a-form-item :label="t('orderDetail.label.trade_no')">
      {{ orderForm.trade_no }}
    </a-form-item>
    <!-- 订单周期，根据不同值显示不同文本 -->
    <a-form-item :label="t('orderDetail.label.period')">
      <span v-if="orderForm.period === 'month_price'">{{ t('order.period.month') }}</span>
      <span v-if="orderForm.period === 'quarter_price'">{{ t('order.period.quarter') }}</span>
      <span v-if="orderForm.period === 'half_year_price'">{{ t('order.period.half_year') }}</span>
      <span v-if="orderForm.period === 'year_price'">{{ t('order.period.year') }}</span>
      <span v-if="orderForm.period === 'two_year_price'">{{ t('order.period.two_year') }}</span>
      <span v-if="orderForm.period === 'three_year_price'">{{ t('order.period.three_year') }}</span>
      <span v-if="orderForm.period === 'onetime_price'">{{ t('order.period.onetime') }}</span>
      <span v-if="orderForm.period === 'reset_price'">{{ t('order.period.reset') }}</span>
    </a-form-item>
    <!-- 订单状态，根据不同值显示不同状态文本 -->
    <a-form-item :label="t('orderDetail.label.status')">
      <span v-if="orderForm.status == 0">{{ t('order.status.pending') }}</span>
      <span v-if="orderForm.status == 1">{{ t('order.status.paid') }}</span>
      <span v-if="orderForm.status == 2">{{ t('order.status.cancelled') }}</span>
      <span v-if="orderForm.status === 3">{{ t('order.status.completed') }}</span>
    </a-form-item>
    <!-- 套餐名称 -->
    <a-form-item :label="t('orderDetail.label.plan_name')">
      {{ orderForm.plan_name }}
    </a-form-item>
    <!-- 回调编号，若为空则显示'-' -->
    <a-form-item :label="t('orderDetail.label.callback_no')">
      {{ orderForm.callback_no === null ? '-' : orderForm.callback_no }}
    </a-form-item>
    <!-- 订单总金额（除以100转换为元） -->
    <a-form-item :label="t('orderDetail.label.total_amount')">
      {{ orderForm.total_amount / 100 }}
    </a-form-item>
    <!-- 余额支付金额 -->
    <a-form-item :label="t('orderDetail.label.balance_amount')">
      {{ orderForm.balance_amount / 100 }}
    </a-form-item>
    <!-- 折扣金额 -->
    <a-form-item :label="t('orderDetail.label.discount_amount')">
      {{ orderForm.discount_amount / 100 }}
    </a-form-item>
    <!-- 退款金额 -->
    <a-form-item :label="t('orderDetail.label.refund_amount')">
      {{ orderForm.refund_amount / 100 }}
    </a-form-item>
    <!-- 剩余金额 -->
    <a-form-item :label="t('orderDetail.label.surplus_amount')">
      {{ orderForm.surplus_amount / 100 }}
    </a-form-item>
    <a-form-item v-if="orderDetailsForm.invite_user && orderDetailsForm.invite_user.email" :label="t('orderDetail.label.invite_user')">
      <router-link :to="`/${adminUrl}/user/manager?invite_by_email=${orderDetailsForm.invite_user.email}`">{{ orderDetailsForm.invite_user.email }}</router-link>
    </a-form-item>

    <!-- 创建时间，使用formatTimestamp函数格式化 -->
    <a-form-item :label="t('orderDetail.label.created_at')">
      {{ formatTimestamp(orderForm.created_at) }}
    </a-form-item>
    <!-- 更新时间，使用formatTimestamp函数格式化 -->
    <a-form-item :label="t('orderDetail.label.updated_at')">
      {{ formatTimestamp(orderForm.updated_at) }}
    </a-form-item>
  </a-form>
</template>

<style scoped lang="less"></style>
