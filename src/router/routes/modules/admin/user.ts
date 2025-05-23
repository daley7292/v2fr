import { adminUrl } from "@/utils/admin-url";
import { DEFAULT_LAYOUT } from '../../base';
import { AppRouteRecordRaw } from '../../types';

const USER: AppRouteRecordRaw = {
    path: `/user`,
    name: 'managerUser',
    component: DEFAULT_LAYOUT,
    meta: {
        admin: true,
        locale: 'menu.user',
        icon: 'icon-user',
        requiresAuth: true,
        order: 4,
    },
    children: [
        {
            path: 'manager',
            name: 'userManager',
            component: () => import('@/views/admin/user/user/index.vue'),
            meta: {
                admin: true,
                locale: 'menu.user.manager',
                requiresAuth: true,
                roles: ['*'],
            },
        },
        {
            path: 'ticket',
            name: 'ticketManager',
            component: () => import('@/views/admin/user/ticket/index.vue'),
            meta: {
                admin: true,
                locale: 'menu.user.work_order',
                requiresAuth: true,
                roles: ['*'],
            }
        },
        {
            path: 'notice',
            name: 'noticeManager',
            component: () => import('@/views/admin/user/notice/index.vue'),
            meta: {
                admin: true,
                locale: 'menu.user.notice',
                requiresAuth: true,
                roles: ['*'],
            },
        },
        {
            path: 'knowledge',
            name: 'knowledgeManager',
            component: () => import('@/views/admin/user/knowledge/index.vue'),
            meta: {
                admin: true,
                locale: 'menu.user.knowledge',
                requiresAuth: true,
                roles: ['*'],
            },
        }
    ],
};

export default USER;
