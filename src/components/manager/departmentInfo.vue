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
              <el-button type="primary" plain round @click="search">
                <el-icon style="vertical-align: middle">
                  <search/>
                </el-icon>
                <span style="vertical-align: middle">查询</span>
              </el-button>
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item style="margin-top: 15px;float: right">
              <el-button type="success" round @click="addDepartmentOpenDialog">
                <el-icon style="vertical-align: middle">
                  <plus/>
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
      <el-table :data="tableData" v-loading="loading" stripe style="width: 100%">
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
            <el-button type="primary" plain circle @click="openModifyRoleDialog(props.row)">
              <el-icon style="vertical-align: middle">
                <edit/>
              </el-icon>
            </el-button>

            <el-popconfirm
                confirm-button-text="确定"
                cancel-button-text="取消"
                @confirm="deleteDepartment(props.row)"
                title="确定要删除此部门么?">
              <template #reference>
                <el-button type="danger" plain circle>
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
      <el-dialog
          v-model="addDialogFormVisible"
          :close-on-click-modal="false"
          :close-on-press-escape="false"
          :show-close="false"
          width="40%"
          title="添 加 部 门">
        <el-form :model="addForm" :rules="addDepartmentRules" ref="addDepartmentFromRef">
          <el-form-item label="部门编号" style="margin-left: 20px" prop="departmentId">
            <el-input v-model.number="addForm.departmentId" style="width: 220px" @change="addDepartmentIdChange"/>
          </el-form-item>
          <el-form-item label="部门名称" style="margin-left: 20px" prop="departmentName">
            <el-input v-model="addForm.departmentName" style="width: 220px" @change="addDepartmentNameChange"/>
          </el-form-item>
        </el-form>
        <template #footer>
      <span class="dialog-footer">
        <el-button type="warning" plain @click="cancel">取 消</el-button>
        <el-button type="primary" @click="addDepartment">添 加</el-button>
      </span>
        </template>
      </el-dialog>
    </div>

    <!-- 修改部门信息 -->
    <div>
      <el-dialog
          v-model="dialogFormVisible"
          :close-on-click-modal="false"
          :close-on-press-escape="false"
          :show-close="false"
          width="40%"
          title="部 门 修 改">
        <el-form :model="form" :rules="rules" ref="departmentFromRef">
          <el-form-item label="部门编号" style="margin-left: 20px" prop="departmentId">
            <el-input disabled v-model.number="form.departmentId" style="width: 220px" @change="departmentIdChange"/>
          </el-form-item>
          <el-form-item label="部门名称" style="margin-left: 20px" prop="departmentName">
            <el-input v-model="form.departmentName" @change="departmentNameChange" style="width: 220px"/>
          </el-form-item>
        </el-form>
        <template #footer>
      <span class="dialog-footer">
        <el-button type="warning" plain @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="success" @click="modifyDepartment">修 改</el-button>
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
      loading: false,
      beforeModifyDepartmentId: '',
      beforeModifyDepartmentName: '',
      currentPage: 1,
      pageSize: 10,
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
      addDepartmentRules: {
        departmentId: [
          {required: true, message: '部门编号不能为空', trigger: 'change'},
          {required: true, type: 'number', message: '编号必须为数字', trigger: 'change'}
        ],
        departmentName: [
          {required: true, message: '部门名称不能为空', trigger: 'change'},
        ]
      },
    };
  },
  mounted() {
    this.listDepartmentOptions();
    this.listDepartmentInfo();
  },
  methods: {
    cancel() {
      this.addDialogFormVisible = false;
      this.$refs["addDepartmentFromRef"].resetFields();
    },
    addDepartmentOpenDialog() {
      this.addDialogFormVisible = true;
    },
    addDepartmentIdChange() {
      let params = {
        department_id: this.addForm.departmentId
      };
      this.$http.post('api/department/check_department', params).then(resp => {
        let apiData = resp.data;
        if (apiData.data.checkout_code === -5003) {
          ElMessageBox.alert('该部门编号已存在，请重新输入', '错误', {
            confirmButtonText: '确定',
            type: "error",
            callback: () => {
              this.$refs["addDepartmentFromRef"].resetFields(['departmentId']);
            }
          });
        }
      });

    },
    addDepartmentNameChange() {
      let params = {
        department_name: this.addForm.departmentName.trim()
      };
      this.$http.post('api/department/check_department', params).then(resp => {
        let apiData = resp.data;
        if (apiData.data.checkout_code === -5003) {
          ElMessageBox.alert('该部门名称已存在，请重新输入', '错误', {
            confirmButtonText: '确定',
            type: "error",
            callback: () => {
              this.$refs["addDepartmentFromRef"].resetFields(['departmentName']);
            }
          });
        }
      });
    },
    departmentNameChange() {
      if (this.form.departmentName === this.beforeModifyDepartmentName) {
        return;
      }
      let params = {
        department_name: this.form.departmentName.trim()
      };
      this.$http.post('api/department/check_department', params).then(resp => {
        let apiData = resp.data;
        if (apiData.data.checkout_code === -5003) {
          ElMessageBox.alert('该部门名称已存在，请重新输入', '错误', {
            confirmButtonText: '确定',
            type: "error",
            callback: () => {
              this.form.departmentName = this.beforeModifyDepartmentName;
            }
          });
        }
      });
    },
    departmentIdChange() {
      if (this.beforeModifyDepartmentId === this.form.departmentId) {
        return;
      }
      let params = {
        department_id: this.form.departmentId
      };
      this.$http.post('api/department/check_department', params).then(resp => {
        let apiData = resp.data;
        if (apiData.data.checkout_code === -5003) {
          ElMessageBox.alert('该部门编号已存在，请重新输入', '错误', {
            confirmButtonText: '确定',
            type: "error",
            callback: () => {
              this.form.departmentId = Number(this.beforeModifyDepartmentId);
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
      this.loading = true;
      let params = {
        page_num: this.currentPage,
        page_size: this.pageSize
      };
      if (this.searchForm.departmentName !== '') {
        params['department_name'] = this.searchForm.departmentName.trim();
      }
      if (this.searchForm.departmentId !== '') {
        params['department_id'] = this.searchForm.departmentId;
      }
      this.$http.get('api/department/query_department', {params}).then(resp => {
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


    // 添加部门
    addDepartment() {
      this.$refs['addDepartmentFromRef'].validate((valid) => {
        if (valid) {
          let params = {
            department_id: this.addForm.departmentId,
            department_name: this.addForm.departmentName.trim(),
          };
          this.$http.post('api/department/save_department', params).then(resp => {
            let apiData = resp.data;
            if (apiData.code === 0) {
              this.$message.success("添加成功");
              this.addDialogFormVisible = false;
              this.$refs["addDepartmentFromRef"].resetFields();
              this.listDepartmentInfo();
            } else {
              this.$message.error("添加接口错误");
            }
          });
        } else {
          return false;
        }
      });
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
      this.dialogFormVisible = true;
      this.form.id = row.id;
      this.form.departmentId = Number(row.departmentId);
      this.form.departmentName = row.departmentName;
      this.beforeModifyDepartmentId = row.departmentId;
      this.beforeModifyDepartmentName = row.departmentName;
    },
    modifyDepartment() {
      this.$refs['departmentFromRef'].validate((valid) => {
        if (valid) {
          let params = {
            id: this.form.id,
            department_id: this.form.departmentId,
            department_name: this.form.departmentName.trim(),
          };
          this.$http.put('api/department/update_department', params).then(resp => {
            let apiData = resp.data;
            if (apiData.code === 0) {
              this.$message.success("修改成功");
              this.dialogFormVisible = false;
              this.listDepartmentInfo();
            } else {
              this.$message.error("修改接口错误");
            }
          });
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