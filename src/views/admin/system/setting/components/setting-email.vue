<template>
  <div>
    <div style="margin-bottom: 15px">
      <a-alert type='warning'>
        {{ t('email.config_warning') }}
      </a-alert>
    </div>
    <a-row>
      <a-col :xs="24" :xl="12" style="padding: 2px">
        <div>
          {{ t('email.host') }}
        </div>
        <span style="font-size: 12px;">
          {{ t('email.host_desc') }}
        </span>
      </a-col>
      <a-col :xs="24" :xl="12" style="text-align: right;padding: 2px">
        <a-input :placeholder="t('email.input_placeholder')" allow-clear v-model="emailForm.email_host" @change="update"/>
      </a-col>
      <a-divider dashed/>
      <a-col :xs="24" :xl="12" style="padding: 2px">
        <div>
          {{ t('email.port') }}
        </div>
        <span style="font-size: 12px;">
          {{ t('email.port_desc') }}
        </span>
      </a-col>
      <a-col :xs="24" :xl="12" style="text-align: right;padding: 2px">
        <a-input :placeholder="t('email.input_placeholder')" allow-clear v-model="emailForm.email_port" @change="update"/>
      </a-col>
      <a-divider dashed/>
      <a-col :xs="24" :xl="12" style="padding: 2px">
        <div>
          {{ t('email.encryption') }}
        </div>
        <span style="font-size: 12px;">
          {{ t('email.encryption_desc') }}
        </span>
      </a-col>
      <a-col :xs="24" :xl="12" style="text-align: right;padding: 2px">
        <a-input :placeholder="t('email.input_placeholder')" allow-clear v-model="emailForm.email_encryption" @change="update"/>
      </a-col>
      <a-divider dashed/>
      <a-col :xs="24" :xl="12" style="padding: 2px">
        <div>
          {{ t('email.username') }}
        </div>
        <span style="font-size: 12px;">
          {{ t('email.username_desc') }}
        </span>
      </a-col>
      <a-col :xs="24" :xl="12" style="text-align: right;padding: 2px">
        <a-input :placeholder="t('email.input_placeholder')" allow-clear v-model="emailForm.email_username" @change="update"/>
      </a-col>
      <a-divider dashed/>
      <a-col :xs="24" :xl="12" style="padding: 2px">
        <div>
          {{ t('email.password') }}
        </div>
        <span style="font-size: 12px;">
          {{ t('email.password_desc') }}
        </span>
      </a-col>
      <a-col :xs="24" :xl="12" style="text-align: right;padding: 2px">
        <a-input :placeholder="t('email.input_placeholder')" allow-clear v-model="emailForm.email_password" @change="update"/>
      </a-col>
      <a-divider dashed/>
      <a-col :xs="24" :xl="12" style="padding: 2px">
        <div>
          {{ t('email.from_address') }}
        </div>
        <span style="font-size: 12px;">
          {{ t('email.from_address_desc') }}
        </span>
      </a-col>
      <a-col :xs="24" :xl="12" style="text-align: right;padding: 2px">
        <a-input :placeholder="t('email.input_placeholder')" allow-clear v-model="emailForm.email_from_address" @change="update"/>
      </a-col>
      <a-divider dashed/>
      <a-col :xs="24" :xl="12" style="padding: 2px">
        <div>
          {{ t('email.template') }}
        </div>
        <span style="font-size: 12px;">
          {{ t('email.template_desc') }}
        </span>
      </a-col>
      <a-col :xs="24" :xl="12" style="text-align: right;padding: 2px">
        <a-select :style="{width:'320px'}" default-value="" placeholder="" v-model="emailForm.email_template" @change="update">
        </a-select>
      </a-col>
      <a-divider dashed/>
      <a-col :xs="24" :xl="12" style="padding: 2px">
        <div>
          {{ t('email.test') }}
        </div>
        <span style="font-size: 12px;">
          {{ t('email.test_desc') }}
        </span>
      </a-col>
      <a-col :xs="24" :xl="12" style="text-align: right;padding: 2px">
        <a-button @click="emailTest" type="primary">{{ t('email.send_test') }}</a-button>
      </a-col>
    </a-row>
  </div>
</template>
<script setup lang="ts">
import {reactive, watch} from "vue";
import {sendEmailTest} from "@/api/admin/system/system";
import {Message} from "@arco-design/web-vue";
import {useI18n} from "vue-i18n";

const {t} = useI18n();
const props = defineProps(['data'])
const emits = defineEmits(['update'])
const emailForm = reactive(props.data.email);
const update = () => {
  let params = {}
  Object.keys(emailForm).forEach(k => {
    params[k] = emailForm[k]
  })
  emits('update', params)
}
const emailTest = ()=>{
  sendEmailTest().then(r=>{
      if (r?.data&&!r?.log){
        Message.success(t('email.send_test_success'));
      }else{
          Message.warning({
            duration:3000,
            content:r?.log?.error
          })
      }
  })
}
watch(() => props.data, (newVal) => {
  Object.keys(newVal.email).forEach(k => {
    emailForm[k] = newVal.email[k]
  })
});
</script>
<style scoped lang="less">
.arco-col>div{
  font-weight: bold;
}
</style>
