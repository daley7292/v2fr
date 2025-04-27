import axios from 'axios';
import {buildForm, buildIdForm, JoinParams} from '@/api/admin/public';
import { apiUrl } from '@/api/api';

export interface FinanceSubscription {
  id: any;
  group_id: any;
  transfer_enable: any;
  name: any;
  speed_limit: any;
  show: any;
  sort: any;
  renew: any;
  content: any;
  month_price: any;
  quarter_price: any;
  half_year_price: any;
  year_price: any;
  two_year_price: any;
  three_year_price: any;
  onetime_price: any;
  reset_price: any;
  reset_traffic_method: any;
  capacity_limit: any;
  created_at: any;
  updated_at: any;
  count: any;
  force_update: boolean;
  ip_limit: number;
  block_plant_cont: number;
}

export const defaultServerSubscription: FinanceSubscription = {
  id: undefined, // 你可以设置适当的默认值
  group_id: undefined,
  transfer_enable: undefined,
  name: undefined,
  speed_limit: 0,
  show: undefined,
  sort: undefined,
  renew: undefined,
  content: undefined,
  month_price: undefined,
  quarter_price: undefined,
  half_year_price: undefined,
  year_price: undefined,
  two_year_price: undefined,
  three_year_price: undefined,
  onetime_price: undefined,
  reset_price: undefined,
  reset_traffic_method: undefined,
  capacity_limit: undefined,
  created_at: undefined,
  updated_at: undefined,
  count: undefined,
  force_update: false,
  ip_limit: 0,
  block_plant_cont: 0,
};

export const newSubscription: FinanceSubscription = {
  ...defaultServerSubscription,
};

/**
 *查询订阅
 */
export const QuerySubscription = (params:any) => {
  return axios.get<FinanceSubscription[]>(apiUrl.querySubscription+ JoinParams(params));
};
/**
 * 保存订阅
 */
export const SaveSubscription = (params: any) => {
  return axios.post(apiUrl.saveSubscription, buildForm(params));
};

/**
 * 删除订阅
 */
export const DeleteSubscription = (id: any) => {
  return axios.post(apiUrl.deleteSubscription, buildIdForm(id));
};

/**
 * 删除订阅
 */
export const PlanUpdate = (params: any) => {
  return axios.post(apiUrl.planUpdate, buildForm(params));
};

/**
 * 删除订阅
 */
export const PlanSort = (params: any) => {
  return axios.post(apiUrl.planSort, buildForm(params));
};
