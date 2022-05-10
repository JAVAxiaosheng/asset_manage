<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像区域 -->
      <div class="avatar_box">
        <img src="../../assets/bilibili_blue.svg" alt="">
      </div>
      <!-- 登录表单区域 -->
      <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules" class="login_form">
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input v-model="loginForm.password" type="password" placeholder="请输入密码"></el-input>
        </el-form-item>
        <!-- 按钮区域 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="warning" @click="Register">注册</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import Cookies from 'js-cookie'

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "Login",
  data() {
    return {
      // 这是登录表单的数据绑定对象
      loginForm: {
        username: '',
        password: '',
        role: '',
      },
      // 这是表单的验证规则对象
      loginFormRules: {
        // 验证用户名是否合法
        username: [
          {required: true, message: '用户名不能为空', trigger: 'change'}
        ],
        // 验证密码是否合法
        password: [
          {required: true, message: '密码不能为空', trigger: 'change'}
        ]
      }
    };
  },
  mounted() {
  },
  methods: {
    login() {
      this.$refs.loginFormRef.validate(async valid => {
        if (!valid) return;
        let params = {
          userName: this.loginForm.username.trim(),
          password: this.loginForm.password.trim()
        };
        this.$http.post('/api/user_info/login', params).then(resp => {
          let apiData = resp.data

          if (apiData.code === 0) {
            Cookies.set('user_name', apiData.data.userName);
            Cookies.set('role', apiData.data.role);
            Cookies.set('id', apiData.data.id);
            this.$router.push({
              path: '/home'
            });
          } else {
            this.$message.error(apiData.message);
            return;
          }
        });
      });
    },


    // 点击注册，进行注册
    Register() {
      console.log("qqq")
      this.$router.push({
        path: '/register'
      });
    }
  }
}
</script>
<style lang="less" scoped>
.login_container {
  height: 100%;
  width: 100%;
  background: url("../../assets/background.jpg") no-repeat center;
  background-size: 100% 100%;
}

.login_box {
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

.login_form {
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