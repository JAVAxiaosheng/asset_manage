<template>
  <div class="box">
    <div id="main1"></div>
    <div id="main2"></div>
  </div>
  <div class="box">
    <div id="main3"></div>
    <div id="main4"></div>
    <el-form>
      <el-form-item style="margin-top: 20px;" class="btn">
        <el-button type="primary" @click="exportExcel" plain>
          <el-icon style="vertical-align: middle">
            <bottom/>
          </el-icon>
          <span style="vertical-align: middle">导出</span>
        </el-button>
      </el-form-item>
      <el-form-item style="margin-top: 20px;margin-left: -50px" class="select">
        <el-select v-model="dateValue" class="m-2" clearable filterable placeholder="请选择"
                   @change="getCountByDate" style="width: 150px">
          <el-option
              v-for="item in dateOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
          />
        </el-select>
      </el-form-item>
    </el-form>
  </div>

  <el-table :data="tableData" border stripe style="width: 100%;display: none" id="outExcel">
    <el-table-column prop="name" label="资产名称" min-width="100px"/>
    <el-table-column prop="value" label="使用率" min-width="80px">
      <template v-slot="props">
        {{ props.row.value }}%
      </template>
    </el-table-column>
  </el-table>

</template>

<script>
import * as echarts from 'echarts';
import outToExcel from "@/excel/outToExcel";
import moment from "moment";

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Home',
  data() {
    return {
      tableData: [],
      dateValue: '',
      dateOptions: [],
    };
  },
  mounted() {
    this.getDateOptions();
    this.getCountByDate();
    this.getSingleAssetsRepairRateData();
    this.getSingleAssetsRateData();
    this.getCountByUserData();

  },
  methods: {
    getDateOptions() {
      let nowDate = moment(new Date().getTime()).format("YYYY-MM-DD");
      let yesterdayDate = moment(new Date().getTime() - (24 * 60 * 60 * 1000)).format("YYYY-MM-DD");
      let lastDate = moment(new Date().getTime() - (24 * 60 * 60 * 1000 * 2)).format("YYYY-MM-DD");
      this.dateOptions.push({
        label: nowDate,
        value: nowDate
      }, {
        label: yesterdayDate,
        value: yesterdayDate
      }, {
        label: lastDate,
        value: lastDate
      });
    },
    exportExcel() {
      outToExcel.exportExcel("资产使用率.xlsx", "#outExcel")
      // outToExcel.exportExcel("资产使用率.xlsx", "#outExcel");
    },
    figure1(id, data) {
      // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(document.getElementById(id));
      // 绘制图表
      myChart.setOption({
        dataset: {
          source: data

        },
        title: {
          text: '资产使用次数（天）',
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
    figure2(id, data) {
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
    figure3(id, data) {
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
            data: data,
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
    figure4(id, xAxisData, series) {
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
          top: 'bottom'
          // data: ['员工', '资产使用', '资产使用']
        },
        xAxis: [
          {
            type: 'category',
            data: xAxisData,
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
            max: 20,
            interval: 4,
          },
          {
            type: 'value',
            name: '资产使用',
            min: 0,
            max: 40,
            interval: 8,
          },

        ],
        series,
      });
    },
    getCountByDate() {
      let params = {};
      if (this.dateValue !== '') {
        params['out_time'] = this.dateValue;
      }
      this.$http.get('api/inout_record/count_by_date', {params}).then(resp => {
        let apiData = resp.data;
        console.log(apiData.data);
        this.figure1("main1", apiData.data)
      })
    }
    ,
    getSingleAssetsRateData() {
      this.$http.get('api/inout_record/inout_count').then(resp => {
        let apiData = resp.data;
        console.log(apiData);
        this.figure3("main3", apiData.data);
        var total = 0;
        for (let i = 0; i < apiData.data.length; i++) {
          total = total + apiData.data[i].value;
        }
        for (let i = 0; i < apiData.data.length; i++) {
          apiData.data[i].value = (apiData.data[i].value / total * 100).toFixed(2);
        }
        this.tableData = apiData.data;

      })
    },
    getSingleAssetsRepairRateData() {
      this.$http.get('api/repair_record/repair_count').then(resp => {
        let apiData = resp.data
        this.figure2("main2", apiData.data);
      })
    },
    getCountByUserData() {
      this.$http.get('api/inout_record/count_by_user').then(resp => {
        let apiData = resp.data;

        for (let i = 0; i < apiData.data.items.length; i++) {
          apiData.data.items[i]['yAxisIndex'] = apiData.data.items[i]['yaxisIndex'];
          delete apiData.data.items[i]['yaxisIndex'];
        }
        // console.log(apiData);
        this.figure4("main4", apiData.data.employee_names, apiData.data.items);
      })
    },

  }


}
</script>

<style scoped>
.box {
  position: relative;
  width: 1300px;
  margin-left: -25px;
  background-color: #fff;
  text-align: center;
  display: flex;
}

#main1, #main2, #main3, #main4 {
  /*position: relative;*/
  padding: 10px;
  width: 700px;
  height: 350px;
  border-left: rgb(233, 238, 243) solid 30px;
  border-bottom: rgb(233, 238, 243) solid 10px;
}

.btn {
  position: absolute;
  top: -10px;
  left: 520px;
  z-index: 10;
}

.select {
  position: absolute;
  top: -390px;
  left: 520px;
}


</style>


