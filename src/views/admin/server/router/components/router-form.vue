<script setup lang="ts">
import {onMounted, reactive, ref} from "vue";
import {SaveRouter} from "@/api/admin/server/router";
import {Message} from "@arco-design/web-vue";
import {useI18n} from 'vue-i18n';

const {t} = useI18n();
const props = defineProps(['data'])
const emits = defineEmits(['close']);
const close = () => {
  emits('close')
}
const formData = reactive(props.data)

const submitRouter = () => {
  formData.match =(formData.match.toString()).split("\n")
  SaveRouter(formData).then(r => {
    if (r.data) {
      close()
      Message.success(t('routerForm.AddSuccess'))
    }
  })
}
onMounted(()=>{
  formData.match = formData.match.toString().replaceAll(",","\n")
})
</script>

<template>
  <div>
    <a-form layout="vertical">
      <a-form-item field="remarks" :label="t('routerTable.columns.remarks')">
        <a-input v-model="formData.remarks" :placeholder="t('routerTable.columns.remarks.input')"/>
      </a-form-item>
      <a-form-item field="match" :label="t('routerTable.columns.match.value')">
        <a-mention  :data="formData.match"   v-model="formData.match" type="textarea"  placeholder="example.com
*.example.com"  >

        </a-mention>
      </a-form-item>
      <a-form-item field="action" :label="t('routerForm.Action')">
        <a-select default-value="block" v-model="formData.action">
          <a-option value="block"> {{t('action.block')}} </a-option>
          <a-option value="dns">{{t('action.dns')}}</a-option>
        </a-select>
      </a-form-item>
      <a-form-item>
        <a-space>
          <a-button type="dashed" @click="close">{{t('button.cancel')}}</a-button>
          <a-button type="primary" @click="submitRouter">{{t('button.submit')}}</a-button>
        </a-space>
      </a-form-item>
    </a-form>
  </div>
</template>

<style scoped lang="less">

</style>
