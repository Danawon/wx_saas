import req from "@/utils/request.js";
//销售顾问
// 销售业绩
export const salePerformance = data => {
	return req({
		url: `sale/sales_performance`,
		method: "GET",
		data
	})
}
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

//申请店面列表
export const getShop = data => {
	return req({
		url: `sale/store_application`,
		method: "GET",
		data,
	})
}

//申请店面 
export const putShop = data => {
	return req({
		url: `sale/store_application`,
		method: "PUT",
		data,
	})
}