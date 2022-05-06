<template>
  <div>

    <div style="background-color: #fdfdfe">


      <el-form :inline="true" :model="searchForm" class="demo-form-inline">

        <el-row :gutter="20">
          <el-col :span="4">
            <el-form-item label="员工编号" style="margin-top: 15px">
              <el-input v-model="searchForm.employee_num" @change="search"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="姓名" style="margin-top: 15px">
              <el-input v-model="searchForm.employee_name" @change="search"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="部门名称" style="margin-top: 15px">
              <el-select v-model="searchForm.department_id" class="m-2" clearable filterable placeholder="请选择"
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
          <el-col :span="4">
            <el-form-item label="员工状态" style="margin-top: 15px;">
              <el-select v-model="searchForm.employee_state" class="m-2" clearable filterable placeholder="请选择"
                         @change="search">
                <el-option
                    v-for="item in stateOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item style="margin-top: 15px;float: right">
              <el-button type="primary" @click="search">
                <el-icon style="vertical-align: middle">
                  <search/>
                </el-icon>
                <span style="vertical-align: middle">查询</span>
              </el-button>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item style="margin-top: 15px;float: right">
              <el-button type="primary" @click="addEmployeeDialogFormVisible=true">
                <el-icon style="vertical-align: middle">
                  <search/>
                </el-icon>
                <span style="vertical-align: middle">添加</span>
              </el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>

    <div style="margin-top: 10px">
      <!-- 列表展示 -->
      <el-table :data="tableData" stripe style="width: 100%">
        <el-table-column prop="employee_num" label="员工编号"/>
        <el-table-column prop="employee_name" label="姓名"/>
        <el-table-column prop="employee_sex" label="性别"/>
        <el-table-column prop="employee_age" label="年龄"/>
        <el-table-column prop="department_id" label="部门名称"/>
        <el-table-column prop="position" label="职务"/>
        <el-table-column prop="address" label="办公地址"/>
        <el-table-column prop="phone" label="电话">
          <!--          <template #default="scope">-->
          <!--            <span>{{ phoneFilter(scope.row.phone) }}</span>-->
          <!--          </template>-->

        </el-table-column>


        <el-table-column prop="employee_state" label="员工状态"/>
        <el-table-column prop="ctime" label="创建时间"/>
        <el-table-column prop="mtime" label="修改时间"/>
        <el-table-column label="操作" fixed="right" width="110">
          <template v-slot="props">
            <el-button type="primary" plain circle @click="openModifyEmployeeDialog(props.row)">
              <el-icon style="vertical-align: middle">
                <edit/>
              </el-icon>
            </el-button>

            <el-popconfirm
                confirm-button-text="确定"
                cancel-button-text="取消"
                @confirm="deleteEmployee(props.row)"
                title="确定要删除此员工么?">
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

    <!--    添加员工-->
    <div>
      <el-dialog v-model="addEmployeeDialogFormVisible" title="添加员工">
        <el-form :model="addEmployeeForm" :rules="addEmployeeRules" ref="addEmployeeFromRef">
          <el-form-item label="员工编号" style="margin-left: 20px" prop="employee_num">
            <el-input v-model.number="addEmployeeForm.employee_num" style="width: 220px"/>
          </el-form-item>
          <el-form-item label="姓名" style="margin-left: 20px" prop="employee_name">
            <el-input v-model="addEmployeeForm.employee_name" style="width: 220px"/>
          </el-form-item>
          <el-form-item label="性别" style="margin-left: 20px">
            <el-select v-model="addEmployeeForm.employee_sex" class="m-2" clearable filterable placeholder="请选择"
                       @change="search">
              <el-option
                  v-for="item in sexOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="年龄" style="margin-left: 20px" prop="employee_age">
            <el-input v-model.number="addEmployeeForm.employee_age" style="width: 220px"/>
          </el-form-item>
          <el-form-item label="部门" style="margin-left: 20px" prop="department_id">
            <el-select v-model="addEmployeeForm.department_id" class="m-2" clearable filterable placeholder="请选择">
              <el-option
                  v-for="item in departmentNameOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="岗位" style="margin-left: 20px">
            <el-input v-model="addEmployeeForm.position" style="width: 220px"/>
          </el-form-item>
          <el-form-item label="员工状态" style="margin-top: 15px;">
            <el-select v-model="addEmployeeForm.employee_state" class="m-2" clearable filterable placeholder="请选择"
                       @change="search">
              <el-option
                  v-for="item in stateOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="电话" style="margin-left: 20px" prop="phone">
            <el-input v-model="addEmployeeForm.phone" style="width: 220px"/>
          </el-form-item>
          <el-form-item label="地址" style="margin-left: 20px">
            <el-input v-model="addEmployeeForm.address" :rows="2" type="textarea" style="width: 220px"/>
          </el-form-item>
        </el-form>
        <template #footer>
      <span class="dialog-footer">
        <el-button type="danger" plain @click="addEmployeeDialogFormVisible=false">取消</el-button>
        <el-button type="primary" @click="addEmployee">添加</el-button>
      </span>
        </template>
      </el-dialog>
    </div>

    <!-- 修改员工信息 -->
    <div>
      <el-dialog v-model="updateEmployeeDialogFormVisible" title="员工信息修改">
        <el-form :model="updateEmployeeForm" :rules="updateEmployeeRules" ref="updateEmployeeFromRef">
          <el-form-item label="员工编号" style="margin-left: 20px" prop="employee_num">
            <el-input v-model.number="updateEmployeeForm.employee_num" style="width: 220px"/>
          </el-form-item>
          <el-form-item label="姓名" style="margin-left: 20px" prop="employee_name">
            <el-input v-model="updateEmployeeForm.employee_name" style="width: 220px"/>
          </el-form-item>
          <el-form-item label="性别" style="margin-left: 20px" prop="employee_sex">
            <el-input v-model="updateEmployeeForm.employee_sex" style="width: 220px"/>
          </el-form-item>
          <el-form-item label="年龄" style="margin-left: 20px" prop="employee_age">
            <el-input v-model.number="updateEmployeeForm.employee_age" style="width: 220px"/>
          </el-form-item>
          <el-form-item label="部门" style="margin-left: 20px">
            <el-input v-model="updateEmployeeForm.department_id" style="width: 220px"/>
            <el-select v-model="searchForm.employee_state" class="m-2" clearable filterable placeholder="请选择"
                       @change="search">
              <el-option
                  v-for="item in stateOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="岗位" style="margin-left: 20px" prop="position">
            <el-input v-model="updateEmployeeForm.position" style="width: 220px"/>
          </el-form-item>
          <el-form-item label="地址" style="margin-left: 20px">
            <el-input v-model="updateEmployeeForm.address" style="width: 220px"/>
          </el-form-item>

          <el-form-item label="员工状态" style="margin-top: 15px;">
            <el-select v-model="searchForm.employee_state" class="m-2" clearable filterable placeholder="请选择"
                       @change="search">
              <el-option
                  v-for="item in stateOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="电话" style="margin-left: 20px">
            <el-input v-model="updateEmployeeForm.phone" style="width: 220px"/>
          </el-form-item>
          <el-form-item label="创建时间" style="margin-left: 20px">
            <el-input v-model="updateEmployeeForm.ctime" style="width: 220px"/>
          </el-form-item>
          <el-form-item label="修改时间" style="margin-left: 20px">
            <el-input v-model="updateEmployeeForm.mtime" style="width: 220px"/>
          </el-form-item>

        </el-form>
        <template #footer>
      <span class="dialog-footer">
        <el-button type="danger" plain @click="updateEmployeeDialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="modifyEmployee">修改</el-button>
      </span>
        </template>
      </el-dialog>
    </div>


  </div>
