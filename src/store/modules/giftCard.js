const state = {
    giftDetail:JSON.parse(sessionStorage.getItem('giftDetail')||'{}')
}

const mutations = {
    SET_DETAIL:(state,info)=>{
        state.giftDetail = info;
    }
}

const actions = {
    setGiftDetail({commit},data){
        commit("SET_DETAIL",data);
        sessionStorage.setItem('giftDetail',JSON.stringify(data))
    }
}

export default {
    namespaced:true,
    state,
    mutations,
    actions
}