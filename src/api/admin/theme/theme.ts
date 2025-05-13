import axios from "axios";
import {buildForm, OpResult} from "@/api/admin/public";
import {apiUrl} from "@/api/api";

export interface ThemeConfig {
    theme_default_i18n: string; // 默认语言，例如 "zh-CN"
    theme_color: string; // 主题颜色，例如 "#319795"
    theme_via: string; // 主题标识符或校验值
    custom_html: string; // 自定义 HTML 脚本
}


export const GetTheme = () => {
    return axios.get<ThemeConfig>(apiUrl.getTheme)
}

export const GetThemeConfig = (params:any) => {
    return axios.post<ThemeConfig>(apiUrl.getThemeConfig,buildForm(params))
}

export const saveThemeConfig = (config: any) => {
    return axios.post<OpResult>(apiUrl.saveThemeConfig, buildForm(config))
}

export const SaveTheme = (config: any) => {
    return axios.post<OpResult>(apiUrl.configSave, buildForm(config))
}
