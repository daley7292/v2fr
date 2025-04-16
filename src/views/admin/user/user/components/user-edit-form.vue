<script setup lang="ts">
import { reactive, ref } from "vue";
import { FinanceSubscription, QuerySubscription } from "@/api/admin/finance/subscription";
import { formatTimestamp, parseDateStringToTimestamp } from "@/api/admin/public";
import { UpdateUser } from "@/api/admin/user/user";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

//订阅组
const subscriptions = ref<FinanceSubscription[]>([])

const props = defineProps(['data'])
const emits = defineEmits(['close'])
const close = () => emits('close')
const userForm = reactive(props.data)
userForm.balance= (userForm.balance/100).toFixed(2)
userForm.u = userForm.u / 1024 / 1024 / 1024
userForm.d = userForm.d / 1024 / 1024 / 1024
userForm.transfer_enable = userForm.transfer_enable / 1024 / 1024 / 1024
userForm.plan_id = userForm.plan_id == null ? '' : userForm.plan_id
userForm.password = undefined
userForm.expired_at = userForm.expired_at > 0 ? formatTimestamp(userForm.expired_at) : ''

const submitEditUser = () => {
  let params = { ...userForm }
  params.u = userForm.u * 1024 * 1024 * 1024
  params.d = userForm.d * 1024 * 1024 * 1024
  params.transfer_enable = userForm.transfer_enable * 1024 * 1024 * 1024
  if (params.expired_at){
    params.expired_at = parseDateStringToTimestamp(params.expired_at)
  }else{
    params.expired_at = ''
  }
  if (params.balance){
    params.balance = params.balance*100
  }
  UpdateUser(params).then(() => {
    close()
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
    <a-form layout="vertical" ref="user" :model="userForm" @submit="submitEditUser">
      <a-form-item field="email" ::label="t('userTable.form.email')">
        <a-input v-model="userForm.email" :placeholder="t('userTable.form.please_input_your_email')" />
      </a-form-item>
      <a-form-item field="invite_user_email" :label="t('')">
        <a-input v-model="userForm.invite_user_email"
          :placeholder="t('userTable.form.please_enter_the_inviters_email_address')" />
      </a-form-item>
      <a-form-item field="password" :label="t('userTable.form.password')">
        <a-input v-model="userForm.password" :placeholder="t('userTable.form.Please_enter_to_change_password')" />
      </a-form-item>
      <a-row>
        <a-col :span="11">
          <a-form-item field="balance" :label="t('userTable.form.balance')">
            <a-input v-model="userForm.balance" placeholder="余额" />
          </a-form-item>
        </a-col>
        <a-col :span="12" :offset="1">
          <a-form-item field="commission_balance" :label="t('userTable.form.Promotional_commission')">
            <a-input v-model="userForm.commission_balance" placeholder="推广佣金" />
          </a-form-item>
        </a-col>
        <a-col :span="11">
          <a-form-item field="balance" :label="t('userTable.form.used_Up')">
            <a-input v-model="userForm.u" placeholder="已用上行">
              <template #append>
                GB
              </template>
            </a-input>
          </a-form-item>
        </a-col>
        <a-col :span="12" :offset="1">
          <a-form-item field="commission_balance" :label="t('userTable.form.Used_down')">
            <a-input v-model="userForm.d" placeholder="已用下行">
              <template #append>
                GB
              </template>
            </a-input>
          </a-form-item>
        </a-col>
      </a-row>
      <a-form-item field="commission_balance" :label="t('userTable.form.flow')">
        <a-input v-model="userForm.transfer_enable" placeholder="流量">
          <template #append>
            GB
          </template>
        </a-input>
      </a-form-item>
      <a-form-item field="expired_at" :label="t('userTable.form.Expire_date')">
        <a-date-picker v-model="userForm.expired_at" placeholder="到期时间" show-time format="YYYY-MM-DD HH:mm:ss" />
      </a-form-item>
      <a-form-item field="plan_id" :label="t('userTable.form.Subscription_plan')">
        <a-select v-model="userForm.plan_id">
          <a-option value="">暂无</a-option>
          <div v-for="(item, index) in subscriptions" :key="index">
            <a-option :value="item.id">{{ item.name }}</a-option>
          </div>
        </a-select>
      </a-form-item>
      <a-form-item field="banned" :label="t('userTable.form.Account_Status')">
        <a-select v-model="userForm.banned" placeholder="账户状态">
          <a-option :value="0">{{ t('userTable.form.normal') }}</a-option>
          <a-option :value="1">{{ t('userTable.form.ban') }}</a-option>
        </a-select>
      </a-form-item>
      <a-form-item field="commission_type" :label="t('userTable.form.Recommended_rebate_types')">
        <a-select v-model="userForm.commission_type" placeholder="推荐返利类型">
          <a-option :value="0">跟随系统设置</a-option>
          <a-option :value="1">循环返利</a-option>
          <a-option :value="2">首次返利</a-option>
        </a-select>
      </a-form-item>
      <a-form-item field="commission_rate" :label="t('userTable.form.Recommended_rebate_ratio')">
        <a-input v-model="userForm.commission_rate" placeholder="推荐返利比例">
          <template #append>
            %
          </template>
        </a-input>
      </a-form-item>
      <a-form-item field="plan_id" :label="t('userTable.form.Exclusive_discount_ratio')">
        <a-input v-model="userForm.plan_id" placeholder="专享折扣比例">
          <template #append>
            %
          </template>
        </a-input>
      </a-form-item>
      <a-form-item field="plan_id" :label="t('userTable.form.speed_limit')">
        <a-input v-model="userForm.speed_limit" :placeholder="t('userTable.form.speed_limit')">
          <template #append>
            %
          </template>
        </a-input>
      </a-form-item>
      <a-form-item field="is_admin" :label="t('userTable.form.Is_it_an_administrator')">
        <a-switch v-model="userForm.is_admin" :checked-value="1" :unchecked-value="0" />
      </a-form-item>
      <a-form-item field="is_staff" :label="t('userTable.form.Is_it_an_employee')">
        <a-switch v-model="userForm.is_staff" :checked-value="1" :unchecked-value="0" />
      </a-form-item>
      <a-form-item field="remarks" :label="t('userTable.form.Remark')">
        <a-textarea v-model="userForm.remarks" :placeholder="t('userTable.form.Remark')" />
      </a-form-item>
      <a-form-item>
        <div style="width: 100%;text-align: center">
          <a-space>
            <a-button @click="close">{{ t('userTable.form.cancel') }}</a-button>
            <a-button type="primary" html-type="submit">{{ t('userTable.form.submit') }}</a-button>
          </a-space>
        </div>
      </a-form-item>
    </a-form>
  </div>
</template>

<style scoped lang="less"></style>
