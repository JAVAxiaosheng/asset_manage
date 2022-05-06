<template>
  <div>

    <div style="background-color: #fdfdfe;margin-top: 15px">


      <el-form :inline="true" :model="employeeInfo" class="demo-form-inline">

        <el-row :gutter="20">
          <el-col :span="6">
            <div class="grid-content bg-purple"/>
          </el-col>
          <el-col :span="6">
            <el-form-item label="ID" style="margin-top: 15px;">
              <el-input v-model="employeeInfo.id" disabled style="margin-left: 27px"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="用户名" style="margin-top: 15px;">
              <el-input v-model="employeeInfo.employee_num" disabled style="margin-left: 27px"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <div class="grid-content bg-purple"/>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="6">
            <div class="grid-content bg-purple"/>
          </el-col>
          <el-col :span="6">
            <el-form-item label="身份" style="margin-top: 15px;">
              <el-input v-model="employeeInfo.employee_sex" disabled style="margin-left: 27px"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="旧密码" style="margin-top: 15px;">
              <el-input v-model="employeeInfo.employee_age" disabled style="margin-left: 27px"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <div class="grid-content bg-purple"/>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="6">
            <div class="grid-content bg-purple"/>
          </el-col>
          <el-col :span="6">
            <el-form-item label="新密码" style="margin-top: 15px;" prop="newPassword">
              <el-input v-model="employeeInfo.department_id" disabled style="margin-left: 27px"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="再次确认" style="margin-top: 15px;" prop="confirmPassword">
              <el-input v-model="employeeInfo.position" disabled style="margin-left: 27px"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <div class="grid-content bg-purple"/>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="6">
            <div class="grid-content bg-purple"/>
          </el-col>
          <el-col :span="6">
            <el-form-item label="ID" style="margin-top: 15px;">
              <el-input v-model="employeeInfo.address" disabled style="margin-left: 27px"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="用户名" style="margin-top: 15px;">
              <el-input v-model="employeeInfo.phone" disabled style="margin-left: 27px"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <div class="grid-content bg-purple"/>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="6">
            <div class="grid-content bg-purple"/>
          </el-col>
          <el-col :span="6">
            <el-form-item label="身份" style="margin-top: 15px;">
              <el-input v-model="employeeInfo.employee_state" disabled style="margin-left: 27px"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="旧密码" style="margin-top: 15px;">
              <el-input v-model="employeeInfo.ctime" disabled style="margin-left: 27px"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <div class="grid-content bg-purple"/>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="6">
            <div class="grid-content bg-purple"/>
          </el-col>
          <el-col :span="6">
            <el-form-item label="新密码" style="margin-top: 15px;" prop="newPassword">
              <el-input v-model="employeeInfo.mtime" disabled style="margin-left: 27px"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="再次确认" style="margin-top: 15px;" prop="confirmPassword">
              <el-input v-model="employeeInfo.employee_name" disabled style="margin-left: 27px"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <div class="grid-content bg-purple"/>
          </el-col>
        </el-row>


      </el-form>

    </div>


  </div>
</template>

<script>

export default {
  name: "EmployeeInfo",
  data() {
    return {
      employeeInfo: {
        id:'',
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
      }
    }
  }
}

</script>

<style scoped>
.el-row {
  margin-bottom: 20px;
}

.el-row:last-child {
  margin-bottom: 0;
}

.el-col {
  border-radius: 4px;
}

.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
</style>