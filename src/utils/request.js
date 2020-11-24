import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'
import { getLanguage } from '@/lang/index'
// create an axios instance
const service = axios.create({
  // baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url 测是mock的时候打开
  // withCredentials: true, // send cookies when cross-domain requests
  withCredentials: false, // 允许携带cookie
  timeout: 15000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent
    // 获取请求方式和请求体数据
    const { method,data } = config;
    // 处理post请求，将data对象转换成query参数格式字符串
    // if(method.toLowerCase()==='post'||method.toLowerCase()==='put'){
      if(!(data instanceof FormData)){
        config.headers = {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
        config.transformRequest = [function(data){
          // 对data进行任意转换处理
          return JSON.stringify(data)
        }]
      }else{
        config.headers = {
          'Accept': 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        }
      }
    // }else{
      // config.headers = {
      //   'Accept': 'application/json',
      //   'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      // }
    // }
    // 存在token则添加到请求头
    if (store.getters.token) {
      config.headers['Token'] = getToken()
      config.headers['Accept-Language'] = getLanguage()
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data

    // if the custom code is not 20000, it is judged as an error.
    if (res.code == 401) {
      Message({
        message: res.message || 'Error',
        type: 'error',
        duration: 5 * 1000
      })
      store.dispatch('user/logout')
      router.replace('/login')
      return Promise.reject(new Error(res.message || 'Error'))
    }else if (res.code !== 1200) {
      Message({
        message: res.message || 'Error',
        type: 'error',
        duration: 5 * 1000
      })
      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      return res.result
    }
  },
  error => {
    console.log('error',error)
    if(error.code=='ECONNABORTED'||error.message=='Network Error'||error.message.includes('timeout')){
      Message({
        message: this.$t('error.timeout'),
        type: 'error',
        duration: 5 * 1000
      })
      return Promise.reject(error)
    }
    switch (error.response.data.code){
      case 401:
        error.message = error.response.data.msg;
        store.dispatch('user/logout')
        router.replace('/login')
        break;
    }
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