</template>

<script>
export default {
  name: "EmployeeInfo",

  filters: {
    phoneFilter(val) {
      let reg = /^(.{3}).*(.{4})$/;
      return val.replace(reg, '$1****$2')
    }
  },
  data() {
    return {
      pageNum: 1,
      pageSize: 100,
      addEmployeeDialogFormVisible: false,
      updateEmployeeDialogFormVisible: false,
      departmentNameOptions: [],
      tableData: [
        {
          id: 1,
          employee_num: '员工编号',
          employee_name: '名字',
          employee_sex: '性别',
          employee_age: '年龄',
          department_id: '部门编号',
          position: '职务',
          address: '地址',
          phone: 17636856685,
          employee_state: '员工状态',
          ctime: '创建时间',
          mtime: '修改时间'
        }, {
          id: 1,
          employee_num: '员工编号',
          employee_name: '名字',
          employee_sex: '性别',
          employee_age: '年龄',
          department_id: '部门编号',
          position: '职务',
          address: '地址',
          phone: 15896258636,
          employee_state: '员工状态',
          ctime: '创建时间',
          mtime: '修改时间'

        }
      ],
      addEmployeeForm: {
        employee_num: '',
        employee_name: '',
        employee_sex: '',
        employee_age: '',
        department_id: '',
        position: '',
        address: '',
        phone: '',
        employee_state: '',
      },
      updateEmployeeForm: {
        employee_num: '',
        employee_name: '',
        employee_sex: '',
        employee_age: '',
        department_id: '',
        position: '',
        address: '',
        phone: '',
        employee_state: '',
        ctime: '',
        mtime: ''
      },
      searchForm: {
        employee_num: '',
        employee_name: '',
        position: '',
        employee_state: ''
      },
      stateOptions: [{
        label: '在职',
        value: 0,
      }, {
        label: '离职',
        value: 1,
      }
      ],
      sexOptions: [{
        label: '男',
        value: '女',
      }, {
        label: '女',
        value: '女',
      }
      ],

      addEmployeeRules: {
        employee_num: [
          {required: true, message: '员工编号不能为空', trigger: 'change'},
          {required: true, type: 'number', message: '编号必须为数字', trigger: 'change'}
        ],
        employee_name: [
          {required: true, message: '员工姓名不能为空', trigger: 'change'},
        ],
        employee_age: [
          {required: true, message: '员工年龄不能为空', trigger: 'change'},
          {required: true, type: 'number', message: '编号必须为数字', trigger: 'change'}
        ],
        phone: [
          {
            pattern: /^1(3[0-9]|5[0-3,5-9]|7[1-3,5-8]|8[0-9])\d{8}$/,
            message: '请输入正确的电话格式',
            trigger: 'blur'
          }
        ]
      },
    }
  },
  updateEmployeeRules: {
    employee_num: [
      {required: true, message: '员工编号不能为空', trigger: 'change'},
      {required: true, type: 'number', message: '编号必须为数字', trigger: 'change'}
    ],
    employee_name: [
      {required: true, message: '员工姓名不能为空', trigger: 'change'},
    ]
  },

  mounted() {
    this.listDepartmentOptions();
    this.search();
  },
  methods: {
    openModifyEmployeeDialog() {
      this.updateEmployeeDialogFormVisible = true;
    },
    // 查询用户
    search() {
      let params = {
        page_size: this.pageSize,
        page_num: this.pageNum,
        // position: this.searchForm.position,
        // employee_name: this.searchForm.employee_name,
        // employee_num: this.searchForm.employee_num,
        // employee_state: this.searchForm.employee_state
      };
      if (this.searchForm.position !== '') {
        params['position'] = this.searchForm.position;
      }
      if (this.searchForm.employee_name !== '') {
        params['employee_name']=this.searchForm.employee_name;
      }
      if (this.searchForm.employee_num!=='') {
        params['employee_num']=this.searchForm.employee_num;
      }
      if (this.searchForm.employee_state!=='') {
        params['employee_state']=this.searchForm.employee_state;
      }

      this.$http.get('api/employee/query_employee', {params}).then(resp => {
        let apiData = resp.data;
        // console.log(apiData);
        this.tableData=apiData.data;
      })

    },
    // 添加员工
    addEmployee() {
      let params = {
        employee_name: this.addEmployeeForm.employee_name,
        employee_sex: this.addEmployeeForm.employee_sex,
        employee_age: this.addEmployeeForm.employee_age,
        employee_state: this.addEmployeeForm.employee_state,
        phone: this.addEmployeeForm.phone,
        position: this.addEmployeeForm.position,
        address: this.addEmployeeForm.address,
        department_id: this.addEmployeeForm.department_id,
        employee_num: this.addEmployeeForm.employee_num

      }
      this.$http.post('api/employee/save_employee', params).then(resp => {
        let apiDate = resp.data;
        console.log(apiDate);
        if (apiDate.code === 0) {
          this.$message.success("添加成功")
          this.addEmployeeDialogFormVisible = false;
          this.search();
        }

      })
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

    // 删除用户
    deleteEmployee(row){
      console.log(row)
      let params = {
        id: row.id,
      };
      this.$http.delete('/api/employee/delete_employee', {data: params}).then(resp => {
        console.log(resp);
        let apiData=resp.data;
        if (apiData.code === 0) {
          this.$message.success("删除成功");
          this.search();
        } else {
          this.$message.error("修改接口错误," + apiData.message)
        }
      })
    }
  },
  handleSizeChange(val) {
    this.search();
    this.pageSize = val;
},
  handleCurrentChange(val) {
    this.search();
    this.pageNum = val;

  }
}
</script>

<style scoped>

</style>