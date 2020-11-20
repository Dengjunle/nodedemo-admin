<template>
  <div :class="{'hidden':hidden}" class="pagination-container">
    <el-pagination
      :background="background"
      :current-page.sync="currentPage"
      :page-size.sync="pageSize"
      :layout="device === 'mobile'?'prev, pager, next':layout"
      :page-sizes="pageSizes"
      :total="total"
      v-bind="$attrs"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    >
    <!-- 分页自定义solt -->
    <span class="el-pagination__sizes">
      <el-select
        :value="internalPageSize"
        :popperClass="popperClass || ''"
        size="mini"
        @change="handleChange">
            <el-option
            v-for=" item in pageSizes"
            :key="item"
              :value="item"
              :label="item">
            </el-option>
      </el-select>
      <span>{{$t('el.pagination.pagesize')}}</span>
    </span>
    </el-pagination>
   <el-pagination
      :background="background"
      :current-page.sync="currentPage"
      :page-size.sync="pageSize"
      :layout="device === 'mobile'?'':'slot'"
      :page-sizes="pageSizes"
      :total="total"
      v-bind="$attrs"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    >
    <!-- 分页自定义solt -->
     <span class="el-pagination__jump">
      {{$t('el.pagination.goto') }}
      <el-input
        class="el-pagination__editor is-in-pagination"
        :value="pages"
        @input="onChangeJump"
        @keyup.enter.native="handleKeyup"/>
        {{$t('el.pagination.pageClassifier') }}
    </span>
    </el-pagination>
  </div>
</template>

<script>
import { scrollTo } from '@/utils/scroll-to'
import { mapState } from 'vuex'
export default {
  name: 'Pagination',
  props: {
    total: {
      required: true,
      type: Number
    },
    page: {
      type: Number,
      default: 1
    },
    limit: {
      type: Number,
      default: 20
    },
    pageSizes: {
      type: Array,
      default() {
        return [10, 20, 30, 50]
      }
    },
    layout: {
      type: String,
      default: 'total, slot, prev, pager, next'
    },
    background: {
      type: Boolean,
      default: true
    },
    autoScroll: {
      type: Boolean,
      default: true
    },
    hidden: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapState({
      device: state => state.app.device
    }),
    currentPage: {
      get() {
        return this.page
      },
      set(val) {
        this.$emit('update:page', val)
      }
    },
    pageSize: {
      get() {
        return this.limit
      },
      set(val) {
        this.$emit('update:limit', val)
      }
    }
  },
  watch: {
    page(){
      this.pages = this.page;
    }
  },
  data(){
    return {
      internalPageSize:0,
      popperClass:"popperClass",
      pages:1
    }
  },
  mounted(){
    this.internalPageSize = this.limit
    this.pages = this.page
  },
  methods: {
    handleSizeChange(val) {
      this.$emit('pagination', { page: this.currentPage, limit: val })
      if (this.autoScroll) {
        scrollTo(0, 800)
      }
    },
    handleCurrentChange(val) {
      this.$emit('pagination', { page: val, limit: this.pageSize })
      if (this.autoScroll) {
        scrollTo(0, 800)
      }
    },
    handleChange(val) {
      if (val !== this.internalPageSize) {
        this.internalPageSize = val = parseInt(val, 10);
        if(this.currentPage>1&&this.total<this.internalPageSize){
          this.$emit('pagination', { page: 1, limit: val })
          return;
        }
        this.handleSizeChange(this.internalPageSize)
      }
    },
    // 按下enter键跳转页面
    handleKeyup({ keyCode, target }) {
      // Chrome, Safari, Firefox triggers change event on Enter
      // Hack for IE: https://github.com/ElemeFE/element/issues/11710
      // Drop this method when we no longer supports IE
      if (keyCode === 13) {
        this.handlePageChange(target.value);
      }
    },
    // 页面跳转变化
    handlePageChange(value) {
      value = value*1;
      if((value>1&&value>Math.ceil(this.total/this.internalPageSize))||!value){
        this.pages = 1;
        this.$emit('pagination', { page: 1, limit:  this.pageSize })
        return;
      }
      this.$emit('pagination', { page: value, limit: this.pageSize })
      if (this.autoScroll) {
        scrollTo(0, 800)
      }
    },
    // 页面跳转输入的值监听
    onChangeJump(value){
       if (value >= 0&&value ) {
        let test1 = /^[0-9]+$/;
        let test2 = /^''$/;
        if (test1.test(value)) {
            this.pages = value;
        }else if(test2.test(value)){
            this.pages = value;
        }
      }else if (!value){
        this.pages = value;
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.pagination-container {
  background: #fff;
  padding: 32px 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.pagination-container.hidden {
  display: none;
}
::v-deep .el-input{
  width: 60px;
}
</style>
