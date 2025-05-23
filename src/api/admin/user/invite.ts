import axios from "axios";
import {userApiUrl} from "@/api/api";

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
 *查询公共配置信息
 */
export const QueryCommConfig = () => {
    return axios.get<CommConfig>(userApiUrl.commConfig)
}