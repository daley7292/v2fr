<script setup lang="ts">


import {reactive, watch} from "vue";
import {useI18n} from "vue-i18n";

const {t} = useI18n();
const props = defineProps(['data'])
const emits = defineEmits(['update'])
const subscribeForm = reactive(props.data.subscribe);
const update = () => {
  let config = props.data
  Object.keys(config.subscribe).forEach(k => {
    config.subscribe[k] = subscribeForm[k]
  })
  emits('update', subscribeForm)
}

watch(() => props.data, (newVal) => {
  Object.keys(newVal.subscribe).forEach(k => {
    subscribeForm[k] = newVal.subscribe[k]
  })
});

</script>
<template>
  <a-row>
    <a-col :xs="24" :xl="12" style="padding: 2px">
      <div>
        {{ t('subscribe.plan_change_enable') }}
      </div>
      <span style="font-size: 12px;">
          {{ t('subscribe.plan_change_enable_desc') }}
        </span>
    </a-col>
    <a-col :xs="24" :xl="12" style="text-align: right;padding: 2px">
      <a-switch v-model="subscribeForm.plan_change_enable" :unchecked-value="0" :checked-value="1" @change="update">
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
        {{ t('subscribe.reset_traffic_method') }}
      </div>
      <span style="font-size: 12px;">
          {{ t('subscribe.reset_traffic_method_desc') }}
        </span>
    </a-col>
    <a-col :xs="24" :xl="12" style="text-align: right;padding: 2px">
      <a-select :style="{width:'320px'}" v-model="subscribeForm.reset_traffic_method" :default-value="0" placeholder=""
                @change="update">
        <a-option :value="0">{{ t('subscribe.reset_traffic_method_option1') }}</a-option>
        <a-option :value="1">{{ t('subscribe.reset_traffic_method_option2') }}</a-option>
        <a-option :value="2">{{ t('subscribe.reset_traffic_method_option3') }}</a-option>
        <a-option :value="3">{{ t('subscribe.reset_traffic_method_option4') }}</a-option>
        <a-option :value="4">{{ t('subscribe.reset_traffic_method_option5') }}</a-option>
      </a-select>
    </a-col>
    <a-divider dashed/>
    <a-col :xs="24" :xl="12" style="padding: 2px">
      <div>
        {{ t('subscribe.surplus_enable') }}
      </div>
      <span style="font-size: 12px;">
          {{ t('subscribe.surplus_enable_desc') }}
        </span>
    </a-col>
    <a-col :xs="24" :xl="12" style="text-align: right;padding: 2px">
      <a-switch v-model="subscribeForm.surplus_enable" :checked-value="1" :unchecked-value="0" @change="update">
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
        {{ t('subscribe.new_order_event_id') }}
      </div>
      <span style="font-size: 12px;">
          {{ t('subscribe.new_order_event_id_desc') }}
        </span>
    </a-col>
    <a-col :xs="24" :xl="12" style="text-align: right;padding: 2px">
      <a-select :style="{width:'320px'}" v-model="subscribeForm.new_order_event_id" :default-value="0" @change="update"
                placeholder="">
        <a-option :value="0">{{ t('subscribe.event_option_none') }}</a-option>
        <a-option :value="1">{{ t('subscribe.event_option_reset') }}</a-option>
      </a-select>
    </a-col>
    <a-divider dashed/>
    <a-col :xs="24" :xl="12" style="padding: 2px">
      <div>
        {{ t('subscribe.renew_order_event_id') }}
      </div>
      <span style="font-size: 12px;">
          {{ t('subscribe.renew_order_event_id_desc') }}
        </span>
    </a-col>
    <a-col :xs="24" :xl="12" style="text-align: right;padding: 2px">
      <a-select v-model="subscribeForm.renew_order_event_id" :style="{width:'320px'}" @change="update"
                :default-value="0" placeholder="">
        <a-option :value="0">{{ t('subscribe.event_option_none') }}</a-option>
        <a-option :value="1">{{ t('subscribe.event_option_reset') }}</a-option>
      </a-select>
    </a-col>
    <a-divider dashed/>
    <a-col :xs="24" :xl="12" style="padding: 2px">
      <div>
        {{ t('subscribe.change_order_event_id') }}
      </div>
      <span style="font-size: 12px;">
          {{ t('subscribe.change_order_event_id_desc') }}
        </span>
    </a-col>
    <a-col :xs="24" :xl="12" style="text-align: right;padding: 2px">
      <a-select v-model="subscribeForm.change_order_event_id" :style="{width:'320px'}" @change="update" default-value=""
                placeholder="">
        <a-option :value="0">{{ t('subscribe.event_option_none') }}</a-option>
        <a-option :value="1">{{ t('subscribe.event_option_reset') }}</a-option>
      </a-select>
    </a-col>
    <a-divider dashed/>
    <a-col :xs="24" :xl="12" style="padding: 2px">
      <div>
        {{ t('subscribe.show_info_to_server_enable') }}
      </div>
      <span style="font-size: 12px;">
         {{ t('subscribe.show_info_to_server_enable_desc') }}
        </span>
    </a-col>
    <a-col :xs="24" :xl="12" style="text-align: right;padding: 2px">
      <a-switch v-model="subscribeForm.show_info_to_server_enable" :checked-value="1" :unchecked-value="0"
                @change="update">
        <template #checked>
          {{ t('form.open') }}
        </template>
        <template #unchecked>
          {{ t('form.close') }}
        </template>
      </a-switch>
    </a-col>
  </a-row>
</template>
<style scoped lang="less">
.arco-col > div {
  font-weight: bold;
}
</style>
