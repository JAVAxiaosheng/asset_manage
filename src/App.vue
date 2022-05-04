<template>
  <router-view></router-view>
</template>
<script>

export default {
  name: 'App',
  components: {}
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
}

#app {
  text-align: center;
  display: flex;
  flex: 1 1 auto;
  height: 100vh;
  background: #eef0f4;
  overflow-y: auto;
}
</style>
