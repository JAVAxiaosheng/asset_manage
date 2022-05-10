<template>
  <div>
    <!--    搜索-->
    <el-form :inline="true" :model="searchForm" class="demo-form-inline"
             style="background-color: #fdfdfe;margin-bottom: 15px">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="记录编号" style="margin-top: 20px">
            <el-input v-model="searchForm.record_num" class="m-2" clearable filterable style="width: 200px"/>
          </el-form-item>
        </el-col>
        <el-col :span="8">

        </el-col>
        <el-col :span="8">
          <el-form-item style="margin-top: 15px;margin-left:10px;">
            <el-button type="primary" plain round>
              <el-icon style="vertical-align: middle">
                <search/>
              </el-icon>
              <span style="vertical-align: middle">查询</span>
            </el-button>
          </el-form-item>
        </el-col>

      </el-row>
    </el-form>

    <el-table :data="tableData" border v-loading="loading" stripe style="width: 100%">
      <el-table-column prop="record_num" label="记录编号" min-width="120px" align="center">
        <template v-slot="props">
          {{
            props.row.record_num ?
                props.row.record_num.replace(/([A-Za-z0-9]{3})([A-Za-z0-9]{25})([A-Za-z0-9]{4})/, "$1****$3") : ""
          }}
          <el-tooltip
              class="box-item"
              effect="customized"
              content="点击记录编号"
              placement="top-start">
            <el-icon @click="copyRecordNum(props.row)">
              <document-copy/>
            </el-icon>
          </el-tooltip>
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
      <el-table-column align="center" label="操作" fixed="right" width="110px">
        <template v-slot="props">
          <el-button type="primary" plain round
                     size="small"
                     @click="returnBack(props.row)"
                     v-if="props.row.inout_state === 2 && props.row.employee_name === username">
            归还
          </el-button>
          <el-popconfirm
              confirm-button-text="确定"
              cancel-button-text="取消"
              @confirm="deleteUseRecord(props.row)"
              title="确定要删除此条记录么?">
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

export default {
  name: "MaintenanceReport",
  data() {
    return {
      searchForm: {
        record_num: ""
      },
      tableData:[],
      pageNum: 1,
      pageSize: 10,
      total: 0,

    }
  },
  mounted() {
    this.listUseRecord();
  },
  methods:{
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
    // 格式化日期
    formatDate(time) {
      return moment(time * 1000).format("YYYY-MM-DD HH:mm");
    },
    listUseRecord() {
      this.loading = true;
      let params = {
        page_num: this.pageNum,
        page_size: this.pageSize
      };
      // if (this.searchForm.property_name !== '') {
      //   params['property_num'] = this.searchForm.property_name
      // }
      // if (this.searchForm.employee_num !== '') {
      //   params['employee_num'] = this.searchForm.employee_num
      // }
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
      });
    },

    handleSizeChange(val) {
      this.pageSize = val;
      this.listUseRecord();
    },
    handleCurrentChange(val) {
      this.pageNum = val;
      this.listUseRecord();
    },
  }
}
</script>

<style scoped>

</style>