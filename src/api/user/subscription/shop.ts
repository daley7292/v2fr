import {userApiUrl} from "@/api/api";
import axios from "axios";
import {buildForm, JoinParams} from "@/api/admin/public";

export interface ShopNode {
    id: number;
    group_id: number;
    transfer_enable: number;
    name: string;
    speed_limit: number;
    show: number;
    sort: null;
    renew: number;
    content: string;
    month_price: number;
    quarter_price: number;
    half_year_price: number;
    year_price: number;
    two_year_price: number;
    three_year_price: number;
    onetime_price: number;
    reset_price: number;
    reset_traffic_method: number;
    capacity_limit: number;
    created_at: number;
    updated_at: number;
}


export interface Plan {
    id: number;
    group_id: number;
    transfer_enable: number;
    name: string;
    speed_limit: number;
    show: number;
    sort?: any;
    renew: number;
    content: string;
    month_price: number;
    quarter_price: number;
    half_year_price: number;
    year_price: number;
    two_year_price: number;
    three_year_price: number;
    onetime_price: number;
    reset_price: number;
    reset_traffic_method: number;
    capacity_limit: number;
    created_at: number;
    updated_at: number;
}

export interface Surplus_order {
    id: number;
    invite_user_id?: any;
    user_id: number;
    plan_id: number;
    coupon_id?: any;
    payment_id?: any;
    type: number;
    period: string;
    trade_no: string;
    callback_no: string;
    total_amount: number;
    handling_amount?: any;
    discount_amount?: any;
    surplus_amount?: any;
    refund_amount?: any;
    balance_amount?: any;
    surplus_order_ids?: any;
    status: number;
    commission_status: number;
    commission_balance: number;
    actual_commission_balance?: any;
    paid_at: number;
    created_at: number;
    updated_at: number;
}

export interface UserOrderDetail {
    id: number;
    invite_user_id?: any;
    user_id: number;
    plan_id: number;
    coupon_id?: any;
    payment_id?: any;
    type: number;
    period: string;
    trade_no: string;
    callback_no?: any;
    total_amount: number;
    handling_amount?: any;
    discount_amount?: any;
    surplus_amount: number;
    refund_amount: number;
    balance_amount?: any;
    surplus_order_ids: number[];
    status: number;
    commission_status: number;
    commission_balance: number;
    actual_commission_balance?: any;
    paid_at?: any;
    created_at: number;
    updated_at: number;
    plan: Plan;
    try_out_plan_id: number;
    surplus_orders: Surplus_order[];
}

export interface UserPayMethod {
    id: number;
    name: string;
    payment: string;
    icon: string;
    handling_fee_fixed: number;
    handling_fee_percent: string;
}

/**
 *可下单订阅
 */
export const ShopNode = (params: any) => {
    return axios.get<ShopNode[]>(userApiUrl.userPlan + JoinParams(params))
}
/**
 *下单
 */
export const CreateUserOrder = (params: any) => {
    return axios.post<string>(userApiUrl.userSaveOrder, buildForm(params))
}
/**
 *用户订单详情
 */
export const UserOrderDetails = (params: any) => {
    return axios.get<UserOrderDetail>(userApiUrl.userOrderDetail + JoinParams(params))
}
/**
 *用户订单详情
 */
export const CancelUserOrderDetails = (params: any) => {
    return axios.post(userApiUrl.cancelUserOrderDetail, buildForm(params))
}
/**
 *获取用户支付方式
 */
export const UserPaymentMethod = () => {
    return axios.get<UserPayMethod[]>(userApiUrl.getPaymentMethod)
}
/**
 *查询用户订单是否已经支付
 */
export const UserOrderCheck = (params: any) => {
    return axios.get(userApiUrl.userOrderCheck + JoinParams(params))
}
/**
 *查询用户订单是否已经支付
 */
export const UserOrderCheckout = (params: any) => {
    return axios.post(userApiUrl.userOrderCheckout, buildForm(params))
}
/**
 *查询优惠卷是否可用
 */
export const UserCouponCheck = (params: any) => {
    return axios.post(userApiUrl.userCouponCheck, buildForm(params))
}