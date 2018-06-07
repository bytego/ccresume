<template>
	<div class="container" v-if="company">
		<h1 class="align-center fs20 c999">公司信息</h1>
		<mu-row>
			<mu-col width="100" tablet="100" desktop="50" style="margin: 20px auto">
				<mu-table :showCheckbox="false">
					<mu-tbody>
						<!-- name: "链社区", //全称
        desc:
          "链社区 - 致力服务于广大区块链开发者的交流平台。这是一个基于星云链开发的DAPP，论坛所有数据全部储存于链社区的智能合约当中，数据永远保存在区块链上。大家如果在开发 DAPP 的过程中遇见任何问题都可以来这里发帖交流。论坛也有很多其他栏目，所以你也可以来这里分享你的故事！", //简介
        phone: "12345678901",
        established: "2018-05", //成立时间
        address: "星云链txash：n1jWpKadorv27XgSbo4WRZvsyCdAajkEP4B", //企业地址
        industry: "区块链", //所属行业
        companyId: "星云链txash：n1jWpKadorv27XgSbo4WRZvsyCdAajkEP4B", //工商企业号
        legalPerson: "链社区", //法人
        website: "https://bbs.forfunapp.com/", //网址
        logo: "", //logo 网址
        reviewed:null,
		 -->
						<mu-tr>
							<mu-td>公司全称</mu-td>
							<mu-td>{{company.name}}</mu-td>
						</mu-tr>
						<mu-tr>
							<mu-td>简介</mu-td>
							<mu-td style="white-space:normal;padding:15px 25px;">
								{{company.desc}}
							</mu-td>
						</mu-tr>
						<mu-tr>
							<mu-td>行业</mu-td>
							<mu-td>{{company.industry}}</mu-td>
						</mu-tr>
						<mu-tr>
							<mu-td>成立时间</mu-td>
							<mu-td>{{company.established}}</mu-td>
						</mu-tr>
						<mu-tr>
							<mu-td>注册地址</mu-td>
							<mu-td style="white-space:normal;padding:15px 25px;">{{company.address}}</mu-td>
						</mu-tr>
						<mu-tr>
							<mu-td>工商企业号</mu-td>
							<mu-td style="white-space:normal;padding:15px 25px;">{{company.companyId}}</mu-td>
						</mu-tr>
						<mu-tr>
							<mu-td>法人</mu-td>
							<mu-td>{{company.legalPerson}}</mu-td>
						</mu-tr>
						<mu-tr>
							<mu-td>公司网址</mu-td>
							<mu-td>
								<a :href="company.website" target="_blank" class="blue">{{company.website}}</a>
							</mu-td>
						</mu-tr>
					</mu-tbody>
				</mu-table>
			</mu-col>
		</mu-row>
	</div>
</template>

<script>
export default {
  created() {
    this.fetchCompanyInfo();
  },
  methods: {
    fetchCompanyInfo() {
      this.$hub
        .nebApiCall({
          func: "getCompany",
          args: [this.$route.params.id]
        })
        .then(data => {
          if (data) {
            this.company = data;
          }
        });
    }
  },
  data() {
    return {
      company: null
    };
  }
};
</script>