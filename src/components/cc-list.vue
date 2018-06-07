<template>
  <div class="cc-list">
    <div class="left">
      <img src="https://gkcx.eol.cn/upload/schoollogo/428.jpg">
    </div>
    <div class="middle">
      <h2>姓名</h2>
      <ul>
        <li>
          <span>职位：</span>
          <span>综合类</span>
        </li>
        <li>
          <span>工作年限：</span>
          <span>湖北荆州</span>
        </li>
      </ul>
      <div class="info">
        <button type="button">4人已经认证</button>
        <button type="button">2人已经报读</button>
      </div>
    </div>
    <div class="right">
      <ul>
        <li>查看详情</li>
        <li>我来认真</li>
        <li>报读高校</li>
      </ul>
    </div>
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
.cc-list{
  width: 700px;
  background: #ddd;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .left{
    width: 120px;
    height: 120px;
    display: inline-block;
    img{
      width: 100%;
      height: 100%;
    }
  }
  .middle{
    width: 60%;
    display: inline-block;
    padding-left: 50px;
    h2{
      margin: 0;
      font-size: 24px;
      padding-bottom: 10px;
    }
    ul{
      margin: 0;
      padding: 10px 0;
      li{
        display: inline-block;
        list-style: none;
        margin-right: 20px;
      }
    }
    button{
      outline: none;
      font-size: 12px;
      padding: 2px 10px;
      border: 1px #43a047 solid;
      color: #43a047;
      margin-right: 10px;
    }
  }
  .right{
    display: inline-block;
  }
}
</style>
