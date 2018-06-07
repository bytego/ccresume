<template>
    <div class="container" id="about">
		<h1 class="align-center fs20 c999">我的信息</h1>
		<mu-row v-if="user">
			<mu-col width="100" tablet="100" desktop="60" style="margin: 0 auto">
                <mu-text-field label="姓名" labelFloat fullWidth v-model="user.name"/>
			    <mu-text-field label="NAS地址" labelFloat fullWidth disabled v-model="user.address"/>
                <mu-raised-button :disabled="!this.user.address" primary icon="send" iconClass="fs16" label="保存" fullWidth class="mt25 mb25" @click="submit"/>
			</mu-col>
		</mu-row>
    </div>
</template>
<script>
export default {
  watch: {
    "$hub.user": function(n, o) {
      this.user = JSON.parse(JSON.stringify(this.$hub.user));
    },
    "$hub.address": function(n, o) {
      if (!this.user.address) {
        this.user.address = n;
      }
    }
  },
  created() {
    if (!this.user.address) {
      this.user.address = this.$hub.address;
    }
  },
  methods: {
    submit() {
      if (!this.user.name) return this.$parent.toast("请输入姓名");
      var _this = this;

      var data = {
        func: "setUser",
        data: [this.user],
        context: this,
        successMsg: "更新用户信息成功!",
        successFunc: function(resp) {
          location.reload();
        }
      };
      this.$hub.nebPayCall(data);
    }
  },
  data() {
    return {
      // isCompanyAdmin
      // companyHash
      user: JSON.parse(JSON.stringify(this.$hub.user))
    };
  }
};
</script>
