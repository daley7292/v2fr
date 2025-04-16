<script setup lang="ts">
import {defineEmits, onMounted, reactive, ref, watch} from "vue";
import {getPaymentForm, getPaymentMethods, PayFormItem, savePaymentMethod} from "@/api/admin/system/payment";
import {Message} from "@arco-design/web-vue";
import { useI18n } from 'vue-i18n';


const { t } = useI18n();

const emit = defineEmits(['closeModal']);
const close = () => {
  emit('closeModal')
}
const props = defineProps(['data'])

const payMethods = ref<String[]>([])
const queryPaymentMethodList = () => {
  getPaymentMethods().then(r => {
    payMethods.value = r.data
  })
}
const submitForm = (values: any) => {
  savePaymentMethod(values).then(r => {
    if (r.data) {
      Message.success({
        content: '提交成功'
      })
      close()
    }
  })
}
const formDataItems = ref<PayFormItem[]>([])
const queryPaymentForm = () => {
  if (!paymentMethodForm.payment  ) {
    return
  }
  getPaymentForm({id:paymentMethodForm.id,payment: paymentMethodForm.payment}).then(r => {
    formDataItems.value = []
    Object.keys(r.data).forEach(k => {
      formDataItems.value.push({
        field: k,
        label: r.data[k].label,
        description: r.data[k].description,
        type: r.data[k].type
      })
    })
  })
}
const paymentMethodForm = reactive(props.data)
queryPaymentForm()
//监听父config改变
watch(() => props.data, (newVal) => {
  Object.keys(newVal).forEach(k => {
    if (k === "config") {
      Object.keys(paymentMethodForm[k]).forEach(ck => {
        paymentMethodForm[k][ck] = newVal[k][ck];
      })
    } else {
      paymentMethodForm[k] = newVal[k];
    }
  })
  paymentMethodForm['handling_fee_fixed'] = paymentMethodForm['handling_fee_fixed'] / 100
  queryPaymentForm()
});
queryPaymentMethodList()
onMounted(() => {
  paymentMethodForm['handling_fee_fixed'] = paymentMethodForm['handling_fee_fixed'] / 100
})
</script>

<template>
  <div>
    <a-form layout="vertical" ref="paymentMethod" :model="paymentMethodForm" @submit="submitForm">
      <a-form-item field="name" :label="t('payment.form.display_name')">
        <a-input v-model="paymentMethodForm.name" :placeholder="t('payment.form.display_name_desc')"/>
      </a-form-item>
      <a-form-item field="name" :label="t('payment.form.icon_url')">
        <a-input v-model="paymentMethodForm.icon" :placeholder="t('payment.form.icon_url_desc')"/>
      </a-form-item>
      <a-form-item field="notify_domain" :label="t('payment.form.custom_notify_domain')">
        <a-input v-model="paymentMethodForm.notify_domain" :placeholder="t('payment.form.custom_notify_domain_desc')"/>
      </a-form-item>
      <a-row>
        <a-col :span="11">
          <a-form-item field="handling_fee_percent" :label="t('payment.form.percentage_fee')">
            <a-input v-model="paymentMethodForm.handling_fee_percent" :placeholder="t('payment.form.percentage_fee_desc')"/>
          </a-form-item>
        </a-col>
        <a-col :span="11" :offset="2">
          <a-form-item field="handling_fee_fixed" label="百分比手续费(选填)">
            <a-input v-model="paymentMethodForm.handling_fee_fixed" placeholder="在订单金额基础上附加手续费"/>
          </a-form-item>
        </a-col>
      </a-row>
      <a-form-item field="payment" :label="t('payment.form.interface_file')">
        <a-select v-model="paymentMethodForm.payment" :placeholder="t('payment.form.interface_file_desc')" @change="queryPaymentForm">
          <div v-for="(item,index) in payMethods" :key="index">
            <a-option :value="item">{{ item }}</a-option>
          </div>
        </a-select>
      </a-form-item>
      <div v-for="(item,index) in formDataItems" :key="index">
        <a-form-item :field="item.field" :label="item.label">
          <a-input :placeholder="item.description" v-model="paymentMethodForm.config[item.field]"/>
        </a-form-item>
      </div>
      <a-form-item style="align-items: center">
        <a-space>
          <a-button @click="close" type="dashed">{{t('button.cancel')}}</a-button>
          <a-button html-type="submit" type="primary">{{t('button.ok')}}</a-button>
        </a-space>
      </a-form-item>
    </a-form>
  </div>
</template>

<style scoped lang="less">

</style>
