<template>
  <div>
    <el-menu
        active-text-color="#ffd04b"
        background-color="#545c64"
        class="el-menu-vertical-demo"
        :default-active="$router.currentRoute.value.fullPath"
        text-color="#fff"
        :router="true"
        :unique-opened="true"
        @open="handleOpen"
        @close="handleClose"
    >
      <div class="layout-menu__logo" style="text-align: center">
        <img style="margin-top: 10px" width="70" src="../assets/bilibili_logo.png" alt="">
      </div>
      <el-menu-item index="/home">
        <template #title>
          <el-icon>
            <home-filled/>
          </el-icon>
          <span>首页</span>
        </template>
      </el-menu-item>

      <el-sub-menu index="1">
        <template #title>
          <el-icon>
            <avatar/>
          </el-icon>
          <span>员工管理</span>
        </template>
        <el-menu-item index="/manager-employee-info">员工信息</el-menu-item>
        <el-menu-item index="/department-info">部门信息</el-menu-item>
      </el-sub-menu>

      <el-sub-menu index="2">
        <template #title>
          <el-icon>
            <histogram/>
          </el-icon>
          <span>资产管理</span>
        </template>
        <el-menu-item index="/asset-info">资产信息</el-menu-item>
        <el-menu-item index="/asset-use">资产借用</el-menu-item>
        <el-menu-item index="/use-record">使用记录</el-menu-item>
      </el-sub-menu>

      <el-sub-menu index="3">
        <template #title>
          <el-icon>
            <setting/>
          </el-icon>
          <span>资产维修</span>
        </template>
        <el-menu-item index="/repair-record">维修记录</el-menu-item>
      </el-sub-menu>

      <el-sub-menu index="4">
        <template #title>
          <el-icon>
            <lock/>
          </el-icon>
          <span>权限管理</span>
        </template>
        <el-menu-item index="/user-info">用户信息</el-menu-item>
        <el-menu-item index="/change-password">修改密码</el-menu-item>
      </el-sub-menu>
    </el-menu>
  </div>
</template>

<script>
// import {Edit} from "@element-plus/icons";

export default {
  name: "ManagerLayoutMenu",
  // components: {Edit},
  data() {
    return {};
  },
  mounted() {
  },
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    }
  }
}
</script>

<style scoped>

</style>