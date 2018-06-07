<template>
	<section id="home">
		<h1 class="align-center fs20 c999 pt40 pb25">查看人员工作经历</h1>
		<div class="stat">
			<div class="com-nums">已入住 <span class="nums">{{stat.companyNums}}</span> 家公司</div>
			<div>已认证 <span class="nums">{{stat.staffNums}}</span> 份工作经历</div>
		</div>
		<div class="search-box" style="text-align:center">
			<mu-text-field label="输入人员NAS地址查询工作记录"  labelFloat  v-model="keywords" @keyup.enter.native="search"/>
			<mu-raised-button icon="search" iconClass="fs16" label="搜索"  class="mt25 mb25" @click="search"/>
		</div>
	</section>
</template>

<script>
export default {
  created() {
    this.fetchStat();
  },
  data() {
    // console.log(this.$hub.nebState)
    return {
      keywords: "n1J5YqDGzXbGNUwW9asuh4py2sjHr86XyHr",
      stat: {
        companyNums: 0,
        reviewedCompanyNums: 0,
        staffNums: 0
      }
      // search_result  : null,
      // search_dialog  : false
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
	},
    search() {
      if (!this.keywords) {
        return this.$parent.toast("请输入用户NAS地址以查询工作记录");
      }
      this.$router.push({ name: "StaffPofile", params: { id: this.keywords } });

      // 这里读取数据 赋值给 search_result

      // this.showSearchDislog();
    }
    // showSearchDislog()
    // {
    // 	this.search_dialog = true;
    // }
  }
};
</script>
<style>
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
  color: #009688;
  font-size: 30px;
  margin: 0px 10px;
}
#home .com-nums {
  margin-right: 20px;
}
</style>
