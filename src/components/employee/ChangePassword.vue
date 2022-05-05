<template>
  <div>

    <div style="background-color: #fdfdfe;margin-top: 15px">
      <el-form :inline="true" :model="userInfo" ref="userFormRef" class="demo-form-inline" :rules="rules">

        <el-row :gutter="20">
          <el-col :span="6">
            <div class="grid-content bg-purple"/>
          </el-col>
          <el-col :span="6">
            <el-form-item label="ID" style="margin-top: 15px;">
              <el-input v-model="userInfo.id" disabled style="margin-left: 27px"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="用户名" style="margin-top: 15px;">
              <el-input v-model="userInfo.username" disabled style="margin-left: 15px"></el-input>
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
              <el-input v-model="userInfo.role" disabled style="margin-left: 15px"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="旧密码" style="margin-top: 15px;">
              <el-input v-model="userInfo.oldPassword" disabled
                        style="margin-left: 15px"></el-input>
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
              <el-input type="password" show-password :disabled="id === ''" v-model="userInfo.newPassword"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="再次确认" style="margin-top: 15px;" prop="confirmPassword">
              <el-input type="password" show-password :disabled="id === ''"
                        v-model="userInfo.confirmPassword"></el-input>
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
            <el-form-item>
              <el-button type="warning" plain @click="reset">
                <el-icon style="vertical-align: middle">
                  <refresh/>
                </el-icon>
                <span style="vertical-align: middle">重置</span>
              </el-button>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button type="success" plain @click="modify" :disabled="id===''">
                <el-icon style="vertical-align: middle">
                  <Finished/>
                </el-icon>
                <span style="vertical-align: middle">修改</span>
              </el-button>
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
import Cookies from "js-cookie";
import {ElMessageBox} from "element-plus";

export default {
  name: "ChangePassword",

  data() {
    return {
      userInfo: {
        id: '',
        username: '',
        role: '',
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      },
      rules: {
        newPassword: [
          {required: true, message: '密码不能为空', trigger: 'change'},
        ],
        confirmPassword: [
          {
            required: true,
            message: '密码不能为空',
            trigger: 'change',
          },
        ],
      },
    }
  },
  mounted() {
    this.userInfo.id = Cookies.get('id');
    this.search();
  },
  methods: {
    search() {
      let params = {
        pageNum: 1,
        pageSize: 1,
        role: 0,
        id: this.userInfo.id,
      };
      this.$http.get('api/user_info/query_user', {params}).then(resp => {
        let apiData = resp.data;
        if (apiData.code === 0) {
          console.log(apiData.data);
          this.userInfo.id = apiData.data[0].id;
          this.userInfo.role = '普通用户';
          this.userInfo.username = apiData.data[0].userName;
          this.userInfo.oldPassword = apiData.data[0].password;

        } else {
          this.$message.error('查询接口错误');
        }
      });

    },
    reset() {
      this.$refs["userFormRef"].resetFields(['newPassword']);
      this.$refs["userFormRef"].resetFields(['confirmPassword']);
    },
    modify() {
      this.$refs['userFormRef'].validate((valid) => {
        if (valid) {
          if (this.userInfo.newPassword !== this.userInfo.confirmPassword) {
            this.$message.error("密码不一致,请重新输入");
            this.reset();
            return;
          }
          let params = {
            id: this.userInfo.id,
            password: this.userInfo.newPassword.trim(),
            role: this.userInfo.role === '管理员' ? 1 : 0,
          };
          this.$http.put('api/user_info/update_user', params).then((resp => {
            let apiData = resp.data;
            if (apiData.code === 0) {
              this.$message.success('修改成功');
              if (Cookies.get('user_name') === this.userInfo.username) {
                ElMessageBox.alert('检测到当前登录用户密码已经更改,请重新登录', '提示', {
                  confirmButtonText: '确定',
                  callback: () => {
                    this.$router.push({
                      path: '/'
                    });
                    Cookies.remove('user_name');
                    Cookies.remove('role');
                    Cookies.remove('id');
                  }
                });
              }
              this.userInfo = {};
              this.reset();
              this.id = '';
            } else {
              this.$message.error('修改接口错误');
            }
          }))
        } else {
          return false;
        }
      });
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