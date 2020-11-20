<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from './mixins/resize'

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '360px'
    },
    // 数据
    chartData: {
      type: Array,
      required: true
    },
    // 标题
    title:{
      default:()=>{
        return []
      }
    },
    // 小标题
    subtext:{
      type:String,
      default:''
    },
    // 是否显示标签在环形上
    centerLabelShow:{
      type:Boolean,
      default:false
    },
    // 是否鼠标指向去的时候显示百分比在环形上
    emphasisLabelShow:{
      type:Boolean,
      default:false
    },
    // legend距离右边的距离
    legendRight:{
      type:String,
      default:null
    },
    // legend距离底部的距离
    legendBottom:{
      type:String,
      default:null
    },
    // legend距离顶部的距离
    legendTop:{
      type:String,
      default:null
    },
    // legend距离左部的距离
    legendLeft:{
      type:String,
      default:null
    },
    // legend图例列表的布局朝向。
    legendOrient:{
      type:String,
      default:'horizontal'
    },
    // 
    seriesCenter:{
      type: Array,
      default:()=>{
        return ['50%', '60%']
      }
    },
    // tooltip提示内容自定义
    tooltipFormatter:{
      type:Function,
      default:()=>{
        return ''
      }
    },
    // legend显示自定义
    legendFormatter:{
      type:Function,
      default:()=>{
        return ''
      }
    }
  },
  data() {
    return {
      chart: null
    }
  },
  watch: {
    chartData: {
      deep: true,
      handler(val) {
        this.setOptions(val)
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart()
    })
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')
      this.setOptions();
    },
    setOptions() {
       this.chart.setOption({
        title:this.title,
        // 提示
        tooltip: {
          trigger: 'item',
          formatter:(params)=>{
            return this.tooltipFormatter(params)
          }
        },
        // 图例配置
        legend: {
          top: this.legendTop,
          left:this.legendLeft,
          right: this.legendRight,
          bottom:this.legendBottom,
          orient:this.legendOrient,
          data: this.chartData,
          icon: "circle",
          formatter:(obj)=>{
            return this.legendFormatter(obj)
          },
          selectedMode:false
        },
        series: [
          {
            name: 'WEEKLY WRITE ARTICLES',
            type: 'pie',
            radius: [60, 100],
            center: this.seriesCenter,
             label: {
                show: this.centerLabelShow,//显示标签在环形上
                position:'inner', //标签的位置
                formatter:'{d}%'
            },
            emphasis: {
                label: {
                    show: this.emphasisLabelShow,//鼠标指向去的时候显示百分比在环形上
                    fontSize: '14',
                    fontWeight: 'bold'
                }
            },
            labelLine: {
                show: false
            },
            data:this.chartData,
            animationEasing: 'cubicInOut',
            animationDuration: 2600
          }
        ]
      })
    }
  }
}
</script>
