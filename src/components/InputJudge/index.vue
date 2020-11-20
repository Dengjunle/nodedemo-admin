<template>
  <el-autocomplete
    :value="valuedata"
    class="inline-input"
    @select="selectValue"
    @input="returnBackFn"
    @clear="returnBackFn"
    :fetch-suggestions="fetchSuggestions"
    :placeholder="placeholder"
    :trigger-on-focus="false"
  >
    <slot name="append" slot="append"></slot>
  </el-autocomplete>
</template>

<script>
export default {
  props: {
    inputValue: {
      type: String,
      default: ""
    },
    searchList: {
      type: Array,
      default: () => {
        return [{ value: "" }];
      }
    },
    placeholder: {
      type: String,
      default: ""
    },
    maxLength: {
      type: Number,
      default: 80
    },
    regular:{
      type:RegExp,
      default:()=>{
        return /^[\u0E00-\u0E7Fa-zA-Z0-9`~!@#$%^&*()_\-+=<>?:"{}|,.\/;'\\[\]· ]+$/
      }
    }
  },
  model: {
    prop: "inputValue",
    event: "returnBack"
  },
  data() {
    return {
      valuedata: ""
    };
  },
  watch: {
    inputValue(newValue, oldValue) {
      this.valuedata = this.inputValue;
    }
  },
  created() {this.valuedata = this.inputValue;},
  mounted() {this.valuedata = this.inputValue;},
  methods: {
    selectValue(e) {
      this.returnBackFn(e.value);
      this.$emit("blurChange",e)
    },
    returnBackFn(e) {
      let test2 = this.regular;
      if ((test2.test(e) || e.length == 0) && e.length <= this.maxLength) {
        this.valuedata = e;
        this.$emit("returnBack", this.valuedata);
      }
    },
    fetchSuggestions(queryString, cb) {
      var restaurants =
        this.searchList.length > 0 ? this.searchList : [{ value: "" }];
      var results = this.queryString(queryString, restaurants);
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    queryString(queryString, restaurants) {
      const result = queryString
        ? restaurants.filter(this.createFilter(queryString))
        : restaurants;
      return result;
    },
    createFilter(queryString) {
      return restaurant => {
        return (
          restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) ===
          0
        );
      };
    }
  }
};
</script>

<style lang="scss" scoped></style>
