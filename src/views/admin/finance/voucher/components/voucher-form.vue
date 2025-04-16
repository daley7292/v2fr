<script setup lang="ts">
import {reactive, ref} from "vue";
import {FinanceSubscription, QuerySubscription} from "@/api/admin/finance/subscription";
import {formatTimestamp, parseDateStringToTimestamp} from "@/api/admin/public";
import {SaveVoucher} from "@/api/admin/finance/voucher";
import { useI18n } from 'vue-i18n';
import { GetCurrencySymbol } from "@/utils/comm-config";

const { t } = useI18n();
const props = defineProps(['data'])
const emits = defineEmits(['close'])
const voucherForm = reactive<any>({});
const subscriptions = ref<FinanceSubscription[]>([])

const close = () => {
  emits('close')
}
const querySubscription = () => {
  Object.keys(props.data).forEach(k => {
    voucherForm[k] = props.data[k]
  })
  if (voucherForm.type === 1) {
    voucherForm.value = voucherForm.value / 100
  }
  QuerySubscription().then(r => {
    subscriptions.value = r.data
  })
}
voucherForm.time_at = [formatTimestamp(props.data.started_at), formatTimestamp(props.data.ended_at)]

const submitVoucher = () => {
  voucherForm.started_at = parseDateStringToTimestamp(voucherForm.time_at[0])
  voucherForm.ended_at = parseDateStringToTimestamp(voucherForm.time_at[1])
  let newValue = {...voucherForm}
  if (voucherForm.type === 1) {
    newValue.value = newValue.value * 100
  }
  SaveVoucher(newValue).then(r => {
    if (r.data) {
      close()
    }
  })
}
querySubscription()

</script>

<template>
  <div>
    <a-form layout="vertical" :model="voucherForm" @submit="submitVoucher">
      <a-form-item field="name" :label="t('voucher.form.name')">
        <a-input v-model="voucherForm.name" :placeholder="t('voucher.form.name.placeholder')"/>
      </a-form-item>
      <a-form-item field="code" :label="t('voucher.form.code')">
        <a-input v-model="voucherForm.code" :placeholder="t('voucher.form.code.placeholder')"/>
      </a-form-item>
      <a-form-item :label="t('voucher.form.discount.info')">
        <a-row>
          <a-col :span="8">
            <a-form-item>
              <a-select style="width: 180px" :default-value="1" v-model="voucherForm.type">
                <a-option  :value="1">{{ t('voucher.form.discount.amount') }}</a-option>
                <a-option :value="2">{{ t('voucher.form.discount.percentage') }}</a-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="16">
            <a-form-item field="value">
              <a-input v-model="voucherForm.value" :placeholder="t('voucher.form.value.placeholder')">
                <template #append>
                  {{ GetCurrencySymbol() }}
                </template>
              </a-input>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form-item>
      <a-form-item field="name" :label="t('voucher.form.validity')">
        <a-range-picker
          showTime
          :time-picker-props="{defaultValue:['00:00:00','00:00:00']}"
          v-model="voucherForm.time_at"
        />
      </a-form-item>
      <a-form-item field="name" :label="t('voucher.form.max.usage')">
        <a-input v-model="voucherForm.limit_use" :placeholder="t('voucher.form.max.usage.placeholder')"/>
      </a-form-item>
      <a-form-item field="name" :label="t('voucher.form.usage.per.user')">
        <a-input v-model="voucherForm.limit_use_with_user" :placeholder="t('voucher.form.usage.per.user.placeholder')"/>
      </a-form-item>
      <a-form-item field="name" :label="t('voucher.form.limit_inviter_ids')">
        <a-input v-model="voucherForm.limit_inviter_ids" :placeholder="t('voucher.form.limit_inviter_ids.placeholder')"/>
      </a-form-item>
      <a-form-item field="plan_id" :label="t('voucher.form.subscription')">
        <a-select :placeholder="t('voucher.form.subscription.placeholder')" v-model="voucherForm.limit_plan_ids" multiple>
          <div v-for="(item,index) in subscriptions" :key="index">
            <a-option :value="item.id+''">{{ item.name }}</a-option>
          </div>
        </a-select>
      </a-form-item>
      <a-form-item field="period" :label="t('voucher.form.period')">
        <a-select :placeholder="t('voucher.form.period.placeholder')" v-model="voucherForm.limit_period" multiple>
          <a-option value="month_price">{{ t('voucher.form.period.month') }}</a-option>
          <a-option value="quarter_price">{{ t('voucher.form.period.quarter') }}</a-option>
          <a-option value="half_year_price">{{ t('voucher.form.period.half_year') }}</a-option>
          <a-option value="year_price">{{ t('voucher.form.period.year') }}</a-option>
          <a-option value="two_year_price">{{ t('voucher.form.period.two_year') }}</a-option>
          <a-option value="three_year_price">{{ t('voucher.form.period.three_year') }}</a-option>
          <a-option value="onetime_price">{{ t('voucher.form.period.onetime') }}</a-option>
          <a-option value="reset_price">{{ t('voucher.form.period.reset') }}</a-option>
        </a-select>
      </a-form-item>
      <a-form-item field="limit_use" v-if="voucherForm.id==undefined" :label="t('voucher.form.generate.count')">
        <a-input v-model="voucherForm.generate_count" :placeholder="t('voucher.form.generate.count.placeholder')"/>
      </a-form-item>
      <a-form-item>
        <div style="width: 100%;text-align: center">
          <a-space>
            <a-button @click="close">{{t('button.cancel')}}</a-button>
            <a-button type="primary" html-type="submit">{{ t('voucher.form.submit') }}</a-button>
          </a-space>
        </div>
      </a-form-item>
    </a-form>
  </div>
</template>

<style scoped lang="less">

</style>
