import axios from 'axios';
import { buildForm } from '@/api/admin/public';
import { apiUrl } from '@/api/api';

/**
 * 权限组接口定义
 */
export interface PermissionGroup {
  id: number; // 权限组ID
  name: string; // 权限组名称
  created_at: number; // 创建时间
  updated_at: number; // 更新时间
  user_count: number; // 用户数量
  server_count: number; // 服务器数量
}

/**
 * 权限组默认值
 */
export const defaultPermissionGroup: PermissionGroup = {
  id: 0, // 默认ID值
  name: '', // 默认名称为空
  created_at: 0, // 默认创建时间
  updated_at: 0, // 默认更新时间
  user_count: 0, // 默认用户数量
  server_count: 0, // 默认服务器数量
};

/**
 * 查询权限组列表
 * @returns 权限组列表
 */
export const QueryPermission = () => {
  return axios.get<PermissionGroup[]>(apiUrl.queryPermissionGroup);
};

/**
 * 保存权限组
 * @param params 权限组参数
 * @returns 操作结果
 */
export const SavePermission = (params: any) => {
  return axios.post(apiUrl.savePermissionGroup, buildForm(params));
};

/**
 * 删除权限组
 * @param params 权限组参数
 * @returns 操作结果
 */
export const DeletePermission = (params: any) => {
  return axios.post(apiUrl.deletePermissionGroup, buildForm(params));
};
