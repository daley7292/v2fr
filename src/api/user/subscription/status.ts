import {userApiUrl} from "@/api/api";
import axios from "axios";

export interface TrafficLog {
    u: number;
    d: number;
    record_at: number;
    user_id: number;
    server_rate: string;
}

export interface ServerFetch {
    id: number;
    group_id: string[];
    route_id: any[];
    name: string;
    parent_id?: any;
    host: string;
    port: number;
    server_port: number;
    tls: number;
    tags: string[];
    rate: string;
    network: string;
    rules?: any;
    networkSettings?: any;
    tlsSettings?: any;
    ruleSettings?: any;
    dnsSettings?: any;
    show: number;
    sort: number;
    created_at: number;
    updated_at: number;
    type: string;
    last_check_at?: any;
    is_online: number;
    cache_key: string;
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

export interface GetSubscribe {
    plan_id: number;
    token: string;
    expired_at?: any;
    u: number;
    d: number;
    transfer_enable: number;
    email: string;
    uuid: string;
    plan: Plan;
    subscribe_url: string;
    reset_day?: any;
}

/**
 *查询订单
 */
export const UserStatTrafficLog = () => {
    return axios.get<TrafficLog[]>(userApiUrl.userStatTrafficLog)
}
/**
 *获取节点
 */
export const UserServerFetch = () => {
    return axios.get<ServerFetch[]>(userApiUrl.userServerFetch)
}
