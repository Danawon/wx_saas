import req from "@/utils/request.js";
// 获取订单状态
export const getOrderInfo = data => {
	return req({
		url: "query",
		method: "get",
		data
	})
}
// 获取可约人员
export const getReduciblePerson = data => {
	return req({
		url: "home_sporty_list",
		method: "get",
		data
	})
}
// 获取选购会员卡
export const getVipCard = data => {
	return req({
		url: "home/membercard_list",
		method: "get",
		data
	})
}
// 获取轮播图
export const getBanner = data => {
	return req({
		url: "banner",
		method: "get",
		data
	})
}

// 获取会员卡门店
export const storeColumn = data => {
	return req({
		url: "store/column",
		method: "get",
		data
	})
}