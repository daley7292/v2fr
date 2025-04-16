<script setup lang="ts">
import {reactive} from "vue";
import {Order, FinanceOrderDetails} from "@/api/admin/finance/order";
import {formatTimestamp} from "@/api/admin/public";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const props = defineProps(['data', 'details'])
const orderForm = reactive<Order>(props.data)
const orderDetailsForm = reactive<FinanceOrderDetails>(props.details)
</script>
<template>
  <a-form :model="orderForm">
    <a-form-item :label="t('orderDetail.email.label')">
      {{ orderDetailsForm.email }}
    </a-form-item>
    <a-form-item :label="t('orderDetail.tradeNo.label')">
      {{ orderForm.trade_no }}
    </a-form-item>
    <a-form-item :label="t('orderDetail.period.label')">
      <span v-if="orderForm.period ==='month_price'">{{ t('orderDetail.period.month') }}</span>
      <span v-if="orderForm.period ==='quarter_price'">{{ t('orderDetail.period.quarter') }}</span>
      <span v-if="orderForm.period ==='half_year_price'">{{ t('orderDetail.period.halfYear') }}</span>
      <span v-if="orderForm.period ==='year_price'">{{ t('orderDetail.period.year') }}</span>
      <span v-if="orderForm.period ==='two_year_price'">{{ t('orderDetail.period.twoYear') }}</span>
      <span v-if="orderForm.period ==='three_year_price'">{{ t('orderDetail.period.threeYear') }}</span>
      <span v-if="orderForm.period ==='onetime_price'">{{ t('orderDetail.period.oneTime') }}</span>
      <span v-if="orderForm.period ==='reset_price'">{{ t('orderDetail.period.resetTraffic') }}</span>
    </a-form-item>
    <a-form-item :label="t('orderDetail.status.label')">
      <span v-if="orderForm.status == 0">{{ t('orderDetail.status.unpaid') }}</span>
      <span v-if="orderForm.status == 1">{{ t('orderDetail.status.paid') }}</span>
      <span v-if="orderForm.status == 2">{{ t('orderDetail.status.cancelled') }}</span>
      <span v-if="orderForm.status === 3">{{ t('orderDetail.status.completed') }}</span>
    </a-form-item>
    <a-form-item :label="t('orderDetail.planName.label')">
      {{ orderForm.plan_name }}
    </a-form-item>
    <a-form-item :label="t('orderDetail.callbackNo.label')">
      {{ orderForm.callback_no === null ? '-' : orderForm.callback_no }}
    </a-form-item>
    <a-form-item :label="t('orderDetail.totalAmount.label')">
      {{ orderForm.total_amount / 100 }}
    </a-form-item>
    <a-form-item :label="t('orderDetail.balanceAmount.label')">
      {{ orderForm.balance_amount / 100 }}
    </a-form-item>
    <a-form-item :label="t('orderDetail.discountAmount.label')">
      {{ orderForm.discount_amount / 100 }}
    </a-form-item>
    <a-form-item :label="t('orderDetail.refundAmount.label')">
      {{ orderForm.refund_amount / 100 }}
    </a-form-item>
    <a-form-item :label="t('orderDetail.surplusAmount.label')">
      {{ orderForm.surplus_amount / 100 }}
    </a-form-item>
    <a-form-item :label="t('orderDetail.createdAt.label')">
      {{ formatTimestamp(orderForm.created_at) }}
    </a-form-item>
    <a-form-item :label="t('orderDetail.updatedAt.label')">
      {{ formatTimestamp(orderForm.updated_at) }}
    </a-form-item>
  </a-form>
</template>
