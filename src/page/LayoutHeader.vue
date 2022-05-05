<template>
  <div>
    <el-dropdown class="down">
    <span class="el-dropdown-link">
       用户名：{{ username }}
      <el-icon class="el-icon--right">
        <arrow-down />
      </el-icon>
    </span>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
    <span>
      <img style="margin-top: 8px;position: fixed;right: 150px" width="40" src="../assets/bilibili_blue.svg"
           alt="">
    </span>
  </div>
</template>

<script>
import Cookies from 'js-cookie'

export default {
  name: "LayoutHeader",
  data() {
    return {
      username: ''
    };
  },
  mounted() {
    this.username = Cookies.get('user_name');
  },
  methods: {
    logout(){
      Cookies.remove('id');
      Cookies.remove('user_name');
      Cookies.remove('role');
      this.$router.push({
        path: '/'
      });
    }
  }
}
</script>

<style scoped>
.example-showcase .el-dropdown-link {
  cursor: pointer;
  color: var(--el-color-primary);
  display: flex;
  align-items: center;
}
/deep/.el-dropdown-link{
  color: #fff;

  font-size: 16px;
}
/deep/ .down{
  margin-top: 16px;
  float: right;
}
</style>