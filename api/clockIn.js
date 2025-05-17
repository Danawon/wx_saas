import req from "@/utils/request.js"  // 我要打卡 接口
/* 对接君岭 使用手机号登录 实现免登录 */
export const mobileLogin = data => {
	return req({
		url: "mobile_login",
		method: "post",
		data
	})
}
/* 我要打卡 课程任务页面 获取任务数据 加分页 */
export const getCoursePageList = data => {
	return req({
		url: "clockon/task_list",
		method: "get",
		data
	})
}
//获取我要打卡列表
export const getClockInList = () => {
	return req({
		url: "clockon/lately_order",
		method: "get",
	})
}
// 饮食打卡
export const nutritionTask = data => {
	return req({
		url: "clockon/nutrition_order_task",
		method: "post",
		data
	})
}
// 获取分析结果
export const getAnalysisResults = data => {
	return req({
		url: "clockon/analysis_results",
		method: "get",
		data
	})
} 
// 保存设备数据
export const submitEquipmentInfo = data => {
	return req({
		url: "clockon/clockin_end_show",
		method: "post",
		data
	})
}
// 获取保存设备数据
export const getSubmitEquipmentInfo = data => {
	return req({
		url: "clockon/clockin_end_show",
		method: "get",
		data
	})
}
// 上传图片接口
export const upLoadImg = data=> {
	return req({
		url: "upload/file",
		method: "post",
		data
	})
}
// 打卡课程接口
export const clockInCourse = data => {
	return req({
		url: "clockon/order_task_details",
		method: "post",
		data
	})
}
// 获取任务内容 （营养打卡信息）
export const nutritionalPunchInfo = data => {
	return req({
		url: "clockon/order_task_details",
		method: "get",
		data
	})
}
// 激活客户课程
export const activateCourses = data => {
	return req({
		url: "clockon/activation_order",
		method: "PUT",
		data
	})
}
// 获取课程任务内容
export const getCourseInfo = data=> {
	return req({
		url: "clockon/order_task",
		method: "get",
		data
	})
}
// 打卡购买课
export const buyCourse = data => {
	return req({
		url: "clockon/sumbit",
		method: "POST",
		data
	})
}
// 查看我购买的卡课
export const getMyCourse = data => {
	return req({
		url: "clockon/orderlist",
		method: "get",
		data
	})
}
// 购课详情
export const buyCourseInfo = data => {
	return req({
		url: "clockon/product_content",
		method: "get",
		data
	})
}
// 我要打卡首页
export const getIndexInfo = () => {
	return req({
		url: "clockon/index",
		method: "get"
	})
}