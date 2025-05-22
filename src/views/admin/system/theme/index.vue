<template>
  <div class="container">
    <Breadcrumb :items="['menu.system', 'menu.system.theme']" />
<!--    <div style="margin-bottom: 20px">-->
<!--      <a-alert type="warning">-->
<!--        {{ t('theme.alert.message') }}<a href="#">{{ t('theme.alert.link') }}</a>-->
<!--      </a-alert>-->
<!--    </div>-->
    <div class="v2_bg"  v-for="(item,index) in themes"  :key="index">
      <div class="v2_bg_content">
        <div style="display: grid;grid-template-columns: auto auto;justify-content: space-between">
          <div>
            <div style="line-height: 120px;font-size: 21px;margin: 2px">
              {{item.key}}
            </div>
            <div style="margin-top: -50px;">
              {{item.value.description}}
            </div>
          </div>
          <div>
            <div style="line-height: 150px">
              <a-space>
                <a-button type="outline" class="arco-color"  v-if="defaultTheme === item.key" shape="round" disabled>{{ t('theme.button.current_theme') }}</a-button>
                <a-button type="outline" class="arco-color" v-else shape="round" @click="activeTheme(item.key)">{{ t('theme.button.active_theme') }}</a-button>
                <a-button type="outline" shape="round" @click="openTheme(item.key)">{{ t('theme.button.theme_settings') }}</a-button>
              </a-space>
            </div>
          </div>
        </div>
      </div>
    </div>
    <a-modal v-model:visible="addThemeMethod" :footer="false" :unmount-on-close="true" width="650px">
      <ThemeForm :name="themeName" @close="hideAddModal" />
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import ThemeForm from '@/views/admin/system/theme/components/theme-form.vue';
import { onMounted,  ref } from "vue";
import { GetTheme,SaveTheme } from "@/api/admin/theme/theme";

const addThemeMethod = ref(false)
const hideAddModal = () => {
  addThemeMethod.value = false;
}

const themeName = ref<string>();

const openTheme = (key: string) => {
  themeName.value = key;
  addThemeMethod.value = true;
}
const activeTheme = (key: string) =>{
  SaveTheme({frontend_theme:key}).then(()=>{
    GetTheme().then(r=>{
      const themesData = r.data.themes;
      defaultTheme.value =  r.data.active;
      themes.value= []
      Object.keys(themesData).forEach(key=>{
        themes.value.push({key:key,value:themesData[key]})
      })
    })
  })
}


const { t } = useI18n();
const defaultTheme = ref()
const themes = ref<any[]>([])
onMounted(()=>{
  GetTheme().then(r=>{
    const themesData = r.data.themes;
    defaultTheme.value =  r.data.active;
    Object.keys(themesData).forEach(key=>{
      themes.value.push({key:key,value:themesData[key]})
    })
  })
})
</script>

<script lang="ts">
export default {
  name: 'SettingTheme',
};
</script>

<style scoped lang="less">
.container {
  padding: 0 20px 20px 20px;
}

.v2_bg {
  height: 160px;
  background-position: 0 50%;
  background-size: cover;
  background-image: url("https://images.unsplash.com/photo-1567095761054-7a02e69e5c43?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1374&q=80");
  background-color: #0665d0 !important;
  margin-bottom: 1rem;
}

.v2_bg_content {
  background-attachment: scroll;
  background-clip: border-box;
  background-color: rgba(255, 255, 255, 0.3);
  background-image: linear-gradient(-90deg, rgba(255, 255, 255, 0.3) 0px, rgba(255, 255, 255, 0.98) 50%, rgba(255, 255, 255, 0.98) 100%);
  background-origin: padding-box;
  background-position-x: 0px;
  background-position-y: 50%;
  background-repeat-x: repeat;
  background-repeat-y: repeat;
  background-size: auto;
  box-sizing: border-box;
  color: rgb(73, 80, 87);
  display: block;
  font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe:UI", Roboto, "Helvetica:Neue", Arial, "Noto:Sans", "Liberation:Sans", sans-serif, "Apple:Color:Emoji", "Segoe:UI:Emoji", "Segoe:UI:Symbol", "Noto:Color:Emoji";
  font-feature-settings: "tnum";
  font-size: 16px;
  font-variant-alternates: normal;
  font-variant-caps: normal;
  font-variant-east-asian: normal;
  font-variant-ligatures: normal;
  font-variant-numeric: tabular-nums;
  font-variant-position: normal;
  font-weight: 400;
  height: 160px;
  line-height: 24px;
  margin-bottom: 0px;
  margin-left: 0px;
  margin-right: 0px;
  margin-top: 0px;
  overflow-x: visible;
  padding-bottom: 20px;
  padding-left: 20px;
  padding-right: 20px;
  padding-top: 20px;
  text-align: left;
  text-rendering: optimizelegibility;
  transition-behavior: normal;
  transition-delay: 0s;
  transition-duration: 0.25s;
  transition-property: opacity;
  transition-timing-function: ease-out;
  width: 100%;
  -webkit-font-smoothing: antialiased;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
}
</style>