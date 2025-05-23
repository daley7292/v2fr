<template>
  <div class="container">
    <a-card class="login-card">
      <div style="text-align: center;margin: 30px 0">
        <img :src="guestConfig.logo" style="height: 60px; object-fit: cover" />
        <h1>{{guestConfig.app_name}}</h1>
        <div style="opacity: 0.7">{{guestConfig.app_description}}</div>
      </div>
      <a-form layout="vertical" ref="loginForm" :model="login" @submit="submit">
        <a-form-item field="email">
          <a-input v-model="login.email" :placeholder="t('login.form.email')" />
        </a-form-item>

        <a-form-item field="password">
          <a-input v-model="login.password" type="password" :placeholder="t('login.form.password')" />
        </a-form-item>
        <a-form-item>
          <a-button html-type="submit" style="width: 100%" type="primary">
            <icon-export size="16" /> &nbsp; {{ t("login.form.submit") }}
          </a-button>
        </a-form-item>
        <a-form-item>
          <a-row style="width: 100%;position:relative">
            <a-col :span="12">
              <a-space>
                <span style="cursor: pointer" @click="toPage('/register')">{{ t("login.form.to_register") }}</span>
                <span style="opacity: 0.3">|</span>
                <span style="cursor: pointer" @click="toPage('/forget_password')">{{
                  t("login.form.forgot_password")
                }}</span>
              </a-space>
            </a-col>
            <a-col :span="12" style="text-align: right;">
              <span style="width: 30px;position: absolute;font-size: 17px; color: #165DFF;right: 48px;top: 2px">
                <a-dropdown trigger="click" @select="changeLocale as any">
                  <div ref="triggerBtn" style="display: flex;float: left;cursor: pointer" class="trigger-btn">
                    <icon-language />
                  </div>
                  <template #content>
                    <a-doption v-for="item in locales" :key="item.value" :value="item.value">
                      <template #icon>
                        <icon-check v-show="item.value === currentLocale" />
                      </template>
                      {{ item.label }}
                    </a-doption>
                  </template>
                </a-dropdown>
              </span>
              {{ t("language") }}
            </a-col>
          </a-row>
        </a-form-item>
      </a-form>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
import { GuestCommConfig } from "@/api/login";
import { onMounted, reactive, ref } from "vue";
import useLocale from "@/hooks/locale";
import { LOCALE_OPTIONS } from "@/locale";
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";
import { ValidatedError } from "@arco-design/web-vue/es/form/interface";
import useUserStore from "../../store/modules/user";
import useLoading from "@/hooks/loading";
import { isAdmin } from "@/utils/auth";
import { adminUrl } from "@/utils/admin-url";

const { loading, setLoading } = useLoading();
const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const login = reactive({
  email: undefined,
  password: undefined
});
const userStore = useUserStore();
const submit = async ({
  errors,
  values
}: {
  errors: Record<string, ValidatedError> | undefined;
  values: Record<string, any>;
}) => {
  if (loading.value) return;
  if (!errors) {
    setLoading(true);
    try {
      await userStore.login(values);
      router.push(`/dashboard`);
    } finally {
      setLoading(false);
    }
  }
};

const toPage = (url: string) => {
  router.push(url);
};
const { changeLocale, currentLocale } = useLocale();
const locales = [...LOCALE_OPTIONS];

const guestConfig = ref({
  app_name: "",
  app_description: ""
});
const queryConfig = () => {
  GuestCommConfig().then(r => {
    guestConfig.value = r.data;
    localStorage.setItem("guest_config", JSON.stringify(guestConfig.value));
    if (guestConfig.value.app_name){
      document.title = guestConfig.value.app_name
    }
  });
};

onMounted(() => {
  queryConfig();
});
</script>
<style lang="less" scoped>
.container {
  display: flex;
  height: 100vh;
  background-color: #e8eaf2;
}

.login-card {
  max-width: 450px;
  width: 100%;
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
