import { adminUrl } from "@/utils/admin-url";
import { DEFAULT_LAYOUT } from '../../base';
import { AppRouteRecordRaw } from '../../types';

const SYSTEM: AppRouteRecordRaw = {
  path: `/subscription`,
  name: 'financeManager',
  component: DEFAULT_LAYOUT,
  meta: {
    admin: true,
    locale: 'menu.finance',
    requiresAuth: true,
    icon: 'icon-strikethrough',
    order: 3,
  },
  children: [
    {
      path: 'subscription',
      name: 'FinanceSubscription',
      component: () => import('@/views/admin/finance/subscription/index.vue'),
      meta: {
        admin: true,
        locale: 'menu.finance.subscription',
        requiresAuth: true,
        roles: ['*'],
      },
    },
    {
      path: 'order',
      name: 'FinanceOrder',
      component: () => import('@/views/admin/finance/order/index.vue'),
      meta: {
        admin: true,
        locale: 'menu.finance.order',
        requiresAuth: true,
        roles: ['*'],
      },
    },
    {
      path: 'voucher',
      name: 'FinanceVoucher',
      component: () => import('@/views/admin/finance/voucher/index.vue'),
      meta: {
        admin: true,
        locale: 'menu.finance.voucher',
        requiresAuth: true,
        roles: ['*'],
      },
    },
    {
      path: 'convert',
      name: 'FinanceConvert',
      component: () => import('@/views/admin/finance/convert/index.vue'),
      meta: {
        admin: true,
        locale: 'menu.finance.convert',
        requiresAuth: true,
        roles: ['*'],
      },
    }
  ],
};

export default SYSTEM;
