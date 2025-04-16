import { DEFAULT_LAYOUT } from '../../base';
import { AppRouteRecordRaw } from '../../types';

const DASHBOARD: AppRouteRecordRaw = {
    path: '/finance',
    name: 'finance',
    component: DEFAULT_LAYOUT,
    meta: {
        locale: 'menu.finance',
        requiresAuth: true,
        icon: 'icon-dashboard',
        order: 2,
    },
    children: [
        {
            path: '/order/list',
            name: 'orderList',
            component: () => import('@/views/user/finance/order/list/index.vue'),
            meta: {
                locale: 'menu.finance.order',
                requiresAuth: true,
                roles: ['*'],
            },
        },
        {
            path: '/order/details',
            name: 'orderDetails',
            component: () => import('@/views/user/finance/order/details/index.vue'),
            meta: {
                locale: 'menu.finance.order',
                requiresAuth: true,
                roles: ['*'],
                hide:true
            },
        },
        {
            path: '/invite',
            name: 'invite',
            component: () => import('@/views/user/finance/invite/index.vue'),
            meta: {
                locale: 'menu.finance.invite',
                requiresAuth: true,
                roles: ['*'],
            },
        }
    ],
};

export default DASHBOARD;
