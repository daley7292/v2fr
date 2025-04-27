<script setup>
import VueMarkdownEditor from '@kangc/v-md-editor';
import '@kangc/v-md-editor/lib/style/base-editor.css';
import vuepressTheme from '@kangc/v-md-editor/lib/theme/vuepress.js';
import '@kangc/v-md-editor/lib/theme/style/vuepress.css';
import Prism from 'prismjs';
import {reactive} from "vue";
import {newKnowledge, QueryKnowledge, SaveKnowledge} from "@/api/admin/user/knowledge";
import {useI18n} from "vue-i18n";

const {t} = useI18n();

VueMarkdownEditor.use(vuepressTheme, {
  Prism,
});

const props = defineProps(['id'])
const emits = defineEmits(['close'])
const editorValue = reactive({...newKnowledge})
//提交文档
const submitKnowledge = () => {
  SaveKnowledge(editorValue).then(() => {
    emits('close')
  })
}
//查询文档
const queryKnowledge = () => {
  if (props.id || props.id === 0) {
    QueryKnowledge({id: props.id}).then(r => {
      Object.keys(r.data).forEach(k => {
        editorValue[k] = r.data[k]
      })
    })
  }
}
queryKnowledge()
</script>

<template>
  <div>
    <a-form layout="vertical" @submit="submitKnowledge">
      <a-form-item :label="t('knowledgeTable.columns.title')">
        <a-input v-model="editorValue.title" :placeholder="t('knowledgeTable.columns.title_desc')"  />
      </a-form-item>
      <a-form-item :label="t('knowledgeTable.columns.category')">
        <a-input v-model="editorValue.category" :placeholder="t('knowledgeTable.columns.category_desc')"/>
      </a-form-item>
      <a-form-item :label="t('knowledgeTable.columns.language')">
        <a-select v-model="editorValue.language">
          <a-option value="en-US">English</a-option>
<!--          <a-option value="ja-JP">日本語</a-option>-->
<!--          <a-option value="ko-KR">한국어</a-option>-->
<!--          <a-option value="vi-VN">Tiếng Việt</a-option>-->
          <a-option value="zh-CN">中文</a-option>
<!--          <a-option value="zh-TW">繁體中文</a-option>-->
        </a-select>
      </a-form-item>
      <a-form-item :label="t('knowledgeTable.columns.content')">
        <VueMarkdownEditor v-model="editorValue.body" height="460px"></VueMarkdownEditor>
      </a-form-item>
      <a-form-item>
        <div class="v2-button">
          <a-space>
            <a-button type="dashed" @click="emits('close')">{{ t('button.cancel') }}</a-button>
            <a-button type="primary" html-type="submit">{{ t('button.submit') }}</a-button>
          </a-space>
        </div>
      </a-form-item>
    </a-form>
  </div>
</template>
<style scoped lang="less">
.v2-button {
  width: 100%;
  text-align: right;
  margin: 50px
}
</style>
