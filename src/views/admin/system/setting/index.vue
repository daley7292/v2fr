<template>
  <div class="container">
    <Breadcrumb :items="['menu.system', 'menu.system.setting']" />
    <a-card>
      <a-tabs default-active-key="1" lazy-load>
        <a-tab-pane key="1" :title="t('setting.tabs.site')">
          <setting-site :data="config" @update="update" />
        </a-tab-pane>
        <a-tab-pane key="2" :title="t('setting.tabs.security')">
          <setting-safety :data="config" @update="update" />
        </a-tab-pane>
        <a-tab-pane key="3" :title="t('setting.tabs.subscription')">
          <setting-subscribe :data="config" @update="update" />
        </a-tab-pane>
        <a-tab-pane key="4" :title="t('setting.tabs.invitation_commission')">
          <setting-invitation-commission :data="config" @update="update" />
        </a-tab-pane>
        <a-tab-pane key="5" :title="t('setting.tabs.personalization')">
          <setting-individuation :data="config" @update="update" />
        </a-tab-pane>
        <a-tab-pane key="6" :title="t('setting.tabs.node')">
          <setting-node :data="config" @update="update" />
        </a-tab-pane>
        <a-tab-pane key="7" :title="t('setting.tabs.email')">
          <setting-email :data="config" @update="update" />
        </a-tab-pane>
        <a-tab-pane key="8" :title="t('setting.tabs.telegram')">
          <setting-telegram :data="config" @update="update" />
        </a-tab-pane>
        <a-tab-pane key="9" :title="t('setting.tabs.app')">
          <setting-app :data="config" @update="update" />
        </a-tab-pane>
<!--        <a-tab-pane key="10" :title="t('setting.tabs.clean')">-->
<!--          <setting-clean />-->
<!--        </a-tab-pane>-->
      </a-tabs>
    </a-card>
  </div>
</template>
<style lang="less" scoped>
.container {
  padding: 0 20px 20px 20px;
}
</style>

<script lang="ts" setup>
import SettingSite from "@/views/admin/system/setting/components/setting-site.vue";
import SettingSafety from "@/views/admin/system/setting/components/setting-safety.vue";
import SettingSubscribe from "@/views/admin/system/setting/components/setting-subscribe.vue";
import SettingInvitationCommission from "@/views/admin/system/setting/components/setting-invitation-commission.vue";
import SettingIndividuation from "@/views/admin/system/setting/components/setting-individuation.vue";
import SettingNode from "@/views/admin/system/setting/components/setting-node.vue";
import SettingEmail from "@/views/admin/system/setting/components/setting-email.vue";
import SettingTelegram from "@/views/admin/system/setting/components/setting-telegram.vue";
import SettingApp from "@/views/admin/system/setting/components/setting-app.vue";
import SettingClean from "@/views/admin/system/setting/components/setting-clean.vue";
import { Config, defaultConfig, queryConfig, updateConfig } from "@/api/admin/system/system";
import { ref } from "vue";
import { Message } from "@arco-design/web-vue";
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const config = ref<Config>(defaultConfig)
const query = () => queryConfig().then(r => {
  config.value = r.data
})
const update = (conf: any) => {
  updateConfig(conf).then(r => {
    if (r.data) {
      Message.success({
        content: t('setting.update_success')
      })
      query()
    } else {
      Message.error({
        content: t('setting.update_failure')
      })
    }
  })
}
query()
</script>

<script lang="ts">
export default {
  name: 'SystemSetting', // If you want the include property of keep-alive to take effect, you must name the component
};
</script>

