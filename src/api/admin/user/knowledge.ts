import axios from "axios";
import {apiUrl} from "@/api/api";
import {buildForm, JoinParams, OpResult} from "@/api/admin/public";

export interface Knowledge {
    id: any; // 你可以设置适当的默认值
    language: string;
    category: string;
    title: string;
    body: string;
    sort: any; // 你可以设置适当的默认值
    show: any; // 你可以设置适当的默认值
    created_at: any; // 你可以设置适当的默认值
    updated_at: any; // 你可以设置适当的默认值
}

// 创建一个默认的 Knowledge 对象
export const defaultKnowledge: Knowledge = {
    id:undefined,
    language: "en", // 设置默认语言
    category: "", // 设置默认类别
    title: "", // 设置默认标题
    body: "", // 设置默认内容
    sort: 0, // 设置默认排序值
    show: 1, // 设置默认显示状态
    created_at: Date.now(), // 设置默认创建时间
    updated_at: Date.now(), // 设置默认更新时间
};

// 使用默认值创建新的 Knowledge 对象
export const newKnowledge: Knowledge = {
    ...defaultKnowledge,
    language: "zh-CN", // 自定义属性值
    title: "",
};
export const QueryKnowledge = (params:any)=>{
    return axios.get<Knowledge[]>(apiUrl.queryKnowledge+JoinParams(params))
}

export const SaveKnowledge = (params:any)=>{
    return axios.post<OpResult>(apiUrl.saveKnowledge,params)
}

export const DeleteKnowledge = (params:any)=>{
    return axios.post<OpResult>(apiUrl.deleteKnowledge,buildForm(params))
}

export const ShowKnowledge = (params:any)=>{
    return axios.post<OpResult>(apiUrl.showKnowledge,buildForm(params))
}
