import localeMessageBox from '@/components/message-box/locale/zh-CN';
import localeLogin from '@/views/login/locale/zh-CN';
import localeRegister from '@/views/register/locale/zh-CN';
import localeForgetPassword from '@/views/forget-password/locale/zh-CN';

import localeWorkplace from '@/views/admin/dashboard/workplace/locale/zh-CN';
import localeSetting from '@/views/admin/system/setting/locale/zh-CN';
import localePayment from '@/views/admin/system/payment/locale/zh-CN';
import localeTheme from '@/views/admin/system/theme/locale/zh-CN';

import localeNode from '@/views/admin/server/node/locale/zh-CN';
import localePermission from '@/views/admin/server/permission/locale/zh-CN';
import localeRouter from '@/views/admin/server/router/locale/zh-CN';
import localeRule from '@/views/admin/server/rule/locale/zh-CN';


import localeConvert from '@/views/admin/finance/convert/locale/zh-CN';
import localeVoucher from '@/views/admin/finance/voucher/locale/zh-CN';
import localeOrder from '@/views/admin/finance/order/locale/zh-CN';
import localeSubscription from '@/views/admin/finance/subscription/locale/zh-CN';

import localeUser from '@/views/admin/user/user/locale/zh-CN';
import localeNotice from '@/views/admin/user/notice/locale/zh-CN';
import localeWorkOrder from '@/views/admin/user/ticket/locale/zh-CN';
import localeTargetQueue from '@/views/admin/target/queue/locale/zh-CN';

import localeKnowledge from '@/views/admin/user/knowledge/locale/zh-CN';

import locale403 from '@/views/exception/403/locale/zh-CN';
import locale404 from '@/views/exception/404/locale/zh-CN';
import locale500 from '@/views/exception/500/locale/zh-CN';

import localeUserSetting from '@/views/admin/user/setting/locale/zh-CN';

import localeSettings from './zh-CN/settings';

export default {
    'language': '中文简体',
    'form.open': '开启',
    'form.close': '关闭',
    'system.title': '页面管理',
    'menu.docs': '使用文档',
    'menu.dashboard': '仪表盘',
    'menu.system': '系统管理',
    'menu.server.dashboard': '仪表盘-服务端',
    'menu.server.workplace': '工作台-服务端',
    'menu.system.setting': '系统配置',
    'menu.system.payment': '支付配置',
    'menu.system.theme': '主题配置',
    'menu.server': '服务器',
    'menu.server.node': '节点管理',
    'menu.server.permission_group': '权限组管理',
    'menu.server.router': '路由管理',
    'menu.finance': '财务',
    'menu.finance.subscription': '订阅管理',
    'menu.finance.order': '订单管理',
    'menu.finance.voucher': '优惠卷管理',
    'menu.user': '用户管理',
    'menu.user.manager': '用户管理',
    'menu.user.work_order': '工单管理',
    'menu.user.notice': '公告管理',
    'menu.user.knowledge': '知识库管理',
    'menu.user.center': '个人中心',
    'menu.user.ticket': '我的工单',
    'menu.user.traffic': '流量明细',
    'menu.finance.invite': '我的邀请',
    'menu.subscription': '订阅',
    'menu.subscription.buy': '购买订阅',
    'menu.subscription.status': '节点状态',
    'menu.arcoWebsite': 'Arco Design',
    'menu.faq': '常见问题',
    'navbar.docs': '文档中心',
    'navbar.action.locale': '切换为中文',
    'button.ok': '确定',
    'button.add': '添加',
    'button.edit': '编辑',
    'button.cancel': '取消',
    'button.delete': '删除',
    'button.reset': '重置',
    'button.submit': '确认', // for the submit button with text "检索"
    'filter.fieldName': '字段名',
    'filter.condition': '条件',
    'filter.searchContent': '欲检索内容',
    'filter.subscription': '订阅',
    ...localeSettings,
    ...localeMessageBox,
    ...localeLogin,
    ...localeRegister,
    ...localeForgetPassword,
    ...localeNode,
    ...localePermission,
    ...localeRule,
    ...localeTheme,
    ...localeRouter,
    ...localePayment,
    ...localeConvert,
    ...localeVoucher,
    ...localeSubscription,
    ...localeOrder,
    ...localeUser,
    ...localeNotice,
    ...localeWorkOrder,
    ...localeKnowledge,
    ...localeTargetQueue,
    ...localeSetting,
    ...localeWorkplace,
    ...locale403,
    ...locale404,
    ...locale500,
    ...localeUserSetting,
};
