<template>
	<div class="container">
		<mu-row v-if="!loading">
			<mu-col width="100" tablet="100" desktop="40" style="margin: 0 auto">
        <div style="margin-bottom:10px;" v-if="!companyNotFound">
        <span class="pass" v-if="company.reviewed && company.reviewed.pass">已通过</span>
        <span class="reject" v-if="company.reviewed && !company.reviewed.pass">未通过</span>
        <span class="unreview" v-if="!company.reviewed">未审核</span>
        </div>
        <div style="margin-bottom:10px;" v-else>
          <span class="unreview" >未注册公司</span>
        </div>
				<mu-card>
          <mu-card-header title="管理员信息："></mu-card-header>
          <mu-card-text>
            <mu-text-field label="钱包地址" labelFloat fullWidth disabled v-model="$hub.address"/>
				  </mu-card-text>
        </mu-card>

				<mu-card style="margin-top:20px">
          <mu-card-header title="公司信息："></mu-card-header>
          <mu-card-text>
				<mu-text-field label="公司全称" labelFloat fullWidth v-model="company.name"/>
				<mu-text-field label="联系电话" labelFloat fullWidth v-model="company.phone"/>
				
				<mu-text-field fullWidth lable="公司简介" hintText="公司简介" multiLine  v-model="company.desc" :rows="3" :rowsMax="6"/>
				<mu-text-field label="成立时间" labelFloat fullWidth v-model="company.established"/>
				<mu-text-field label="注册地址" labelFloat fullWidth v-model="company.address"/>
				<mu-text-field label="所属行业" labelFloat fullWidth v-model="company.industry"/>
				<mu-text-field label="工商企业号" labelFloat fullWidth v-model="company.companyId"/>
				<mu-text-field label="公司法人" labelFloat fullWidth v-model="company.legalPerson"/>
				<mu-text-field label="公司网址" labelFloat fullWidth v-model="company.website"/>
				<mu-text-field label="公司Logo" hintText="请输入公司 Logo 地址" labelFloat fullWidth v-model="company.logo"/>
				<mu-raised-button primary icon="send" iconClass="fs16" label="保存"  class="mt25 mb25" @click="submit"/>
          </mu-card-text>
        </mu-card>
			</mu-col>
		</mu-row>
	</div>
</template>

<script>
export default {
  created() {
    this.fetchCompanyInfo();
  },
  data() {
    return {
      loading:true,
      companyNotFound:false,
      company: {
        name: "", //全称
        desc:"", //简介
        phone: "",
        established: "", //成立时间
        address: "", //企业地址
        industry: "", //所属行业
        companyId: "", //工商企业号
        legalPerson: "", //法人
        website: "", //网址
        logo: "", //logo 网址
        reviewed:null,
      }
    };
  },
  methods: {
    fetchCompanyInfo() {
      this.$hub
        .nebApiCall({
          func: "getCompanyByAdmin"
        })
        .then(data => {
          // console.log('xxxxx',data)
          // var company = JSON.parse(result)
          if(data){
            this.company = data;
          }else{
            this.companyNotFound = true
          }
          this.loading  = false
        });
    },
    submit() {
      if (!this.company.name) return this.$parent.toast("请输入公司全称");
      if (!this.company.phone) return this.$parent.toast("请输入联系电话");
      if (!this.company.desc) return this.$parent.toast("请输入公司简介");
      if (!this.company.established)
        return this.$parent.toast("请输入公司成立时间");
      if (!this.company.address) return this.$parent.toast("请输入注册地址");
      if (!this.company.industry)
        return this.$parent.toast("请输入公司所属行业");
      if (!this.company.companyId)
        return this.$parent.toast("请输入工商企业号");
      if (!this.company.legalPerson)
        return this.$parent.toast("请输入公司法人");
      if (!this.company.website) return this.$parent.toast("请输入公司网址");
      // if (!this.company.logo) return this.$parent.toast("请输入公司logo 网址");

      var data = {
        value: 0,
        func: "addCompany",
        data: [this.company],
        context: this,
        successMsg: "注册公司成功，请等待审核通过……",
        successFunc: function(resp) {
          location.reload()
        }
      };
      this.$hub.nebPayCall(data);
    }
  }
};
</script>