<template>
  <div>
    <a-row class="safety">
      <a-col :xs="24" :xl="12" style="padding: 2px">
        <div>
          {{ t('invite.force') }}
        </div>
        <span style="font-size: 12px;">
          {{ t('invite.force_desc') }}
        </span>
      </a-col>
      <a-col :xs="24" :xl="12" style="text-align: right;padding: 2px">
        <a-switch v-model="inviteForm.invite_force" :checked-value="1" :unchecked-value="0" @change="update">
          <template #checked>
            {{ t('form.open') }}
          </template>
          <template #unchecked>
            {{ t('form.close') }}
          </template>
        </a-switch>
      </a-col>
      <a-divider dashed />
      <a-col :xs="24" :xl="12" style="padding: 2px">
        <div>
          {{ t('invite.force_present') }}
        </div>
        <span style="font-size: 12px;">
          {{ t('invite.force_present_desc') }}
        </span>
      </a-col>
      <a-col :xs="24" :xl="12" style="text-align: right;padding: 2px">
        <a-switch v-model="inviteForm.invite_force_present" :checked-value="1" :unchecked-value="0" @change="update">
          <template #checked>
            {{ t('form.open') }}
          </template>
          <template #unchecked>
            {{ t('form.close') }}
          </template>
        </a-switch>
      </a-col>
      <a-divider v-if="inviteForm.invite_force_present == 1" dashed />
      <a-col v-if="inviteForm.invite_force_present == 1" :xs="24" :xl="12" style="padding: 2px">
        <div>
          {{ t('invite.complimentary_packages') }}
        </div>
        <span style="font-size: 12px;">
          {{ t('invite.complimentary_packages_desc') }}
        </span>
      </a-col>
      <a-col v-if="inviteForm.invite_force_present == 1" :xs="24" :xl="12" style="text-align: right;padding: 2px">
        <a-select v-model="inviteForm.complimentary_packages" :placeholder="t('invite.complimentary_packages_placeholder')" @change="update">
