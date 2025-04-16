import axios from "axios";
import {userApiUrl} from "@/api/api";
import {JoinParams} from "@/api/admin/public";
import {Order} from "@/api/admin/finance/order";
import {GetSubscribe} from "@/api/user/subscription/status";

export interface UserNotice {
    id: number;
    title: string;
    content: string;
    show: number;
    img_url: string;
    tags: string[];
    created_at: number;
    updated_at: number;
}

/**
 *查询订单
 */
export const QueryUserNotice = () => {
    return axios.get<UserNotice[]>(userApiUrl.queryUserNotice )
}

/**
 *查询服务列表
 */
export const UserGetSubscribe = () => {
    return axios.get<GetSubscribe>(userApiUrl.userGetSubscribe)
}
