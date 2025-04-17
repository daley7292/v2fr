<template>
  <div class="navbar">
    <div class="left-side">
      <a-space >
        <a-typography-title
          v-if="!(!topMenu && appStore.device === 'mobile')"
          :style="{ margin: 0, fontSize: '18px' ,cursor:'pointer'}"
          :heading="5"
          @click="toUserHome"
        >
          {{GetAppName()}}
        </a-typography-title>
        <icon-menu-fold
            v-if="!topMenu && appStore.device === 'mobile'"
            style="font-size: 22px; cursor: pointer"
            @click="toggleDrawerMenu"
        />
      </a-space>
    </div>
    <div class="center-side">
      <Menu v-if="topMenu"/>
    </div>
    <ul class="right-side">
      <!--      <li>
              <a-tooltip :content="$t('settings.search')">
                <a-button class="nav-btn" type="outline" :shape="'circle'">
                  <template #icon>
                    <icon-search />
                  </template>
                </a-button>
              </a-tooltip>
            </li>-->
      <li>
        <a-tooltip :content="$t('settings.language')">
          <a-button
              class="nav-btn"
              type="outline"
              :shape="'circle'"
              @click="setDropDownVisible"
          >
            <template #icon>
              <icon-language/>
            </template>
          </a-button>
        </a-tooltip>
        <a-dropdown trigger="click" @select="changeLocale as any">
          <div ref="triggerBtn" class="trigger-btn"></div>
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
      </li>
      <li>
        <a-tooltip
            :content="
            theme === 'light'
              ? $t('settings.navbar.theme.toDark')
              : $t('settings.navbar.theme.toLight')
          "
        >
          <a-button
              class="nav-btn"
              type="outline"
              :shape="'circle'"
              @click="handleToggleTheme"
          >
            <template #icon>
              <icon-moon-fill v-if="theme === 'dark'"/>
              <icon-sun-fill v-else/>
            </template>
          </a-button>
        </a-tooltip>
      </li>
      <li>
        <a-tooltip
            :content="
            isFullscreen
              ? $t('settings.navbar.screen.toExit')
              : $t('settings.navbar.screen.toFull')
          "
        >
          <a-button
              class="nav-btn"
              type="outline"
              :shape="'circle'"
              @click="toggleFullScreen"
          >
            <template #icon>
              <icon-fullscreen-exit v-if="isFullscreen"/>
              <icon-fullscreen v-else/>
            </template>
          </a-button>
        </a-tooltip>
      </li>
      <li>
        <a-tooltip :content="$t('settings.title')">
          <a-button
              class="nav-btn"
              type="outline"
              :shape="'circle'"
              @click="setVisible"
          >
            <template #icon>
              <icon-settings/>
            </template>
          </a-button>
        </a-tooltip>
      </li>
      <li>
        <a-dropdown trigger="click">
           <a-button ><icon-user />&nbsp;<span v-if="!(!topMenu && appStore.device === 'mobile')">{{email}}</span></a-button>
          <template #content>
            <a-doption>
              <a-space @click="handleLogout">
                <icon-export/>
                <span>
                  {{ $t('messageBox.logout') }}
                </span>
              </a-space>
            </a-doption>
          </template>
        </a-dropdown>
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import {computed, inject, ref} from 'vue';
import {Message} from '@arco-design/web-vue';
import {useDark, useFullscreen, useToggle} from '@vueuse/core';
import {useAppStore, useUserStore} from '@/store';
import {LOCALE_OPTIONS} from '@/locale';
import useLocale from '@/hooks/locale';
import useUser from '@/hooks/user';
import {GetAppName} from '@/utils/comm-config';
import Menu from '@/components/menu/index.vue';
import { useRouter } from "vue-router";
import { queryConfig} from "@/api/admin/system/system";

const appStore = useAppStore();
const userStore = useUserStore();
const {logout} = useUser();
const {changeLocale, currentLocale} = useLocale();
const {isFullscreen, toggle: toggleFullScreen} = useFullscreen();
const locales = [...LOCALE_OPTIONS];

const email = computed(() => {
  return userStore.email;
});
const theme = computed(() => {
  return appStore.theme;
});
const topMenu = computed(() => appStore.topMenu && appStore.menu);
const isDark = useDark({
  selector: 'body',
  attribute: 'arco-theme',
  valueDark: 'dark',
  valueLight: 'light',
  storageKey: 'arco-theme',
  onChanged(dark: boolean) {
    appStore.toggleTheme(dark);
  },
});
const toggleTheme = useToggle(isDark);
const handleToggleTheme = () => {
  toggleTheme();
};
const setVisible = () => {
  appStore.updateSettings({globalSettings: true});
};
const refBtn = ref();
const triggerBtn = ref();
const setPopoverVisible = () => {
  const event = new MouseEvent('click', {
    view: window,
    bubbles: true,
    cancelable: true,
  });
  refBtn.value.dispatchEvent(event);
};
const handleLogout = () => {
  logout();
};
const setDropDownVisible = () => {
  const event = new MouseEvent('click', {
    view: window,
    bubbles: true,
    cancelable: true,
  });
  triggerBtn.value.dispatchEvent(event);
};
const switchRoles = async () => {
  const res = await userStore.switchRoles();
  Message.success(res as string);
};
const toggleDrawerMenu = inject('toggleDrawerMenu') as () => void;
const route = useRouter()
const toUserHome =()=>{
  const role =localStorage.getItem("role")
  if (role&&role==="1"){
      queryConfig().then(r=>{
        if (r?.data?.site?.app_url){
          window.location.href =r.data.site.app_url
        }else{
          route.push({path:"/dashboard"});
        }
      })
  }else{
    route.push({path:"/dashboard"});
  }
}
</script>

<style scoped lang="less">
.navbar {
  display: flex;
  justify-content: space-between;
  height: 100%;
  background-color: var(--color-bg-1  );
  border-bottom: 1px solid var(--color-border);
}

.left-side {
  display: flex;
  justify-items: center;
  align-items: center;
  padding-left: 40px;
}

.center-side {
  flex: 1;
}

.right-side {
  display: flex;
  padding-right: 20px;
  list-style: none;

  :deep(.locale-select) {
    border-radius: 20px;
  }

  li {
    display: flex;
    align-items: center;
    padding: 0 10px;
  }

  a {
    color: var(--color-text-1);
    text-decoration: none;
  }

  .nav-btn {
    border-color: rgb(var(--gray-2));
    color: rgb(var(--gray-8));
    font-size: 16px;
  }

  .trigger-btn,
  .ref-btn {
    position: absolute;
    bottom: 14px;
  }

  .trigger-btn {
    margin-left: 14px;
  }
}
</style>

<style lang="less">
.message-popover {
  .arco-popover-content {
    margin-top: 0;
  }
}
</style>
