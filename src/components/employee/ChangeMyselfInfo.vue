<template>
  <div style="background-color: #fdfdfe;padding: 20px;">

    <el-form :model="updateEmployeeForm" :rules="updateEmployeeRules" ref="updateEmployeeFromRef">
      <el-row>
        <el-col :span="12">
          <el-form-item label="&nbsp;&nbsp;员工编号" style="margin-left: 20px">
            <el-input v-model.number="updateEmployeeForm.employee_num" style="width: 220px" disabled/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="&nbsp;&nbsp;姓&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;名" style="margin-left: 20px">

            <el-input v-model="updateEmployeeForm.employee_name" style="width: 220px" disabled/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="&nbsp;&nbsp;性&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;别" style="margin-left: 20px">
            <el-select v-model="updateEmployeeForm.employee_sex" class="m-2" clearable filterable placeholder="请选择">
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
          >
            <el-input v-model.number="updateEmployeeForm.department_name" style="width: 220px" disabled/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="&nbsp;&nbsp;岗&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;位" style="margin-left: 20px">
            <el-input v-model="updateEmployeeForm.position" style="width: 220px" disabled/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;员工状态" style="margin-top: 15px;">
            <el-select v-model="updateEmployeeForm.employee_state" class="m-2" clearable filterable placeholder="请选择">
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
            <el-input v-model="updateEmployeeForm.address" :rows="4" type="textarea" style="width: 765px"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12" >
          <el-form-item>
            <el-button type="warning" plain @click="reset" style="margin-left: 200px">
              <el-icon style="vertical-align: middle">
                <refresh/>
              </el-icon>
              <span style="vertical-align: middle">重置</span>
            </el-button>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item>
            <el-button type="success" plain @click="modify" style="margin-left: -100px">
              <el-icon style="vertical-align: middle">
                <Finished/>
              </el-icon>
              <span style="vertical-align: middle">修改</span>
            </el-button>
          </el-form-item>
        </el-col>
      </el-row>

    </el-form>


  </div>

</template>

<script>
import Cookies from 'js-cookie'

export default {
  name: "changeInfo",
  mounted() {
    this.queryInfo();
  },
  data() {
    return {
      updateEmployeeForm: {
        id:'',
        employee_num: '',
        employee_name: '',
        employee_sex: '',
        employee_age: '',
        department_id: '',
        department_name: '',
        position: '',
        address: '',
        phone: '',
        employee_state: '',
        ctime: '',
        mtime: ''
      },
      updateEmployeeRules: {

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
    }
  },
  methods: {
    reset() {
      this.queryInfo();
    },
    modify() {

      let params = {
        id:this.updateEmployeeForm.id,
        department_id: this.updateEmployeeForm.department_id,
        employee_name: this.updateEmployeeForm.employee_name.trim(),
        employee_sex: this.updateEmployeeForm.employee_sex,
        employee_age: this.updateEmployeeForm.employee_age,
        position: this.updateEmployeeForm.position.trim(),
        employee_num: this.updateEmployeeForm.employee_num,
        employee_state: this.updateEmployeeForm.employee_state,
        address: this.updateEmployeeForm.address.trim(),
        phone: this.updateEmployeeForm.phone
      }
      this.$http.put('api/employee/update_employee', params).then(resp => {
        let apiDate = resp.data;
        console.log(apiDate);
        if (apiDate.code === 0) {
          this.$message.success("修改成功")
          this.queryInfo();
        }
      })
    },
    queryInfo() {
      let employee_name = Cookies.get('user_name')
      let params = {
        employee_name
      };
      this.$http.get('api/employee/query_employee', {params}).then(resp => {
        console.log(resp)
        let apiData = resp.data;
        apiData.data[0].phone = Number(apiData.data[0].phone);
        this.updateEmployeeForm = apiData.data[0];
      });
    }
  }


}
</script>

<style scoped>

</style>