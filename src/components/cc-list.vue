<template>
  <div class="list-main">
    <div class="cc-list"
         @click="onClickLink(item.fromUser)"
         v-for="item in companyList.coll" v-if="item">
      <div class="middle">
        <h2>{{item && item.core && item.core[0].value}}</h2>
        <small v-if="item && item.core && item.core.length > 4">{{item.core[4].value?'('+item.core[4].value+')':''}}</small>
        <ul>
          <!--<li v-for="c in item.core">
            <span>{{c.name}}</span>
            <span>{{c.value}}</span>
          </li>-->
          <li>
            <span>职位：</span>
            <span>{{item && item.core && item.core[1].value}}</span>
          </li>
          <li>
            <span>项目经历：</span>
            <span>{{ item && item.exp && item.exp[1].exp.length }}个</span>
          </li>
          <li>
            <span>邮箱：</span>
            <span>{{ item && item.core && item.core.length > 3 && item.core[3].value }}</span>
          </li>
        </ul>
        <div class="info">
          <button type="button">{{ item && item.num }}人已经阅读</button>
          <button type="button">{{ item && item.num1 }}人已经联系</button>
          <button type="button">付费0.00001 nas 查看详情</button>
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
        data: [],
        offset: -1,
        limit: 20,
        companyList: {
          total: -1,
          coll: []
        }
      };
    },
    mounted() {
      console.log(this.$route)
    },
    created() {
      this.getCompanyList();
    },
    methods: {
      getCompanyList() {
        this.$hub
          .nebApiCall({
            func: "getCollList",
            args: [this.limit,this.offset]
          })
          .then(data => {
            console.log(data)

            if (this.offset == -1) {
              this.offset = data.total
            }
            this.companyList.total = data.total
            this.companyList.coll = this.removeRepeat(data.coll);
          });
      },
      removeRepeat(list){
        var map = {}
        var rs = [];
        list.forEach(li => {
          if(!li){
            return;
          }
          if(!map[li.fromUser]){
            rs.push(li);
            map[li.fromUser] = true;
          }
        });
        return rs;
      },
      onClickLink (forUser) {

        var data = {
          func: "addProve",
          data: [forUser],
          value : 0.00001,
          context: this,
          successMsg: "支付查看简历成功!",
          successFunc: (resp) => {

            this.$router.push({
              path: '/detail',
              query: {
                id: forUser
              }
            })

          }
        };

        this.$hub.nebPayCall(data);

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
    width: 80%;
    display: inline-block;
    h2{
      margin: 0;
      font-size: 24px;
      padding-bottom: 10px;
      display: inline-block;
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
