
const state = {
    user:JSON.parse(sessionStorage.getItem("account-user")||'{}'),
    merchant:JSON.parse(sessionStorage.getItem("account-merchant")||'{}'),
    admin:JSON.parse(sessionStorage.getItem("account-admin")||'{}'),
    employee:JSON.parse(sessionStorage.getItem("merchant-employee")||'{}')
}

const mutations = {
    SET_USER:(state,info)=>{
        state.user = info;
    },
    SET_MERCHANT:(state,info)=>{
        state.merchant = info
    },
    SET_ADMIN:(state,info)=>{
        state.admin = info
    },
    SET_EMPLOYEE:(state,info)=>{
        state.employee = info
    }
}

const actions = {
    setUser({commit},info){
        commit("SET_USER",info)
        sessionStorage.setItem("account-user",JSON.stringify(info))
    },
    setMerchant({commit},info){
        commit("SET_MERCHANT",info)
        sessionStorage.setItem("account-merchant",JSON.stringify(info))
    },
    setAdmin({commit},info){
        commit("SET_ADMIN",info)
        sessionStorage.setItem("account-admin",JSON.stringify(info))
    },
    setEmployee({commit},info){
        commit("SET_EMPLOYEE",info)
        sessionStorage.setItem("merchant-employee",JSON.stringify(info))
    }
}

export default {
    namespaced:true,
    state,
    mutations,
    actions
}