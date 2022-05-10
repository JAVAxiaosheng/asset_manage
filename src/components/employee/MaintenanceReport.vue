<template>
  <div>
    <!--    搜索-->
    <el-form :inline="true" :model="searchForm" class="demo-form-inline"
             style="background-color: #fdfdfe;margin-bottom: 15px">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="记录编号" style="margin-top: 20px;margin-left: 50px">
            <el-input v-model="searchForm.recordNum"
                      class="m-2" clearable filterable
                      placeholder="请贴入借用资产的记录编号"
                      @change="search"
                      style="width: 320px"/>
          </el-form-item>
        </el-col>
        <el-col :span="8">

        </el-col>
        <el-col :span="8">
          <el-form-item style="margin-top: 15px;margin-left:10px;">
            <el-button type="primary" plain round @click="search">
              <el-icon style="vertical-align: middle">
                <search/>
              </el-icon>
              <span style="vertical-align: middle">查询</span>
            </el-button>
          </el-form-item>
        </el-col>

      </el-row>
    </el-form>

    <el-table :data="tableData" v-loading="loading" stripe style="width: 100%">
      <el-table-column type="expand">
        <el-form label-position="left" v-model="propertyInfo" inline class="demo-table-expand"
                 style="margin-left: 50px">
          <el-form-item label="资产编号">
            <el-tag type="info">{{ propertyInfo.property_num }}</el-tag>
          </el-form-item>
          <br/>
          <el-form-item label="资产型号">
            <el-tag>{{ propertyInfo.property_model }}</el-tag>
          </el-form-item>
          <br/>
          <el-form-item label="资产类型">
            {{ propertyInfo.property_type }}
          </el-form-item>
          <br/>
          <el-form-item label="资产价格">
            <el-tag type="danger">{{ propertyInfo.property_price + ' 元' }}</el-tag>
          </el-form-item>
          <br/>
          <el-form-item label="生产厂商">
            {{ propertyInfo.property_factory }}
          </el-form-item>
          <br/>
          <el-form-item label="入库时间">
            <el-tag type="success">{{ formatDate(propertyInfo.create_date) }}</el-tag>
          </el-form-item>
        </el-form>
      </el-table-column>
      <el-table-column prop="record_num" label="记录编号" min-width="120px" align="center">
        <template v-slot="props">
          {{
            props.row.record_num ?
                props.row.record_num.replace(/([A-Za-z0-9]{3})([A-Za-z0-9]{25})([A-Za-z0-9]{4})/, "$1****$3") : ""
          }}
        </template>
      </el-table-column>
      <el-table-column align="center" prop="property_num" label="资产编号" min-width="90px"/>
      <el-table-column align="center" prop="property_name" label="资产名称" min-width="90px"/>
      <el-table-column align="center" prop="employee_name" label="借用人" min-width="90px"/>
      <el-table-column align="center" prop="out_date" label="借出时间" width="150px">
        <template v-slot="props">
          <el-tag type="warning">{{ formatDate(props.row.out_date) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="归还时间" width="150px">
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
      <el-table-column align="center" label="操作" fixed="right" width="140px">
        <el-button type="primary" plain>
          维修上报
        </el-button>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import moment from "moment";

export default {
  name: "MaintenanceReport",
  data() {
    return {
      loading: false,
      searchForm: {
        recordNum: ""
      },
      tableData: [],
      pageNum: 1,
      pageSize: 1,
      propertyInfo: {}
    }
  },
  mounted() {
  },
  methods: {
    search() {
      if (this.searchForm.recordNum === '') {
        this.tableData = [];
        this.propertyInfo = {};
        return
      }
      this.listUseRecord();
    },
    // 格式化日期
    formatDate(time) {
      return moment(time * 1000).format("YYYY-MM-DD HH:mm");
    },
    // 查询资产信息
    listProInfo(propertyNum) {
      let params = {
        page_num: this.pageNum,
        page_size: this.pageSize,
        property_num: propertyNum
      };
      this.$http.get('api/property_info/query_property', {params}).then((resp) => {
        let apiData = resp.data;
        this.propertyInfo = apiData.data[0];
      });
    },
    listUseRecord() {
      this.loading = true;
      let params = {
        page_num: this.pageNum,
        page_size: this.pageSize,
        record_num: this.searchForm.recordNum.trim()
      };
      this.$http.get('api/inout_record/query_inout_record', {params}).then(resp => {
        let apiData = resp.data;
        if (apiData.code === 0) {
          if (apiData.data.length !== 0) {
            this.listProInfo(apiData.data[0].property_num);
          }
          setTimeout(() => {
            this.tableData = apiData.data;
            this.loading = false;
          }, 500);
        } else {
          this.loading = false;
          this.$message.error("查询记录接口错误")
        }
      });
    },
  }
}
</script>

<style scoped>

</style>