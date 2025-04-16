import axios from 'axios';
import {
  buildForm,
  buildIdForm,
  JoinParams,
  OpResult,
} from '@/api/admin/public';
import { apiUrl } from '@/api/api';

export interface Voucher {
  id: any;
  code: any;
  name: any;
  type: any;
  value: any;
  show: any;
  limit_use: any;
  limit_use_with_user: any;
  limit_inviter_ids: any;
  limit_plan_ids: string[];
  limit_period: string[];
  time_at: any[];
  started_at: any;
  ended_at: any;
  created_at: any;
  updated_at: any;
}

// 创建一个默认的 Voucher 对象
export const defaultVoucher: Voucher = {
  id: undefined,
  code: undefined,
  name: undefined,
  type: 1,
  value: 0,
  show: undefined,
  limit_use: undefined,
  limit_inviter_ids: undefined,
  limit_use_with_user: undefined,
  limit_plan_ids: [],
  limit_period: [],
  time_at: [],
  started_at: undefined,
  ended_at: undefined,
  created_at: undefined,
  updated_at: undefined,
};
// 使用默认值创建新的 Voucher 对象
export const newVoucher: Voucher = {
  ...defaultVoucher,
};

/**
 *查询优惠卷
 */
export const QueryVoucher = (params: any) => {
  return axios.get<Voucher[], number>(apiUrl.queryVoucher + JoinParams(params));
};
/**
 * 保存优惠卷
 */
export const SaveVoucher = (params: any) => {
  return axios.post<OpResult>(apiUrl.saveVoucher, buildForm(params));
};

/**
 * 删除优惠卷
 */
export const DeleteVoucher = (id: any) => {
  return axios.post<OpResult>(apiUrl.deleteVoucher, buildIdForm(id));
};

/**
 * 显示隐藏优惠卷
 */
export const CouponShow = (params: any) => {
  return axios.post<OpResult>(apiUrl.couponShow, buildForm(params));
};
