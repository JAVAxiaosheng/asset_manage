<template>
  <div>
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
      <el-table-column align="center" label="维修完成时间" min-width="90px">
        <template v-slot="props">
          <el-tag type="success" v-if="props.row.repair_state === 1">{{ formatDate(props.row.repair_date) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="repair_state" label="维修状态" min-width="90px">
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
    };
  },
  mounted() {
    this.listRepairRecord();
  },
  methods: {
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
      this.pageSize = val;
    },
    handleCurrentChange(val) {
      this.pageNum = val;
    },
  }
}
</script>

<style scoped>

</style>