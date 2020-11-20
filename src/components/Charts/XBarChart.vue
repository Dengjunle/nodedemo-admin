<template>
    <div class="bar">
        <div class="bar-title">
            <span class="title-left">{{leftTitle}}</span><span class="title-center">{{title}}</span><span class="title-right">{{rightTitle}}</span>
        </div>
        <div class="bar-legend">
            <template v-for="(item,index) in chartData">
                <div class="legend-item" :key="index"><div class="pie" :style="`background-color:${colorPalette[index]}`"></div><span>{{item.name}} {{item.value}}/元</span></div>
            </template>
        </div>
        <div class="bar-chart">
            <template v-for="(item,index) in chartData">
                <div class="chart" :key="index" :style="`width:${item.value/total*100}%;background-color:${colorPalette[index]}`"></div>
            </template>
        </div>
    </div>
</template>

<script>
export default {
    props:{
        chartData:{
            type:Array,
            default:()=>{
                return []
            }
        },
        leftTitle:{
            type:String,
            default:""
        },
        title:{
            type:String,
            default:""
        },
        rightTitle:{
            type:String,
            default:""
        }
    },
    data() {
        return {
            total:0,
            colorPalette:[
                '#2ec7c9','#b6a2de','#5ab1ef','#ffb980','#d87a80',
                '#8d98b3','#e5cf0d','#97b552','#95706d','#dc69aa',
                '#07a2a4','#9a7fd1','#588dd5','#f5994e','#c05050',
                '#59678c','#c9ab00','#7eb00a','#6f5553','#c14089'
            ],
        }
    },
    mounted() {
        this.getTotal();
    },
    methods: {
        getTotal(){
            let chartData = this.chartData;
            let total = 0;
            for(let i=0;i<chartData.length;i++){
                total += chartData[i].value
            }
            this.total = total;
        }
    },
}
</script>

<style lang="scss" scoped>
.bar{
    .bar-title{
        margin-bottom: 20px;
        .title-left{
            font-size: 16px;
            margin-right: 15px;
        }
        .title-center{
            font-size: 32px;
        }
        .title-right{
            font-size: 16px;
        }
    }
    .bar-legend{
        margin-bottom: 20px;
        .legend-item{
            display: flex;
            align-items: center;
            margin-bottom: 10px;
            font-size: 12px;
            .pie{
                margin-right: 10px;
                width: 13px;
                height: 13px;
                border-radius: 999px;
                background-color: #cccccc;
            }
        }
    }
    .bar-chart{
        display: flex;
        margin-bottom: 20px;
        width: 100%;
        height: 20px;
        border: 1px solid #cccccc;
        .chart{
            height: 100%;
            background-color: #cccccc;
        }
    }
}
</style>