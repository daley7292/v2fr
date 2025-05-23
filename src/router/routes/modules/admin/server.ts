import { adminUrl } from "@/utils/admin-url";
import { DEFAULT_LAYOUT } from '../../base';
import { AppRouteRecordRaw } from '../../types';

const SYSTEM: AppRouteRecordRaw = {
  path: `/server`,
  name: 'server',
  component: DEFAULT_LAYOUT,
  meta: {
    admin: true,
    locale: 'menu.server',
    requiresAuth: true,
    icon: 'icon-common',
    order: 2,
  },
  children: [
    {
      path: 'node',
      name: 'ServerNode',
      component: () => import('@/views/admin/server/node/index.vue'),
      meta: {
        admin: true,
        locale: 'menu.server.node',
        requiresAuth: true,
        roles: ['*'],
      },
    },
    {
      path: 'rule',
      name: 'ServerRule',
      component: () => import('@/views/admin/server/rule/index.vue'),
      meta: {
        admin: true,
        locale: 'menu.server.rule',
        requiresAuth: true,
        roles: ['*'],
      },
    },
    {
      path: 'permission_group',
      name: 'ServerPermissionGroup',
      component: () => import('@/views/admin/server/permission/index.vue'),
      meta: {
        admin: true,
        locale: 'menu.server.permission_group',
        requiresAuth: true,
        roles: ['*'],
      },
    },
    {
      path: 'router',
      name: 'ServerRouter',
      component: () => import('@/views/admin/server/router/index.vue'),
      meta: {
        admin: true,
        locale: 'menu.server.router',
        requiresAuth: true,
        roles: ['*'],
      },
    }
  ],
};

export default SYSTEM;
