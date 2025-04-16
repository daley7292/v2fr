import { DEFAULT_LAYOUT } from '../../base';
import { AppRouteRecordRaw } from '../../types';

const DASHBOARD: AppRouteRecordRaw = {
    path: '/subscription',
    name: 'subscription',
    component: DEFAULT_LAYOUT,
    meta: {
        locale: 'menu.subscription',
        requiresAuth: true,
        icon: 'icon-dashboard',
        order: 1,
    },
    children: [
        {
            path: '/buy',
            name: 'buy',
            component: () => import('@/views/user/subscription/buy/index.vue'),
            meta: {
                locale: 'menu.subscription.buy',
                requiresAuth: true,
                roles: ['*'],
            },
        },
        {
            path: '/details',
            name: 'details',
            component: () => import('@/views/user/subscription/details/index.vue'),
            meta: {
                locale: 'menu.subscription.buy',
                requiresAuth: true,
                roles: ['*'],
                hide:true
            },
        },
        {
            path: '/shop',
            name: 'shop',
            component: () => import('@/views/user/subscription/shop/index.vue'),
            meta: {
                locale: 'menu.subscription.shop',
                requiresAuth: true,
                roles: ['*'],
                hide:true
            },
        },
        {
            path: '/status',
            name: 'status',
            component: () => import('@/views/user/subscription/status/index.vue'),
            meta: {
                locale: 'menu.subscription.status',
                requiresAuth: true,
                roles: ['*'],
            },
        }
    ],
};

export default DASHBOARD;
