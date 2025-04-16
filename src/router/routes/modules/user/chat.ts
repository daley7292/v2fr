import {AppRouteRecordRaw} from '../../types';

const TicketChat: AppRouteRecordRaw = {
    path: '/ticket/chat',
    name: 'TicketChat',
    component: () => import('@/views/user/user/ticket/components/ticket-chat.vue'),
    meta: {
        hide: true,
        locale: 'TicketChat',
        requiresAuth: false,
        roles: ['*'],
    },
};

export default TicketChat;
