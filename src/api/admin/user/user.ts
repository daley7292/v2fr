import axios from "axios";
import { buildForm, buildIdForm, JoinArrary, JoinParams, OpResult } from "@/api/admin/public";
import { apiUrl } from "@/api/api";

export interface User {
    id?: any;
    invite_user_id?: any;
    telegram_id?: any;
    email?: any;
    password?: any;
    password_algo?: any;
    password_salt?: any;
    balance?: any;
    discount?: any;
    commission_type?: any;
    commission_rate?: any;
    commission_balance?: any;
    t?: any;
    u?: any;
    d?: any;
    transfer_enable?: any;
    banned?: any;
    is_admin?: any;
    last_login_at?: any;
    is_staff?: any;
    last_login_ip?: any;
    uuid?: any;
    group_id?: any;
    plan_id?: any;
    speed_limit?: any;
    remind_expire?: any;
    remind_traffic?: any;
    token?: any;
    expired_at?: any;
    remarks?: any;
    created_at?: any;
    updated_at?: any;
    total_used?: any;
    invite_user_email?: any;
    plan_name?: any;
    subscribe_url?: any;
}


// 创建一个默认的 User 对象
export const defaultUser: User = {};

// 使用默认值创建新的 User 对象
export const newUser: User = {
    ...defaultUser,
};

export interface NetworkRecord {
    id: number;
    user_id: number;
    server_rate: string;
    u: number;
    d: number;
    record_type: string;
    record_at: number;
    created_at: number;
    updated_at: number;
}

/**
 *查询用户
 */
export const QueryUser = (params: any, cond:any) => {
    return axios.get<User[], number>(apiUrl.queryUser + JoinParams(params) + JoinArrary(cond))
}
/**
 * 获取用户信息
 */
export const QueryUserDetails = (params: any) => {
    return axios.get<User>(apiUrl.queryUserDetails + JoinParams(params))
}
/**
 * 创建支付订单
 */
export const AssignOrder = (params: any) => {
    return axios.post<OpResult>(apiUrl.assignOrder, buildForm(params))
}

/**
 * 重置uuid和订阅地址
 */
export const ResetUUIDWithUrl = (params: any) => {
    return axios.post<OpResult>(apiUrl.resetSecret, buildForm(params))
}

/**
 * 更新用户
 */
export const UpdateUser = (params: any) => {
    return axios.post<OpResult>(apiUrl.updateUser, buildForm(params))
}

/**
 * 保存用户
 */
export const SaveUser = (params: any) => {
    return axios.post(apiUrl.userGenerate, buildForm(params))
}

/**
 * 查询用户流量使用记录
 */
export const QueryUserNetworkRecord = (params: any) => {
    return axios.get<NetworkRecord[], number>(apiUrl.queryUserNetworkRecord + JoinParams(params))
}


/**
 * 删除用户
 */
export const DeleteUser = (id: any) => {
    return axios.post(apiUrl.planDrop, buildIdForm(id))
}


/**
 * 用户禁封
 */
export const UserBan =(params:any)=>{
    return axios.post(apiUrl.userBan,buildForm(params))
}


/**
 * 用户删除
 */
export const UserDel =(params:any)=>{
    return axios.post(apiUrl.userDel,buildForm(params))
}

///
/**
 * 删除用户
 */
export const DumpCSV = (params: any) => {
    return axios.post(apiUrl.dumpCSV,buildForm(params))
}

export const SendEmail = (params:any)=>{
    return axios.post(apiUrl.sendMail,buildForm(params))
}

export const GetRenewalNewPurchase = (params:any)=>{
    return axios.post(apiUrl.getRenewalNewPurchase,buildForm(params))
}