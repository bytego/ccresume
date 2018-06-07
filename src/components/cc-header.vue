<template>
  <div class="cc-header">
    <ul class="nav-left">
      <li class="logo">
        <img src="https://nebulas.io/assets/images/nebulasx60.png">
      </li>
      <li class="title" @click="$router.push('/')">云简历</li>
      <li class="item">我的简历</li>
      <li class="item" @click="$router.push('/cclist')">简历市场</li>
    </ul>
    <ul class="nav-right">
      <li @click="$router.push('/about')">关于</li>
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
  margin-bottom: 20px;
  ul,li{
    list-style: none;
    margin: 0;
    padding: 0;
  }
  .nav-left{
    display: flex;
    align-items: center;
    padding: 10px;
    box-sizing: border-box;
    li{
      display: inline-block;
      color: #fff;
      margin-right: 20px;
      cursor: pointer;
      transition: all .5s;
      transform: scale(1);
      &.item:hover{
        transform: scale(1.2);
      }
      &.title{
        font-size: 22px;
        color: #fff;
        margin-right: 30px;
      }
      &.logo{
        width: 160px;
        img{
          width: 100%;
          height: 100%;
        }
      }
    }

  }
  .nav-right{
    li{
      color: #fff;
      transform: scale(1);
      transition: all .5s;
      cursor: pointer;
      &:hover{
        transform: scale(1.2);
      }
    }
  }
}
</style>
