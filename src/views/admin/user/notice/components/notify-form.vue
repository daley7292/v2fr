<script setup lang="ts">
import {onMounted, reactive} from "vue";
import {newNotify, Notify, SaveNotify} from "@/api/admin/user/notify";
import {useI18n} from "vue-i18n";

const {t} = useI18n();

const props = defineProps(['data'])
const emits = defineEmits(['close'])
const form = reactive<Notify>(newNotify)

const close = () => emits('close')
const saveNotify = () => {
  SaveNotify(form).then(r => {
    close()
  })
}
onMounted(() => {
  if (props.data) {
    Object.keys(props.data).forEach(k => {
      form[k] = props.data[k]
    })
    if (form.windows_type <1 ||form.windows_type>7){
      form.windows_type = undefined
    }
  }
})
</script>

<template>
  <a-form layout="vertical" :model="form" @submit="saveNotify">
    <a-form-item :label="t('notifyTable.form.title')" >
      <a-input v-model="form.title" :placeholder="t('notifyTable.form.placeholder.title')"/>
    </a-form-item>
    <a-form-item :label="t('notifyTable.form.content')">
      <a-textarea v-model="form.content" :auto-size="{minRows: 10}" :placeholder="t('notifyTable.form.placeholder.content')"
                  :show-word-limit="true"/>
    </a-form-item>
    <a-form-item  :label="t('notifyTable.form.tag')">
      <a-input-tag v-model="form.tags" :placeholder="t('notifyTable.form.placeholder.tag')" allow-clear/>
    </a-form-item>
    <a-form-item :label="t('notifyTable.form.windows_type')">
      <a-select v-model="form.windows_type" :placeholder="t('notifyTable.form.windows_type_desc')">
        <a-option :value="1">{{ t('notifyTable.form.windows_type.option1') }}</a-option>
        <a-option :value="2">{{ t('notifyTable.form.windows_type.option2') }}</a-option>
        <a-option :value="3">{{ t('notifyTable.form.windows_type.option3') }}</a-option>
        <a-option :value="4">{{ t('notifyTable.form.windows_type.option4') }}</a-option>
        <a-option :value="5">{{ t('notifyTable.form.windows_type.option5') }}</a-option>
        <a-option :value="6">{{ t('notifyTable.form.windows_type.option6') }}</a-option>
        <a-option :value="7">{{ t('notifyTable.form.windows_type.option7') }}</a-option>
      </a-select>
    </a-form-item>
    <a-form-item :label="t('notifyTable.form.image_url')">
      <a-input v-model="form.img_url" :placeholder="t('notifyTable.form.placeholder.image_url')"/>
    </a-form-item>
    <a-form-item>
      <div style="width: 100%;text-align: center">
        <a-space>
          <a-button @click="close">{{t('notifyTable.form.cancel')}}</a-button>
          <a-button type="primary" html-type="submit">{{t('notifyTable.form.submit')}}</a-button>
        </a-space>
      </div>
    </a-form-item>
  </a-form>
</template>

<style scoped lang="less">

</style>
