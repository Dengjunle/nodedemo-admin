import request from "@/utils/request";
import {BASE} from "./config";

// 修改用户信息
export function updateUser(data){
    return request({
        url:`${BASE}/admin/users/userinfo`,
        method:'post',
        data
    })
}

// 获取身份列表
export function getRole(params){
    return request({
        url:`${BASE}/admin/users/roles`,
        method:'get',
        params
    })
}


// 获取用户列表
export function getUserList(params){
    return request({
        url:`${BASE}/admin/users/userlist`,
        method:'get',
        params
    })
}

// 编辑用户信息
export function editUser(data){
    return request({
        url:`${BASE}/admin/users/edit`,
        method:'put',
        data
    })
}

// 删除用户信息
export function delUser(data){
    return request({
        url:`${BASE}/admin/users/delete`,
        method:'delete',
        data
    })
}

// 添加用户信息
export function addUser(data){
    return request({
        url:`${BASE}/admin/users/add`,
        method:'post',
        data
    })
}

// 获取权限列表
export function getAuthList(params){
    return request({
        url:`${BASE}/admin/users/auth`,
        method:'get',
        params
    })
}

// 删除权限信息
export function delAuth(data){
    return request({
        url:`${BASE}/admin/users/auth`,
        method:'delete',
        data
    })
}

// 添加/编辑权限信息
export function addUpdateAuth(data){
    return request({
        url:`${BASE}/admin/users/auth`,
        method:'post',
        data
    })
}

// 获取角色列表
export function getRoleList(params){
    return request({
        url:`${BASE}/admin/users/role`,
        method:'get',
        params
    })
}

// 删除角色信息
export function delRole(data){
    return request({
        url:`${BASE}/admin/users/role`,
        method:'delete',
        data
    })
}

// 添加/编辑角色信息
export function addUpdateRole(data){
    return request({
        url:`${BASE}/admin/users/role`,
        method:'post',
        data
    })
}

// 获取菜单列表
export function getMenuList(params){
    return request({
        url:`${BASE}/admin/users/menu`,
        method:'get',
        params
    })
}

// 删除菜单信息
export function delMenu(data){
    return request({
        url:`${BASE}/admin/users/menu`,
        method:'delete',
        data
    })
}

// 添加/编辑菜单信息
export function addUpdateMenu(data){
    return request({
        url:`${BASE}/admin/users/menu`,
        method:'post',
        data
    })
}