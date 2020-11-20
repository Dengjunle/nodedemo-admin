<template>
  <div :class="className" style="padding-top:20px" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from './mixins/resize'

const animationDuration = 6000

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
    chartData: {
      type: Array,
      required: true
    },
    xData:{
      type:Array,
      required:true
    },
    yTitle:{
      type:String,
      default:''
    },
    title:{
      type:String,
      default:''
    },
    tooltipFormatter:{
      type:Function,
      default:()=>{
        return ''
      }
    },
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
      this.setOptions()
    },
    setOptions() {
      this.chart.setOption({
        title:{
          text:this.title,
          left:'left'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          },
          formatter: (params) =>{
            return this.tooltipFormatter(params)
          }
        },
        legend: {
          zlevel:999,
          right: '2%',
          orient:'vertical',
          icon: "circle",
          formatter:(name)=>{
            return this.legendFormatter(name)
          }
        },
        grid: {
          left: '2%',
          right: '2%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [{
          type: 'category',
          data: this.xData,
          axisTick: {
            alignWithLabel: true
          }
        }],
        yAxis: [{
          type: 'value',
          axisTick: {
            show: false
          }
        }],
        series: this.chartData.map((item)=>{
          return {
            name: item.name,
            type: 'bar',
            barWidth: (100/(this.chartData.length+2))+'%',
            barGap: 0,
            data: item.data,
            animationDuration
          }
        })
      })
    }
  }
}
</script>
