<template>
  <div class="container">
    <a-card class="forgetPassword-card">
      <div style="text-align: center;margin-bottom: 20px">
        <h1>V2Boardb1</h1>
        <div style="opacity: 0.7">V2Board is best!</div>
      </div>
      <a-form layout="vertical" ref="forgetPasswordForm" :model="forgetPassword" @submit="submitForgetPassword">
        <a-form-item field="email">
          <a-input v-model="forgetPassword.email" :placeholder="t('forget_password.form.email')"/>
        </a-form-item>

        <a-form-item  field="email_code">
          <a-input v-model="forgetPassword.email_code" :placeholder="t('forget_password.form.email_ver')"/>&nbsp;
          <a-button @click="SendEmailVerify({email:forgetPassword.email})" type="primary">
            {{ t('forget_password.form.send') }}
          </a-button>
        </a-form-item>

        <a-form-item  field="password">
          <a-input v-model="forgetPassword.password" :placeholder="t('forget_password.form.password')"/>
        </a-form-item>
        <a-form-item>
          <a-input v-model="forgetPassword.password_check" :placeholder="t('forget_password.form.password')"/>
        </a-form-item>

        <a-form-item>
          <a-button html-type="submit" style="width: 100%" type="primary">
            <icon-safe size="16"/> &nbsp; {{ t('forget_password.form.submit') }}
          </a-button>
        </a-form-item>

        <a-form-item>
          <a-row style="width: 100%;padding-bottom: 25px">
            <a-col :span="12"><span style="cursor: pointer" @click="toLogin">{{
                t('forget_password.form.back_to_login')
              }}</span></a-col>
            <a-col :span="12" style="text-align: right;">
              <span style="width: 30px;position: absolute;font-size: 17px; color: #165DFF;right: 65px;bottom: 10px">
                <a-dropdown trigger="click" @select="changeLocale as any">
                <div ref="triggerBtn" style="display: flex;float: left;cursor: pointer" class="trigger-btn">
                  <icon-language/>
                </div>
                <template #content>
                  <a-doption
                      v-for="item in locales"
                      :key="item.value"
                      :value="item.value"
                  >
                    <template #icon>
                      <icon-check v-show="item.value === currentLocale"/>
                    </template>
                    {{ item.label }}
                  </a-doption>
                </template>
              </a-dropdown>
              </span>
              {{ t('language') }}
            </a-col>
          </a-row>
        </a-form-item>
      </a-form>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
import {AuthForget, GuestCommConfig, SendEmailVerify} from "@/api/login";
import {onMounted, reactive, ref} from "vue";
import useLocale from "@/hooks/locale";
import {LOCALE_OPTIONS} from "@/locale";
import {useI18n} from "vue-i18n";
import {useRoute, useRouter} from "vue-router";
import {ValidatedError} from "@arco-design/web-vue/es/form/interface";
import {Message} from "@arco-design/web-vue";

const {t} = useI18n();
const route = useRoute();
const router = useRouter();
const forgetPassword = reactive({
  email: undefined,
  password: undefined,
  password_check: undefined,
  email_code: undefined,
})
const submitForgetPassword = async ({
                                      errors,
                                      values,
                                    }: {
  errors: Record<string, ValidatedError> | undefined;
  values: Record<string, any>;
}) => {
  if (values.password===undefined){
    Message.warning(t('forget_password.form.password_check'))
    return
  }
  if (values.password===''||values.password!==values.password_check){
    Message.warning(t('forget_password.form.password_check'))
    return
  }

  AuthForget(values).then(r=>{
    Message.success(t('forget_password.form.success'))
  })
}


const toLogin = () => {
  router.push('/login')
}
const {changeLocale, currentLocale} = useLocale();
const locales = [...LOCALE_OPTIONS];

const guestConfig = ref()
const queryConfig = () => {
  GuestCommConfig().then(r => {
    guestConfig.value = r.data
    localStorage.setItem("guest_config", JSON.stringify(r.data))
  })
}

onMounted(() => {
  queryConfig()
})
</script>
<style lang="less" scoped>
.container {
  display: flex;
  height: 100vh;
  background-color: #e8eaf2;
}

.forgetPassword-card {
  max-width: 450px;
  width: 100%;
  height: 460px;
  margin: auto auto;
  border-radius: .25rem;
  box-shadow: rgba(0, 0, 0, 0.05) 0px 0.5rem 2rem;
}

.input {
  font-size: 1.3rem;
}
</style>

<style lang="less" scoped>
// responsive
@media (max-width: @screen-lg) {
  .container {
    .banner {
      width: 25%;
    }
  }
}
</style>
