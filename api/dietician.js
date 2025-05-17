import req from "@/utils/request.js"; // 营养师模块接口
/* 修改任务标题 */
export const editTaskTit = data => {
	return req({
		url: `clockon/task_edit?id=374`,
		method: "post",
		data
	})
}
/* 获取描述列表 */
export const describeList = data => {
	return req({
		url: `clockon/food_description_choice`,
		method: "GET",
		data
	})
}
//销售顾问
//销售顾问的基本信息
export const getInfo = data => {
	return req({
		url: `position/info`,
		method: "GET",
		data
	})
}

//编辑基本信息
export const editInfo = data => {
	return req({
		url: `position/edit`,
		method: "POST",
		data,
	})
}
 
//营养打卡课程列表
export const nutritionList = data => {
	return req({
		url: `nutrition/clockon_order`,
		method: "GET",
		data
	})
}

//任务列表 https://jp.csxclxs.cn/api/sporty/tasklist?id=68
export const tasklist = data => {
	return req({
		url: `sporty/tasklist`,
		method: "GET",
		data
	})
}

//发布任务（第1步）https://jp.csxclxs.cn/api/nutrition/release_tast?task_id=70
export const release_tast = data => {
	return req({
		url: `nutrition/release_tast`,
		method: "GET",
		data
	})
}

//发布任务（第2步）https://jp.csxclxs.cn/api/nutrition/release_tast
export const release_tasK = data => {
	return req({
		url: `nutrition/release_tast`,
		method: "POST",
		data
	})
}

//发布任务（第2步）https://jp.csxclxs.cn/api/nutrition/release_tast_info?task_id=96&meal_time=breakfast
export const  taskInfo = data => {
	return req({
		url: `nutrition/release_tast_info`,
		method: "GET",
		data
	})
}

// 查看详情（营养打卡） https://jp.csxclxs.cn/api/nutrition/task_comment?task_id=34
export const  getDetail = data => {
	return req({
		url: `nutrition/task_comment`,
		method: "GET",
		data
	})
}

// 提交反馈 https://jp.csxclxs.cn/api/nutrition/task_comment_assess
export const  feedbackSubmit = data => {
	return req({
		url: `nutrition/task_comment_assess`,
		method: "POST",
		data
	})
}