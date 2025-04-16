import axios from "axios";
import {userApiUrl} from "@/api/api";
import {JoinParams} from "@/api/admin/public";
import {Order} from "@/api/admin/finance/order";


/**
 *查询订单
 */
export const QueryOrder = (params: any) => {
    return axios.get<Order[]>(userApiUrl.queryOrderList + JoinParams(params))
}
/**
 *查询订单
 */
export const QueryOrderDetails = (params: any) => {
    return axios.get<Order>(userApiUrl.queryOrderDetails + JoinParams(params))
}
