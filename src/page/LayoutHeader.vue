<template>
  <div>
    <span style="color: white;float: right">
      用户名：{{ username }}
    </span>
    <span>
      <img style="margin-top: 8px;margin-left: 35%;position: fixed" width="40" src="../assets/bilibili_blue.svg"
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
  methods: {}
}
</script>

<style scoped>

</style>