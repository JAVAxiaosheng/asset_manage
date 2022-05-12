<template>
  <el-dialog
      v-model="dialogVisible"
      :show-close="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      title="登录提醒"
      width="30%">
    <span style="color: red">您还没有登录，请您先登录！</span>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="confirmClick">确定</el-button>
      </span>
    </template>
  </el-dialog>
  <el-container>
    <el-aside width="200px">
      <layout-menu v-if="roleId === 0"/>
      <manager-layout-menu v-if="roleId === 1"/>
    </el-aside>
    <el-container>
      <el-header>
        <layout-header/>
      </el-header>
      <el-main>
        <router-view/>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
import LayoutMenu from "@/page/LayoutMenu";
import LayoutHeader from "@/page/LayoutHeader";
import ManagerLayoutMenu from "@/page/ManagerLayoutMenu";
import Cookies from 'js-cookie'

export default {
  components: {ManagerLayoutMenu, LayoutMenu, LayoutHeader},
  data() {
    return {
      roleId: -1,
      username: '',
      dialogVisible: false,
    };
  },

  mounted() {
    this.roleId = Number(Cookies.get('role'));
    this.username = Cookies.get('user_name') || '';
    this.checkoutLogin();
  },
  methods: {
    confirmClick() {
      this.$router.push({
        path: '/'
      });
    },
    checkoutLogin() {
      if (this.username === '') {
        this.dialogVisible = true;
      }
    }
  }
}
</script>
<style scoped>
.el-header {
  background: rgba(51, 51, 51, .9);
  background: linear-gradient(30deg, #4b4141, #444e52, #49483d);
  width: 100%;
  color: #333;
  text-align: center;
  line-height: 60px;
}

.el-aside {
  background-color: #545c64;
  color: #333;
  text-align: center;
  height: 100%;
  overflow-y: auto;
}

.el-main {
  background-color: rgb(233, 238, 243);
  color: #333;
  text-align: center;
  overflow-y: auto;
}

body > .el-container {
  margin-bottom: 40px;
}
</style>