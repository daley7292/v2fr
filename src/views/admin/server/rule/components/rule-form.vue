<script setup lang="ts">
import {useI18n} from 'vue-i18n';
import {onMounted, reactive, ref} from "vue";
import {SaveRule} from "@/api/admin/server/rule";
import {QueryPermissionGroup,PermissionGroup} from "@/api/admin/server/node"
import {Message} from "@arco-design/web-vue";

const {t} = useI18n();
const props = defineProps(['data'])
const emits = defineEmits(['close']);
const close = () => {
  emits('close')
}
const formData = reactive(props.data)
//权限组
const permissionGroup = ref<PermissionGroup[]>([])
const queryPermissionGroup = async () => {
  const {data} = await QueryPermissionGroup()
  permissionGroup.value = data
}
const submitRule = () => {
    formData.server_arr = formData.temp_server_arr.toString()
  if (!formData.sort){
    formData.sort = 0
  }
  SaveRule(formData).then(r => {
    if (r.data) {
      close()
      Message.success("添加成功")
    }
  })
}

onMounted(()=>{
  queryPermissionGroup()
  // formData.match = formData.match
})
</script>

<template>
  <div>
    <a-form layout="vertical">
      <a-form-item field="name" :label="t('menu.server.name')" >
        <a-input v-model="formData.name" :placeholder="t('menu.server.name_desc')"/>
      </a-form-item>
      <a-form-item field="domain" :label="t('menu.server.domain')" >
        <a-input v-model="formData.domain" :placeholder="t('menu.server.domain_desc')"/>
      </a-form-item>
      <a-form-item field="ua" :label="t('menu.server.ua')" >
        <a-input v-model="formData.ua" :placeholder="t('menu.server.ua_desc')"/>
      </a-form-item>
      <a-form-item field="port" :label="t('menu.server.port')" >
        <a-input v-model="formData.port" type="number" :placeholder="t('menu.server.port_desc')"/>
      </a-form-item>
      <a-form-item field="server_arr" :label="t('menu.server.service_group')">
        <a-select v-model="formData.temp_server_arr" :placeholder="t('menu.server.service_group_desc')"  multiple>
          <div v-for="(item,index) in permissionGroup " :key="index">
            <a-option :value="item.id+''">{{ item.name }}</a-option>
          </div>
        </a-select>
      </a-form-item>
      <a-form-item>
        <a-space>
          <a-button @click="close">{{t('server.rule.cancel')}}</a-button>
          <a-button type="primary" @click="submitRule">{{t('server.rule.submit')}}</a-button>
        </a-space>
      </a-form-item>
    </a-form>
  </div>
</template>

<style scoped lang="less">

</style>
