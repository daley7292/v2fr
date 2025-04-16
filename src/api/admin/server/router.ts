import axios from 'axios';
import { buildForm } from '@/api/admin/public';
import { apiUrl } from '@/api/api';

/**
 * 服务器路由接口定义
 */
export interface ServerRouter {
  id: number; // 路由ID
  remarks: string; // 备注信息
  match: string[]; // 匹配规则列表
  action: string; // 动作类型
  action_value: string; // 动作值
  created_at: number; // 创建时间
  updated_at: number; // 更新时间
}

/**
 * 服务器路由默认值
 */
export const defaultServerRouter: ServerRouter = {
  id: 0, // 默认ID值
  remarks: '', // 默认备注为空
  match: [], // 默认匹配规则为空数组
  action: 'block', // 默认动作为阻止
  action_value: '', // 默认动作值为空
  created_at: 0, // 默认创建时间
  updated_at: 0, // 默认更新时间
};

/**
 * 查询路由列表
 * @returns 路由列表
 */
export const QueryRouter = () => {
  return axios.get<ServerRouter[]>(apiUrl.queryRouter);
};

/**
 * 保存路由
 * @param params 路由参数
 * @returns 操作结果
 */
export const SaveRouter = (params: any) => {
  return axios.post(apiUrl.saveRouter, buildForm(params));
};

/**
 * 删除路由
 * @param params 路由参数
 * @returns 操作结果
 */
export const DeleteRouter = (params: any) => {
  return axios.post(apiUrl.deleteRouter, buildForm(params));
};
