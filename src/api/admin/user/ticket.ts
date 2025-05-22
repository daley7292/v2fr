import axios from "axios";
import {apiUrl} from "@/api/api";
import {buildForm, JoinParams} from "@/api/admin/public";

export interface Ticket {
    id: number;
    user_id: number;
    subject: string;
    level: number;
    status: number;
    message:[];
    reply_status: number;
    created_at: number;
    updated_at: number;
}

// 创建一个默认的 Ticket 对象
const defaultWorkOrder: Ticket = {
    id: 0, // 你可以设置适当的默认值
    user_id: 0,
    subject: "",
    level: 0,
    message:[],
    status: 1,
    reply_status: 0,
    created_at: 0,
    updated_at: 0,
};

// 使用默认值创建新的 Ticket 对象
export const newTicket: Ticket = {
    ...defaultWorkOrder,
};


export const QueryTicket = (params: any) => {
    return axios.get<Ticket[], number>(apiUrl.queryTicket + JoinParams(params))
}

export const QueryTicketDetails = (params: any) => {
    return axios.get<Ticket>(apiUrl.queryTicket + JoinParams(params))
}


export const ReplyTicket = (params: any) => {
    return axios.post(apiUrl.replyTicket ,buildForm(params))
}



export const CloseTicket = (params: any) => {
    return axios.post(apiUrl.closeTicket ,buildForm(params))
}
