import axios from 'axios';
import type { TableData } from '@arco-design/web-vue/es/table/interface';
import { apiUrl } from '@/api/api';
import { buildForm, JoinParams } from "@/api/admin/public";

/**
 * 订单信息接口
 */
export interface Order {
  type: string; // 订单类型
  date: string; // 订单日期
  value: number; // 订单价值
}

/**
 * 收入数据接口
 */
export interface Income {
  month_income: string; // 月收入
  month_register_total: number; // 月注册总数
  ticket_pending_total: number; // 待处理票据总数
  commission_pending_total: number; // 待处理佣金总数
  day_income: number; // 日收入
  last_month_income: number; // 上月收入
  commission_month_payout: number; // 本月佣金支付
  commission_last_month_payout: number; // 上月佣金支付
}

/**
 * 查询收入数据
 * @returns Promise<Income> 收入数据
 */
export const queryIncome = () => {
  return axios.get<Income>(apiUrl.getOverride);
};

/**
 * 查询订单列表
 * @returns Promise<Order[]> 订单列表
 */
export const queryOrders = () => {
  return axios.get<Order[]>(apiUrl.getOrder);
};

export const getColumnChart = (params:any) => {
  return axios.post(apiUrl.getColumnChart,buildForm(params));
};

export const getServerLastRank = () => {
  return axios.get(apiUrl.getServerLastRank);
};

/**
 * 获取财务数据
 * @param value 查询参数
 * @returns Promise 财务数据
 */
export const GetFinances = (value: any) => {
  return axios.get(apiUrl.getFinances + JoinParams(value));
};

/**
 * 热门记录接口
 */
export interface PopularRecord {
  key: number; // 记录键值
  clickNumber: string; // 点击次数
  title: string; // 标题
  increases: number; // 增长量
}

/**
 * 查询热门列表
 * @param params 查询参数，包含类型
 * @returns Promise<TableData[]> 热门列表数据
 */
export function queryPopularList(params: { type: string }) {
  return axios.get<TableData[]>('/api/popular/list', { params });
}

/**
 * 获取在线状态信息
 * @returns Promise 在线状态数据
 */
export const getOnlinePresence = () => {
  return axios.get(apiUrl.getOnlinePresence);
};
