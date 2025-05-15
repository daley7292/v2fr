<script setup lang="ts">
  import { reactive, ref } from 'vue';
  import {
    FinanceSubscription,
    QuerySubscription,
  } from '@/api/admin/finance/subscription';
  import {
    formatTimestamp,
    parseDateStringToTimestamp,
  } from '@/api/admin/public';
  import { SaveConvert, CheckEmail } from '@/api/admin/finance/convert';
  import { useI18n } from 'vue-i18n';

  const { t } = useI18n();
  const props = defineProps(['data']);
  const emits = defineEmits(['close']);
  const convertForm = reactive<any>({});
  const subscriptions = ref<FinanceSubscription[]>([]);

  const close = () => {
    emits('close');
  };
  const querySubscription = () => {
    Object.keys(props.data).forEach((k) => {
      convertForm[k] = props.data[k];
    });
    QuerySubscription().then((r) => {
      subscriptions.value = r.data;
      changeSubscription(convertForm.plan_id)
    });
  };
  if (props.data.end_at) {
    convertForm.time_at = formatTimestamp(props.data.end_at);
  }

  const selectSubscription = ref<FinanceSubscription>({})

  const changeSubscription = (res)=>{
    subscriptions.value.forEach((r)=>{
      if (res === r.id){
        selectSubscription.value = r
      }
    })
    console.log(selectSubscription.value)
  }

  const submitconvert = (value: any, errors: any) => {
    if (convertForm.time_at) {
      convertForm.end_at = parseDateStringToTimestamp(convertForm.time_at);
    }
    let newValue = { ...convertForm };
    if (newValue.email) {
      newValue.is_invitation = 1;
    } else {
      newValue.is_invitation = 0;
    }
    SaveConvert(newValue).then((r) => {
      if (r.data) {
        close();
      }
    });
  };

  const rules = {
    email: [
      {
        message: t('convert.form.email.format_err'),
      },
      {
        validator: async (value: string, cb: (error?: string) => void) => {
          console.log(value);
          if (!value) {
            cb();
            return;
          }
          const { data, code, message } = await CheckEmail({ email: value });
          if (code === 422) {
            cb(message);
            return;
          }
          if (!data.exists) {
            cb(t('convert.form.email.not_exists'));
          } else {
            cb();
          }
        },
      },
    ],
  };



  querySubscription();
</script>
<template>
  <div>
    <a-form
      ref="formRef"
      layout="vertical"
      :rules="rules"
      :model="convertForm"
      @submit-success="submitconvert"
    >
      <a-form-item field="name" :label="t('convert.form.name')">
        <a-input
          v-model="convertForm.name"
          :placeholder="t('convert.form.name.placeholder')"
        />
      </a-form-item>
      <a-form-item field="name" :label="t('convert.form.redeem_code')">
        <a-input
          v-model="convertForm.redeem_code"
          :placeholder="t('convert.form.redeem_code.placeholder')"
          :disabled="convertForm.id"
        />
      </a-form-item>
      <a-form-item field="plan_id" :label="t('convert.form.plan_id')">
        <a-select
          :placeholder="t('convert.form.plan_id.placeholder')"
          v-model="convertForm.plan_id"
          @change="changeSubscription"
        >
          <div v-for="(item, index) in subscriptions"  :key="index">
            <a-option :value="item.id">{{ item.name }}</a-option>
          </div>
        </a-select>
      </a-form-item>
      <a-form-item
        field="duration_unit"
        :label="t('convert.form.duration_unit')"
      >
        <a-select
          :placeholder="t('convert.form.duration_unit.placeholder')"
          v-model="convertForm.duration_unit"
        >
          <a-option v-if="selectSubscription.month_price" value="month">{{
            t('voucher.form.period.month')
          }}</a-option>
          <a-option  v-if="selectSubscription.quarter_price" value="quarter">{{
            t('voucher.form.period.quarter')
          }}</a-option>
          <a-option  v-if="selectSubscription.half_year_price"  value="half_year">{{
            t('voucher.form.period.half_year')
          }}</a-option>
          <a-option  v-if="selectSubscription.year_price"   value="year">{{ t('voucher.form.period.year') }}</a-option>
          <a-option  v-if="selectSubscription.onetime_price"   value="onetime">{{
            t('voucher.form.period.onetime')
          }}</a-option>
        </a-select>
      </a-form-item>
      <a-row>
        <a-col :span="convertForm.id?24:12">
          <a-form-item field="email" :label="t('convert.form.email')">
            <a-input
              v-model="convertForm.email"
              :placeholder="t('convert.form.email.placeholder')"
            />
          </a-form-item>
        </a-col>
        <a-col v-if="!convertForm.id" :span="11" :offset="1">
          <a-form-item
            field="count"
            :label="t('convert.form.count')"
          >
            <a-input :placeholder="t('convert.form.count.placeholder')"
                     v-model="convertForm.count" min="1" type="number" />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="12">
          <a-form-item
            field="ordinal_number"
            :label="t('convert.form.ordinal_number')"
          >
            <a-input
              v-model="convertForm.ordinal_number"
              :placeholder="t('convert.form.ordinal_number.placeholder')"
            />
          </a-form-item>
        </a-col>
        <a-col :span="11" :offset="1">
          <a-form-item field="end_at" :label="t('convert.form.end_at')">
            <a-date-picker
              style="width: 100%"
              show-time
              format="YYYY-MM-DD HH:mm:ss"
              v-model="convertForm.time_at"
            />
          </a-form-item>
        </a-col>
      </a-row>
      <a-form-item>
        <div style="width: 100%; text-align: center">
          <a-space>
            <a-button type="dashed" @click="close">{{ t('button.cancel') }}</a-button>
            <a-button type="primary" html-type="submit"
              >{{ t('button.ok') }}
            </a-button>
          </a-space>
        </div>
      </a-form-item>
    </a-form>
  </div>
</template>
<style scoped lang="less"></style>
