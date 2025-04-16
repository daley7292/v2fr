<template>
  <div>
    <a-row class="safety">
      <a-col :xs="24" :xl="12" style="padding: 2px">
        <div>
          {{ t('safety.email_verification') }}
        </div>
        <span style="font-size: 12px;">
          {{ t('safety.email_verification_desc') }}
        </span>
      </a-col>
      <a-col :xs="24" :xl="12" style="text-align: right;padding: 2px">
        <a-switch v-model="safeForm.email_verify" :checked-value="1" :unchecked-value="0" @change="update">
          <template #checked>
            {{ t('form.open') }}
          </template>
          <template #unchecked>
            {{ t('form.close') }}
          </template>
        </a-switch>
      </a-col>
      <a-divider dashed/>
      <a-col :xs="24" :xl="12" style="padding: 2px">
        <div>
          {{ t('safety.disable_gmail_aliases') }}
        </div>
        <span style="font-size: 12px;">
          {{ t('safety.disable_gmail_aliases_desc') }}
        </span>
      </a-col>
      <a-col :xs="24" :xl="12" style="text-align: right;padding: 2px">
        <a-switch v-model="safeForm.email_gmail_limit_enable" checked-value="1" unchecked-value="0" @change="update">
          <template #checked>
            {{ t('form.open') }}
          </template>
          <template #unchecked>
            {{ t('form.close') }}
          </template>
        </a-switch>
      </a-col>
      <a-divider dashed/>
      <a-col :xs="24" :xl="12" style="padding: 2px">
        <div>
          {{ t('safety.safe_mode') }}
        </div>
        <span style="font-size: 12px;">
          {{ t('safety.safe_mode_desc') }}
        </span>
      </a-col>
      <a-col :xs="24" :xl="12" style="text-align: right;padding: 2px">
        <a-switch v-model="safeForm.safe_mode_enable" :checked-value="1" :unchecked-value="0" @change="update">
          <template #checked>
              {{ t('form.open') }}
          </template>
          <template #unchecked>
            {{ t('form.close') }}
          </template>
        </a-switch>
      </a-col>
      <a-divider dashed/>
      <a-col :xs="24" :xl="12" style="padding: 2px">
        <div>
          {{ t('safety.admin_path') }}
        </div>
        <span style="font-size: 12px;">
          {{ t('safety.admin_path_desc') }}
        </span>
      </a-col>
      <a-col :xs="24" :xl="12" style="text-align: right;padding: 2px">
        <a-input v-model="safeForm.secure_path" @change="update"/>
      </a-col>
      <a-divider dashed/>
      <a-col :xs="24" :xl="12" style="padding: 2px">
        <div>
          {{ t('safety.email_whitelist') }}
        </div>
        <span style="font-size: 12px;">
          {{ t('safety.email_whitelist_desc') }}
        </span>
      </a-col>
      <a-col :xs="24" :xl="12" style="text-align: right;padding: 2px">
        <a-switch v-model="safeForm.email_whitelist_enable" :checked-value="1" :unchecked-value="0" @change="update">
          <template #checked>
            {{ t('form.open') }}
          </template>
          <template #unchecked>
            {{ t('form.close') }}
          </template>
        </a-switch>
      </a-col>
      <a-divider v-if="safeForm.email_whitelist_enable" dashed/>
      <a-col :xs="24" :xl="12" style="padding: 2px" v-if="safeForm.email_whitelist_enable">
        <div>
          {{ t('safety.email_whitelist_suffix') }}
        </div>
        <span style="font-size: 12px;">
          {{ t('safety.email_whitelist_suffix_desc') }}
        </span>
      </a-col>
      <a-col :xs="24" :xl="12" style="text-align: right;padding: 2px" v-if="safeForm.email_whitelist_enable">
        <a-textarea v-model="safeForm.email_whitelist_suffix" @change="update"/>
      </a-col>
      <a-divider dashed/>
      <a-col :xs="24" :xl="12" style="padding: 2px">
        <div>
          {{ t('safety.anti_bot') }}
        </div>
        <span style="font-size: 12px;">
          {{ t('safety.anti_bot_desc') }}
        </span>
      </a-col>
      <a-col :xs="24" :xl="12" style="text-align: right;padding: 2px">
        <a-switch v-model="safeForm.recaptcha_enable" :checked-value="1" :unchecked-value="0" @change="update">
          <template #checked>
            {{ t('form.open') }}
          </template>
          <template #unchecked>
            {{ t('form.close') }}
          </template>
        </a-switch>
      </a-col>
      <a-divider v-if="safeForm.recaptcha_enable" dashed/>
      <a-col :xs="24" :xl="12" style="padding: 2px" v-if="safeForm.recaptcha_enable">
        <div>
          {{ t('safety.recaptcha_key') }}
        </div>
        <span style="font-size: 12px;">
          {{ t('safety.recaptcha_key_desc') }}
        </span>
      </a-col>
      <a-col :xs="24" :xl="12" style="text-align: right;padding: 2px" v-if="safeForm.recaptcha_enable">
        <a-input v-model="safeForm.recaptcha_key" @change="update"/>
      </a-col>
      <a-divider  v-if="safeForm.recaptcha_enable" dashed/>
      <a-col :xs="24" :xl="12" style="padding: 2px" v-if="safeForm.recaptcha_enable">
        <div>
          {{ t('safety.recaptcha_site_key') }}
        </div>
        <span style="font-size: 12px;">
          {{ t('safety.recaptcha_site_key_desc') }}
        </span>
      </a-col>
      <a-col :xs="24" :xl="12" style="text-align: right;padding: 2px" v-if="safeForm.recaptcha_enable">
        <a-input v-model="safeForm.recaptcha_site_key" @change="update"/>
      </a-col>
      <a-divider dashed/>
      <a-col :xs="24" :xl="12" style="padding: 2px">
        <div>
          {{ t('safety.ip_registration_limit') }}
        </div>
        <span style="font-size: 12px;">
          {{ t('safety.ip_registration_limit_desc') }}
        </span>
      </a-col>
      <a-col :xs="24" :xl="12" style="text-align: right;padding: 2px">
        <a-switch v-model="safeForm.register_limit_by_ip_enable" :checked-value="1" :unchecked-value="0"
                  @change="update">
          <template #checked>
            {{ t('form.open') }}
          </template>
          <template #unchecked>
            {{ t('form.close') }}
          </template>
        </a-switch>
      </a-col>
      <a-divider dashed/>
      <a-col :xs="24" :xl="12" style="padding: 2px">
        <div>
          {{ t('safety.anti_brute_force') }}
        </div>
        <span style="font-size: 12px;">
          {{ t('safety.anti_brute_force_desc') }}
        </span>
      </a-col>
      <a-col :xs="24" :xl="12" style="text-align: right;padding: 2px">
        <a-switch v-model="safeForm.password_limit_enable" :checked-value="1" :unchecked-value="0" @change="update">
          <template #checked>
            {{ t('form.open') }}
          </template>
          <template #unchecked>
            {{ t('form.close') }}
          </template>
        </a-switch>
      </a-col>
      <a-divider dashed/>
      <a-col :xs="24" :xl="12" style="padding: 2px">
        <div>
          {{ t('safety.failure_count') }}
        </div>
        <span style="font-size: 12px;">
          {{ t('safety.failure_count_desc') }}
        </span>
      </a-col>
      <a-col :xs="24" :xl="12" style="text-align: right;padding: 2px">
        <a-input v-model="safeForm.password_limit_count" @change="update"/>
      </a-col>
      <a-divider dashed/>
      <a-col :xs="24" :xl="12" style="padding: 2px">
        <div>
          {{ t('safety.punishment_time') }}
        </div>
        <span style="font-size: 12px;">
          {{ t('safety.punishment_time_desc') }}
        </span>
      </a-col>
      <a-col :xs="24" :xl="12" style="text-align: right;padding: 2px">
        <a-input v-model="safeForm.password_limit_expire" @change="update"/>
      </a-col>
    </a-row>
  </div>
</template>
<script setup lang="ts">
import {defineEmits, defineProps, reactive, ref, watch} from 'vue';
import {Config, Safe} from "@/api/admin/system/system";
import {useI18n} from "vue-i18n";

const {t} = useI18n();
const props = defineProps<{
  data: Config
}>()

const safeForm = reactive<Safe>(props.data.safe);


const emit = defineEmits(['update'])
const data = props.data

//监听父config改变
watch(() => props.data, (newVal) => {
  Object.keys(newVal.safe).forEach(k => {
    safeForm[k] = newVal.safe[k]
  })
});
//监听form改变
const update = () => {
  emit('update', safeForm)
}

</script>
<style scoped lang="less">
.arco-col > div {
  font-weight: bold;
}
</style>
