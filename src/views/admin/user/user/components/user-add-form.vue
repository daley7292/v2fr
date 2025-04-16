<script setup lang="ts">
import { reactive, ref } from "vue";
import { SaveUser } from "@/api/admin/user/user";
import { FinanceSubscription, QuerySubscription } from "@/api/admin/finance/subscription";
import { parseDateStringToTimestamp } from "@/api/admin/public";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const emits = defineEmits(['close'])
const userForm = reactive({
  email_prefix: '',
  email_suffix: '',
  password: '',
  expired_at: undefined,
  plan_id: '',
  generate_count: undefined,
})

const saverUser = () => {
  let params = { ...userForm }
  if (params.expired_at){
    params.expired_at = parseDateStringToTimestamp(params.expired_at)
  }
  SaveUser(params).then(() => {
    emits('close')
  })
}
const subscriptions = ref<FinanceSubscription[]>([])
const querySubscription = () => {
  QuerySubscription().then(r => {
    subscriptions.value = r.data
  })
}

querySubscription()
</script>

<template>
  <a-form layout="vertical" ref="userFormForm" @submit="saverUser">
    <a-form-item :label="t('userNetworkTable.form.email')" >
      <a-input-group>
        <a-input v-model="userForm.email_prefix" placeholder="账号(批量生成请留空)">
          <template #append>@</template>
        </a-input>
        <a-input v-model="userForm.email_suffix" placeholder="域" />
      </a-input-group>
    </a-form-item>
    <a-form-item :label="t('userNetworkTable.form.password')">
      <a-input v-model="userForm.password" placeholder="留空则密码与邮箱相同" />
    </a-form-item>
    <a-form-item :label="t('userNetworkTable.form.expiration_date')">
      <a-date-picker show-time format="YYYY-MM-DD HH:mm:ss" v-model="userForm.expired_at" />
    </a-form-item>
    <a-form-item :label="t('userNetworkTable.form.subscription_plan')">
      <a-select v-model="userForm.plan_id">
        <a-option value="">{{t('userTable.form.not')}}</a-option>
        <div v-for="(item, index) in subscriptions" :key="index">
          <a-option :value="item.id">{{ item.name }}</a-option>
        </div>
      </a-select>
    </a-form-item>
    <a-form-item :label="t('userNetworkTable.form.generate_quantity')">
      <a-input v-model="userForm.generate_count" placeholder="如果为批量生成请输入生成数量" />
    </a-form-item>
    <a-form-item>
      <div style="width: 100%;text-align: center">
        <a-space>
          <a-button @click="close">{{ t('userNetworkTable.form.cancel') }}</a-button>
          <a-button type="primary" html-type="submit">{{ t('userNetworkTable.form.submit') }}</a-button>
        </a-space>
      </div>

    </a-form-item>
  </a-form>
</template>

<style scoped lang="less"></style>
