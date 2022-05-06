<template>
  <div>
    <el-table :data="tableData" stripe style="width: 100%">
      <el-table-column prop="employee_num" label="员工编号" min-width="100px">
        <template v-slot="props">
          <el-tag type="info">{{ props.row.employee_num }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="employee_name" label="姓名" min-width="100px"/>
      <el-table-column prop="employee_sex" label="性别" min-width="80px"/>
      <el-table-column prop="employee_age" label="年龄" min-width="80px"/>
      <el-table-column prop="department_name" label="所在部门" min-width="120px">
        <template v-slot="props">
          <el-tag>{{ props.row.department_name }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="position" label="职位" min-width="120px">
        <template v-slot="props">
          <el-tag type="warning">{{ props.row.position }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="phone" label="电话" min-width="150px">
        <template v-slot="props">
          {{ props.row.phone ? props.row.phone.replace(/(\d{3})(\d{4})(\d{4})/, "$1****$3") : "" }}
          <el-tooltip
              class="box-item"
              effect="customized"
              content="点击复制电话"
              placement="top-start">
            <el-icon @click="copyPhone(props.row)">
              <document-copy/>
            </el-icon>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="address" label="地址" width="100px"/>
      <el-table-column prop="employee_state" label="状态" min-width="80px">
        <template v-slot="props">
          <el-tag type="success" v-if="props.row.employee_state === '在职'">
            {{ props.row.employee_state }}
          </el-tag>
          <el-tag type="danger" v-else-if="props.row.employee_state === '离职'">
            {{ props.row.employee_state }}
          </el-tag>
          <el-tag v-else>
            {{ props.row.employee_state }}
          </el-tag>
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
        :page-sizes="[10, 15, 20, 50]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        style="margin-top: 8px;float: right;background-color: #fdfdfe">
    </el-pagination>
  </div>
</template>

<script>
export default {
  name: "EmployeeInfo",
  data() {
    return {
      tableData: [],
      pageNum: 1,
      pageSize: 10,
      total: 0,
    };
  },
  mounted() {
    this.listEmployee();
  },
  methods: {
    // 复制电话号码
    copyPhone(row) {
      let input = document.createElement('input')
      input.value = row.phone;
      document.body.appendChild(input)
      input.select()
      document.execCommand('copy')
      this.$message.success('复制成功')
      document.body.removeChild(input);
    },
    // 查询员工信息列表
    listEmployee() {
      let params = {
        page_num: this.pageNum,
        page_size: this.pageSize
      };
      this.$http.get('api/employee/query_employee', {params}).then(resp => {
        let apiData = resp.data;
        if (apiData.code === 0) {
          this.tableData = apiData.data;
          this.total = apiData.total;
        } else {
          this.$message.error("查询接口错误")
        }
      });
    },

    // 查询方法
    search() {
      this.listEmployee();
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

<style>
.el-popper.is-customized {
  /* Set padding to ensure the height is 32px */
  padding: 6px 12px;
  background: linear-gradient(90deg, rgb(159, 229, 151), rgb(204, 229, 129));
}

.el-popper.is-customized .el-popper__arrow::before {
  background: linear-gradient(45deg, #b2e68d, #bce689);
  right: 0;
}
</style>