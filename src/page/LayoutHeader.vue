<template>
  <div>
    <span class="title">资 &nbsp;产 &nbsp;管 &nbsp;理 &nbsp;系 &nbsp;统</span>
    <el-dropdown class="down">
    <span class="el-dropdown-link">
      <span v-if="role==0">
         用户名：
      </span>
       <span v-if="role==1">
         管理员：
      </span>
      {{ username }}
      <el-icon class="el-icon--right">
        <arrow-down/>
      </el-icon>
    </span>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
    <span>
      <img style="margin-top: 8px;position: fixed;right: 190px" width="40" src="../assets/bilibili_blue.svg"
           alt="">
    </span>
  </div>
</template>

<script>
import Cookies from 'js-cookie'
import {ElMessageBox} from 'element-plus'

export default {
  name: "LayoutHeader",
  data() {
    return {
      username: '',
      role:''
    };
  },
  mounted() {
    this.username = Cookies.get('user_name');
    this.role = Cookies.get('role');
  },
  methods: {
    logout() {
      ElMessageBox.confirm(
          '确定要退出吗',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          }
      )
          .then(() => {
            Cookies.remove('id');
            Cookies.remove('user_name');
            Cookies.remove('role');
            this.$router.push({
              path: '/'
            });
          })
          .catch(() => {

          })

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

.title{
  color: #ffffff;
  font-size: 24px;
  font-family: "微软雅黑", Arial, sans-serif;
  font-weight: bold;
}
/deep/ .el-dropdown-link {
  color: #fff;
  font-size: 16px;
}

/deep/ .down {
  margin-top: 20px;
  margin-right: 20px;
  float: right;
}
</style>