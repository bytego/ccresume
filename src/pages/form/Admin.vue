<template>
	<div class="container" id="company-admin">
		<h1 class="align-center fs20 c999">公司管理员</h1>
		<mu-row>
			<mu-col width="100" tablet="100" desktop="50" style="margin: 0 auto">
				<mu-list>
					<mu-list-item title="添加管理员" @click.native="form_dialog = true">
						<mu-icon slot="right" value="arrow_forward_ios"/>
					</mu-list-item>
					<mu-list-item :title="item.name || item.nasAddress" v-for="item in companyAdmin" :key="item.nasAddress">
						<div>
				         <p v-if="item.name">NAS地址：{{item.nasAddress}}</p>
						 <p>部门：{{item.department||'未设置'}} <span class="superuser" v-if="item.superuser">超级管理员</span></p>
						 <p v-if="item.note">{{item.note}}</p>
				    	</div>
						<mu-icon-menu slot="right" icon="more_vert" tooltip="操作">
							<mu-menu-item @click="changeAdmin(item)" title="修改" />
							<mu-menu-item @click="delAdmin(item)" title="删除" />
						</mu-icon-menu>
					</mu-list-item>
				</mu-list>
			</mu-col>
		</mu-row>

		<mu-dialog :open="form_dialog" title="添加管理员">
			<mu-text-field label="姓名" labelFloat fullWidth v-model="admin.name"/>
			<mu-text-field label="NAS地址" labelFloat fullWidth v-model="admin.nasAddress"/>
			<mu-text-field label="部门" labelFloat fullWidth v-model="admin.department"/>
			<mu-text-field label="备注" labelFloat fullWidth v-model="admin.note"/>
			<mu-flat-button label="取消" slot="actions" @click="form_dialog = false" />
			<mu-flat-button label="确定" slot="actions" primary @click="submit"/>
		</mu-dialog>
	</div>
</template>

<script>
export default {
  created() {
    this.fetchCompanyAdmin();
  },
  methods: {
    changeAdmin(item) {
		this.admin = JSON.parse(JSON.stringify(item))
		this.form_dialog=true
	},
    delAdmin(item) {
      var _this = this;
      var data = {
        func: "delCompanyAdmin",
        data: [this.company.hash, item.nasAddress],
        context: this,
        successMsg: "删除管理员成功",
        successFunc: function(resp) {
          _this.fetchCompanyAdmin();
        }
      };
      this.$hub.nebPayCall(data);
    },
    fetchCompanyAdmin() {
      var companyHash = this.company.hash || this.$hub.company.hash;
      if (!companyHash) {
        return;
      }
      this.$hub
        .nebApiCall({
          func: "getCompanyAdmin",
          args: [companyHash]
        })
        .then(data => {
          if (!data) {
            return;
          }
          this.companyAdmin = data;
        });
    },
    submit() {
      if (!this.admin.name) return this.$parent.toast("请输入姓名");
      if (!this.admin.nasAddress) return this.$parent.toast("请输入NAS地址");
      if (!this.admin.department) return this.$parent.toast("请输入部门");
      var _this = this;

      var data = {
        func: "addCompanyAdmin",
        data: [this.company.hash, [this.admin]],
        context: this,
        successMsg: "添加管理员成功",
        successFunc: function(resp) {
          location.reload()
        }
      };
	  this.$hub.nebPayCall(data);
	  this.form_dialog = false
    }
  },
  watch: {
    "$hub.company.hash": function() {
      // console.log('xxxx')
      this.company = this.$hub.company;
      this.fetchCompanyAdmin();
    }
  },
  data() {
    return {
      form_dialog: false,
      companyAdmin: {},
      company: {
        hash: this.$hub.company.hash
      },
      admin: {
        name: "",
        nasAddress: "",
        department: "",
        note: ""
      }
    };
  }
};
</script>
<style>
#company-admin .superuser {
  background: #009688;
  color: #fff;
  font-size: 12px;
  padding: 3px 6px;
  border-radius: 3px;
  margin-left: 20px;
}
</style>
