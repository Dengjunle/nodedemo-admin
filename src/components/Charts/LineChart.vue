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
    autoResize: {
      type: Boolean,
      default: true
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
      this.setOptions(this.chartData,this.xData)
    },
    setOptions(chartData = []) {
      this.chart.setOption({
        title:{
          text:this.title,
          left:'left'
        },
        xAxis: {
          data:this.xData,
          boundaryGap: false,
          axisTick: {
            show: false
          }
        },
        grid: {
          left: 0,
          right:20,
          bottom: 20,
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          },
          padding: [5, 10],
          formatter: (params) =>{
            return this.tooltipFormatter(params)
          }
        },
        yAxis: {
          name:this.yTitle,
          boundaryGap: false,
          axisTick: {
            show: false
          }
        },
        legend: {
          zlevel:999,
          right: '2%',
          icon: "circle",
          orient:'vertical',
          formatter:()=>{
            return this.legendFormatter()
          }
        },
        series: [
          {
          name: 'expected', 
          itemStyle: {
            normal: {
              color: '#FF005A',
              lineStyle: {
                color: '#FF005A',
                width: 2
              },
              areaStyle: {
                color: '#f3f8ff',
                opacity:0.5
              }
            }
          },
          smooth: true,
          type: 'line',
          data: chartData,
          animationDuration: 2800,
          animationEasing: 'quadraticOut'
        }
        ]
      })
    }
  }
}
</script>
