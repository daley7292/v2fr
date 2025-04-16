import axios from 'axios';
import { buildForm } from '@/api/admin/public';
import { apiUrl } from '@/api/api';

/**
 * 服务器规则接口定义
 */
export interface ServerRule {
  id: number; // 规则ID
  name: string; // 规则名称
  domain: string; // 域名
  ua: string; // ua
  sort:0,
  server_arr: string; // 服务器数组（字符串格式）
  temp_server_arr: any[]; // 临时服务器数组
}

/**
 * 服务器规则默认值
 */
export const defaultServerRule: ServerRule = {
  id: 0, // 默认ID值为0
  name: '', // 默认名称为空
  domain: '', // 默认域名为空
  ua: '', // 默认域名为空
  sort:0,
  server_arr: '', // 默认服务器数组为空
  temp_server_arr: [], // 默认临时服务器数组为空数组
};

/**
 * 查询所有规则
 * @returns 规则列表Promise
 */
export const QueryRule = () => {
  return axios.get<ServerRule[]>(apiUrl.queryRule);
};

/**
 * 保存规则
 * @param params 规则参数
 * @returns 操作结果Promise
 */
export const SaveRule = (params: any) => {
  return axios.post(apiUrl.saveRule, buildForm(params));
};
/**
 * 保存规则排序
 * @param params 规则排序参数
 * @returns 操作结果Promise
 */
export const SaveRuleSort = (params: any) => {
  return axios.post(apiUrl.saveRuleSort, buildForm(params));
};

/**
 * 删除规则
 * @param params 规则参数
 * @returns 操作结果Promise
 */
export const DeleteRule = (params: any) => {
  return axios.post(apiUrl.deleteRule, buildForm(params));
};
