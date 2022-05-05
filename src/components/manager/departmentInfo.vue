<template>
  <div>

    <div style="background-color: #fdfdfe">
      <el-form :inline="true" :model="searchForm" class="demo-form-inline">

        <el-row :gutter="20">
          <el-col :span="9">
            <el-form-item label="部门编号" style="margin-top: 15px;">
              <el-select v-model="searchForm.departmentId" class="m-2" clearable filterable placeholder="请选择"
                         @change="search">
                <el-option
                    v-for="item in departmentIdOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="9">
            <el-form-item label="部门名称" style="margin-top: 15px;">
              <el-select v-model="searchForm.departmentName" class="m-2" clearable filterable placeholder="请选择"
                         @change="search">
                <el-option
                    v-for="item in departmentNameOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item style="margin-top: 15px;float: right">
              <el-button type="primary" @click="search">
                <el-icon style="vertical-align: middle">
                  <search/>
                </el-icon>
                <span style="vertical-align: middle">查询</span>
              </el-button>
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item style="margin-top: 15px;float: right">
              <el-button type="primary" @click="addDialogFormVisible=true">
                <el-icon style="vertical-align: middle">
                  <search/>
                </el-icon>
                <span style="vertical-align: middle">添加部门</span>
              </el-button>
            </el-form-item>
          </el-col>
        </el-row>

      </el-form>
    </div>

    <div style="margin-top: 10px">
      <!-- 列表展示 -->
      <el-table :data="tableData" stripe style="width: 100%">
        <el-table-column prop="id" label="ID"/>
        <el-table-column prop="departmentId" label="部门编号">
          <template v-slot="props">
            <el-tag type="info">{{ props.row.departmentId }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="departmentName" label="部门名称">
          <template v-slot="props">
            <el-tag type="warning">{{ props.row.departmentName }}</el-tag>
          </template>
        </el-table-column>

        <el-table-column label="操作">
          <template v-slot="props">
            <el-button type="primary" plain style="font-size: 10px" @click="openModifyRoleDialog(props.row)">
              <el-icon style="vertical-align: middle">
                <edit/>
              </el-icon>
              <span style="vertical-align: middle">修改</span>
            </el-button>

            <el-popconfirm
                confirm-button-text="确定"
                cancel-button-text="取消"
                @confirm="deleteDepartment(props.row)"
                title="确定要删除此部门么?">
              <template #reference>
                <el-button type="danger" plain>
                  <el-icon style="vertical-align: middle">
                    <delete/>
                  </el-icon>
                </el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>

      </el-table>

      <!--分页-->
      <el-pagination
          background
          class="pageInput"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          v-model:currentPage="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[5, 10, 15, 20]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          style="margin-top: 8px;float: right;background-color: #fdfdfe">
      </el-pagination>
    </div>


    <!--    添加部门-->
    <div>
      <el-dialog v-model="addDialogFormVisible" title="部门添加">
        <el-form :model="addForm">
          <el-form-item label="部门编号" style="margin-left: 20px">
            <el-input v-model="addForm.departmentId" style="width: 220px"/>
          </el-form-item>
          <el-form-item label="部门名称" style="margin-left: 20px">
            <el-input v-model="addForm.departmentName" style="width: 220px"/>
          </el-form-item>
        </el-form>
        <template #footer>
      <span class="dialog-footer">
        <el-button @click="addDialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="addDepartment">确定</el-button>
      </span>
        </template>
      </el-dialog>
    </div>

    <div>
      <el-dialog v-model="dialogFormVisible" title="部门修改">
        <el-form :model="form" :rules="rules" ref="departmentFromRef">
          <el-form-item label="部门编号" style="margin-left: 20px" prop="departmentId">
            <el-input v-model.number="form.departmentId" style="width: 220px" @change="departmentIdChange"/>
          </el-form-item>
          <el-form-item label="部门名称" style="margin-left: 20px" prop="departmentName">
            <el-input v-model="form.departmentName" style="width: 220px"/>
          </el-form-item>
        </el-form>
        <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="modifyDepartment">确定</el-button>
      </span>
        </template>
      </el-dialog>
    </div>

  </div>
</template>

<script>
import {ElMessageBox} from 'element-plus'

export default {
  name: "departmentInfo",
  data() {
    return {
      currentPage: 1,
      pageSize: 5,
      total: 0,
      tableData: [],
      departmentIdOptions: [],
      departmentNameOptions: [],
      searchForm: {
        departmentName: '',
        departmentId: '',
      },
      dialogFormVisible: false,
      addDialogFormVisible: false,
      form: {
        id: '',
        departmentName: '',
        departmentId: '',
      },
      addForm: {
        departmentName: '',
        departmentId: '',
      },
      beforeModifyId: '',
      rules: {
        departmentId: [
          {required: true, message: '部门编号不能为空', trigger: 'change'},
          {required: true, type: 'number', message: '编号必须为数字', trigger: 'change'}
        ],
        departmentName: [
          {required: true, message: '部门名称不能为空', trigger: 'change'},
        ],
      },
    };
  },
  mounted() {
    this.listDepartmentOptions();
    this.listDepartmentInfo();
  },
  methods: {
    departmentIdChange() {
      let params = {
        department_id: this.form.departmentId
      };
      this.$http.post('api/department/check_department', params).then(resp => {
        let apiData = resp.data;
        if (apiData.data.checkout_code === -5003) {
          console.log("已存在");
          ElMessageBox.alert('该部门编号已存在，请重新输入', '错误', {
            confirmButtonText: '确定',
            type: "error",
            callback: () => {
              this.$refs["departmentFromRef"].resetFields(['departmentId']);
            }
          });
        }
      });
    },
    // 获取部门编号和部门名称的选项
    listDepartmentOptions() {
      let params = {
        page_num: 1,
        page_size: 100,
      };
      this.$http.get('api/department/query_department', {params}).then(resp => {
        let apiData = resp.data;
        for (let i = 0; i < apiData.data.length; i++) {
          this.departmentIdOptions.push({
            label: apiData.data[i].departmentId,
            value: apiData.data[i].departmentId
          });
          this.departmentNameOptions.push({
            label: apiData.data[i].departmentName,
            value: apiData.data[i].departmentName
          });
        }
      });
    },

    //获取部门表的信息
    listDepartmentInfo() {
      let params = {
        page_num: 1,
        page_size: 100
      };
      if (this.searchForm.departmentName !== '') {
        params['department_name'] = this.searchForm.departmentName;
      }
      if (this.searchForm.departmentId !== '') {
        params['department_id'] = this.searchForm.departmentId;
      }
      this.$http.get('api/department/query_department', {params}).then(resp => {
        console.log(resp);
        let apiData = resp.data;
        this.tableData = apiData.data;
        this.total = apiData.total;
      });
    },


    // 添加部门
    addDepartment() {

    },
    // 删除部门
    deleteDepartment(row) {
      let params = {
        id: row.id,
      };
      this.$http.delete('/api/department/delete_department', {data: params}).then(resp => {
        let apiData = resp.data;
        if (apiData.code === 0) {
          this.$message.success("删除成功");
          this.listDepartmentInfo();
        } else {
          this.$message.error("修改接口错误," + apiData.message)
        }
      });
    },
    openModifyRoleDialog(row) {
      console.log(row);
      this.dialogFormVisible = true;
      this.form.id = row.id;
      this.form.departmentId = row.departmentId;
      this.form.departmentName = row.departmentName;
      // this.beforeModifyRole = row.role;
    },
    modifyDepartment() {
      this.$refs['departmentFromRef'].validate((valid) => {
        if (valid) {
          console.log(valid);
        }
      })
    },
    search() {
      this.listDepartmentInfo();
    },
    handleSizeChange(val) {
      this.search();
      this.pageSize = val;
    },
    handleCurrentChange(val) {
      this.search();
      this.currentPage = val;
    },

  }
}

</script>

<style scoped>

</style>