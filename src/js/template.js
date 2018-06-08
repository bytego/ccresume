const userTemplate = {
	core: [
		{ name: "姓名", value: null },
		{ name: "职业", value: null },
		{ name: "电话", value: null },
		{ name: "邮箱", value: null },
		{ name: "简介", value: null }
	],
	skils: [
		{ name: "JS", skil: 100 },
		{ name: "CSS", skil: 100 },
		{ name: "HTML", skil: 100 }
	],
	exp: [
		{
			name: "工作经历",
			exp: [
				{
					startTime: null,
					endTime: null,
					company: null,
					job: null,
					exps: null
				}
			]
		},
		{
			name: "项目经历",
			exp: [
				{
          startTime: null,
          endTime: null,
          company: null,
          job: null,
          exps: null
				}
			]
		},
		{
			name: "教育经历",
			exp: [
				{
					startTime: null,
					endTime: null,
					company: null,
					job: null,
					exps: null
				}
			]
		}
	],
	custom: [
		{
			name: "自我评价",
			exps:null
		},
		{
			name: "技能水平",
			exps:null
		},
		{
			name: "社区账号",
			exps:null
		}
	]
}
export default userTemplate;
