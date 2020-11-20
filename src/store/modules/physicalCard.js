const state = {
    physicalDetail:JSON.parse(sessionStorage.getItem('physicalDetail')||'{}')
}

const mutations = {
    SET_DETAIL:(state,info)=>{
        state.physicalDetail = info;
    }
}

const actions = {
    setPhysicalDetail({commit},data){
        commit("SET_DETAIL",data);
        sessionStorage.setItem('physicalDetail',JSON.stringify(data))
    }
}

export default {
    namespaced:true,
    state,
    mutations,
    actions
}