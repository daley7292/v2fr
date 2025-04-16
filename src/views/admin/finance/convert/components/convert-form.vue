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
  });
};
if (props.data.end_at) {
  convertForm.time_at = formatTimestamp(props.data.end_at);
}

const submitconvert = (value: any, errors: any) => {
  if (convertForm.time_at) {
    convertForm.end_at = parseDateStringToTimestamp(convertForm.time_at);
  }
  let newValue = { ...convertForm };
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
        console.log(value)
        if (value === undefined){
          cb()
          return
        }
        const { data,code,message } = await CheckEmail({ email: value })
        if (code === 422 ){
          cb(message);
          return;
        }
        if (!data.exists) {
          cb(t('convert.form.email.not_exists'));
        } else {
          cb()
        }
      }
    }
  ],
}

querySubscription();
</script>
<template>
  <div>
    <a-form  ref="formRef"  layout="vertical" :rules="rules" :model="convertForm" @submit-success="submitconvert">
      <a-form-item field="name" :label="t('convert.form.name')">
        <a-input v-model="convertForm.name" :placeholder="t('convert.form.name.placeholder')" />
      </a-form-item>
      <a-form-item field="plan_id" :label="t('convert.form.plan_id')">
        <a-select :placeholder="t('convert.form.plan_id.placeholder')" v-model="convertForm.plan_id">
          <div v-for="(item, index) in subscriptions" :key="index">
            <a-option :value="item.id">{{ item.name }}</a-option>
          </div>
        </a-select>
      </a-form-item>
      <a-form-item field="duration_unit" :label="t('convert.form.duration_unit')">
        <a-select :placeholder="t('convert.form.duration_unit.placeholder')" v-model="convertForm.duration_unit">
          <a-option value="month">{{ t('voucher.form.period.month') }}</a-option>
          <a-option value="quarter">{{ t('voucher.form.period.quarter') }}</a-option>
          <a-option value="half_year">{{ t('voucher.form.period.half_year') }}</a-option>
          <a-option value="year">{{ t('voucher.form.period.year') }}</a-option>
          <a-option value="onetime">{{ t('voucher.form.period.onetime') }}</a-option>
        </a-select>
      </a-form-item>
      <!--      <a-form-item  field="duration_value" :label="t('convert.form.duration_value')">-->
      <!--        <a-input-->
      <!--          v-model="convertForm.duration_value"-->
      <!--          type="number"-->
      <!--          min="0"-->
      <!--          :placeholder="t('convert.form.duration_value.placeholder')"-->
      <!--        />-->
      <!--      </a-form-item>-->
      <a-row>
        <a-col :span="12">
          <a-form-item field="email" :label="t('convert.form.email')" >
            <a-input v-model="convertForm.email" :placeholder="t('convert.form.email.placeholder')" />
          </a-form-item>
        </a-col>
        <a-col :span="11" :offset="1">
          <a-form-item field="is_invitation" :label="t('convert.form.is_invitation')">
            <a-select :placeholder="t('convert.form.is_invitation.placeholder')" v-model="convertForm.is_invitation">
              <a-option :value="0">{{ t('convert.form.is_invitation.no') }}</a-option>
              <a-option :value="1">{{ t('convert.form.is_invitation.yes') }}</a-option>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="12">
          <a-form-item field="ordinal_number" :label="t('convert.form.ordinal_number')">
            <a-input v-model="convertForm.ordinal_number" :placeholder="t('convert.form.ordinal_number.placeholder')" />
          </a-form-item>
        </a-col>
        <a-col :span="11" :offset="1">
          <a-form-item field="end_at" :label="t('convert.form.end_at')">
            <a-date-picker style="width: 100%; " show-time format="YYYY-MM-DD HH:mm:ss"
                           v-model="convertForm.time_at" />
          </a-form-item>
        </a-col>
      </a-row>
      <a-form-item>
        <div style="width: 100%; text-align: center">
          <a-space>
            <a-button @click="close">{{ t('button.cancel') }}</a-button>
            <a-button type="primary" html-type="submit">{{
              t('button.ok')
            }}</a-button>
          </a-space>
        </div>
      </a-form-item>
    </a-form>
  </div>
</template>
<style scoped lang="less"></style>
