import { adminUrl } from "@/utils/admin-url";
import { DEFAULT_LAYOUT } from '../../base';
import { AppRouteRecordRaw } from '../../types';

const SYSTEM: AppRouteRecordRaw = {
  path: `/${adminUrl}/system`,
  name: 'system',
  component: DEFAULT_LAYOUT,
  meta: {
    admin: true,
    locale: 'menu.system',
    requiresAuth: true,
    icon: 'icon-tool',
    order: 1,
  },
  children: [
    {
      path: 'setting',
      name: 'SystemSetting',
      component: () => import('@/views/admin/system/setting/index.vue'),
      meta: {
        admin: true,
        locale: 'menu.system.setting',
        requiresAuth: true,
        roles: ['*'],
      },
    },
    {
      path: 'payment',
      name: 'SettingPayment',
      component: () => import('@/views/admin/system/payment/index.vue'),
      meta: {
        admin: true,
        locale: 'menu.system.payment',
        requiresAuth: true,
        roles: ['*'],
      },
    },
    {
      path: 'theme',
      name: 'SettingTheme',
      component: () => import('@/views/admin/system/theme/index.vue'),
      meta: {
        admin: true,
        locale: 'menu.system.theme',
        requiresAuth: true,
        roles: ['*'],
      },
    }
  ],
};

export default SYSTEM;
