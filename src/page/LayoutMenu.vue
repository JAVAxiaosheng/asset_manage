<template>
  <div>
    <el-menu
        active-text-color="#ffd04b"
        background-color="#545c64"
        class="el-menu-vertical-demo"
        default-active="2"
        text-color="#fff"
        router="true"
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
        <el-menu-item index="student-info">员工信息</el-menu-item>
        <el-menu-item index="1-2">修改信息</el-menu-item>
      </el-sub-menu>

      <el-sub-menu index="2">
        <template #title>
          <el-icon>
            <histogram/>
          </el-icon>
          <span>资产管理</span>
        </template>
        <el-menu-item index="2-1">资产信息</el-menu-item>
        <el-menu-item index="2-2">资产借还</el-menu-item>
      </el-sub-menu>

      <el-sub-menu index="3">
        <template #title>
          <el-icon>
            <setting/>
          </el-icon>
          <span>资产维修</span>
        </template>
        <el-menu-item index="2-1">维修上报</el-menu-item>
        <el-menu-item index="2-2">维修记录</el-menu-item>
      </el-sub-menu>

      <el-menu-item index="employee-change-password">
        <template #title>
          <el-icon>
            <unlock/>
          </el-icon>
          <span>修改密码</span>
        </template>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script>
// import {Edit} from "@element-plus/icons";

export default {
  name: "LayoutMenu",
  // components: {Edit},
  data() {
    return {};
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