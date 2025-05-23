import { adminUrl } from "@/utils/admin-url";
import { AppRouteRecordRaw } from '../../types';

const TicketChat: AppRouteRecordRaw = {
    path: `/ticket/chat`,
    name: 'AdminTicketChat',
    component: () => import('@/views/admin/user/ticket/components/ticket-chat.vue'),
    meta: {
        hide: true,
        admin: true,
        locale: 'TicketChat',
        requiresAuth: false,
        roles: ['*'],
    },
};

export default TicketChat;
