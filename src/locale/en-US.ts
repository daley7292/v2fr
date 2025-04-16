import localeMessageBox from '@/components/message-box/locale/en-US';
import localeLogin from '@/views/login/locale/en-US';
import localeRegister from '@/views/register/locale/en-US';
import localeForgetPassword from '@/views/forget-password/locale/en-US';

import localeWorkplace from '@/views/admin/dashboard/workplace/locale/en-US';
import localeSetting from '@/views/admin/system/setting/locale/en-US';
import localePayment from '@/views/admin/system/payment/locale/en-US';
import localeTheme from '@/views/admin/system/theme/locale/en-US';

import localeNode from '@/views/admin/server/node/locale/en-US';
import localePermission from '@/views/admin/server/permission/locale/en-US';
import localeRouter from '@/views/admin/server/router/locale/en-US';
import localeRule from '@/views/admin/server/rule/locale/en-US';

import localeWorkspace from '@/views/user/dashboard/locale/en-US';
import localeUser from '@/views/admin/user/user/locale/en-US';
import localeNotice from '@/views/admin/user/notice/locale/en-US';
import localeWorkOrder from '@/views/admin/user/ticket/locale/en-US';
import localeKnowledge from '@/views/admin/user/knowledge/locale/en-US';
import localeUserCenter from '@/views/user/user/center/locale/en-US';

import localeTargetQueue from '@/views/admin/target/queue/locale/en-US';
import localeUserTraffic from '@/views/user/user/traffic/locale/en-US';
import localeUserTicket from '@/views/user/user/ticket/locale/en-US';
import localeUserSubscriptionStatus from '@/views/user/subscription/status/locale/en-US';
import localeUserInvite from '@/views/user/finance/invite/locale/en-US';
import localeUserOrderDetails from '@/views/user/finance/order/details/locale/en-US';
import localeUserOrderList from '@/views/user/finance/order/list/locale/en-US';

import localeConvert from '@/views/admin/finance/convert/locale/en-US';
import localeVoucher from '@/views/admin/finance/voucher/locale/en-US';
import localeOrder from '@/views/admin/finance/order/locale/en-US';
import localeSubscription from '@/views/admin/finance/subscription/locale/en-US';
import localeUserSubscriptionBuy from '@/views/user/subscription/buy/locale/en-US';
import localeUserSubscriptionDetail from '@/views/user/subscription/details/locale/en-US';
import localeUserSubscriptionShop from '@/views/user/subscription/shop/locale/en-US';


import locale403 from '@/views/exception/403/locale/en-US';
import locale404 from '@/views/exception/404/locale/en-US';
import locale500 from '@/views/exception/500/locale/en-US';

import localeUserSetting from '@/views/admin/user/setting/locale/en-US';

import localeSettings from './en-US/settings';

export default {
    'language': 'English',
    'form.open': 'open',
    'form.close': 'close',
    'menu.docs': 'Documentation',
    'system.title': 'Page management',
    'menu.dashboard': 'Dashboard',
    'menu.system': 'System',
    'menu.system.setting': 'Setting',
    'menu.server.dashboard': 'dashboard',
    'menu.server.workplace': 'dashboard',
    'menu.system.payment': 'Payment',
    'menu.system.theme': 'Theme',
    'menu.server': 'Server',
    'menu.server.node': 'Node',
    'menu.server.permission_group': 'Permissions',
    'menu.server.router': 'Router',
    'menu.finance': 'Finance',
    'menu.finance.subscription': 'Subscription',
    'menu.finance.order': 'Order',
    'menu.finance.voucher': 'Voucher',
    'menu.user': 'User Center',
    'navbar.docs': 'Docs',
    'navbar.action.locale': 'Switch to English',
    'menu.user.manager': 'User Management',
    'menu.user.work_order': 'Ticket Management',
    'menu.user.notice': 'Notice Management',
    'menu.user.knowledge': 'Knowledge Management',
    'menu.user.center': 'Center',
    'menu.user.ticket': 'Ticket',
    'menu.user.traffic': 'Traffic Breakdown',
    'menu.finance.invite': 'MyInvitation',
    'menu.subscription': 'Subscription',
    'menu.subscription.buy': 'BuySubscription',
    'menu.subscription.status': 'NodeStatus',
    'button.ok': 'OK',
    'button.add': 'Add',
    'button.edit': 'Edit',
    'button.cancel': 'Cancel',
    'button.delete': 'Delete',
    'button.reset': 'Reset',
    'button.submit': 'Search', // for the submit button with text "检索"
    'filter.fieldName': 'Field Name',
    'filter.condition': 'Condition',
    'filter.searchContent': 'Search Content',
    'filter.subscription': 'Subscription',
    ...localeSettings,
    ...localeMessageBox,
    ...localeLogin,
    ...localeRegister,
    ...localeForgetPassword,
    ...localeWorkplace,
    ...localeNode,
    ...localePermission,
    ...localeRouter,
    ...localeRule,
    ...localeTheme,
    ...localePayment,
    ...localeConvert,
    ...localeVoucher,
    ...localeWorkspace,
    ...localeUser,
    ...localeNotice,
    ...localeWorkOrder,
    ...localeKnowledge,
    ...localeSubscription,
    ...localeUserTraffic,
    ...localeUserTicket,
    ...localeTargetQueue,
    ...localeUserSubscriptionStatus,
    ...localeUserInvite,
    ...localeUserCenter,
    ...localeUserOrderList,
    ...localeUserOrderDetails,
    ...localeOrder,
    ...localeSetting,
    ...locale403,
    ...locale404,
    ...locale500,
    ...localeUserSetting,
    ...localeUserSubscriptionBuy,
    ...localeUserSubscriptionShop,
    ...localeUserSubscriptionDetail,
};
