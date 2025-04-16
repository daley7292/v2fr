import axios from "axios";
import {buildForm, JoinParams, OpResult} from "@/api/admin/public";
import {userApiUrl} from "@/api/api";
import {Ticket} from "@/api/admin/user/ticket";

/**
 *查询订单
 */
export const QueryUserTicket = (params: any) => {
    return axios.get<Ticket[]>(userApiUrl.userQueryTicket + JoinParams(params))
}
/**
 *查询订单
 */
export const SaveUserTicket = (params: any) => {
    return axios.post<OpResult>(userApiUrl.userSaveTicket, buildForm(params))
}
/**
 *查询订单
 */
export const UserCloseTicket = (params: any) => {
    return axios.post<OpResult>(userApiUrl.userCloseTicket, buildForm(params))
}
/**
 *查询订单
 */
export const UserTicketReply = (params: any) => {
    return axios.post<OpResult>(userApiUrl.userTicketReply, buildForm(params))
}