import { adminUrl } from "@/utils/admin-url";
import { DEFAULT_LAYOUT } from '../../base';
import { AppRouteRecordRaw } from '../../types';

const DASHBOARD: AppRouteRecordRaw = {
  path: `/${adminUrl}`,
  name: 'dashboard',
  component: DEFAULT_LAYOUT,
  meta: {
    admin: true,
    locale: 'menu.dashboard',
    requiresAuth: true,
    icon: 'icon-dashboard',
    order: 0,
  },
  children: [
    {
      path: `dashboard`,
      name: 'Workplace',
      component: () => import('@/views/admin/dashboard/workplace/index.vue'),
      meta: {
        admin: true,
        locale: 'menu.dashboard.workplace',
        requiresAuth: true,
        roles: ['*'],
      },
    }
  ],
};

export default DASHBOARD;
