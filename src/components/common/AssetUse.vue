<template>
  <div>
    <div style="background-color: #fdfdfe;margin-bottom: 20px">
      <el-form :inline="true" :model="searchForm" class="demo-form-inline">
        <el-form-item label="资产名称" style="margin-top: 20px;float: left;margin-left: 50px">
          <el-input v-model="searchForm.propertyName" @change="search" style="width:200px"/>
        </el-form-item>
        <el-form-item style="margin-top: 20px;margin-left: -900px">
          <el-button type="primary" @click="search" round plain>
            <el-icon style="vertical-align: middle">
              <search/>
            </el-icon>
          </el-button>
        </el-form-item>
      </el-form>
    </div>

    <div style="background-color: #fdfdfe;" align="left">
    <span style="color: #e18484;font-size: 12px;margin-left: 20px"><b>*注：</b>
      本界面只展示可借用的资产</span>
    </div>
    <!-- 表格 -->
    <div>
      <el-table :data="tableData" border v-loading="loading" stripe style="width: 100%">
        <el-table-column prop="property_num" label="资产编号" min-width="80px" align="center">
          <template v-slot="props">
            <el-tag type="info">{{ props.row.property_num }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="property_model" label="资产型号" min-width="90px"/>
        <el-table-column align="center" prop="property_name" label="资产名称" min-width="100px">
          <template v-slot="props">
            <el-tag>{{ props.row.property_name }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="property_price" label="资产价格" min-width="115px">
          <template v-slot="props">
            <el-tag type="danger" round>{{ '￥' + formatMoney(props.row.property_price, 2) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="property_factory" label="生产厂商" min-width="90px"/>
        <el-table-column align="center" prop="create_date" label="入库时间" min-width="115px">
          <template v-slot="props">
            <el-tag type="warning">{{ formatDate(props.row.create_date) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="property_type" label="资产类别" min-width="90px"/>
        <el-table-column align="center" prop="property_state" label="资产状态" min-width="85px">
          <template v-slot="props">
            <el-tag type="success" v-if="props.row.property_state === 1">入库</el-tag>
            <el-tag type="warning" v-if="props.row.property_state === 2">借出</el-tag>
            <el-tag type="danger" v-if="props.row.property_state === 3">维修</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="150px">
          <template v-slot="props">
            <el-button type="warning" plain @click="propertyUse(props.row)">
              借用
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
          background
          class="pageInput"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          v-model:currentPage="pageNum"
          v-model:page-size="pageSize"
          :page-sizes="[5, 10, 15, 20, 50]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          style="margin-top: 8px;float: right;background-color: #fdfdfe">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import {ElMessageBox} from "element-plus";
import Cookies from 'js-cookie'

export default {
  name: "AssetUse",
  data() {
    return {
      tableData: [],
      loading: false,
      pageNum: 1,
      pageSize: 10,
      total: 0,
      searchForm: {
        propertyName: ''
      },
      employeeNum: '',
    };
  },
  mounted() {
    this.listPropertyInfo();
    this.getEmployeeNum();
  },
  methods: {
    formatDate(time) {
      return moment(time * 1000).format("YYYY-MM-DD");
    },
    formatMoney(s, n) {
      n = n > 0 && n <= 20 ? n : 2;
      s = parseFloat((s + "").replace(/[^\d.-]/g, "")).toFixed(n) + "";
      let l = s.split(".")[0].split("").reverse(), r = s.split(".")[1];
      let t = "";
      for (let i = 0; i < l.length; i++) {
        t += l[i] + ((i + 1) % 3 === 0 && (i + 1) !== l.length ? "," : "");
      }
      return t.split("").reverse().join("") + "." + r;
    },
    search() {
      this.listPropertyInfo();
    },
    listPropertyInfo() {
      this.loading = true;
      let params = {
        page_num: this.pageNum,
        page_size: this.pageSize,
        property_state: 1
      };
      if (this.searchForm.propertyName !== '') {
        params['property_name'] = this.searchForm.propertyName.trim();
      }
      this.$http.get('api/property_info/query_property', {params}).then(resp => {
        let apiData = resp.data;
        if (apiData.code === 0) {
          setTimeout(() => {
            this.tableData = apiData.data;
            this.total = apiData.total;
            this.loading = false;
          }, 500);
        } else {
          this.$message.error("查询列表接口错误");
          this.loading = false;
        }
      });
    },
    propertyUse(row) {
      ElMessageBox.confirm(
          '确定要借用该资产么?',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          }
      ).then(() => {
        let params = {
          property_num: row.property_num,
          employee_num: this.employeeNum,
          out_time: parseInt((new Date().getTime() / 1000).toString()),
          inout_state: 2
        };
        this.$http.post('api/inout_record/save_inout_record', params).then(resp => {
          let apiData = resp.data;
          if (apiData.code === 0) {
            this.modifyProState(row);
          } else {
            this.$message.error("接口错误，借用失败")
          }
        });
      }).catch(() => {
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
        } else {
          this.$message.error("查询员工编号接口错误");
        }
      });
    },
    modifyProState(row) {
      let params = {
        id: row.id,
        property_state: 2,
      };
      this.$http.put('api/property_info/update_property', params).then((resp) => {
        let apiData = resp.data;
        if (apiData.code === 0) {
          this.$message.success("借用成功,请爱惜使用");
          this.listPropertyInfo();
        } else {
          this.$message.error("修改资产状态接口错误")
        }
      });
    },
    handleSizeChange(val) {
      this.search();
      this.pageSize = val;
    },
    handleCurrentChange(val) {
      this.search();
      this.pageNum = val;
    },
  }
}
</script>

<style scoped>

</style>