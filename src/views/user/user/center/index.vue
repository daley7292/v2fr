<template>
  <div class="container">
    <a-card>
      <div>{{ t('userCenter.wallet.title') }}</div>
      <div style="margin: 30px 0">
        <span style="font-size: 3rem;font-weight: 200;padding-right: 20px">{{userInfo?userInfo.balance/100:0}}</span>
        <span style="font-weight: 150">{{GetCurrency() }}</span>
        <div style="margin: 10px 0">{{ t('userCenter.wallet.balance') }}</div>
      </div>
      <div>
        <h3>{{ t('userCenter.password.title') }}</h3>
        <a-form layout="vertical" ref="formRef" :model="form" @submit="updatePassword">
          <a-form-item field="old_password" :label="t('userCenter.password.old')" :rules="[{required:true,message:t('userCenter.password.old.rule')}]">
            <a-input v-model="form.old_password" :placeholder="t('userCenter.password.old.placeholder')"/>
          </a-form-item>
          <a-form-item field="new_password" :label="t('userCenter.password.new')" :rules="[{required:true,message:t('userCenter.password.new.rule')}]">
            <a-input v-model="form.new_password" :placeholder="t('userCenter.password.new.placeholder')"/>
          </a-form-item>
          <a-form-item field="new_password_ok" :label="t('userCenter.password.new')" :rules="[{required:true,validator:validator}]">
            <a-input v-model="form.new_password_ok" :placeholder="t('userCenter.password.new.placeholder')"/>
          </a-form-item>
          <a-form-item>
            <a-button html-type="submit">{{ t('userCenter.password.save') }}</a-button>
          </a-form-item>
        </a-form>
      </div>

      <div style="line-height: 30px">
        <div>
          <h4>{{ t('userCenter.notification.title') }}</h4>
          <div>
            <div>{{ t('userCenter.notification.expire') }}</div>
            <a-switch v-model="userInfo.remind_expire" :checked-text="t('userCenter.notification.on')" :unchecked-text="t('userCenter.notification.off')" :checked-value="1" :unchecked-value="0"
                      @change="emailExpireNotify"/>
          </div>
          <div>
            <div>{{ t('userCenter.notification.traffic') }}</div>
            <a-switch  v-model="userInfo.remind_traffic" :checked-text="t('userCenter.notification.on')" :unchecked-text="t('userCenter.notification.off')" :checked-value="1" :unchecked-value="0"
                       @change="emailTrafficNotify"/>
          </div>
        </div>
        <div>
          <h4>{{ t('userCenter.reset.title') }}</h4>
          <a-alert type="warning" :show-icon="false" style="margin: 20px 0">
            {{ t('userCenter.reset.warning') }}
          </a-alert>
          <a-popconfirm :content="t('userCenter.reset.confirm')" @ok="ResetSecurity">
            <a-button type="primary" status="danger">{{t('button.reset')}}</a-button>
          </a-popconfirm>
        </div>
      </div>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
import {onMounted, reactive, ref} from "vue";
import {ChangePassword, ResetSecurity, UpdateUser, UserInfo} from "@/api/user/user/user";
import {Message} from "@arco-design/web-vue";
import {QueryUserInfo} from "@/api/user/finance/invite";
import { useI18n } from 'vue-i18n';
import {GetCurrency} from "@/utils/comm-config";


const { t } = useI18n();
const form = reactive({
  old_password: '',
  new_password: '',
  new_password_ok: ''
});
const validator = (value: string, cb: any) => {
  if (value !== form.new_password) {
    cb(t('userCenter.password.mismatch'))
  }
}
const updatePassword = ({values, errors}) => {
  if (!errors) {
    ChangePassword(values).then(r => {
      if (r.data) {
        Message.success({
          content: t('userCenter.password.success')
        })
      }
    })
  }
}

const emailExpireNotify = (value: any) => {
  UpdateUser({remind_expire: value})
}

const emailTrafficNotify = (value: any) => {
  UpdateUser({remind_traffic: value})
}

const userInfo = ref({
  balance:0,
  remind_expire:0,
  remind_traffic:0,
})

const queryUserInfo = () => {
  QueryUserInfo().then(r => {
    userInfo.value = r.data
  })
}

onMounted(() => {
  queryUserInfo()
})

</script>
<script lang="ts">
export default {
  name: 'UserCenter',
};
</script>

<style scoped lang="less">
.container {
  padding: 20px;
}
</style>
