import axios from "axios";
import {buildForm, OpResult} from "@/api/admin/public";
import {apiUrl} from "@/api/api";

export interface  SitePlan {
    id: number;
    group_id: number;
    transfer_enable: number;
    name: string;
    speed_limit: number | null;
    show: number;
    sort: number | null;
    renew: number;
    content: string;
    month_price: number;
    quarter_price: number | null;
    half_year_price: number | null;
    year_price: number | null;
    two_year_price: number | null;
    three_year_price: number | null;
    onetime_price: number;
    reset_price: number | null;
    reset_traffic_method: string | null;
    capacity_limit: number | null;
    created_at: number;
    updated_at: number;
}


export interface Invite {
    invite_force: number;
    invite_commission: string;
    invite_force_present: number;
    complimentary_packages: number;
    complimentary_package_duration: number;
    invite_gen_limit: string;
    invite_never_expire: string;
    commission_first_time_enable: string;
    commission_auto_check_enable: string;
    commission_withdraw_limit: string;
    commission_withdraw_method: string[];
    withdraw_close_enable: string;
    commission_distribution_enable: string;
    commission_distribution_l1: string;
    commission_distribution_l2: string;
    commission_distribution_l3: string;
    plans: SitePlan[];
}

export interface Site {
    logo: string;
    force_https: number;
    stop_register: number;
    app_name: string;
    app_description: string;
    app_url: string;
    subscribe_url: string;
    try_out_plan_id: number;
    try_out_hour: number;
    tos_url: string;
    currency: string;
    currency_symbol: string;
}

export interface Subscribe {
    plan_change_enable: number;
    reset_traffic_method: number;
    surplus_enable: number;
    new_order_event_id: number;
    renew_order_event_id: number;
    change_order_event_id: number;
    show_info_to_server_enable: number;
}

export interface Frontend {
    frontend_theme: string;
    frontend_theme_sidebar: string;
    frontend_theme_header: string;
    frontend_theme_color: string;
    frontend_background_url: string;
}

export interface Server {
    server_token: string;
    server_pull_interval: string;
    server_push_interval: string;
}

export interface Email {
    email_template: string;
    email_host: string;
    email_port: string;
    email_username: string;
    email_password: string;
    email_encryption: string;
    email_from_address: string;
}

export interface Telegram {
    telegram_bot_enable: number;
    telegram_bot_token: string;
    telegram_discuss_link: string;
}

export interface App {
    windows_version: string;
    windows_download_url: string;
    macos_version: string;
    macos_download_url: string;
    android_version: string;
    android_download_url: string;
}

export interface Safe {
    email_verify: number;
    safe_mode_enable: number;
    secure_path: string;
    email_whitelist_enable: number;
    email_whitelist_suffix: string[];
    email_gmail_limit_enable: string;
    recaptcha_enable: number;
    recaptcha_key: string;
    recaptcha_site_key: string;
    register_limit_by_ip_enable: number;
    register_limit_count: string;
    register_limit_expire: string;
    password_limit_enable: number;
    password_limit_count: string;
    password_limit_expire: string;
}

export interface Config {
    invite: Invite;
    site: Site;
    subscribe: Subscribe;
    frontend: Frontend;
    server: Server;
    email: Email;
    telegram: Telegram;
    app: App;
    safe: Safe;
}

export const defaultInvite: Invite = {
    invite_force: 0,
    invite_commission: '',
    invite_force_present: 0,
    complimentary_packages: undefined,
    complimentary_package_duration:0,
    invite_gen_limit: '',
    invite_never_expire: '',
    commission_first_time_enable: '',
    commission_auto_check_enable: '',
    commission_withdraw_limit: '',
    commission_withdraw_method: [],
    withdraw_close_enable: '',
    commission_distribution_enable: '',
    commission_distribution_l1: '',
    commission_distribution_l2: '',
    commission_distribution_l3: '',
    plans: [],
};

