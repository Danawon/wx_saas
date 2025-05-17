import req from "@/utils/request.js"; // 运动管理师
/* 获取快捷语列表 */
export const shortcutList = data => {
	return req({
		url: `clockon/quick_reply`,
		method: "get",
		data
	})
}
/* 获取有氧打卡运动形式 */
export const getModalityAction = () => {
	return req({
		url: `clockon/training_form`,
		method: "get",
	})
}
// 发布任务
export const releaseTask = data => {
	return req({
		url: `sporty/release_tast`,
		method: "POST",
		data
	})
}
// 新增任务
export const addTask = data => {
	return req({
		url: `sporty/add_tast`,
		method: "POST",
		data
	})
}
// 任务反馈 点评
export const planFeedback = data => {
	return req({
		url: `sporty/task_comment`,
		method: "POST",
		data
	})
}
// 任务详情
export const planDetail = data => {
	return req({
		url: `sporty/task_comment`,
		method: "GET",
		data
	})
}
// 删除任务
export const delPlan =  data => {
	return req({
		url: `sporty/del_tast`,
		method: "DELETE",
		data
	})
}
// 获取课程列表计划任务管理
export const aerobicCoursePlan = data => {
	return req({
		url: `sporty/tasklist`,
		method: "get",
		data
	})
}
// 有氧打卡课程列表
export const aerobicCourseList = data=> {
	return req({
		url: `sporty/clockon_order`,
		method: "get",
		data
	})
}
// 提现记录
export const withdrawRecord = data => {
	return req({
		url: `withdrawal_log`,
		method: "get",
		data
	})
}
// 获取运动管理师收入
export const revenueList = data => {
	return req({
		url: `sporty/income`,
		method: "get",
		data
	})
}
// 运动管理师提现
export const withdraw = data => {
	return req({
		url: `withdrawal`,
		method: "post",
		data
	})
}
// 编辑基本信息
export const sportsTeacherEdit = data => {
	return req({
		url: `position/edit`,
		method: "post",
		data
	})
}
// 获取运动管理师信息
export const sportsTeacherInfo = () => {
	return req({
		url: `position/info`,
		method: "get",
		
	})
}