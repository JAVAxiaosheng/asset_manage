<template>
  <div>
    <!--    搜索-->
    <el-form :inline="true" :model="searchForm" class="demo-form-inline"
             style="background-color: #fdfdfe;margin-bottom: 15px">

      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="资产名称" style="margin-top: 20px">
            <el-select v-model="searchForm.property_name" class="m-2" clearable filterable placeholder="请选择"
                       style="width: 200px" @change="search">
              <el-option
                  v-for="item in propertyNameOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="送修人" style="margin-top: 20px">
            <el-select v-model="searchForm.send_person" class="m-2" clearable filterable placeholder="请选择"
                       style="width: 200px" @change="search">
              <el-option
                  v-for="item in sendPersonOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item style="margin-top: 20px;margin-left: -400px">
            <el-button type="primary" @click="search" round plain>
              <el-icon style="vertical-align: middle">
                <search/>
              </el-icon>
            </el-button>
          </el-form-item>
        </el-col>
      </el-row>


    </el-form>

    <el-table :data="tableData" border v-loading="loading" stripe style="width: 100%">

      <el-table-column align="center" prop="property_num" label="资产编号" min-width="90px">
        <template v-slot="props">
          <el-tag type="info">{{ props.row.property_num }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="property_name" label="资产名称" min-width="90px"/>
      <el-table-column align="center" prop="send_person" label="送修人" min-width="90px">
        <template v-slot="props">
          <el-tag>{{ props.row.send_person }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="send_date" label="送修时间" min-width="90px">
        <template v-slot="props">
          <el-tag type="warning">{{ formatDate(props.row.send_date) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="handle_person" label="经手人" min-width="90px">
        <template v-slot="props">
          <el-tag v-if="props.row.handle_person!==''">{{ props.row.handle_person }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="reason" label="原因" min-width="115px"/>
      <el-table-column align="center" prop="repair_state" label="维修状态" min-width="90px">
        <template v-slot="props">
          <el-tag type="success" v-if="props.row.repair_state === 1">维修完成</el-tag>
          <el-tag type="warning" v-if="props.row.repair_state === 2">已上报</el-tag>
          <el-tag v-if="props.row.repair_state === 3">维修中</el-tag>
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
import moment from "moment";

export default {
  name: "MaintenanceRecord",
  data() {
    return {
      loading: false,
      pageNum: 1,
      pageSize: 10,
      total: 0,
      tableData: [
        {
          id: 4,
          repair_date: 0,
          send_date: 1652194923,
          handle_person: "",
          property_name: "为服务商",
          property_num: "1002",
          reason: "需要维修",
          repair_state: 2,
          send_person: "王志强",
        }
      ],
      searchForm: {
        property_name: "",
        send_person: "",
      },
      propertyNameOptions: [],
      sendPersonOptions: []
    }
  },
  mounted() {
    this.search();
    this.listData()
  },
  methods: {
    search() {
      this.loading = true;
      let params = {
        page_num: this.pageNum,
        page_size: this.pageSize,
      }
      if (this.searchForm.property_name !== '') {
        params['property_num'] = this.searchForm.property_name
      }
      if (this.searchForm.send_person !== '') {
        params['send_person'] = this.searchForm.send_person
      }
      this.$http.get('api/repair_record/query_repair_record', {params}).then(resp => {
        let apiData = resp.data;
        if (apiData.code === 0) {
          setTimeout(() => {
            this.tableData = apiData.data;
            this.total = apiData.total;
            this.loading = false;
          }, 500);
        } else {
          this.$message.error("查询接口错误")
        }
      })
    },
    listData() {
      let params = {
        page_num: 1,
        page_size: 1000,
      };
      this.$http.get('api/repair_record/query_repair_record', {params}).then(resp => {
        let apiData = resp.data;
        let map1 = new Map();
        let map2 = new Map();
        if (apiData.code === 0) {
          for (let i = 0; i < apiData.data.length; i++) {
            map1.set(apiData.data[i].send_person, apiData.data[i].send_person);
            map2.set(apiData.data[i].property_num, apiData.data[i].property_name);
          }
          for (let [k] of map1) {
            this.sendPersonOptions.push({
              label: map1.get(k),
              value: k
            });
          }
          for (let [k] of map2) {
            this.propertyNameOptions.push({
              label: map2.get(k),
              value: k
            });
          }

        } else {
          this.$message.error("查询记录接口错误")
        }
      })
    },
    // 格式化日期
    formatDate(time) {
      return moment(time * 1000).format("YYYY-MM-DD HH:mm");
    },

    handleSizeChange(val) {
      this.pageSize = val;
      this.search();
    },
    handleCurrentChange(val) {
      this.pageNum = val;
      this.search();
    },
  }
}
</script>

<style scoped>

</style>