import request from "@/utils/request";
import {BASE} from "./config";

// 上传图片
export function upload(data){
    return request({
        url:`${BASE}/upload`,
        method:'post',
        data
    })
}