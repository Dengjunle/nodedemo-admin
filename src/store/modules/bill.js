const state = {
    billDetail:JSON.parse(sessionStorage.getItem('billDetail')||'{}')
}

const mutations = {
    SET_DETAIL:(state,info)=>{
        state.billDetail = info;
    }
}

const actions = {
    setBillDetail({commit},data){
        commit("SET_DETAIL",data);
        sessionStorage.setItem('billDetail',JSON.stringify(data))
    }
}

export default {
    namespaced:true,
    state,
    mutations,
    actions
}