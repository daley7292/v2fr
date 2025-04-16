<script setup lang="ts">
import { onMounted, reactive, watch } from "vue";
import { SavePermission } from "@/api/admin/server/permission";
import { Message } from "@arco-design/web-vue";
import { useI18n } from 'vue-i18n';
const { t } = useI18n();



const props = defineProps(['data'])
const emits = defineEmits(['close']);
const close = () => {
  emits('close')
}
const formData = reactive(props.data)
const submitPermission = () => {
  SavePermission(formData).then(r => {
    if (r.data) {
      close()
      Message.success("添加成功")
    }
  })
}
</script>

<template>
  <div>
    <a-form ref="formDataData" layout="vertical">
      <a-form-item field="name" :label="t('permission.form.name')">
        <a-input v-model="formData.name" :placeholder="t('permission.form.name.input')" />
      </a-form-item>
      <a-form-item>
        <a-space>
          <a-button @click="close">{{t('button.cancel')}}</a-button>
          <a-button @click="submitPermission">{{t('button.submit')}}</a-button>
        </a-space>
      </a-form-item>
    </a-form>
  </div>
</template>

<style scoped lang="less"></style>