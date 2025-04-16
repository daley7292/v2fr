<template>
  <div>
    <a-row>
      <a-col :xs="24" :xl="12" style="padding: 2px">
        <div>
          {{t('site.form.site_name')}}
        </div>
        <span style="font-size: 12px;">
          {{t('site.form.site_name_desc')}}
        </span>
      </a-col>
      <a-col :xs="24" :xl="12" style="text-align: right;padding: 2px">
        <a-input :placeholder="t('site.form.site_name_input')" v-model="siteForm.app_name" @change="update" allow-clear/>
      </a-col>
      <a-divider dashed/>
      <a-col :xs="24" :xl="12" style="padding: 2px">
        <div>
          {{t('site.form.site_description')}}

        </div>
        <span style="font-size: 12px;">
          {{t('site.form.site_description_desc')}}
        </span>
      </a-col>
      <a-col :xs="24" :xl="12" style="text-align: right;padding: 2px">
        <a-input :placeholder="t('site.form.site_description_input')" v-model="siteForm.app_description" @change="update"  allow-clear/>
      </a-col>
      <a-divider dashed/>
      <a-col :xs="24" :xl="12" style="padding: 2px">
        <div>
          {{t('site.form.site_url')}}
        </div>
        <span style="font-size: 12px;">
          {{t('site.form.site_url_desc')}}
        </span>
      </a-col>
      <a-col :xs="24" :xl="12" style="text-align: right;padding: 2px">
        <a-input :placeholder="t('site.form.site_url_input')" v-model="siteForm.app_url" @change="update"  allow-clear/>
      </a-col>
      <a-divider dashed/>
      <a-col :xs="24" :xl="12" style="padding: 2px">
        <div>
          {{t('site.form.force_https')}}
        </div>
        <span style="font-size: 12px;">
          {{t('site.form.force_https_desc')}}
        </span>
      </a-col>
      <a-col :xs="24" :xl="12" style="text-align: right;padding: 2px">
        <a-switch v-model="siteForm.force_https" :checked-value="1" :unchecked-value="0" @change="update" >
                  <template #checked>
          {{ t('form.open') }}
        </template>
        <template #unchecked>
          {{ t('form.close') }}
        </template>
        </a-switch>
      </a-col>
      <a-divider dashed/>
      <a-col :xs="24" :xl="12" style="padding: 2px">
        <div>
          LOGO
        </div>
        <span style="font-size: 12px;">
          {{t('site.form.logo_desc')}}
        </span>
      </a-col>
      <a-col :xs="24" :xl="12" style="text-align: right;padding: 2px">
        <a-input :placeholder="t('site.form.logo_input')" v-model="siteForm.logo" @change="update"  allow-clear/>
      </a-col>
      <a-divider dashed/>
      <a-col :xs="24" :xl="12" style="padding: 2px">
        <div>
          {{t('site.form.subscription_url')}}
        </div>
        <span style="font-size: 12px;">
          {{t('site.form.subscription_url_desc')}}
        </span>
      </a-col>
      <a-col :xs="24" :xl="12" style="text-align: right;padding: 2px">
        <a-textarea :placeholder="t('site.form.subscription_url_input')" @change="update"  v-model="siteForm.subscribe_url"
                    :auto-size="{minRows:4}" allow-clear/>
      </a-col>
      <a-divider dashed/>
      <a-col :xs="24" :xl="12" style="padding: 2px">
        <div>
          {{t('site.form.terms_of_service_url')}}
        </div>
        <span style="font-size: 12px;">
          {{t('site.form.terms_of_service_url_desc')}}
        </span>
      </a-col>
      <a-col :xs="24" :xl="12" style="text-align: right;padding: 2px">
        <a-input :placeholder="t('site.form.terms_of_service_url_input')" v-model="siteForm.tos_url" @change="update"  allow-clear/>
      </a-col>
      <a-divider dashed/>
      <a-col :xs="24" :xl="12" style="padding: 2px">
        <div>
          {{t('site.form.disable_new_user_registration')}}
        </div>
        <span style="font-size: 12px;">
          {{t('site.form.disable_new_user_registration_desc')}}
        </span>
      </a-col>
      <a-col :xs="24" :xl="12" style="text-align: right;padding: 2px">
        <a-switch v-model="siteForm.stop_register" :checked-value="1" :unchecked-value="0"  @change="update" >
                  <template #checked>
          {{ t('form.open') }}
        </template>
        <template #unchecked>
          {{ t('form.close') }}
        </template>
        </a-switch>
      </a-col>
      <a-divider dashed/>
      <a-col :xs="24" :xl="12" style="padding: 2px">
        <div>
          {{t('site.form.trial_registration')}}
        </div>
        <span style="font-size: 12px;">
         {{t('site.form.trial_registration_desc')}}
        </span>
      </a-col>
      <a-col :xs="24" :xl="12" style="text-align: right;padding: 2px">
        <a-select :style="{width:'320px'}" v-model="siteForm.try_out_plan_id" @change="update"  placeholder="">
          <div>
            <a-option :value="0">{{ t('form.close') }}</a-option>
          </div>
          <div v-for="item in plans">
            <a-option :value="item.id">{{ item.name }}</a-option>
          </div>
        </a-select>
      </a-col>
      <a-divider dashed/>
      <a-col :xs="24" :xl="12" style="padding: 2px" v-if="siteForm.try_out_plan_id!=0">
        <div>
          {{t('site.form.trial_time')}}
        </div>
      </a-col>
      <a-col :xs="24" :xl="12" style="text-align: right;padding: 2px" v-if="siteForm.try_out_plan_id!=0">
        <a-input v-model="siteForm.try_out_hour" @change="update"  placeholder="请输入"/>
      </a-col>
      <a-divider dashed/>
      <a-col :xs="24" :xl="12" style="padding: 2px">
        <div>
          {{t('site.form.currency_unit')}}
        </div>
        <span style="font-size: 12px;">
          {{t('site.form.currency_unit_desc')}}
        </span>
      </a-col>
      <a-col :xs="24" :xl="12" style="text-align: right;padding: 2px">
        <a-input placeholder="CNY" v-model="siteForm.currency" @change="update"  allow-clear/>
      </a-col>
      <a-divider dashed/>
      <a-col :xs="24" :xl="12" style="padding: 2px">
        <div>
          {{t('site.form.currency_symbol')}}
        </div>
        <span style="font-size: 12px;">
          {{t('site.form.currency_symbol_desc')}}
        </span>
      </a-col>
      <a-col :xs="24" :xl="12" style="text-align: right;padding: 2px">
        <a-input placeholder="￥" v-model="siteForm.currency_symbol" @change="update" allow-clear/>
      </a-col>
      <a-divider dashed/>
      <a-col :xs="24" :xl="12" style="padding: 2px">
        <div>
          {{t('setting.system.optimize')}}
        </div>
        <span style="font-size: 12px;">
          {{t('setting.system.optimize_desc')}}
        </span>
      </a-col>
      <a-col :xs="24" :xl="12" style="padding: 2px">
        <a-popconfirm  @ok="clearLogs"  :content="t('setting.system.clean.logs.confirm')">
          <a-button type="primary" :loading="loading">{{
              t('setting.system.clean.logs')
            }}</a-button>
        </a-popconfirm> </a-col>
      <a-divider dashed/>
    </a-row>

  </div>
</template>
<script setup lang="ts">
import {defineEmits, defineProps, reactive, ref, watch} from 'vue';
import {Config, defaultSite, Plan, queryPlan, Site,clearLog} from "@/api/admin/system/system";
import {useI18n} from "vue-i18n";
import { Message } from "@arco-design/web-vue";

const {t} = useI18n();
const siteForm = reactive<Site>(defaultSite);
const props = defineProps<{
  data: Config
}>()
const emit = defineEmits(['update'])
const plans = ref<Plan[]>([])
const query = () => {
  queryPlan().then(r => {
    plans.value = r.data
  })
};
const update=()=>{
  emit('update', siteForm)
}

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
query()
//监听父config改变
watch(() => props.data, (newVal) => {
  Object.keys(newVal.site).forEach(k=>{
    siteForm[k] = newVal.site[k]
  })
});

</script>
<style scoped lang="less">
.arco-col > div {
  font-weight: bold;
}
</style>
