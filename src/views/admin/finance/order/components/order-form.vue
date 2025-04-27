<script setup lang="ts">
// 导入所需的 Vue 组件和 API 函数
import { reactive, ref } from "vue";
import { QuerySubscription, } from "@/api/admin/finance/subscription";
import { defaultFinanceOrder, Order, SaveOrder } from "@/api/admin/finance/order";
import { Message } from "@arco-design/web-vue";
import { useI18n } from 'vue-i18n';

// 初始化国际化
const { t } = useI18n();
// 订阅列表数据
const subscriptions = ref<Order[]>([])

// 接收父组件传递的数据
const props = defineProps(['data'])
// 定义向父组件触发的事件
const emits = defineEmits(['close'])
// 关闭表单并重置数据
const close = () => {
  emits('close')
  Object.keys(orderForm).forEach(k => {
    orderForm[k] = undefined
  })
}
// 初始化订单表单数据
const orderForm = reactive(defaultFinanceOrder)
// 用于提交的数据对象
const orderFormSubmit = reactive<any>({})
// 提交订单的处理函数
const submitOrder = () => {
  // 复制表单数据到提交对象
  Object.keys(orderForm).forEach(k => {
    orderFormSubmit[k] = orderForm[k]
  })
  // 将金额转换为分（乘以100）
  orderFormSubmit['total_amount'] = orderForm['total_amount'] * 100
  // 调用保存订单API
  SaveOrder(orderFormSubmit).then(r => {
    if (r.data) {
      Message.success("提交成功")
      close()
    }
  })
}
// 查询可用订阅计划
const querySubscription = () => {
  QuerySubscription().then(r => {
    subscriptions.value = r.data
  })
}

// 组件加载时查询订阅数据
querySubscription()
</script>

<template>
  <div>
    <!-- 订单表单 -->
    <a-form layout="vertical" ref="order" :model="orderForm" @submit="submitOrder">
      <!-- 邮箱输入 -->
      <a-form-item field="name" :label="t('order.form.email')">
        <a-input v-model="orderForm.email" :placeholder="t('order.form.email.placeholder')" />
      </a-form-item>
      <!-- 订阅计划选择 -->
      <a-form-item field="plan_id" :label="t('order.form.subscription')">
        <a-select v-model="orderForm.plan_id">
          <div v-for="(item, index) in subscriptions" :key="index">
            <a-option :value="item.id">{{ item.name }}</a-option>
          </div>
        </a-select>
      </a-form-item>
      <!-- 订阅周期选择 -->
      <a-form-item field="period" :label="t('order.form.reset_method')">
        <a-select :placeholder="t('order.form.period')" v-model="orderForm.period">
          <a-option value="month_price">{{ t('order.period.month') }}</a-option>
          <a-option value="quarter_price">{{ t('order.period.quarter') }}</a-option>
          <a-option value="half_year_price">{{ t('order.period.half_year') }}</a-option>
          <a-option value="year_price">{{ t('order.period.year') }}</a-option>
          <a-option value="two_year_price">{{ t('order.period.two_year') }}</a-option>
          <a-option value="three_year_price">{{ t('order.period.three_year') }}</a-option>
          <a-option value="onetime_price">{{ t('order.period.onetime') }}</a-option>
          <a-option value="reset_price">{{ t('order.period.reset') }}</a-option>
        </a-select>
      </a-form-item>
      <!-- 金额输入 -->
      <a-form-item field="name" :label="t('order.form.amount')">
        <a-input :placeholder="t('order.form.amount.placeholder')" v-model="orderForm.total_amount" allow-clear>
          <template #append>
            ￥
          </template>
        </a-input>
      </a-form-item>
      <!-- 表单操作按钮 -->
      <a-form-item>
        <a-space>
          <a-button type="dashed" @click="close">{{ t('button.cancel') }}</a-button>
          <a-button type="primary" html-type="submit">{{ t('order.form.submit') }}</a-button>
        </a-space>
      </a-form-item>
    </a-form>
  </div>
</template>

<style scoped lang="less"></style>
