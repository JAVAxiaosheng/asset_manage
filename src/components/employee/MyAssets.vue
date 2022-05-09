<template>
  <div>
    <!--    搜索-->
    <el-form :inline="true" :model="searchForm" class="demo-form-inline"
             style="background-color: #fdfdfe;margin-bottom: 15px">

      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="资产名称" style="margin-top: 20px">
            <el-select v-model="searchForm.property_name" class="m-2" clearable filterable placeholder="请选择"
                       style="width: 200px" @change="listMyRecord">
              <el-option
                  v-for="item in propertyNameOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="16">
          <el-form-item style="margin-top: 20px;margin-left: -900px">
            <el-button type="primary" @click="listMyRecord" round plain>
              <el-icon style="vertical-align: middle">
                <search/>
              </el-icon>
            </el-button>
          </el-form-item>
        </el-col>
      </el-row>


    </el-form>

    <!--    展示列表-->
    <el-table :data="tableData" border v-loading="loading" stripe style="width: 100%">
      <el-table-column prop="record_num" label="记录编号" min-width="120px" align="center">
        <template v-slot="props">
          {{
            props.row.record_num ? props.row.record_num.replace(/([A-Za-z0-9]{3})([A-Za-z0-9]{25})([A-Za-z0-9]{4})/, "$1****$3") : ""
          }}
          <el-tooltip
              class="box-item"
              effect="customized"
              content="点击记录编号"
              placement="top-start">
            <el-icon @click="copyRecordNum(props.row)" v-if="props.row.inout_state!==1">
              <document-copy/>
            </el-icon>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="property_num" label="资产编号" min-width="90px"/>
      <el-table-column align="center" prop="property_name" label="资产名称" min-width="90px"/>
      <el-table-column align="center" prop="employee_name" label="借用人" min-width="90px"/>
      <el-table-column align="center" prop="out_date" label="借出时间" min-width="115px">
        <template v-slot="props">
          <el-tag type="warning">{{ formatDate(props.row.out_date) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="归还时间" min-width="110px">
        <template v-slot="props">
          <el-tag v-if="props.row.inout_state === 1">{{ formatDate(props.row.back_date) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="当前状态" min-width="90px">
        <template v-slot="props">
          <el-tag type="success" v-if="props.row.inout_state === 1">已归还</el-tag>
          <el-tag type="warning" v-if="props.row.inout_state === 2">借用</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" width="110">
        <template v-slot="props">
          <el-button type="primary" plain v-if="props.row.inout_state === 2" @click="returnBack(props.row)">
            归还
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--    分页-->
    <el-pagination
        background
        class="pageInput"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        v-model:currentPage="pageNum"
        v-model:page-size="pageSize"
        :page-sizes="[5,10, 15, 20, 50]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        style="margin-top: 8px;float: right;background-color: #fdfdfe">
    </el-pagination>
  </div>
</template>

<script>
import Cookies from 'js-cookie'
import moment from "moment";
import {ElMessageBox} from "element-plus";

export default {
  name: "MyAssets",
  data() {
    return {
      searchForm: {
        property_name: ""
      },
      propertyNameOptions: [],
      loading: false,
      pageNum: 1,
      pageSize: 10,
      total: 0,
      tableData: [],
      employeeNum: '',
    }
  },
  mounted() {

    this.getEmployeeNum();
    setTimeout(()=>{
      this.listMyRecord();
      this.listPropertyName();
    },0)
  },
  methods: {
    // 格式化日期
    formatDate(time) {
      return moment(time * 1000).format("YYYY-MM-DD HH:mm");
    },
    // 复制记录编号
    copyRecordNum(row) {
      let input = document.createElement('input')
      input.value = row.record_num;
      document.body.appendChild(input)
      input.select()
      document.execCommand('copy')
      this.$message.success('复制成功')
      document.body.removeChild(input);
    },
    returnBack(row) {
      // console.log(row.id);
      ElMessageBox.confirm(
          '确定要归还该资产么?',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          }
      ).then(() => {
        let params = {
          id: row.id,
          inout_state: 1,
          back_time: Math.floor(new Date().getTime() / 1000)
        }
        this.$http.put('api/inout_record/update_inout_record', params).then(resp => {
          let apiData = resp.data;
          if (apiData.code === 0) {
            this.queryProStateId(row);
          } else {
            this.$message.error("接口错误，借用失败")
          }
        })
      })
    },
    queryProStateId(row) {
      let params = {
        property_num: row.property_num,
      };
      // 查询id通过编号
      this.$http.get('api/property_info/query_property', {params}).then((resp) => {
        console.log(resp);
        let apiData = resp.data;

        this.modifyProState(apiData.data[0].id)
      });

    },
    modifyProState(id) {
      let params = {
        id,
        property_state: 1,
      };
      this.$http.put('api/property_info/update_property', params).then((resp) => {
        let apiData = resp.data;
        if (apiData.code === 0) {
          this.$message.success("归还成功");
          this.listMyRecord();
        } else {
          this.$message.error("修改资产状态接口错误")
        }
      });
    },
    listMyRecord() {
      this.loading = true;
      let params = {
        page_num: this.pageNum,
        page_size: this.pageSize,
        employee_num: this.employeeNum
      };
      if (this.searchForm.property_name !== '') {
        params['property_num'] = this.searchForm.property_name
      }
      this.$http.get('api/inout_record/query_inout_record', {params}).then(resp => {
        let apiData = resp.data;
        if (apiData.code === 0) {
          setTimeout(() => {
            this.tableData = apiData.data;
            this.total = apiData.total;
            this.loading = false;
          }, 500);
        } else {
          this.loading = false;
          this.$message.error("查询记录接口错误")
        }
      })
    },
    listPropertyName() {
      let params = {
        page_num: this.pageNum,
        page_size: this.pageSize,
        employee_num: this.employeeNum
      };
      this.$http.get('api/inout_record/query_inout_record', {params}).then(resp => {
        let apiData = resp.data;
        let map = new Map();
        if (apiData.code === 0) {
          for (let i = 0; i < apiData.data.length; i++) {
            map.set(apiData.data[i].property_num, apiData.data[i].property_name);
          }

          for (let [k] of map) {
            this.propertyNameOptions.push({
              label: map.get(k),
              value: k
            });
          }

        } else {
          this.$message.error("查询记录接口错误")
        }
      })
    },
    getEmployeeNum() {
      let params = {
        employee_name: Cookies.get("user_name")
      };
      this.$http.get('api/employee/query_employee', {params}).then(resp => {
        let apiData = resp.data;
        if (apiData.code === 0) {
          this.employeeNum = apiData.data[0].employee_num;
          console.log(this.employeeNum)
        } else {
          this.$message.error("查询员工编号接口错误");
        }
      });
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.listMyRecord();
    },
    handleCurrentChange(val) {
      this.pageNum = val;
      this.listMyRecord();
    },
  }
}
</script>

<style scoped>

</style>