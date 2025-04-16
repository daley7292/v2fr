import axios from 'axios';
import { buildForm, buildIdForm } from '@/api/admin/public';
import { apiUrl } from '@/api/api';

export interface FinanceSubscription {
  id: any;
  group_id: any;
  transfer_enable: string;
  name: string;
  speed_limit: string;
  show: string;
  sort: string;
  renew: string;
  content: string;
  month_price: string;
  quarter_price: string;
  half_year_price: string;
  year_price: string;
  two_year_price: string;
  three_year_price: string;
  onetime_price: string;
  reset_price: string;
  reset_traffic_method: any;
  capacity_limit: string;
  created_at: string;
  updated_at: string;
  count: string;
  force_update: boolean;
  ip_limit: number;
  block_plant_cont: number;
}

export const defaultServerSubscription: FinanceSubscription = {
  id: '', // 你可以设置适当的默认值
  group_id: undefined,
  transfer_enable: '',
  name: '',
  speed_limit: '0',
  show: '',
  sort: '',
  renew: '',
  content: '',
  month_price: '',
  quarter_price: '',
  half_year_price: '',
  year_price: '',
  two_year_price: '',
  three_year_price: '',
  onetime_price: '',
  reset_price: '',
  reset_traffic_method: undefined,
  capacity_limit: '',
  created_at: '',
  updated_at: '',
  count: '',
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
export const QuerySubscription = () => {
  return axios.get<FinanceSubscription[]>(apiUrl.querySubscription);
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
