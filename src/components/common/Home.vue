<template>
  <div class="box">
    <div id="main1"></div>
    <div id="main2"></div>
  </div>
  <div class="box">
    <div id="main3"></div>
    <div id="main4"></div>
  </div>

</template>

<script>
import * as echarts from 'echarts';


export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Home',
  data() {
    return {

    };
  },

  mounted() {
    this.getSingleAssetsRepairRateData();
    this.getSingleAssetsRateData();
    this.getCountByUserData();
    this.figure1("main1");
    this.figure2("main2");

    this.figure4("main4");
  },
  methods: {
    figure1(id) {
      // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(document.getElementById(id));
      // 绘制图表
      myChart.setOption({
        dataset: {
          source: [
            ['score', 'amount', 'product'],
            [89.3, 58212, 'Matcha Latte'],
            [57.1, 78254, 'Milk Tea'],
            [74.4, 41032, 'Cheese Cocoa'],
            [50.1, 12755, 'Cheese Brownie'],
            [89.7, 20145, 'Matcha Cocoa'],
            [68.1, 79146, 'Tea'],
            [19.6, 91852, 'Orange Juice'],
            [10.6, 101852, 'Lemon Juice'],
            [32.7, 20112, 'Walnut Brownie']
          ]
        },
        title: {
          text: 'Referer of a Website',
          left: 'center'
        },
        grid: {containLabel: true},
        xAxis: {name: 'amount'},
        yAxis: {type: 'category'},
        visualMap: {
          orient: 'horizontal',
          left: 'center',
          min: 10,
          max: 100,
          text: ['High Score', 'Low Score'],
          dimension: 0,
          inRange: {
            color: ['#65B581', '#FFCE34', '#FD665F']
          }
        },
        series: [
          {
            type: 'bar',
            encode: {
              x: 'amount',
              y: 'product'
            }
          }
        ]
      });
    },
    figure2(id,data) {
      // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(document.getElementById(id));
      // 绘制图表
      myChart.setOption({
        legend: {
          top: 'bottom'
        },
        title: {
          text: '单个资产维修率',
          left: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        series: [
          {
            name: '维修率',
            type: 'pie',
            radius: [20, 100],
            center: ['50%', '50%'],
            roseType: 'area',
            itemStyle: {
              borderRadius: 5
            },
            data: data
          }
        ]
      });
    },
    figure3(id,data) {
      // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(document.getElementById(id));
      // 绘制图表
      myChart.setOption({
        title: {
          text: '单个资产使用率',
          left: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          left: 'left'
        },
        series: [
          {
            name: '使用率',
            type: 'pie',
            radius: '65%',
            data:data,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      });
    },
    figure4(id,xAxisData,series) {
      // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(document.getElementById(id));
      // 绘制图表
      myChart.setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            crossStyle: {
              color: '#999'
            }
          }
        },

        legend: {
          // data: ['员工', '资产使用', '资产使用']
        },
        xAxis: [
          {
            type: 'category',
            data:xAxisData,
            axisPointer: {
              type: 'shadow'
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '资产使用',
            min: 0,
            max: 25,
            interval: 5,
          },
          {
            type: 'value',
            name: '资产使用',
            min: 0,
            max: 50,
            interval: 10,
          },
        ],
        series,
      });
    },
    getSingleAssetsRateData() {
      this.$http.get('api/inout_record/inout_count').then(resp => {
       let apiData=resp.data
        this.figure3("main3",apiData.data);
      })
    },
    getSingleAssetsRepairRateData() {
      this.$http.get('api/repair_record/repair_count').then(resp => {
        let apiData=resp.data
        this.figure2("main2",apiData.data);
      })
    },
    getCountByUserData() {
      this.$http.get('api/inout_record/count_by_user').then(resp => {
        let apiData=resp.data;
        // console.log(apiData);
        for (let i = 0; i < apiData.data.items.length; i++) {
          apiData.data.items[i]['yAxisIndex']=apiData.data.items[i]['yaxisIndex'];
          delete apiData.data.items[i]['yaxisIndex'];
        }
        this.figure4("main4",apiData.data.employee_names,apiData.data.items);
      })
    },
  }


}
</script>

<style scoped>
.box {
  width: 1300px;
  margin-left: -25px;
  background-color: #fff;
  text-align: center;
  display: flex;
}

#main1, #main2, #main3, #main4 {
  position: relative;
  padding: 10px;
  width: 700px;
  height: 350px;
  border-left: rgb(233, 238, 243) solid 30px;
  border-bottom: rgb(233, 238, 243) solid 10px;
}


</style>


