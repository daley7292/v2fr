import axios from 'axios';
import {
  buildForm,
  JoinArrary,
  JoinParams,
  OpResult,
} from '@/api/admin/public';
import { apiUrl } from '@/api/api';

export interface InviteUser {
  id: number;
  invite_user_id: number | null;
  telegram_id: number | null;
  email: string;
  password: string;
  password_algo: string | null;
  password_salt: string | null;
  balance: number;
  discount: number | null;
  commission_type: number;
  commission_rate: number | null;
  commission_balance: number;
  t: number;
  u: number;
  d: number;
  ip_limit: number;
  transfer_enable: number;
  banned: number;
  is_admin: number;
  last_login_at: number;
  is_staff: number;
  last_login_ip: string | null;
  uuid: string;
  group_id: number;
  plan_id: number;
  speed_limit: number;
  remind_expire: number;
  remind_traffic: number;
  token: string;
  expired_at: number;
  remarks: string | null;
  created_at: number;
  updated_at: number;
  has_received_inviter_reward: number;
}

export interface Order {
  id?: any;
  email?: any;
  invite_user_id?: any;
  user_id?: any;
  invite_user: any;
  plan_id?: any;
  coupon_id?: any;
  payment_id?: any;
  type?: any;
  period?: any;
  trade_no?: any;
  callback_no?: any;
  total_amount?: any;
  handling_amount?: any;
  discount_amount?: any;
  surplus_amount?: any;
  refund_amount?: any;
  balance_amount?: any;
  surplus_order_ids?: any;
  status?: any;
  commission_status?: any;
  commission_balance?: any;
  actual_commission_balance?: any;
  paid_at?: any;
  created_at?: any;
  updated_at?: any;
  plan_name?: any;
}
// 创建一个默认的 Order 对象
export const defaultFinanceOrder: Order = {
  invite_user: undefined,
  id: undefined, // 你可以设置适当的默认值
  user_id: undefined,
  plan_id: undefined,
  email: undefined,
  type: undefined,
  period: undefined,
  trade_no: undefined,
  callback_no: undefined,
  total_amount: undefined,
  status: undefined,
  commission_status: undefined,
  commission_balance: undefined,
  paid_at: undefined,
  created_at: undefined,
  updated_at: undefined,
  plan_name: undefined
};

/**
 *查询订单
 */
export const QueryOrder = (params: any, condition: string) => {
  return axios.get<Order[]>(
    apiUrl.queryOrder +JoinParams(params) + JoinArrary(condition)
  );
};
/**
 * 保存订单
 */
export const SaveOrder = (params: any) => {
  return axios.post<OpResult>(apiUrl.saveOrder, buildForm(params));
};

/**
 * 取消订单
 */
export const CancelOrder = (params: any) => {
  return axios.post<OpResult>(apiUrl.cancelOrder, buildForm(params));
};

/**
 * 确认订单
 */
export const PassPayOrder = (params: any) => {
  return axios.post<OpResult>(apiUrl.passPayOrder, buildForm(params));
};
/**
 * 确认订单
 */
export const PassUpdateOrder = (params: any) => {
  return axios.post<OpResult>(apiUrl.passUpdateOrder, buildForm(params));
};

/**
 * 订单详情
 */
export const OderDetails = (params: any) => {
  return axios.post<Order>(apiUrl.oderDetails, buildForm(params));
};
