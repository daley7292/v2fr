<template>
  <div>
    <a-row>
      <a-col :xs="24" :xl="12" style="padding: 2px">
        <div>
          {{ t('telegram.bot_token') }}
        </div>
        <span style="font-size: 12px;">
          {{ t('telegram.bot_token_desc') }}
        </span>
      </a-col>
      <a-col :xs="24" :xl="12" style="text-align: right;padding: 2px">
        <a-input v-model="telegramForm.telegram_bot_token" @change="update" :placeholder="t('telegram.bot_token_placeholder')" allow-clear/>
      </a-col>
      <a-divider dashed/>
      <a-col v-if="telegramForm.telegram_bot_token" :xs="24" :xl="12" style="padding: 2px">
        <div>
          {{ t('telegram.set_webhook') }}
        </div>
        <span style="font-size: 12px;">
          {{ t('telegram.set_webhook_desc') }}
        </span>
      </a-col>
      <a-col v-if="telegramForm.telegram_bot_token" :xs="24" :xl="12" style="text-align: right;padding: 2px">
        <a-button type="primary" @click="setTelegramWebhook">{{ t('form.set_with_one_click') }}</a-button>
      </a-col>
      <a-divider dashed/>
      <a-col :xs="24" :xl="12" style="padding: 2px">
        <div>
          {{ t('telegram.enable_notification') }}
        </div>
        <span style="font-size: 12px;">
          {{ t('telegram.enable_notification_desc') }}
        </span>
      </a-col>
      <a-col :xs="24" :xl="12" style="text-align: right;padding: 2px">
        <a-switch unchecked-value="0" checked-value="1" v-model="telegramForm.telegram_bot_enable" @change="update">
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
          {{ t('telegram.group_address') }}
        </div>
        <span style="font-size: 12px;">
          {{ t('telegram.group_address_desc') }}
        </span>
      </a-col>
      <a-col :xs="24" :xl="12" style="text-align: right;padding: 2px">
        <a-input v-model="telegramForm.telegram_discuss_link" @change="update" :placeholder="t('telegram.group_address_placeholder')" allow-clear/>
      </a-col>
    </a-row>
  </div>
</template>
<script setup lang="ts">
import {reactive, watch} from "vue";
import {telegramWebhook} from "@/api/admin/system/system";
import {Message} from "@arco-design/web-vue";
import {useI18n} from "vue-i18n";

const {t} = useI18n();
const props = defineProps(['data'])
const emits = defineEmits(['update'])
const telegramForm = reactive(props.data.telegram);
const update = () => {
  let params = {}
  Object.keys(telegramForm).forEach(k => {
    params[k] = telegramForm[k]
  })
  emits('update', params)
}
const setTelegramWebhook=()=>{
  telegramWebhook().then(r=>{
    if (r?.messsage){
      Message.warning({
        content:r?.messsage
      })
    }
  })
}

watch(() => props.data, (newVal) => {
  Object.keys(newVal.server).forEach(k => {
    telegramForm[k] = newVal.telegram[k]
  })
});

</script>
<style scoped lang="less">
.arco-col>div{
  font-weight: bold;
}
</style>
