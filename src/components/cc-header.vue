<template>
  <div class="cc-header">
    <ul class="nav-left">
      <li>我的简历</li>
      <li>简历市场</li>
      <li>关于</li>
    </ul>
    <ul class="nav-right">

    </ul>
  </div>
</template>
<script>
  export default {
    name: '',
    data() {
      return {
        name: ''
      }
    }
  }
</script>
<style lang="less">
.cc-header{
  height: 64px;
  width: 100%;
  background: #2196f3;
  z-index: 9999;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  box-sizing: border-box;
  ul,li{
    list-style: none;
    margin: 0;
    padding: 0;
  }
  .nav-left{
    li{
      display: inline-block;
      color: #fff;
      margin-right: 15px;
      cursor: pointer;
    }

  }
}
</style>
