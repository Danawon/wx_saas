import req from "@/utils/request.js" // 积分模块接口 
// 兑换产品
export const exchangeProduct = data => {
	return req({
		url: `integral/submit`,
		method: "POST",
		data
	})
}
// 积分产品详情
export const integralProductDetail = data => {
	return req({
		url: `integral/details`,
		method: "GET",
		data
	})
}
// 积分产品列表
export const integralProductList = data => {
	return req({
		url: `integral/product_list`,
		method: "GET",
		data
	})
}
// 获取积分明细
export  const integralDetail = () => {
	return req({
		url: `integral/obvious`,
		method: "GET",
		
	})
}