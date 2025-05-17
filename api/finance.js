import req from "@/utils/request.js"; // 区域财务 所有接口
// 获取统计分析报表
export const statisticsAnalyseList = () => {
	return req({
		url: `finance_atistics`,
		method: "get"
	})
}
// 审核会员卡
export const auditCard = data => {
	return req({
		url: `finance/membercard_examine`,
		method: "POST",
		data
	})
}
// 获取会员卡审核列表
export const cardAuditList = data => {
	return req({
		url: `finance/membercard_examine_list`,
		method: "get",
		data
	})
}
// 提交 补录审核管理
export const submitMembercardSupplement = data => {
	return req({
		url: `finance/membercard_supplement`,
		method: "POST",
		data
	})
}
// 获取 补录审核管理
export const membercardSupplement = data => {
	return req({
		url: `finance/membercard_supplement`,
		method: "get",
		data
	})
}
// 课程收入统计
export const investorData = data => {
	return req({
		url: `course_income`,
		method: "get",
		data
	})
}