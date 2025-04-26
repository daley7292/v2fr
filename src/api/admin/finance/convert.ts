import axios from 'axios';
import {
  buildForm,
  JoinParams,
  OpResult,
} from '@/api/admin/public';
import { apiUrl,userApiUrl } from '@/api/api';

export interface Convert {
  id:any,
  name: string;
  plan_id: any;
  duration_unit: string;
  duration_value: any;
  is_invitation: number;
  email: string;
  ordinal_number: any;
  redeem_code: any;
  end_at: number;
  count: number;
}

// 创建一个默认的 Convert 对象
export const defaultConvert: Convert = {
  id: undefined,
  name: '',
  plan_id: undefined,
  duration_unit: 'month',
  duration_value: 1,
  is_invitation: 1,
  email: '',
  redeem_code: '',
  ordinal_number: undefined,
  end_at: 0,
  count: 1,
};

// 使用默认值创建新的 Convert 对象
export const newConvert: Convert = {
  ...defaultConvert,
};

/**
 * 查询转换配置
 */
export const QueryConvert = (params: any) => {
  return axios.get<Convert[], number>(apiUrl.convertFetch + JoinParams(params));
};

/**
 * 保存或编辑转换配置
 */
export const SaveConvert = (params: any) => {
  return axios.post<OpResult>(apiUrl.convertSave, buildForm(params));
};

/**
 * 保存或编辑转换配置
 */
export const DeleteConvert = (params: any) => {
  return axios.post<OpResult>(apiUrl.convertDelete, buildForm(params));
};

export const GetRedeemOrders = (params: any) => {
  return axios.post<Convert>(apiUrl.convertGetRedeemOrders , buildForm(params));
}

export const CheckEmail = (params: any) => {
  return axios.post<Convert>(userApiUrl.checkEmail , buildForm(params));
}

