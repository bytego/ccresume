<template>
	<div class="container">
		<h1 class="align-center fs20 c999"  v-if="company">
			<a href="" target="_blank" class="blue">{{$hub.company.name}}</a>
		</h1>
		<mu-row>
			<mu-col width="100" tablet="100" desktop="50" style="margin: 0 auto"  v-if="company">
				<mu-text-field class="align-center" :hintText="$hub.company.name" disabled fullWidth/>
				<mu-table :showCheckbox="false">
					<mu-thead>
						<mu-tr>
							<mu-th>姓名</mu-th>
							<mu-th>职位</mu-th>
							<mu-th>入职时间</mu-th>
							<mu-th>离职时间</mu-th>
						</mu-tr>
					</mu-thead>
					<mu-tbody>
						<mu-tr v-for="item in staffList.staff" :key="item.resumeHash">
							<mu-td>{{item.resumeInfo.name}}</mu-td>
							<mu-td>{{item.resumeInfo.jobTitle}}</mu-td>
							<mu-td>{{item.resumeInfo.joinDate}}</mu-td>
							<mu-td>{{item.resumeInfo.leaveDate}}</mu-td>
						</mu-tr>
					</mu-tbody>
				</mu-table>
			</mu-col>
		</mu-row>
	</div>
</template>

<script>
	export default {
		created(){
			this.fetchCompanyStaff()
		},
		methods:{
		fetchCompanyStaff(){
			var companyHash = this.company.hash
			if(!companyHash){
				return
			}
			this.$hub.nebApiCall({
				func: "getStaffList",
				args:[companyHash,this.limit,this.offset]
            }).then(data => {
				if(this.offset == -1){
					this.offset = data.total
				}
				this.staffList = data
				console.log(data.staff)
            });
		}
		},
		watch:{
			"$hub.company.hash":function(){
				// console.log('xxxx')
				this.company = this.$hub.company
				this.fetchCompanyStaff()
			}
		},
		data(){
			return {
				limit:100,
				offset:-1,
				staffList:{
					total:0,
					staff:[]
				},
				company:this.$hub.company
			}
		}
	}
</script>