import req from "@/utils/request.js"; // 投资人 所有接口
/* 获取投资人统计信息 */
export const fundstatisticsDetails = data => {
	return req({
		url: `fundstatistics_details`,
		method: "get",
		data
	})
}
// 投资人数据
export const investorData = data => {
	return req({
		url: `fundstatistics`,
		method: "get",
		data
	})
}