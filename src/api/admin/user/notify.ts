import axios from "axios";
import { apiUrl } from "@/api/api";
import {buildForm, JoinParams} from "@/api/admin/public";


export interface Notify {
    id: any;
    title: string;
    content: string;
    show: any;
    img_url: string;
    tags: string[];
    windows_type:number;
    created_at: any;
    updated_at: any;
}

// 创建一个默认的 Notify 对象
const defaultNotify: Notify = {
    id: undefined, // 你可以设置适当的默认值
    title: "",
    content: "",
    show: undefined,
    img_url: "",
    windows_type:1,
    tags: [],
    created_at: undefined,
    updated_at: undefined,
};

// 使用默认值创建新的 Notify 对象
export const newNotify: Notify = {
    ...defaultNotify,
};

export const SaveNotify = (params:any)=>{
    return axios.post(apiUrl.saveNotify ,buildForm(params))
}
export const ShowNotify = (params:any)=>{
    return axios.post(apiUrl.showNotify ,buildForm(params))
}

export const DeleteNotify = (params:any)=>{
    return axios.post(apiUrl.deleteNotify ,buildForm(params))
}

export const QueryNotify = (params:any)=>{
    return axios.get<Notify[]>(apiUrl.queryNotify+JoinParams(params))
}

