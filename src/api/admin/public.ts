import { unescape } from "lodash"

export interface OpResult {
    data: boolean
}

const eq = "="
const and = "&"

export function buildIdForm(id: any) {
    const formData = new FormData()
    formData.append("id", id)
    return formData;
}

const l = "["
const r = "]"



/* eslint-disable */
function form(parentKey: string, value: any, index: number, formData: FormData, empty: boolean) {
    if (value||value ==0) {
        if (value instanceof Array) {
            value.forEach((v: any, index: number) => {
                formData = form(parentKey + l + index + r, v, index, formData, empty)
            })
        } else if (typeof value === "object") {
            Object.keys(value).forEach(k => {
                if(parentKey){
                    formData = form(parentKey + l + k + r, value[k], index, formData, empty)
                }else{
                    formData = form(k, value[k], index, formData, empty)
                }
            })
        } else {
            formData.append(parentKey, value)
        }
    }
    return formData
}


export function buildForm(params: any, empty = false) {
    const formData: FormData = new FormData()
    return form("", params, -1, formData, empty)
}

export function JoinParams(params: any) {
    if (params == undefined) {
        return "?1=1"
    }
    let str = '?'
    Object.keys(params).forEach(key => {
        if (params[key] || params[key] === 0) {
            str += key + eq + params[key] + and
        }
    })
    return str.length > 1 ? str.substring(0, str.length - 1) : str
}


export function JoinArrary(params: any) {
    return array("", params, -1, "")
}

function array(parentKey: string, value: any, index: number, formData: string) {
    if (value) {
        if (value instanceof Array) {
            value.forEach((v: any, index: number) => {
                formData = array(parentKey + l + index + r, v, index, formData)
            })
        } else if (typeof value === "object") {
            Object.keys(value).forEach(k => {
                if(parentKey){
                    formData = array(parentKey + l + k + r, value[k], index, formData)
                }else{
                    formData = array(k, value[k], index, formData)
                }
            })
        } else {
            formData += and + parentKey + eq + value
        }
    }
    return formData
}

export function formatTimestamp(timestamp: number): string {
    const date = new Date(timestamp * 1000); // 乘以1000以将秒转换为毫秒
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // 月份从0开始，需要加1，然后用padStart补零
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}


export function formatYYYYMMDD(timestamp: number): string {
    const date = new Date(timestamp * 1000); // 乘以1000以将秒转换为毫秒
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // 月份从0开始，需要加1，然后用padStart补零
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}



export function parseDateStringToTimestamp(dateString: string) {
    const dateParts = dateString.split(" ");
    const date = dateParts[0];
    const time = dateParts[1];

    const [year, month, day] = date.split("-");
    const [hours, minutes, seconds] = time.split(":");

    // @ts-ignore
    const timestamp = new Date(Number(year), month - 1, day, hours, minutes, seconds).getTime() / 1000; // 除以1000以将毫秒转换为秒

    return timestamp;
}


export function calculateDaysDifference(targetTimestamp: number) {
    targetTimestamp = targetTimestamp * 1000
    const currentTimestamp = Date.now();

    // 如果传入时间小于等于当前时间，返回零
    if (targetTimestamp <= currentTimestamp) {
        return 0;
    }

    // 计算间隔天数
    const millisecondsPerDay = 24 * 60 * 60 * 1000;
    const timeDifference = targetTimestamp - currentTimestamp;
    const daysDifference = Math.ceil(timeDifference / millisecondsPerDay);
    return daysDifference;
}

