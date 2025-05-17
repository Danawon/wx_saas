import req from "@/utils/request.js"; // 商城模块接口
/* 订单列表 立即支付 */
export const againPay = data => {
	return req({
		url: "mall/again_pay", 
		method: "PUT",
		data
	})
}
// 确认收货接口
export const confirmReceipt = data => {
	return req({
		url: "mall/confirm_receipt",
		method: "GET",
		data
	})
}

export const orderDetails = data => {
	return req({
		url: "mall/order_detail",
		method: "GET",
		data
	})
}
// 查看订单物流
export const orderLogistics = data => {
	return req({
		url: "mall/logistics",
		method: "POST",
		data
	})
}
// 提交订单
export const submitOrder = data => {
	return req({
		url: "mall/submit",
		method: "POST",
		data
	})
}
// 编辑地址
export const editAddress = data => {
	return req({
		url: "mall/address_edit",
		method: "POST",
		data
	})
}
// 地址详情
export const addressDetail = data => {
	return req({
		url: "mall/address_info",
		method: "get",
		data
	})
}
// 删除地址
export const deleteAddress = data => {
	return req({
		url: `mall/address_del?id=${data.id}`,
		method: "DELETE",
		
	})
}
// 地址列表
export const addressList = () => {
	return req({
		url: "mall/address_index",
		method: "get",
		
	})
}
// 新建地址
export const addAddress = data => {
	return req({
		url: "mall/address_create",
		method: "POST",
		data
	})
}
// 创建订单接口
export const createOrder = data => {
	return req({
		url: "mall/confirm",
		method: "get",
		data
	})
}
// 商品详情
export const productDetails = data => {
	return req({
		url: "mall/product/details",
		method: "get",
		data
	})
}
// 商品分类筛选
export const productScreening = data => {
	return req({
		url: "mall/category",
		method: "get",
		data
	})
}
// 商品列表
export const  productList = data => {
	return req({
		url: "mall/product_list",
		method: "get",
		data
	})
}
// 我的商城订单列表
export const mallOrdersList = data => {
	return req({
		url: "mall/order_status_list",
		method: "get",
		data
	})
}