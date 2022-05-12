<template>
  <div>
    <!--    搜索-->
    <el-form :inline="true" :model="searchForm" class="demo-form-inline"
             style="background-color: #fdfdfe;margin-bottom: 15px">

      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="资产名称" style="margin-top: 20px">
            <el-select v-model="searchForm.propertyName" class="m-2" clearable filterable placeholder="请选择"
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
            <el-select v-model="searchForm.sendPerson" class="m-2" clearable filterable placeholder="请选择"
                       style="width: 200px" @change="search">
              <el-option
                  v-for="item in sendPersonOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"/>
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

    <el-table :data="tableData" v-loading="loading" stripe style="width: 100%">
      <el-table-column type="expand">
        <template #default="props">
          <el-form label-position="left" v-model="props.row" inline class="demo-table-expand"
                   style="margin-left: 80px">
            <el-form-item label="送修原因">
              <el-tag type="danger">{{ props.row.reason }}</el-tag>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="property_num" label="资产编号" min-width="80px">
        <template v-slot="props">
          <el-tag type="info">{{ props.row.property_num }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="property_name" label="资产名称" width="100px"/>
      <el-table-column align="center" prop="send_person" label="送修人" min-width="90px">
        <template v-slot="props">
          <el-tag>{{ props.row.send_person }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="send_date" label="送修时间" width="150px">
        <template v-slot="props">
          <el-tag type="warning">{{ formatDate(props.row.send_date) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="handle_person" label="经手人" min-width="90px">
        <template v-slot="props">
          <el-tag v-if="props.row.handle_person!==''">{{ props.row.handle_person }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="维修完成时间" width="150px">
        <template v-slot="props">
          <el-tag type="success" v-if="props.row.repair_state === 1">{{ formatDate(props.row.repair_date) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="repair_state" label="维修状态" min-width="100px">
        <template v-slot="props">
          <el-tag type="success" v-if="props.row.repair_state === 1">维修完成</el-tag>
          <el-tag type="warning" v-if="props.row.repair_state === 2">已上报</el-tag>
          <el-tag v-if="props.row.repair_state === 3">维修中</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="140px">
        <template v-slot="props">
          <el-button type="primary" @click="agreeRepair(props.row)" plain round size="small"
                     v-if="props.row.repair_state === 2">
            同意维修
          </el-button>
          <el-button type="success" @click="repairSuccess(props.row)" plain round size="small"
                     v-if="props.row.repair_state === 3">维修完成
          </el-button>
          <el-popconfirm
              confirm-button-text="确定"
              cancel-button-text="取消"
              @confirm="deleteRepairRecord(props.row)"
              title="删除此记录会将资产状态和使用状态恢复为原状态,确定要执行此操作么？">
            <template #reference>
              <el-button type="danger" plain circle size="small">
                <el-icon style="vertical-align: middle">
                  <delete/>
                </el-icon>
              </el-button>
            </template>
          </el-popconfirm>
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
import Cookies from 'js-cookie'

export default {
  name: "RepairRecord",
  data() {
    return {
      loading: false,
      tableData: [],
      pageNum: 1,
      pageSize: 10,
      total: 0,
      searchForm: {
        propertyName: '',
        sendPerson: '',
      },
      sendPersonOptions: [],
      propertyNameOptions: []
    };
  },
  mounted() {
    this.listRepairRecord();
    this.listSearchOptions();
  },
  methods: {
    listSearchOptions() {
      let params = {
        page_num: 1,
        page_size: 1000,
      };
      this.$http.get('api/repair_record/query_repair_record', {params}).then(resp => {
        let apiData = resp.data;
        let proInfoMap = new Map();
        let sendPersonMap = new Map();
        if (apiData.code === 0) {
          for (let i = 0; i < apiData.data.length; i++) {
            proInfoMap.set(apiData.data[i].send_person, apiData.data[i].send_person);
            sendPersonMap.set(apiData.data[i].property_num, apiData.data[i].property_name);
          }
          for (let [k] of proInfoMap) {
            this.sendPersonOptions.push({
              label: proInfoMap.get(k),
              value: k
            });
          }
          for (let [k] of sendPersonMap) {
            this.propertyNameOptions.push({
              label: sendPersonMap.get(k),
              value: k
            });
          }
        } else {
          this.$message.error("查询记录接口错误")
        }
      });
    },
    // 删除记录
    deleteRepairRecord(row) {
      let params = {
        id: row.id,
        property_num: row.property_num,
        property_state: 2,
        inout_state: 2,
      };
      this.$http.delete('api/repair_record/delete_repair_record', {data: params}).then(resp => {
        let apiData = resp.data;
        if (apiData.code === 0) {
          this.$message.success("删除成功");
          this.listRepairRecord();
        } else {
          this.$message.error("删除失败")
        }
      });
    },
    // 维修完成
    repairSuccess(row) {
      let params = {
        id: row.id,
        repair_state: 1,
        repair_time: parseInt((new Date().getTime() / 1000).toString()),
        property_num: row.property_num,
        property_state: 2,
        inout_state: 2,
      };
      this.$http.post('api/repair_record/update_record_by_manager', params).then(resp => {
        let apiData = resp.data;
        if (apiData.code === 0) {
          this.$message.success("已成功处理");
          this.listRepairRecord();
        } else {
          this.$message.error("管理员修改接口错误")
        }
      });
    },
    // 统一维修
    agreeRepair(row) {
      let params = {
        id: row.id,
        repair_state: 3,
        handle_person: Cookies.get('user_name'),
        property_num: row.property_num,
        property_state: 3
      };
      this.$http.post('api/repair_record/update_record_by_manager', params).then(resp => {
        let apiData = resp.data;
        if (apiData.code === 0) {
          this.$message.success("已成功处理");
          this.listRepairRecord();
        } else {
          this.$message.error("管理员修改接口错误")
        }
      });
    },
    search() {
      this.listRepairRecord();
    },
    listRepairRecord() {
      this.loading = true;
      let params = {
        page_num: this.pageNum,
        page_size: this.pageSize,
      }
      if (this.searchForm.propertyName !== '') {
        params['property_num'] = this.searchForm.propertyName
      }
      if (this.searchForm.sendPerson !== '') {
        params['send_person'] = this.searchForm.sendPerson
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
      });
    },

    // 格式化日期
    formatDate(time) {
      return moment(time * 1000).format("YYYY-MM-DD HH:mm");
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