<template>
  <div class="list-main">
    <div class="cc-list"
         @click="onClickLink()"
         v-for="item in 2">
      <div class="left">
        <img src="https://gkcx.eol.cn/upload/schoollogo/428.jpg">
      </div>
      <div class="middle">
        <h2>姓名</h2>
        <ul>
          <li>
            <span>职位：</span>
            <span>web前端</span>
          </li>
          <li>
            <span>工作年限：</span>
            <span>1年</span>
          </li>
        </ul>
        <div class="info">
          <button type="button">4人已经阅读</button>
          <button type="button">2人已经联系</button>
        </div>
      </div>
      <div class="right">
        <img src="../assets/image/1111.png">
      </div>
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
    },
    mounted() {
      console.log(this.$route)
    },
    methods: {
      onClickLink (item) {
        this.$router.push({
          path: '/detail',
          query: {
            id: 111
          }
        })
      }
    }
  }
</script>
<style lang="less">
.list-main{
  width: 700px;
  margin: 0 auto;
}
.cc-list{
  width: 700px;
  background: #ddd;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 4px;
  margin-bottom: 20px;
  cursor: pointer;
  &:hover{
    background: #a1a1a1;
  }
  .left{
    width: 120px;
    height: 120px;
    display: inline-block;
    border-radius: 50%;
    overflow: hidden;
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
      border-radius: 4px;
    }
  }
  .right{
    display: inline-block;
    img{
      width: 100px;
      height: 100px;
    }
  }
}
</style>
