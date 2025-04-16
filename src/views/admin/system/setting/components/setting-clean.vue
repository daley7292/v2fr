<template>
  <div style="min-height: 70vh; padding: 20px">
    <a-popconfirm  @ok="clearLogs"  :content="t('setting.system.clean.logs.confirm')">
      <a-button type="primary" :loading="loading">{{
          t('setting.system.clean.logs')
        }}</a-button>
    </a-popconfirm>
  </div>
</template>
<script setup lang="ts">
  import { useI18n } from 'vue-i18n';
  import { clearLog } from '@/api/admin/system/system';
  import { Message } from '@arco-design/web-vue';
  import { ref } from 'vue';

  const { t } = useI18n();
  const loading = ref(false);
  const clearLogs = () => {
    loading.value = true;
    clearLog().then((res) => {
      if (res.data) {
        Message.success({
          content: t('setting.system.clean.success', {
            logCount: res.logCount,
            mailLogCount: res.mailLogCount
          }),
        });
      } else {
        Message.error({
          content: t('setting.system.clean.error'),
        });
      }
      loading.value = false
    });
  };
</script>
<style scoped lang="less">
  .arco-col > div {
    line-height: 40px;
    font-weight: bold;
  }
</style>
<style scoped lang="less"></style>