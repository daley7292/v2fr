<template>
  <div>
    <div style="margin-bottom: 15px">
      <a-alert  type='warning' >
        {{ t('individuation.warning') }}<a href="#">{{ t('individuation.learn_more') }}</a>
      </a-alert>
    </div>
    <a-row>
      <a-col :xs="24" :xl="12" style="padding: 2px">
        <div>
          {{ t('individuation.sidebar_style') }}
        </div>
      </a-col>
      <a-col :xs="24" :xl="12" style="text-align: right;padding: 2px">
        <a-switch v-model="frontendForm.frontend_theme_sidebar" @change="update" checked-value="light" unchecked-value="dark">
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
          {{ t('individuation.header_style') }}
        </div>
      </a-col>
      <a-col :xs="24" :xl="12" style="text-align: right;padding: 2px">
        <a-switch v-model="frontendForm.frontend_theme_header" @change="update" checked-value="light" unchecked-value="dark">
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
          {{ t('individuation.theme_color') }}
        </div>
        <span style="font-size: 12px;">
          {{ t('individuation.theme_color_desc') }}
        </span>
      </a-col>
      <a-col :xs="24" :xl="12" style="text-align: right;padding: 2px">
        <a-select :style="{width:'320px'}" default-value="default" placeholder="" v-model="frontendForm.frontend_theme_color" @change="update">
          <a-option value="default">{{ t('individuation.default') }}</a-option>
        </a-select>
      </a-col>
      <a-divider dashed/>
      <a-col :xs="24" :xl="12" style="padding: 2px">
        <div>
          {{ t('individuation.background') }}
        </div>
        <span style="font-size: 12px;">
          {{ t('individuation.background_desc') }}
        </span>
      </a-col>
      <a-col :xs="24" :xl="12" style="text-align: right;padding: 2px">
        <a-input v-model="frontendForm.frontend_background_url" @change="update" :placeholder="t('individuation.background_placeholder')" allow-clear/>
      </a-col>
      <a-divider dashed/>
    </a-row>
  </div>
</template>
<script setup lang="ts">
import {reactive, watch} from "vue";
import {useI18n} from "vue-i18n";

const {t} = useI18n();
const props = defineProps(['data'])
const emits = defineEmits(['update'])
const frontendForm = reactive(props.data.frontend);
const update = () => {
  let params = {}
  Object.keys(frontendForm).forEach(k => {
      params[k] = frontendForm[k]
  })
  emits('update', params)
}

watch(() => props.data, (newVal) => {
  Object.keys(newVal.frontend).forEach(k => {
    frontendForm[k] = newVal.frontend[k]
  })
});

</script>
<style scoped lang="less">
.arco-col>div{
  font-weight: bold;
}
</style>
