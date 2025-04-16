<template>
  <div>
    <a-row>
      <a-col :xs="24" :xl="12" style="padding: 2px">
        <div>
          {{ t('app.windows') }}
        </div>
        <span>
          {{ t('app.windows_desc') }}
        </span>
      </a-col>
      <a-col :xs="24" :xl="12" style="text-align: right;padding: 2px">
        <div style="margin-bottom: 10px">
          <a-input :placeholder="t('app.version_placeholder')" v-model="appForm.windows_version" @change="update" allow-clear/>
        </div>
        <div>
          <a-input :placeholder="t('app.windows_download_placeholder')" v-model="appForm.windows_download_url" @change="update" allow-clear/>
        </div>
      </a-col>
      <a-divider dashed/>
      <a-col :xs="24" :xl="12" style="padding: 2px">
        <div>
          {{ t('app.macos') }}
        </div>
        <span>
          {{ t('app.macos_desc') }}
        </span>
      </a-col>
      <a-col :xs="24" :xl="12" style="text-align: right;padding: 2px">
        <div style="margin-bottom: 10px">
          <a-input :placeholder="t('app.version_placeholder')" v-model="appForm.macos_version" @change="update" allow-clear/>
        </div>
        <div>
          <a-input :placeholder="t('app.macos_download_placeholder')" v-model="appForm.macos_download_url" @change="update" allow-clear/>
        </div>
      </a-col>
      <a-divider dashed/>
      <a-col :xs="24" :xl="12" style="padding: 2px">
        <div>
          {{ t('app.android') }}
        </div>
        <span>
          {{ t('app.android_desc') }}
        </span>
      </a-col>
      <a-col :xs="24" :xl="12" style="text-align: right;padding: 2px">
        <div style="margin-bottom: 10px">
          <a-input :placeholder="t('app.version_placeholder')" v-model="appForm.android_version" @change="update" allow-clear/>
        </div>
        <div>
          <a-input :placeholder="t('app.android_download_placeholder')" v-model="appForm.android_download_url" @change="update" allow-clear/>
        </div>
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
const appForm = reactive(props.data.app);
const update = () => {
  let params = {}
  Object.keys(appForm).forEach(k => {
    params[k] = appForm[k]
  })
  emits('update', params)
}

watch(() => props.data, (newVal) => {
  Object.keys(newVal.app).forEach(k => {
    appForm[k] = newVal.app[k]
  })
});

</script>
<style scoped lang="less">
.arco-col>div{
  line-height: 40px;
  font-weight: bold;
}
</style>
