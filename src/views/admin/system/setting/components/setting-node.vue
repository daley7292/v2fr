<template>
  <div>
    <a-row>
      <a-col :xs="24" :xl="12" style="padding: 2px">
        <div>
          {{ t('node.form.server_token') }}
        </div>
        <span style="font-size: 12px;">
          {{ t('node.form.server_token_desc') }}
        </span>
      </a-col>
      <a-col :xs="24" :xl="12" style="text-align: right;padding: 2px">
        <a-input :placeholder="t('node.form.placeholder')" v-model="serverForm.server_token" @click="update" allow-clear/>
      </a-col>
      <a-divider dashed/>
      <a-col :xs="24" :xl="12" style="padding: 2px">
        <div>
          {{ t('node.form.server_pull_interval') }}
        </div>
        <span style="font-size: 12px;">
          {{ t('node.form.server_pull_interval_desc') }}
        </span>
      </a-col>
      <a-col :xs="24" :xl="12" style="text-align: right;padding: 2px">
        <a-input :placeholder="t('node.form.placeholder')" v-model="serverForm.server_pull_interval" @click="update" allow-clear/>
      </a-col>
      <a-divider dashed/>
      <a-col :xs="24" :xl="12" style="padding: 2px">
        <div>
          {{ t('node.form.server_push_interval') }}
        </div>
        <span style="font-size: 12px;">
          {{ t('node.form.server_push_interval_desc') }}
        </span>
      </a-col>
      <a-col :xs="24" :xl="12" style="text-align: right;padding: 2px">
        <a-input :placeholder="t('node.form.placeholder')" v-model="serverForm.server_push_interval" @click="update" allow-clear/>
      </a-col>
    </a-row>
  </div>
</template>
<script setup lang="ts">
import {reactive, watch} from "vue";
import {useI18n} from "vue-i18n";

const {t} = useI18n();
const props = defineProps(['data'])
const emits = defineEmits(['update'])
const serverForm = reactive(props.data.server);
const update = () => {
  let params = {}
  Object.keys(serverForm).forEach(k => {
    params[k] = serverForm[k]
  })
  emits('update', params)
}

watch(() => props.data, (newVal) => {
  Object.keys(newVal.server).forEach(k => {
    serverForm[k] = newVal.server[k]
  })
});

</script>
<style scoped lang="less">
.arco-col > div {
  font-weight: bold;
}
</style>
