<template>
	<div class="container" id="company-list">
		<mu-row>
			<mu-col width="100" tablet="100" desktop="50" style="margin: 0 auto">
				<mu-list>
					<mu-sub-header>公司列表</mu-sub-header>
						<mu-list-item  :title="item.name" v-for="item in companyList.company" :key="item.hash" v-if="item">
							<div @click="$router.push({name:'CompanyProfile',params:{id:item.hash}})">
							<div slot="describe">
								工商企业号：{{ item.companyId }}
							</div>
							<div slot="default" class="review-state">
								<span class="pass" v-if="item.reviewed && item.reviewed.pass">已通过</span>
								<span class="reject" v-if="item.reviewed && !item.reviewed.pass">未通过</span>
								<span class="unreview" v-if="!item.reviewed">未审核</span>
							</div>
							</div>
							<mu-icon-menu slot="right" icon="more_vert" tooltip="操作" v-if="$hub.address == $hub.chainInfo.admin">
								<mu-menu-item title="通过认证" @click.stop="pass(item)"/>
								<mu-menu-item title="拒绝认证" @click.stop="reject(item)"/>
							</mu-icon-menu>
						</mu-list-item>
						<div style="text-align:center;">
							<mu-flat-button label="查看更多" @click="loadMore" primary/>
						</div>
				</mu-list>
			</mu-col>
		</mu-row>
	</div>
</template>
<style>

</style>

<script>
export default {
  data() {
    return {
      data: [],
      offset: -1,
      limit: 20,
      companyList: {
        total: -1,
        company: []
      }
    };
  },
  created() {
    this.getCompanyList();
  },
  methods: {
    loadMore() {
	  this.offset -= this.limit
	  if(this.offset < 0){
		  this.offset = 0
		  return this.$parent.toast('没有更多数据……')
	  }
      this.getCompanyList()
    },
    getCompanyList() {
      this.$hub
        .nebApiCall({
          func: "getCompanyList",
          args: [this.limit,this.offset]
        })
        .then(data => {
          if (this.offset == -1) {
            this.offset = data.total
		  }
		  this.companyList.total = data.total
          this.companyList.company = this.companyList.company.concat(
            data.company
          );
        });
    },
    pass(item) {
      var data = {
        func: "reviewCompany",
        data: [item.hash, true],
        context: this,
		successMsg: "已通过公司：" + item.name,
		successFunc:function(){
			location.reload()
		}
      };
      this.$hub.nebPayCall(data);
    },
    reject(item) {
      var data = {
        func: "reviewCompany",
        data: [item.hash, false],
        context: this,
		successMsg: "已拒绝公司：" + item.name,
		successFunc:function(){
			location.reload()
		}
      };
      this.$hub.nebPayCall(data);
    }
  }
};
</script>