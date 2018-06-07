<template>
	<div class="container" id="staff-resume">
		<h1 class="align-center fs20 c999" >{{user.name||user.address}}的工作经历</h1>
		<mu-row>
			<mu-col width="100" tablet="100" desktop="70" style="margin: 0 auto">
				<mu-table :showCheckbox="false">
					<mu-thead>
						<mu-tr>
							<mu-th>公司名称</mu-th>
							<mu-th>入职时间</mu-th>
							<mu-th>离职时间</mu-th>
							<mu-th>职位</mu-th>
							<mu-th>详情</mu-th>
						</mu-tr>
					</mu-thead>
					<mu-tbody>
						<mu-tr @click.native="viewInfo(item)" v-for="item in resumeList" :key="item.hash">
							<mu-td>{{item.company && item.company.name}}</mu-td>
							<mu-td>{{item.joinDate}}</mu-td>
							<mu-td>{{item.leaveDate}}</mu-td>
							<mu-td>{{item.jobTitle}}</mu-td>
							<mu-td>
								<a class="blue">查看详情</a>
								<!-- <p>{{item.nasAddress}}</p>
								<p>{{$hub.address}}</p> -->
								<span v-if="item.nasAddress == $hub.address">
									| <span class="blue" @click.stop="setVisible(item.hash,false)" v-if="item.visible">隐藏</span><span  @click.stop="setVisible(item.hash,true)"  class="blue" v-else>显示</span>
								</span>
							</mu-td>
						</mu-tr>
					</mu-tbody>
				</mu-table>
			</mu-col>
		</mu-row>

		<mu-dialog scrollable :open="dialogVisible" title="工作经历详情">
				<mu-table :showCheckbox="false">
					<mu-tbody>
						<mu-tr>
							<mu-td>公司全称</mu-td>
							<mu-td>{{resume.company && resume.company.name}}</mu-td>
						</mu-tr>
						<mu-tr>
							<mu-td>职位</mu-td>
							<mu-td>{{resume.jobTitle}}</mu-td>
						</mu-tr>
						<mu-tr>
							<mu-td>入职时间</mu-td>
							<mu-td>{{resume.joinDate}}</mu-td>
						</mu-tr>
						<mu-tr>
							<mu-td>离职时间</mu-td>
							<mu-td>{{resume.leaveDate}}</mu-td>
						</mu-tr>
						<mu-tr>
							<mu-td>入职评价</mu-td>
							<mu-td class="job-desc" style="white-space: normal;padding: 24px 24px;">{{resume.joinDesc}}</mu-td>
						</mu-tr>
						<mu-tr>
							<mu-td>离职评价</mu-td>
							<mu-td class="job-desc" style="white-space: normal;padding: 24px 24px;">{{resume.desc}}</mu-td>
						</mu-tr>
					</mu-tbody>
				</mu-table>
			<mu-flat-button label="确定" slot="actions" primary @click="dialogVisible = false"/>
		</mu-dialog> 
	</div>
</template>

<script>
export default {
  watch: {
    "$route": function() {
	  this.staffNasAddress = this.$route.params.id;
	  this.user.address = this.staffNasAddress
      this.fetchStaffInfo();
      this.fetchStaffResume();
    }
  },
  methods: {
    setVisible(hash, visible) {
      var _this = this;

      var data = {
        func: "setResumeVisible",
        data: [hash, visible],
        context: this,
        successMsg: (visible ? "显示" : "隐藏") + "成功！",
        successFunc: function(resp) {
          _this.fetchStaffResume();
        }
      };
      this.$hub.nebPayCall(data);
    },
    viewInfo(item) {
      this.resume = item;
      this.dialogVisible = true;
    },
    fetchStaffInfo() {
      this.$hub
        .nebApiCall({
          func: "getUser",
          args: [this.staffNasAddress]
        })
        .then(data => {
          if (data) {
            this.user = data;
          }
        });
    },
    fetchStaffResume() {
      this.$hub
        .nebApiCall({
          func: "getResumeList",
          args: [this.staffNasAddress]
        })
        .then(data => {
          this.resumeList = data.resume;
        });
    }
  },
  created() {
    this.fetchStaffInfo();
    this.fetchStaffResume();
  },
  data() {
    var staffNasAddress = this.$route.params.id;
    return {
      staffNasAddress: staffNasAddress,
      dialogVisible: false,
      user: { name: "", address: staffNasAddress },
      resume: {},
      resumeList: []
    };
  }
};
</script>
<style>
#staff-resume .blue {
  cursor: pointer;
}

#staff-resume .job-desc {
  white-space: normal !important;
  padding: 24px 24px !important;
}
</style>
