<template>
  <div>

    <!--    搜索-->
    <div style="background-color: #fdfdfe;margin-bottom: 15px">
      <el-form :inline="true" :model="searchForm" class="demo-form-inline">

        <el-row :gutter="20">
          <el-col :span="0">

          </el-col>
          <el-col :span="8">
            <el-form-item label="姓名" style="margin-top: 20px">
              <el-input v-model="searchForm.employee_name" @change="search" style="width:200px;"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="部门名称" style="margin-top: 20px;margin-left: -50px">
              <el-select v-model="searchForm.department_id" class="m-2" clearable filterable placeholder="请选择"
                         @change="search" style="width: 200px">
                <el-option
                    v-for="item in departmentNameOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item style="margin-top: 20px;float: right">
              <el-button type="primary" @click="search" round plain>
                <el-icon style="vertical-align: middle">
                  <search/>
                </el-icon>
                <span style="vertical-align: middle">查询</span>
              </el-button>
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item style="margin-top: 20px;float: right">
              <el-button type="warning" @click="exportExcel" round plain>
                <el-icon style="vertical-align: middle">
                  <bottom/>
                </el-icon>
                <span style="vertical-align: middle">导出</span>
              </el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <!--    列表展示-->
    <el-table :data="tableData" border v-loading="loading" stripe style="width: 100%" id="outExcel">
      <el-table-column prop="employee_num" label="员工编号" min-width="100px" fixed>
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
      <el-table-column prop="address" label="地址" width="100px" show-overflow-tooltip="true"/>
      <el-table-column prop="employee_state" label="状态" min-width="80px" fixed="right">
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
        :page-sizes="[5,10, 15, 20, 50]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        style="margin-top: 8px;float: right;background-color: #fdfdfe">
    </el-pagination>
  </div>
</template>

<script>
import outToExcel from "@/excel/outToExcel";

export default {
  name: "EmployeeInfo",
  data() {
    return {
      loading: false,
      tableData: [],
      pageNum: 1,
      pageSize: 10,
      total: 0,
      searchForm: {
        employee_name: '',
        department_id: '',
      },
      departmentNameOptions: [],
    };
  },
  mounted() {
    this.listDepartmentOptions();
    this.listEmployee();
  },
  methods: {
    exportExcel() {
      outToExcel.exportExcel("员工信息表.xlsx", "#outExcel");
    },

    // 获取部门编号和部门名称的选项
    listDepartmentOptions() {
      let params = {
        page_num: 1,
        page_size: 100,
      };
      this.$http.get('api/department/query_department', {params}).then(resp => {
        let apiData = resp.data;
        console.log(apiData);
        for (let i = 0; i < apiData.data.length; i++) {
          this.departmentNameOptions.push({
            label: apiData.data[i].departmentName,
            value: apiData.data[i].departmentId
          });
        }
      });
    },
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
      this.loading = true;
      let params = {
        page_num: this.pageNum,
        page_size: this.pageSize
      };
      if (this.searchForm.department_id !== '') {
        params['department_id'] = this.searchForm.department_id;
      }
      if (this.searchForm.employee_name !== '') {
        params['employee_name'] = this.searchForm.employee_name;
      }
      this.$http.get('api/employee/query_employee', {params}).then(resp => {
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