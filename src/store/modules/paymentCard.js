const state = {
    paymentDetail:JSON.parse(sessionStorage.getItem('paymentDetail')||'{}')
}

const mutations = {
    SET_DETAIL:(state,info)=>{
        state.paymentDetail = info;
    }
}

const actions = {
    setPaymentDetail({commit},data){
        commit("SET_DETAIL",data);
        sessionStorage.setItem('paymentDetail',JSON.stringify(data))
    }
}

export default {
    namespaced:true,
    state,
    mutations,
    actions
}