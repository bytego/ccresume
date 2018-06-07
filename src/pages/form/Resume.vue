<template>
	<div class="container">
		<mu-row>
			<mu-col width="100" tablet="100" desktop="33" style="margin: 0 auto">
				<p style="color:#f44336" v-if="!this.$hub.company.hash">你的公司未注册，请先注册公司！</p>
				<mu-text-field label="姓名" labelFloat fullWidth v-model="resume.name"/>
				<mu-text-field label="员工NAS地址" labelFloat fullWidth v-model="resume.nasAddress"/>
				<mu-text-field label="职位" labelFloat fullWidth v-model="resume.jobTitle"/>
				<!-- <mu-text-field label="薪水" labelFloat fullWidth v-model="resume.pay"/> -->
				<mu-date-picker label="入职时间" labelFloat fullWidth v-model="resume.joinDate"/>
				<mu-date-picker label="离职时间" labelFloat fullWidth v-model="resume.leaveDate"/>
				<div class="mu-text-field-label">入职评价</div>
				<mu-text-field fullWidth lable="入职评价" hintText="入职评价" multiLine  v-model="resume.joinDesc" :rows="3" :rowsMax="6"/>
				<div class="mu-text-field-label">总体评价</div>
				<mu-text-field fullWidth lable="总体评价" hintText="总体评价" multiLine  v-model="resume.leaveDesc" :rows="3" :rowsMax="6"/>
				<mu-raised-button :disabled="!this.$hub.company.hash" primary icon="send" iconClass="fs16" label="保存" fullWidth class="mt25 mb25" @click="submit"/>
			</mu-col>
		</mu-row>
	</div>
</template>

<script>
export default {
  created() {
    // alert(this.$hub.company.name)
  },
  data() {
    return {
      resume: {
        name: "",
        nasAddress: "",
        joinDate: "",
        leaveDate: "",
        jobTitle: "",
        // pay: "",
        joinDesc: "",
        leaveDesc: ""
      }
    };
  },
  methods: {
    submit() {
      if (!this.resume.name) return this.$parent.toast("请输入员工姓名");
      if (!this.resume.nasAddress)
        return this.$parent.toast("请输入员工NAS地址");
      if (!this.resume.joinDate) return this.$parent.toast("请输入入职时间");
      if (!this.resume.leaveDate) return this.$parent.toast("请输入离职时间");
      if (!this.resume.jobTitle) return this.$parent.toast("请输入职位");
      //   if (!this.resume.pay) return this.$parent.toast("请输入薪水");
      if (!this.resume.joinDesc) return this.$parent.toast("请输入入职评价");
      if (!this.resume.leaveDesc) return this.$parent.toast("请输入总体评价");
      var companyHash = this.$hub.company.hash,
        _this = this;

      var data = {
        func: "addStaffResume",
        data: [companyHash, this.resume],
        context: this,
        successMsg: "添加简历成功！",
        successFunc: function(resp) {
          _this.$router.push({
            name: "StaffPofile",
            params: { id: _this.resume.nasAddress }
          });
        }
      };
      this.$hub.nebPayCall(data);
    }
  }
};
</script>