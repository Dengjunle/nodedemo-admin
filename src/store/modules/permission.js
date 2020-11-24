import { asyncRoutes, constantRoutes } from '@/router'

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}

/**
根据后台name权限过滤路由
*/
export function filterServeAsyncRoutes(routes, rolesview) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasServePermission(rolesview, tmp)) {
      if (tmp.children) {
        tmp.children = filterServeAsyncRoutes(tmp.children, rolesview)
      }
      res.push(tmp)
    }
  })

  return res
}
function hasServePermission(rolesview, route) {
  if (route.name) {
    return rolesview.includes(route.name)
  } else {
    return true
  }
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  },
  SET_CLEAR_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = routes
  }
}

const actions = {
  // generateRoutes({ commit }, roles) {
  //   return new Promise(resolve => {
  //     let accessedRoutes
  //     accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
  //     commit('SET_ROUTES', accessedRoutes)
  //     resolve(accessedRoutes)
  //   })
  // },
  generateRoutes({ commit }, data) {
    return new Promise(resolve => {
      const roles = data;
      // const {roles} =data
      // const { routesMap } = data
      // const { rolesView } = data
      // const rolesView = ['Permission','PagePermission']
      let accessedRoutes
        // if (roles.includes('admin')) {
        //   accessedRoutes = asyncRoutes
        // } else {
          accessedRoutes = filterServeAsyncRoutes(asyncRoutes, roles)
        // }
      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
    })
  },
  clearRoutes({ commit }, roles) {
    console.log("clear")
      commit('SET_CLEAR_ROUTES', [])
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
