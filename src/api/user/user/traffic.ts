import {userApiUrl} from "@/api/api";
import axios from "axios";

export interface TrafficLog {
    u: number;
    d: number;
    record_at: number;
    user_id: number;
    server_rate: string;
}

/**
 *查询订单
 */
export const UserStatTrafficLog = () => {
    return axios.get<TrafficLog[]>(userApiUrl.userStatTrafficLog)
}