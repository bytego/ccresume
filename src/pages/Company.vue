<template>
	<section>
		<h1 class="align-center fs20 c999 pt40 pb25">查看公司资料</h1>
		<div class="search-box">
			<mu-text-field label="公司 / 企业名称" inputClass="align-center" labelFloat fullWidth v-model="keywords" @keyup.enter.native="search"/>
			<mu-raised-button icon="search" iconClass="fs16" label="搜索" fullWidth class="mt25 mb25" @click="search"/>
		</div>
	</section>
</template>

<script>
	export default {
		data()
		{
			return {
				keywords       : '',
				search_result  : null,
				search_dialog  : false
			}
		},
		methods: {
			search()
			{
				if (!this.keywords)
					return this.$parent.toast('请输入公司 / 企业名称');

				// 这里读取数据 赋值给 search_result

				this.showSearchDislog();
			},
			showSearchDislog()
			{
				this.search_dialog = true;
			}
		}
	}
</script>