export const defaultSite: Site = {
    logo: '',
    force_https: 0,
    stop_register: 0,
    app_name: '',
    app_description: '',
    app_url: '',
    subscribe_url: '',
    try_out_plan_id: 0,
    try_out_hour: 0,
    tos_url: '',
    currency: '',
    currency_symbol: '',
};

export const defaultSubscribe: Subscribe = {
    plan_change_enable: 0,
    reset_traffic_method: 0,
    surplus_enable: 0,
    new_order_event_id: 0,
    renew_order_event_id: 0,
    change_order_event_id: 0,
    show_info_to_server_enable: 0,
};

export const defaultFrontend: Frontend = {
    frontend_theme: '',
    frontend_theme_sidebar: '',
    frontend_theme_header: '',
    frontend_theme_color: '',
    frontend_background_url: '',
};

export const defaultServer: Server = {
    server_token: '',
    server_pull_interval: '',
    server_push_interval: '',
};

export const defaultEmail: Email = {
    email_template: '',
    email_host: '',
    email_port: '',
    email_username: '',
    email_password: '',
    email_encryption: '',
    email_from_address: '',
};

export const defaultTelegram: Telegram = {
    telegram_bot_enable: 0,
    telegram_bot_token: '',
    telegram_discuss_link: '',
};

export const defaultApp: App = {
    windows_version: '',
    windows_download_url: '',
    macos_version: '',
    macos_download_url: '',
    android_version: '',
    android_download_url: '',
};

export const defaultSafe: Safe = {
    email_verify: 0,
    safe_mode_enable: 0,
    secure_path: '',
    email_whitelist_enable: 0,
    email_whitelist_suffix: [],
    email_gmail_limit_enable: '',
    recaptcha_enable: 0,
    recaptcha_key: '',
    recaptcha_site_key: '',
    register_limit_by_ip_enable: 0,
    register_limit_count: '',
    register_limit_expire: '',
    password_limit_enable: 0,
    password_limit_count: '',
    password_limit_expire: '',
};

export const defaultConfig: Config = {
    invite: defaultInvite,
    site: defaultSite,
    subscribe: defaultSubscribe,
    frontend: defaultFrontend,
    server: defaultServer,
    email: defaultEmail,
    telegram: defaultTelegram,
    app: defaultApp,
    safe: defaultSafe,
};


export interface Plan {
    id: number;
    group_id: number;
    transfer_enable: number;
    name: string;
    speed_limit: string;
    show: number;
    sort: string;
    renew: number;
    content: string;
    month_price: string;
    quarter_price: string;
    half_year_price: string;
    year_price: string;
    two_year_price: string;
    three_year_price: string;
    onetime_price: number;
    reset_price: string;
    reset_traffic_method: number;
    capacity_limit: string;
    created_at: number;
    updated_at: number;
    count: number;
}

export const defaultPlan: Plan = {
    id: 0,
    group_id: 0,
    transfer_enable: 0,
    name: '',
    speed_limit: '',
    show: 0,
    sort: '',
    renew: 0,
    content: '',
    month_price: '',
    quarter_price: '',
    half_year_price: '',
    year_price: '',
    two_year_price: '',
    three_year_price: '',
    onetime_price: 0,
    reset_price: '',
    reset_traffic_method: 0,
    capacity_limit: '',
    created_at: 0,
    updated_at: 0,
    count: 0,
};

export interface Result {
    data: boolean;
}

export interface ClearLog {
    data:boolean;
    logCount:boolean;
    mailLogCount:boolean;
}

export const queryConfig = () => {
    return axios.get<Config>(apiUrl.configFetch)
}

export const updateConfig = (config: any) => {
    return axios.post<OpResult>(apiUrl.configSave, buildForm(config))
}

export const queryPlan = () => {
    return axios.get<Plan[]>(apiUrl.planFetch)
}

export const sendEmailTest = () => {
    return axios.post(apiUrl.sendEmailTest)
}


export const telegramWebhook = () => {
    return axios.post(apiUrl.telegramWebhook)
}

export const clearLog =()=>{
    return axios.post<ClearLog>(apiUrl.clearLog)
}
