import axios from 'axios';
import { apiUrl } from '@/api/api';
import { buildForm } from '@/api/admin/public';

/**
 * 支付配置接口定义
 */
export interface Config {
  app_id: string; // 应用ID
  private_key: string; // 私钥
  public_key: string; // 公钥
  product_name: string; // 产品名称
}

/**
 * 支付方式接口定义
 */
export interface PayMethod {
  id: number; // 唯一标识
  uuid: string; // 通用唯一标识符
  payment: string; // 支付类型标识
  name: string; // 支付名称
  icon: string; // 图标
  config: Config; // 支付配置
  notify_domain: string; // 通知域名
  handling_fee_fixed: number; // 固定手续费
  handling_fee_percent: string; // 百分比手续费
  enable: number; // 是否启用
  sort: string; // 排序值
  created_at: number; // 创建时间
  updated_at: number; // 更新时间
  notify_url: string; // 通知URL
}

/**
 * 支付方式默认值
 */
export const defaultPayMethod: PayMethod = {
  id: 0,
  uuid: '',
  payment: '',
  name: '',
  icon: '',
  config: {
    app_id: '',
    private_key: '',
    public_key: '',
    product_name: '',
  },
  notify_domain: '',
  handling_fee_fixed: 0,
  handling_fee_percent: '',
  enable: 0,
  sort: '',
  created_at: 0,
  updated_at: 0,
  notify_url: '',
};

/**
 * 支付表单项接口定义
 */
export interface PayFormItem {
  field: string; // 字段名
  label: string; // 标签
  description: string; // 描述
  type: string; // 类型
}

/**
 * 查询支付方式列表
 * @returns 支付方式列表
 */
export const queryPayMethods = () => {
  return axios.get<PayMethod[]>(apiUrl.queryPayMethods);
};

/**
 * 变更支付方式启用状态
 * @param params 请求参数
 * @returns 操作结果
 */
export const showPayMethod = (params: any) => {
  return axios.post(apiUrl.showPayMethod, buildForm(params));
};

/**
 * 获取所有可用的支付方式
 * @returns 支付方式
 */
export const getPaymentMethods = () => {
  return axios.get(apiUrl.getPaymentMethods);
};

/**
 * 获取支付方式配置表单
 * @param params 请求参数
 * @returns 表单配置
 */
export const getPaymentForm = (params: any) => {
  return axios.post(apiUrl.getPaymentForm, buildForm(params));
};

/**
 * 保存或更新支付方式配置
 * @param params 支付方式参数
 * @returns 操作结果
 */
export const savePaymentMethod = (params: any) => {
  const r = ']';
  const l = '[';
  const w = '';
  const dataForm = new FormData();

  Object.keys(params.values).forEach((k) => {
    if (k === 'config') {
      // 处理嵌套的config对象
      Object.keys(params.values[k]).forEach((ck) => {
        dataForm.append(k + l + ck + r, params.values[k][ck]);
      });
    } else {
      // 处理普通字段
      dataForm.append(k, params.values[k]);
    }

    // 处理固定手续费（转换为分）
    if (k === 'handling_fee_fixed') {
      dataForm.append(k, params.values[k] * 100 + w);
    }
  });

  return axios.post(apiUrl.savePaymentMethod, dataForm);
};
