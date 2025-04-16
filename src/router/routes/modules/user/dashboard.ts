import { DEFAULT_LAYOUT } from '../../base';
import { AppRouteRecordRaw } from '../../types';

const DASHBOARD: AppRouteRecordRaw = {
  path: '',
  name: 'UserDashboard',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: 'menu.dashboard',
    requiresAuth: true,
    icon: 'icon-dashboard',
    order: 0,
  },
  children: [
    {
      path: '/dashboard',
      name: 'UserWorkplace',
      component: () => import('@/views/user/dashboard/index.vue'),
      meta: {
        locale: 'menu.dashboard.workplace',
        requiresAuth: true,
        roles: ['*'],
      },
    },
    {
      path: '/docs',
      name: 'docs',
      component: () => import('@/views/user/docs/index.vue'),
      meta: {
        locale: 'menu.docs',
        requiresAuth: true,
        roles: ['*'],
      },
    }
  ],
};

export default DASHBOARD;
