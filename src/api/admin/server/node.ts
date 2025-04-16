import axios from 'axios';
import { buildForm, JoinParams, OpResult } from '@/api/admin/public';
import { apiUrl } from '@/api/api';
import { defaultUser, User } from '@/api/admin/user/user';

/**
 * 节点接口定义
 */
export interface Node {
  id: any; // 节点ID
  group_id: any[]; // 权限组ID列表
  route_id: string[]; // 路由ID
  name: any; // 节点名称
  parent_id: any; // 父节点ID
  host: any; // 主机地址
  port: any; // 端口
  server_port: any; // 服务器端口
  tls: any; // TLS 配置
  tags: any[]; // 节点标签
  rate: any; // 倍率
  network: any; // 网络类型
  rules: any; // 规则
  networkSettings: any; // 网络设置
  tlsSettings: any; // TLS设置
  ruleSettings: any; // 规则设置
  dnsSettings: any; // DNS设置
  show: any; // 是否显示
  sort: any; // 排序
  created_at: any; // 创建时间
  updated_at: any; // 更新时间
  type: any; // 节点类型
  online: any; // 在线状态
  last_check_at: any; // 最后检查时间
  last_push_at: any; // 最后推送时间
  available_status: any; // 可用状态
  insecure: any; // 不安全
  allow_insecure: any; // 允许不安全
  server_name: any; // 服务器名称
  obfs_settings: any; // 混淆设置
  obfs: any; // 混淆
  cipher: any; // 加密方式
  up_mbps: any; // 上行带宽
  down_mbps: any; // 下行带宽
}

/**
 * 节点默认值
 */
export const defaultNode: Node = {
  id: null,
  group_id: [],
  route_id: [],
  name: null,
  parent_id: null,
  host: null,
  port: null,
  server_port: null,
  tls: null,
  tags: [],
  rate: null,
  network: null,
  rules: null,
  networkSettings: null,
  tlsSettings: null,
  ruleSettings: null,
  dnsSettings: null,
  show: 0,
  sort: 1,
  created_at: null,
  updated_at: null,
  type: null,
  online: null,
  last_check_at: null,
  last_push_at: null,
  available_status: null,
  insecure: null,
  allow_insecure: null,
  server_name: null,
  obfs_settings: null,
  obfs: null,
  cipher: null,
  up_mbps: null,
  down_mbps: null,
};

/**
 * 创建新节点对象
 */
export const newNode: Node = {
  ...defaultNode,
};

/**
 * 权限组接口定义
 */
export interface PermissionGroup {
  id: any; // 权限组ID
  name: any; // 权限组名称
  created_at: any; // 创建时间
  updated_at: any; // 更新时间
  user_count: any; // 用户数量
  server_count: any; // 服务器数量
}

/**
 * 查询节点列表
 * @param params 查询参数
 * @returns 节点列表
 */
export const QueryNodes = (params: any) => {
  return axios.get<Node[]>(apiUrl.queryNodes + JoinParams(params));
};

/**
 * 查询权限组
 * @returns 权限组列表
 */
export const QueryPermissionGroup = () => {
  return axios.get<PermissionGroup[]>(apiUrl.queryPermissionGroup);
};

/**
 * 保存节点
 * @param params 节点参数
 * @returns 操作结果
 */
export const SaveNode = (params: any) => {
  return axios.post<OpResult>(
    apiUrl.saveNode.replace('%s', params.type),
    buildForm(params, true)
  );
};

/**
 * 修改节点
 * @param params 节点参数
 * @returns 操作结果
 */
export const UpdateNode = (params: any) => {
  return axios.post<OpResult>(
    apiUrl.updateNode.replace('%s', params.type),
    buildForm(params, true)
  );
};

/**
 * 复制节点
 * @param params 节点参数
 * @returns 操作结果
 */
export const CopyNode = (params: any) => {
  return axios.post(
    apiUrl.copyNode.replace('%s', params.type),
    buildForm(params)
  );
};

/**
 * 删除节点
 * @param params 节点参数
 * @returns 操作结果
 */
export const DeleteNode = (params: any) => {
  return axios.post(
    apiUrl.deleteNode.replace('%s', params.type),
    buildForm(params)
  );
};
/**
 * 删除节点
 * @param params 节点参数
 * @returns 操作结果
 */
export const NodeSort = (params: any) => {
  return axios.post(apiUrl.NodeSort,buildForm(params));
};
