import request from "@/utils/request";
import {BASE} from "./config";

// 获取指定时间的home图标页面
export function getHome(data){
    return request({
        url:`${BASE}/home/getHome`,
        method:'post',
        data
    })
}