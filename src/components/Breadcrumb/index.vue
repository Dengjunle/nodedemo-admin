<template>
<div v-if="levelList.length" class="breadcrumb">
  <el-breadcrumb  separator-class="el-icon-arrow-right" class="app-breadcrumb" separator="/">
    <transition-group name="breadcrumb">
      <el-breadcrumb-item v-for="(item,index) in levelList" :key="item.path">
        <span v-if="item.redirect==='noRedirect'||index==levelList.length-1" class="no-redirect">{{ item.meta.title }}</span>
        <a v-else @click.prevent="handleLink(item)">{{ item.meta.title }}</a>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</div>
</template>

<script>
import pathToRegexp from 'path-to-regexp'
import {constantRoutes} from "@/router"
export default {
  data() {
    return {
      levelList: null
    }
  },
  watch: {
    $route(route) {
      // if you go to the redirect page, do not update the breadcrumbs
      if (route.path.startsWith('/redirect/')) {
        return
      }
      this.getBreadcrumb()
    }
  },
  created() {
    this.getBreadcrumb()
  },
  methods: {
    getRoutes(routes,arr=[]){
      let levelList = [];
      for(let i=0;i<routes.length;i++){
        if(routes[i].children){
          let arrRoute = this.getRoutes(routes[i].children,arr);
          levelList.push(...arrRoute);
        }else{
          for(let j=0;j<arr.length;j++){
            if(routes[i].name==arr[j]){
              levelList.push(routes[i])
            }
          }
        }
      }
      return levelList;
    },
    getBreadcrumb() {
      // only show routes with meta.title
      // let matched = this.$route.matched.filter(item => item.meta && item.meta.title)
      let matched = this.$route
      this.levelList = this.getRoutes(constantRoutes,matched.meta.breadcrumb)
      // const first = matched[0]
      // if (!this.isDashboard(first)) {
      //   matched = [{ path: '/home', meta: { title: 'Home' },parent:{path:'/home'}}].concat(matched)
      // }
      // this.levelList = matched.filter(item => item.meta && item.meta.title && item.meta.breadcrumb !== false)
    },
    isDashboard(route) {
      const name = route && route.name
      if (!name) {
        return false
      }
      return name.trim().toLocaleLowerCase() === 'home'.toLocaleLowerCase()
    },
    pathCompile(path) {
      // To solve this problem https://github.com/PanJiaChen/vue-element-admin/issues/561
      const { params } = this.$route
      var toPath = pathToRegexp.compile(path)
      return toPath(params)
    },
    handleLink(item) {
      // const { redirect, path } = item
      // if (redirect) {
      //   this.$router.push(redirect)
      //   return
      // }
      this.$router.push(item.meta.path)
    }
  }
}
</script>

<style lang="scss" scoped>
.breadcrumb{
    padding: 16px 16px 0;
    background-color: #f0f2f5;
    .app-breadcrumb{
      margin-left: 0 !important;
      padding-left: 8px;
      width: 100%;
      background-color: #ffffff;
    }
  }
.app-breadcrumb.el-breadcrumb {
  display: inline-block;
  font-size: 14px;
  line-height: 50px;
  margin-left: 8px;

  .no-redirect {
    color: #97a8be;
    cursor: text;
  }
}
</style>