<!--          <a-option :value="0" :label="t('invite.complimentary_packages_option')" />-->
          <div v-for="(item, index) in inviteForm.plans" :key="index">
            <a-option :value="item.id" :key="item.id" :label="item.name" />
          </div>
        </a-select>
      </a-col>
      <a-divider v-if="inviteForm.invite_force_present == 1" dashed />
      <a-col v-if="inviteForm.invite_force_present == 1" :xs="24" :xl="12" style="padding: 2px">
        <div>
          {{ t('invite.complimentary_package_duration') }}
        </div>
        <span style="font-size: 12px;">
          {{ t('invite.complimentary_package_duration_desc') }}
        </span>
      </a-col>
      <a-col v-if="inviteForm.invite_force_present == 1" :xs="24" :xl="12" style="text-align: right;padding: 2px">
        <a-input v-model="inviteForm.complimentary_package_duration" :min="0" type="number" @change="update" />
      </a-col>
      <a-divider dashed />
      <a-col :xs="24" :xl="12" style="padding: 2px">
        <div>
          {{ t('invite.is_Invitation_to_give_model') }}
        </div>
        <span style="font-size: 12px;">
          {{ t('invite.is_Invitation_to_give_model_desc') }}
        </span>
      </a-col>
      <a-col   :xs="24" :xl="12" style="text-align: right;padding: 2px">
        <a-select v-model="inviteForm.is_Invitation_to_give" :placeholder="t('invite.is_Invitation_to_give_placeholder')" @change="update">
          <a-option :value="0" :label="t('invite.is_Invitation_to_give_close')" />
          <a-option :value="1" :label="t('invite.is_Invitation_to_give_register')" />
          <a-option :value="2" :label="t('invite.is_Invitation_to_give_shop')" />
          <a-option :value="3" :label="t('invite.is_Invitation_to_give_all')" />
        </a-select>
      </a-col>
      <a-divider dashed />
      <a-col :xs="24" :xl="12" style="padding: 2px">
        <div>
          {{ t('invite.commission') }}
        </div>
        <span style="font-size: 12px;">
          {{ t('invite.commission_desc') }}
        </span>
      </a-col>
      <a-col :xs="24" :xl="12" style="text-align: right;padding: 2px">
        <a-input v-model="inviteForm.invite_commission" @change="update" />
      </a-col>
      <a-divider dashed />
      <a-col :xs="24" :xl="12" style="padding: 2px">
        <div>
          {{ t('invite.gen_limit') }}
        </div>
      </a-col>
      <a-col :xs="24" :xl="12" style="text-align: right;padding: 2px">
        <a-input v-model="inviteForm.invite_gen_limit" @change="update" />
      </a-col>
      <a-divider dashed />
      <a-col :xs="24" :xl="12" style="padding: 2px">
        <div>
          {{ t('invite.never_expire') }}
        </div>
        <span style="font-size: 12px;">
          {{ t('invite.never_expire_desc') }}
        </span>
      </a-col>
      <a-col :xs="24" :xl="12" style="text-align: right;padding: 2px">
        <a-switch checked-value="1" v-model="inviteForm.invite_never_expire" unchecked-value="0" @change="update">
          <template #checked>
            {{ t('form.open') }}
          </template>
          <template #unchecked>
            {{ t('form.close') }}
          </template>
        </a-switch>
      </a-col>
      <a-divider dashed />
      <a-col :xs="24" :xl="12" style="padding: 2px">
        <div>
          {{ t('invite.commission_first_time_enable') }}
        </div>
        <span style="font-size: 12px;">
          {{ t('invite.commission_first_time_enable_desc') }}
        </span>
      </a-col>
      <a-col :xs="24" :xl="12" style="text-align: right;padding: 2px">
        <a-switch v-model="inviteForm.commission_first_time_enable" checked-value="1" unchecked-value="0"
                  @change="update">
          <template #checked>
            {{ t('form.open') }}
          </template>
          <template #unchecked>
            {{ t('form.close') }}
          </template>
        </a-switch>
      </a-col>

      <a-divider dashed />
      <a-col :xs="24" :xl="12" style="padding: 2px">
        <div>
          {{ t('invite.commission_auto_check_enable') }}
        </div>
        <span style="font-size: 12px;">
          {{ t('invite.commission_auto_check_enable_desc') }}
        </span>
      </a-col>
      <a-col :xs="24" :xl="12" style="text-align: right;padding: 2px">
        <a-switch v-model="inviteForm.commission_auto_check_enable" checked-value="1" unchecked-value="0"
                  @change="update">
          <template #checked>
            {{ t('form.open') }}
          </template>
          <template #unchecked>
            {{ t('form.close') }}
          </template>
        </a-switch>
      </a-col>
      <a-divider dashed />
      <a-col :xs="24" :xl="12" style="padding: 2px">
        <div>
          {{ t('invite.commission_withdraw_limit') }}
        </div>
        <span style="font-size: 12px;">
          {{ t('invite.commission_withdraw_limit_desc') }}
        </span>
      </a-col>
      <a-col :xs="24" :xl="12" style="text-align: right;padding: 2px">
        <a-input v-model="inviteForm.commission_withdraw_limit" @change="update" />
      </a-col>
      <a-divider dashed />
      <a-col :xs="24" :xl="12" style="padding: 2px">
        <div>
          {{ t('invite.commission_withdraw_method') }}
        </div>
        <span style="font-size: 12px;">
          {{ t('invite.commission_withdraw_method_desc') }}
        </span>
      </a-col>
      <a-col :xs="24" :xl="12" style="text-align: right;padding: 2px">
        <a-textarea v-model="inviteForm.commission_withdraw_method" :auto-size="{ minRows: 4 }" @change="update" />
      </a-col>
      <a-divider dashed />
      <a-col :xs="24" :xl="12" style="padding: 2px">
        <div>
          {{ t('invite.withdraw_close_enable') }}
        </div>
        <span style="font-size: 12px;">
          {{ t('invite.withdraw_close_enable_desc') }}
        </span>
      </a-col>
      <a-col :xs="24" :xl="12" style="text-align: right;padding: 2px">
        <a-switch v-model="inviteForm.withdraw_close_enable" checked-value="1" unchecked-value="0" @change="update">
          <template #checked>
            {{ t('form.open') }}
          </template>
          <template #unchecked>
            {{ t('form.close') }}
          </template>
        </a-switch>
      </a-col>
      <a-divider dashed />
      <a-col :xs="24" :xl="12" style="padding: 2px">
        <div>
          {{ t('invite.commission_distribution_enable') }}
        </div>
        <span style="font-size: 12px;">
          {{ t('invite.commission_distribution_enable_desc') }}
        </span>
      </a-col>
      <a-col :xs="24" :xl="12" style="text-align: right;padding: 2px">
        <a-switch v-model="inviteForm.commission_distribution_enable" checked-value="1" unchecked-value="0"
                  @change="update">
          <template #checked>
            {{ t('form.open') }}
          </template>
          <template #unchecked>
            {{ t('form.close') }}
          </template>
        </a-switch>
      </a-col>
    </a-row>
  </div>
</template>
<script setup lang="ts">
import { reactive, watch } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const props = defineProps(['data'])
const emits = defineEmits(['update'])
const inviteForm = reactive(props.data.invite);
const update = () => {
  let params = {}
  Object.keys(inviteForm).forEach(k => {
    if (k === "commission_withdraw_method") {
      params[k] = inviteForm[k].toString().split(",")
    } else {
      params[k] = inviteForm[k]
    }
  })

  emits('update', params)
}

watch(() => props.data, (newVal) => {
  Object.keys(newVal.invite).forEach(k => {
    inviteForm[k] = newVal.invite[k]
  })
});

</script>
<style scoped lang="less">
.arco-col>div {
  font-weight: bold;
}
</style>
