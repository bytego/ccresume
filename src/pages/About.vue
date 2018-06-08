<template>
    <div class="container" id="about">
		<h1 class="align-center fs20 c999">关于本站</h1>
		<mu-row id="home">
      <mu-col width="100" tablet="100" desktop="60" style="margin: 0 auto">
        <span class="align-center fs20 c999 pt40 pb25">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;这是一份功能完备的简历工具，支持生成在线编辑简历，生成简历pdf,图片等功能</span>
        <br>
        <span class="align-center fs20 c999 pt40 pb25">提供简历市场功能，可以付费阅读他人简历，学习怎么写好一份简历。</span>
        <div class="stat">
          <div class="com-nums">已经有 <span class="nums">{{stat.collNums}}</span> 份简历</div>
        </div>
      </mu-col>
		</mu-row>
    </div>
</template>
<style lang="less">
#about{
  text-align: center;
}
#home .stat {
  text-align: center;
  margin-bottom: 50px;
  font-weight: bold;
  font-size: 15px;
  color: #666;
}
#home .stat > div {
  display: inline-block;
}
#home .nums {
  color: #f30707;
  font-size: 30px;
  margin: 0px 10px;
}
#home .com-nums {
  margin-right: 20px;
}

</style>

<script>
  export default {
    created() {
      this.fetchStat();
    },
    data() {
      return {
        stat: {
          collNums: 0,
        }
      };
    },
    methods: {
      fetchStat() {
        this.$hub
          .nebApiCall({
            func: "stats"
          })
          .then(data => {
            if (data) {
              this.stat = data;
            }
          });
      }
    }
  };
</script>

