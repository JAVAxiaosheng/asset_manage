<template>
  <div class="register_container">
    <div class="register_box">
      <!-- 头像区域 -->
      <div class="avatar_box">
        <img src="../assets/bilibili_blue.svg" alt="">
      </div>
      <!-- 注册表单区域 -->
      <el-form ref="registerFormRef" :model="registerForm" :rules="registerFormRules" class="register_form">
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input v-model="registerForm.username" placeholder="请输入用户名" @change="usernameCheck"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input v-model="registerForm.password" type="password" placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item prop="confirmPassword">
          <el-input @change="confirmPasswordCheck" v-model="registerForm.confirmPassword" type="password"
                    placeholder="再次确认密码"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button style="margin-left: 95px" type="primary" @click="register">注册</el-button>
        </el-form-item>
        <el-link type="danger" @click="resetRegisterForm">返回登录</el-link>
      </el-form>
    </div>
  </div>
</template>

<script>

import {ElMessageBox} from "element-plus";

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "Register",
  data() {
    return {
      // 这是登注册录表单的数据绑定对象
      registerForm: {
        username: '',
        password: '',
        confirmPassword: '',
        role: 0
      },
      roleOptions: [{
        label: '管理员',
        value: 1,
      }, {
        label: '普通用户',
        value: 0,
      }],
      // 这是表单的验证规则对象
      registerFormRules: {
        // 验证用户名是否合法
        username: [
          {required: true, message: '请输入用户名', trigger: 'blur'}
        ],
        // 验证密码是否合法
        password: [
          {required: true, message: '请输入密码', trigger: 'blur'}
        ],
        confirmPassword: [
          {required: true, message: '请再次输入密码', trigger: 'blur'}
        ]
      }
    };
  },
  mounted() {
  },
  methods: {
    confirmPasswordCheck() {
      if (this.registerForm.password.trim() !== this.registerForm.confirmPassword.trim()) {
        ElMessageBox.alert('密码输入不一致，请重新输入!', '错误', {
          confirmButtonText: 'OK',
          callback: () => {
            this.$refs["registerFormRef"].resetFields(['password']);
            this.$refs["registerFormRef"].resetFields(['confirmPassword']);
          }
        });
      }
    },
    usernameCheck() {
      if (this.registerForm.username !== '') {
        let params = {
          user_name: this.registerForm.username.trim()
        };
        this.$http.post('/api/user_info/check_user', params).then(resp => {
          let apiData = resp.data
          if (apiData.code !== 0) {
            ElMessageBox.alert(apiData.message, '错误', {
              confirmButtonText: '知道了',
              callback: () => {
                this.$refs["registerFormRef"].resetFields(['username']);
              }
            });
          }
        });
      }
    },
    register() {
      this.$refs.registerFormRef.validate(async valid => {
        if (!valid) return;
        let params = {
          userName: this.registerForm.username.trim(),
          password: this.registerForm.password.trim(),
          role: this.registerForm.role
        };
        this.$http.post('api/user_info/save_user', params).then(resp => {
          if (resp.data.code === 0) {
            this.$message.success("注册成功，请登录");
            this.$router.push({
              path: '/'
            })
          } else {
            this.$message.error("该用户已存在，请勿重复注册");
          }
        });
      });
    },

    // 点击重置按钮，重置注册表单
    resetRegisterForm() {
      this.$refs.registerFormRef.resetFields()
      this.$router.push({
        path: '/'
      });
    }
  }
}
</script>
<style lang="less" scoped>
.register_container {
  height: 100%;
  width: 100%;
  background: url("../assets/background.jpg") no-repeat center;
  background-size: 100% 100%;
}

.register_box {
  width: 300px;
  height: 350px;
  background-color: rgba(111, 111, 111, .2);
  position: absolute;
  left: 70%;
  top: 50%;
  transform: translate(-50%, -50%);
  //border: 5px rgba(110, 147, 114, 0.3) solid;

  .avatar_box {
    height: 80px;
    width: 80px;
    background-color: transparent;
    border: 1px solid #eee;
    border-radius: 50%;
    box-shadow: 0 0 10px #ddd;
    padding: 1px;
    position: absolute;
    left: 50%;
    bottom: 195px;
    transform: translate(-50%, -50%);
    background-color: #fff;

    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: transparent;
    }
  }
}

/deep/ .el-input__inner {
  background-color: transparent;
}

.register_form {
  width: 100%;
  position: absolute;
  top: 35%;
  padding: 0 20px;
  box-sizing: border-box;
}

.btns {
  margin-left: 60px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
</style>