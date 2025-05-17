import req from "@/utils/request.js"; // 客服模块接口

//客服 客户反馈列表
export const getList = data => {
	return req({
		url: `information_list`,
		method: "GET",
		data
	})
}

//客服 客户反馈详情
export const getDetail = data => {
	return req({
		url: `customer/details`,
		method: "GET",
		data
	})
}

//客服 客户提交反馈  客服反馈
export const getSub  = data => {
	return req({
		url: `customer/details`,
		method: "POST",
		data
	})
}

 //客服 反馈信息回复
 export const reply_feedback  = data => {
 	return req({
 		url: `reply_feedback`,
 		method: "POST",
 		data
 	})
 }
 
 //客服 用户第一次提交反馈
 export const add_feedback  = data => {
 	return req({
 		url: `add_feedback`,
 		method: "POST",
 		data
 	})
 }
 
 //客服 用户第一次提交反馈 https://jp.csxclxs.cn/api/information_admin_list
 export const getListAdmin  = data => {
 	return req({
 		url: `information_admin_list`,
 		method: "GET",
 		data
 	})
 }