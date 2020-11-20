// import { login, logout, getInfo } from '@/api/user'
import { login } from '@/api/login'
import { getToken, setToken, removeToken,getUserinfo, setUserinfo, removeUserinfo } from '@/utils/auth'
import { resetRouter } from '@/router'
import { Message } from 'element-ui'
import i18n from '@/lang'

const state = {
  token: getToken(),
  userinfo: getUserinfo()
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_USERINFO: (state,userinfo)=>{
    state.userInfo = userinfo
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password }).then(async (response) => {
        // 获取用户信息
        Message({
          message: i18n.t("login.loginSuccess"),
          type: 'success'
        })
        const userinfo = response;
        // 保存token
        commit('SET_TOKEN', userinfo.token)
        // 保存用户信息
        commit('SET_USERINFO', userinfo)
        setToken(userinfo.token)
        setUserinfo(userinfo)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      try {
        resolve(state.userinfo)
      } catch (error){
        reject(error)
      }
    })
  },

  // user logout
  logout({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
        commit('SET_TOKEN', '')
        commit('SET_USERINFO', {})
        removeToken()
        resetRouter()
        removeUserinfo()
        resolve()
      }).catch(error => {
        reject(error)
      })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
