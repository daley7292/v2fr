import axios from "axios";
import {userApiUrl} from "@/api/api";
import {buildForm, JoinParams, OpResult} from "@/api/admin/public";
import {Order} from "@/api/admin/finance/order";
import {UserInfo} from "@/api/user/user/user";

export interface Code {
    id: number;
    user_id: number;
    code: string;
    status: number;
    pv: number;
    created_at: number;
    updated_at: number;
}

export interface InviteData {
    codes: Code[];
    stat: number[];
}

export interface CommConfig {
    is_telegram: number;
    telegram_discuss_link?: any;
    stripe_pk?: any;
    withdraw_methods: string[];
    withdraw_close: number;
    currency: string;
    currency_symbol: string;
    commission_distribution_enable: number;
    commission_distribution_l1?: any;
    commission_distribution_l2?: any;
    commission_distribution_l3?: any;
}
/**
 *保存邀请
 */
export const SaveInvite = () => {
    return axios.get<OpResult>(userApiUrl.inviteSave)
}
/**
 *查询邀请
 */
export const QueryInvite = () => {
    return axios.get<InviteData>(userApiUrl.inviteFetch)
}
/**
 *查询邀请详情
 */
export const QueryInviteDetails = (params: any) => {
    return axios.get<Order>(userApiUrl.inviteDetails + JoinParams(params))
}
/**
 *查询用户信息
 */
export const QueryUserInfo = () => {
    return axios.get<UserInfo>(userApiUrl.userInfo)
}
/**
 *查询公共配置信息
 */
export const QueryCommConfig = () => {
    return axios.get<CommConfig>(userApiUrl.commConfig)
}
/**
 *资金划转
 */
export const UserTransfer = (params:any) => {
    return axios.post<OpResult>(userApiUrl.userTransfer,buildForm(params))
}

/**
 *佣金提现
 */
export const UserTicketWithdraw = (params:any) => {
    return axios.post<OpResult>(userApiUrl.userTicketWithdraw,buildForm(params))
}

/**
 *佣金提现
 */
export const UserInviteDetails = () => {
    return axios.get(userApiUrl.inviteDetails)
}
