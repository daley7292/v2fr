<template>
  <div class="container">
    <a-card class="register-card" :style="guestConfig?.is_email_verify==1?'height: 520px;':''">
      <div style="text-align: center;margin-bottom: 20px">
        <h1>{{GetAppName()}}</h1>
        <div style="opacity: 0.7">{{GetAppDescription()}}</div>
      </div>
      <a-form layout="vertical" ref="registerForm" :rules="rules" :model="register" @submit-success="submitRegister" >
        <a-form-item field="email"  hide-asterisk>
          <a-input v-model="register.email"  :placeholder="t('register.form.email')"/>
        </a-form-item>
        <a-form-item field="email_code" v-if="guestConfig?.is_email_verify==1" hide-asterisk>
          <a-input :placeholder="t('register.form.email_code')" /> &nbsp;<a-button @click="SendEmailVerify({email:register.email})" type="primary">&nbsp;发送&nbsp;</a-button>
        </a-form-item>
        <a-form-item field="password" hide-asterisk>
          <a-input v-model="register.password" :placeholder="t('register.form.password')"/>
        </a-form-item>

        <a-form-item  field="password_check"  hide-asterisk>
          <a-input v-model="register.password_check" :placeholder="t('register.form.password')"/>
        </a-form-item>

        <a-form-item field="invite_code">
          <a-input v-model="register.invite_code" :placeholder="t('register.form.invite_code')"/>
        </a-form-item>

        <a-form-item>
          <a-button html-type="submit" style="width: 100%" type="primary">
            <icon-face-smile-fill size="16"/> &nbsp; {{ t('register.form.submit') }}
          </a-button>
        </a-form-item>

        <a-form-item>
          <a-row style="width: 100%;padding-bottom: 25px">
            <a-col :span="12"><span style="cursor: pointer" @click="toLogin">{{
                t('register.form.back_to_login')
              }}</span></a-col>
            <a-col :span="12" style="text-align: right;">
              <span style="width: 30px;position: absolute;font-size: 17px; color: #165DFF;right: 65px;bottom: 30px">
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
import { AuthRegister, GuestCommConfig, SendEmailVerify } from "@/api/login";
import {onMounted, reactive, ref} from "vue";
import useLocale from "@/hooks/locale";
import {LOCALE_OPTIONS} from "@/locale";
import {useI18n} from "vue-i18n";
import {useRoute, useRouter} from "vue-router";
import {ValidatedError} from "@arco-design/web-vue/es/form/interface";
import {Message} from "@arco-design/web-vue";
import { isAdmin, setRole, setToken } from "@/utils/auth";
import { adminUrl } from "@/utils/admin-url";
import { GetAppDescription, GetAppName } from "../../utils/comm-config";

const {t} = useI18n();
const route = useRoute();
const router = useRouter();
const register = reactive({
  email: undefined,
  password: undefined,
  password_check: undefined,
  invite_code: route.query.code,
  email_code: undefined,
})

const rules = {
  email: [
    {
      type: 'email',
      required: true,
      message:t('register.form.verify.email')
    }
  ],
  email_code: [
    {
      required: true,
      message:t('register.form.verify.email_code')
    }
  ],
  password: [
    {
      required: true,
      message:t('register.form.verify.password')
    },
  ],
  password_check: [
    {
      required: true,
      message:t('register.form.verify.password_check')
    },
    {
      validator: (value:any, cb:any) => {
        if (value !== register.password) {
          cb(t('register.form.verify.password_not_match'))
        } else {
          cb()
        }
      }
    }
  ]}

const submitRegister = async ({
                                values,
                                errors,
                        }: {
  values: Record<string, any>;
  errors: Record<string, ValidatedError> | undefined;
}) => {
  console.log(register);
  AuthRegister(register).then(r=>{
    if (r.data){

      Message.success(t('register.form.success'))
      if (r.data?.auth_data){
        setToken(r.data.auth_data);
        setRole(r.data.is_admin);
        router.push("/").then(()=>{
          location.reload();
        });
      }
    }
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

.register-card {
  max-width: 450px;
  width: 100%;
  height: 480px;
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
