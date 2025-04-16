import {userApiUrl} from "@/api/api";
import {buildForm, OpResult} from "@/api/admin/public";
import axios from "axios";

export interface UserInfo {
    email: string;
    transfer_enable: number;
    last_login_at?: any;
    created_at: number;
    banned: number;
    remind_expire: number;
    remind_traffic: number;
    expired_at: number;
    balance: number;
    commission_balance: number;
    plan_id: number;
    discount?: any;
    commission_rate: number;
    telegram_id?: any;
    uuid: string;
    avatar_url: string;
}

/**
 *查询订单
 */
export const ChangePassword = (params: any) => {
    return axios.post<OpResult>(userApiUrl.changePassword, buildForm(params))
}
/**
 *查询订单
 */
export const UpdateUser = (params: any) => {
    return axios.post<OpResult>(userApiUrl.updateUser, buildForm(params))
}
/**
 *查询订单
 */
export const ResetSecurity = () => {
    return axios.get<OpResult>(userApiUrl.resetSecurity)
}