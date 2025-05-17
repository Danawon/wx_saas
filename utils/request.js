import {
	baseUrlApi
} from "@/utils/baseUrl.js"
const req = obj => {
	if(!obj.cancelLoading) {
		uni.showLoading({
			title: "加载中...",
			mask: true,
		})
	}
	
	return new Promise((resolve, reject) => {
		let url = baseUrlApi + obj.url;
		let method = obj.method || "GET";
		let data = obj.data || {};
		let header = obj.header || {
			'Authorization': uni.getStorageSync("token") ? 'Bearer'+ ' ' +uni.getStorageSync("token") : '',
			'Content-Type': obj.contentType || 'application/json;charset=UTF-8',
			role: uni.getStorageSync("role") ?? '',
			relationid: uni.getStorageSync("relation_id") ?? '',
		};
		uni.request({
			url: url,
			data: data,
			method: method,
			header: header,
			dataType: 'json',
			success: (res => {
				console.log(res)
				uni.hideLoading()
				if (res.data.code >= 200 && res.data.code < 300) {
					resolve(res.data)
				} else if (res.data.code == 401||res.data.code == 403) {
					uni.showToast({
						icon: "none",
						title: res.data.msg,
						duration: 2000,
					})
					uni.removeStorageSync('token')
					 setTimeout(() => {
						uni.navigateTo({
							url: "/pages/login/login"
						})
					 }, 1500)
					reject(res.data)
				}
					
			}),
			fail: ((err) => {
				uni.hideLoading()
				uni.showToast({
					icon: "none",
					title: "请求错误",
					duration: 2000,
				})
				reject(err.data)
				
			}),
		})

	})
}
export default req
