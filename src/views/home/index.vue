<template>
  <div class="container">
    home
  </div>
</template>
<script>
import {getHome} from "@/api/home"
export default {
  components: {
  },
  data() {
    return {
    };
  },
  mounted() {
    // 初始化
    this.getData();
  },
  methods: {
    // 获取首页各种数据
    async getData(){
      const res = await getHome()
    }
  },
};
</script>

<style lang="scss" scoped>
.container {
  padding: 16px;
  box-sizing: border-box;
  background-color: rgb(240, 242, 245);
  position: relative;
}
</style>