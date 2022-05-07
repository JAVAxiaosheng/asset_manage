<template>
  <div>

    <div style="background-color: #fdfdfe">
      <el-form :inline="true" :model="searchForm" class="demo-form-inline">
        <el-row :gutter="20">
          <el-col :span="6" style="margin-left: 20px">
            <el-form-item label="姓名" style="margin-top: 15px">
              <el-input v-model="searchForm.employee_name" @change="search"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
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
          <el-col :span="6">
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
          <el-col :span="3">
            <el-form-item style="margin-top: 15px;margin-left:10px;float: right">
              <el-button type="primary" plain round @click="search">
                <el-icon style="vertical-align: middle">
                  <search/>
                </el-icon>
                <span style="vertical-align: middle">查询</span>
              </el-button>
            </el-form-item>
          </el-col>
          <el-col :span="2">
            <el-form-item style="margin-top: 15px;float: right">

              <el-button type="success" round @click="addEmployeeDialogFormVisible=true">
                <el-icon style="vertical-align: middle">
                  <plus/>
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
        <el-table-column label="操作" fixed="right" width="110">
          <template v-slot="props">
            <el-button type="primary" plain circle
                       v-if="props.row.employee_state !== '离职'"
                       @click="openModifyEmployeeDialog(props.row)">
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
          @current-change="handleNumChange"
          v-model:currentPage="pageNum"
          v-model:page-size="pageSize"
          :page-sizes="[5, 10, 15, 20]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          style="margin-top: 8px;float: right;background-color: #fdfdfe">
      </el-pagination>

    </div>

    <!-- 添加员工-->
    <div>
      <el-dialog v-model="addEmployeeDialogFormVisible" title="添加员工" width="55%">
        <el-form :model="addEmployeeForm" :rules="addEmployeeRules" ref="addEmployeeFromRef">
          <el-row>
            <el-col :span="12">
              <el-form-item label="员工编号" style="margin-left: 20px" prop="employee_num">
                <el-input v-model.number="addEmployeeForm.employee_num" style="width: 220px"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="姓&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;名" style="margin-left: 20px"
                            prop="employee_name">
                <el-input v-model="addEmployeeForm.employee_name" style="width: 220px"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="&nbsp;&nbsp;性&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;别" style="margin-left: 20px">
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
            </el-col>
            <el-col :span="12">
              <el-form-item label="年&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;龄" style="margin-left: 20px"
                            prop="employee_age">
                <el-input v-model.number="addEmployeeForm.employee_age" style="width: 220px"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="&nbsp;&nbsp;部&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;门" style="margin-left: 20px"
                            prop="department_id">
                <el-select v-model="addEmployeeForm.department_id" class="m-2" clearable filterable placeholder="请选择">
                  <el-option
                      v-for="item in departmentNameOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="&nbsp;&nbsp;职&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;位" style="margin-left: 20px">
                <el-input v-model="addEmployeeForm.position" style="width: 220px"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;员工状态" style="margin-top: 15px;">
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
            </el-col>
            <el-col :span="12">
              <el-form-item label="&nbsp;&nbsp;电&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;话"
                            style="margin-left: 20px;margin-top: 15px" prop="phone">
                <el-input v-model="addEmployeeForm.phone" style="width: 220px"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="&nbsp;&nbsp;地&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;址" style="margin-left: 20px">
                <el-input v-model="addEmployeeForm.address" :rows="4" type="textarea" style="width: 600px"/>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <template #footer>
      <span class="dialog-footer">
        <el-button type="danger" plain @click="addEmployeeCancel">取消</el-button>
        <el-button type="primary" @click="addEmployee">添加</el-button>
      </span>
        </template>
      </el-dialog>
    </div>

    <!-- 修改员工信息 -->
    <div>
      <el-dialog v-model="updateEmployeeDialogFormVisible" title="员工信息修改" width="55%">
        <el-form :model="updateEmployeeForm" :rules="updateEmployeeRules" ref="updateEmployeeFromRef">
          <el-row>
            <el-col :span="12">
              <el-form-item label="员工编号" style="margin-left: 20px" prop="employee_num">
                <el-input disabled v-model.number="updateEmployeeForm.employee_num" style="width: 220px"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="姓&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;名" style="margin-left: 20px"
                            prop="employee_name">
                <el-input v-model="updateEmployeeForm.employee_name" style="width: 220px"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="&nbsp;&nbsp;性&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;别" style="margin-left: 20px">
                <el-select v-model="updateEmployeeForm.employee_sex" class="m-2" clearable filterable placeholder="请选择"
                           @change="search">
                  <el-option
                      v-for="item in sexOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="年&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;龄" style="margin-left: 20px"
                            prop="employee_age">
                <el-input v-model.number="updateEmployeeForm.employee_age" style="width: 220px"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="&nbsp;&nbsp;部&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;门" style="margin-left: 20px"
                            prop="department_id">
                <el-select v-model="updateEmployeeForm.department_id" class="m-2" clearable filterable
                           placeholder="请选择">
                  <el-option
                      v-for="item in departmentNameOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="&nbsp;&nbsp;职&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;位" style="margin-left: 20px">
                <el-input v-model="updateEmployeeForm.position" style="width: 220px"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;员工状态" style="margin-top: 15px;">
                <el-select v-model="updateEmployeeForm.employee_state" class="m-2" clearable filterable
                           placeholder="请选择"
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
            <el-col :span="12">
              <el-form-item label="&nbsp;&nbsp;电&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;话"
                            style="margin-left: 20px;margin-top: 15px" prop="phone">
                <el-input v-model="updateEmployeeForm.phone" style="width: 220px"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="&nbsp;&nbsp;地&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;址" style="margin-left: 20px">
                <el-input v-model="updateEmployeeForm.address" :rows="4" type="textarea" style="width: 600px"/>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <template #footer>
      <span class="dialog-footer">
        <el-button type="danger" plain @click="updateEmployeeCancel">取消</el-button>
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

  data() {
    return {
      pageNum: 1,
      pageSize: 10,
      total: 1,
      addEmployeeDialogFormVisible: false,
      updateEmployeeDialogFormVisible: false,
      departmentNameOptions: [],
      tableData: [],
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
        id: '',
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
        employee_state: '',
        department_id: ''
      },
      stateOptions: [{
        label: '在职',
        value: '在职',
      }, {
        label: '离职',
        value: '离职',
      }, {
        label: '休假',
        value: '休假',
      }
      ],
      sexOptions: [{
        label: '男',
        value: '男',
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
      updateEmployeeRules: {
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
          }]
      }
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
    handleSizeChange(val) {
      this.pageSize = val;
      this.search();
    },
    handleNumChange(val) {
      this.pageNum = val;
      this.search();
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
    // 修改员工信息
    openModifyEmployeeDialog(row) {
      this.updateEmployeeDialogFormVisible = true;
      // console.log(row);
      this.updateEmployeeForm.id = row.id;
      this.updateEmployeeForm.department_id = row.department_id;
      this.updateEmployeeForm.employee_name = row.employee_name;
      this.updateEmployeeForm.employee_age = row.employee_age;
      this.updateEmployeeForm.employee_num = Number(row.employee_num);
      this.updateEmployeeForm.employee_sex = row.employee_sex;
      this.updateEmployeeForm.position = row.position;
      this.updateEmployeeForm.employee_state = row.employee_state;
      this.updateEmployeeForm.address = row.address;
      this.updateEmployeeForm.phone = row.phone;
    },
    // 确认修改
    modifyEmployee() {
      let params = {
        id: this.updateEmployeeForm.id,
        department_id: this.updateEmployeeForm.department_id,
        employee_name: this.updateEmployeeForm.employee_name.trim(),
        employee_age: this.updateEmployeeForm.employee_age,
        employee_num: this.updateEmployeeForm.employee_num,
        employee_sex: this.updateEmployeeForm.employee_sex,
        position: this.updateEmployeeForm.position.trim(),
        employee_state: this.updateEmployeeForm.employee_state,
        address: this.updateEmployeeForm.address.trim(),
        phone: this.updateEmployeeForm.phone
      }
      this.$http.put('api/employee/update_employee', params).then(resp => {
        let apiDate = resp.data;
        console.log(apiDate);
        if (apiDate.code === 0) {
          this.$message.success("修改成功")
          this.updateEmployeeDialogFormVisible = false;
          this.$refs.updateEmployeeFromRef.resetFields();
          this.search();
        }
      })
    },
    updateEmployeeCancel() {
      this.updateEmployeeDialogFormVisible = false;
      this.$refs['updateEmployeeFromRef'].resetFields();
    },
    // 查询用户
    search() {
      let params = {
        page_size: this.pageSize,
        page_num: this.pageNum,
      };
      if (this.searchForm.department_id !== '') {
        params['department_id'] = this.searchForm.department_id;
      }
      if (this.searchForm.employee_name !== '') {
        params['employee_name'] = this.searchForm.employee_name;
      }
      if (this.searchForm.employee_num !== '') {
        params['employee_num'] = this.searchForm.employee_num;
      }
      if (this.searchForm.employee_state !== '') {
        params['employee_state'] = this.searchForm.employee_state;
      }
      // console.log('555');
      this.$http.get('api/employee/query_employee', {params}).then(resp => {
        let apiData = resp.data;
        console.log(apiData);
        this.tableData = apiData.data;
        this.total = apiData.total;
      })

    },
    // 添加员工
    addEmployee() {

      this.$refs['addEmployeeFromRef'].validate((valid) => {
        if (valid) {
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
          };
          this.$http.post('api/employee/save_employee', params).then(resp => {
            let apiDate = resp.data;
            console.log(apiDate);
            if (apiDate.code === 0) {
              this.$message.success("添加成功")
              this.addEmployeeDialogFormVisible = false;
              this.addEmployeeForm = [];
              this.$refs.addEmployeeFromRef.resetFields();
              this.search();
            }
          })
        }
      });

    },
    addEmployeeCancel() {
      this.addEmployeeDialogFormVisible = false;
      this.$refs['addEmployeeFromRef'].resetFields();
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
    deleteEmployee(row) {
      console.log(row)
      let params = {
        id: row.id,
      };
      this.$http.delete('/api/employee/delete_employee', {data: params}).then(resp => {
        console.log(resp);
        let apiData = resp.data;
        if (apiData.code === 0) {
          this.$message.success("删除成功");
          this.search();
        } else {
          this.$message.error("修改接口错误," + apiData.message)
        }
      })
    }
  }
}
</script>

<style scoped>

</style>