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
    return {};
  },

  mounted() {
    this.figure1("main1");
    this.figure2("main2");
    this.figure3("main3");
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
    figure2(id) {
      // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(document.getElementById(id));
      // 绘制图表
      myChart.setOption({
        legend: {
          top: 'bottom'
        },
        title: {
          text: 'Referer of a Website',
          left: 'center'
        },
        series: [
          {
            name: 'Nightingale Chart',
            type: 'pie',
            radius: [20, 100],
            center: ['50%', '50%'],
            roseType: 'area',
            itemStyle: {
              borderRadius: 5
            },
            data: [
              {value: 40, name: 'rose 1'},
              {value: 38, name: 'rose 2'},
              {value: 32, name: 'rose 3'},
              {value: 30, name: 'rose 4'},
              {value: 28, name: 'rose 5'},
              {value: 26, name: 'rose 6'},
              {value: 22, name: 'rose 7'},
              {value: 18, name: 'rose 8'}
            ]
          }
        ]
      });
    },
    figure3(id) {
      // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(document.getElementById(id));
      // 绘制图表
      myChart.setOption({
        title: {
          text: 'Referer of a Website',
          left: 'center'
        },
        tooltip: {
          trigger: 'item'
        },
        legend: {
          orient: 'vertical',
          left: 'left'
        },
        series: [
          {
            name: 'Access From',
            type: 'pie',
            radius: '50%',
            data: [
              {value: 1048, name: 'Search Engine'},
              {value: 735, name: 'Direct'},
              {value: 580, name: 'Email'},
              {value: 484, name: 'Union Ads'},
              {value: 300, name: 'Video Ads'}
            ],
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
    figure4(id) {
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
        title: {
          text: 'Referer of a Website',
          left: 'center'
        },
        legend: {
          data: ['Evaporation', 'Precipitation', 'Temperature']
        },
        xAxis: [
          {
            type: 'category',
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            axisPointer: {
              type: 'shadow'
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: 'Precipitation',
            min: 0,
            max: 250,
            interval: 50,
            axisLabel: {
              formatter: '{value} ml'
            }
          },
          {
            type: 'value',
            name: 'Temperature',
            min: 0,
            max: 25,
            interval: 5,
            axisLabel: {
              formatter: '{value} °C'
            }
          }
        ],
        series: [
          {
            // name: 'Evaporation',
            type: 'bar',
            tooltip: {
              valueFormatter: function (value) {
                return value + ' ml';
              }
            },
            data: [
              2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3
            ]
          },
          {
            // name: 'Precipitation',
            type: 'bar',
            tooltip: {
              valueFormatter: function (value) {
                return value + ' ml';
              }
            },
            data: [
              2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3
            ]
          },
          {
            // name: 'Temperature',
            type: 'line',
            yAxisIndex: 1,
            tooltip: {
              valueFormatter: function (value) {
                return value + ' °C';
              }
            },
            data: [2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3, 23.4, 23.0, 16.5, 12.0, 6.2]
          }
        ]
      });
    },
  }
}
</script>

<style scoped>
.box {
  width: 1100px;
  margin-left: 60px;
  background-color: #fff;
  text-align: center;
  display: flex;
}

#main1, #main2, #main3, #main4 {
  position: relative;
  padding: 10px;
  width: 500px;
  height: 350px;
  border-left: rgb(233, 238, 243) solid 30px;
  border-bottom: rgb(233, 238, 243) solid 10px;
}


</style>


