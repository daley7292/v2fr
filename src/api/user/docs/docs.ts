import {userApiUrl} from "@/api/api";
import axios from "axios";
import {JoinParams} from "@/api/admin/public";

export interface General {
    id: number;
    category: string;
    title: string;
    updated_at: number;
}

export interface GeneralData {
    General: General[];
}
/**
 *查询订单
 */
export const UserKnowledgeFetch = (params:any) => {
    return axios.get<GeneralData>(userApiUrl.userKnowledgeFetch+JoinParams(params))
}