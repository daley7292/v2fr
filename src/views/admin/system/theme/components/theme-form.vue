<script setup lang="ts">
import {onMounted, reactive} from "vue";
import { GetThemeConfig, saveThemeConfig, ThemeConfig } from "@/api/admin/theme/theme";
import {useI18n} from "vue-i18n";
import { Base64 } from 'js-base64';

const data = defineProps(["name"])
const {t} = useI18n();

const emits = defineEmits(['close'])
const form = reactive<ThemeConfig>({})

const close = () => emits('close')
const saveTheme = () => {
  saveThemeConfig({name:data.name,config:Base64.encode(JSON.stringify(form))}).then(r => {
    close()
  })
}
onMounted(() => {
  GetThemeConfig({name:data.name}).then((r) => {
    Object.keys(r.data).forEach((key) => {
      form[key]= r.data[key]
    })
  })
})
</script>

<template>
  <a-form layout="vertical" :model="form" @submit="saveTheme">
    <a-form-item :label="t('theme.form.language')">
      <a-select v-model="form.theme_default_i18n">
        <a-option value="en-US">English</a-option>
        <!--          <a-option value="ja-JP">日本語</a-option>-->
        <!--          <a-option value="ko-KR">한국어</a-option>-->
        <!--          <a-option value="vi-VN">Tiếng Việt</a-option>-->
        <a-option value="zh-CN">中文</a-option>
        <!--          <a-option value="zh-TW">繁體中文</a-option>-->
      </a-select>
    </a-form-item>
    <a-form-item :label="t('theme.form.theme_color')" >
      <a-input v-model="form.theme_color" :placeholder="t('theme.form.theme_color.placeholder')"/>
    </a-form-item>
    <a-form-item :label="t('theme.form.theme_via')" >
      <a-input v-model="form.theme_via" :placeholder="t('theme.form.theme_via.placeholder')"/>
    </a-form-item>
    <a-form-item :label="t('theme.form.custom_html')">
      <a-textarea v-model="form.custom_html" :auto-size="true" :placeholder="t('theme.form.custom_html.placeholder')"
                  :show-word-limit="true"/>
    </a-form-item>
    <a-form-item>
      <div style="width: 100%;text-align: center">
        <a-space>
          <a-button type="dashed" @click="close">{{t('button.cancel')}}</a-button>
          <a-button type="primary" html-type="submit">{{t('button.submit')}}</a-button>
        </a-space>
      </div>
    </a-form-item>
  </a-form>
</template>

<style scoped lang="less">

</style>
