import { adminUrl } from '@/utils/admin-url';
import { DEFAULT_LAYOUT } from '../../base';
import { AppRouteRecordRaw } from '../../types';

const SYSTEM: AppRouteRecordRaw = {
  path: `/${adminUrl}`,
  name: 'target',
  component: DEFAULT_LAYOUT,
  meta: {
    admin:true,
    locale: 'menu.target',
    requiresAuth: true,
    icon: 'icon-computer',
    order: 5,
  },
  children: [
    {
      path: 'queue',
      name: 'TargetQueue',
      component: () => import('@/views/admin/target/queue/index.vue'),
      meta: {
        admin:true,
        locale: 'menu.target.queue',
        requiresAuth: true,
        roles: ['*'],
      },
    }
  ],
};

export default SYSTEM;
