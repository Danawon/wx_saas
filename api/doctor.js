import req from "@/utils/request.js"; // 医生身份相关接口
/* 患者列表 */
export const patientList = data => {
	return req({
		url: "userlist",
		method: "get",
		data
	})
}

/* 患者处方管理列表 */
export const patientRecipe = data => {
	return req({
		url: "doctor/prescription_history_list",
		method: "get",
		data
	})
}

/* 新增|| 编辑处方时select下拉数据 */
export const recipeSelectData = data => {
	return req({
		url: "doctor/prescription_profile",
		method: "get",
		data
	})
}

/* 保存处方编辑 */
export const preserveRecipe = data => {
	return req({
		url: "doctor/prescription_add",
		method: "post",
		data
	})
}

/* 
 * 指定处方下的详情数据
 */
export const recipeChildDetail = data => {
	return req({
		url: "doctor/prescription_history_details",
		method: "get",
		data
	})
}

/* 
*	保存处方编辑 
*/
export const editRecipe = data => {
	return req({
		url: "doctor/prescription_edit",
		method: "post",
		data
	})
}

/* 教练端所需的运动处方列表 */
export const recipeList = data => {
	return req({
		url: "/training/prescription_data",
		method: "get",
		data
	})
}

/* 
	患者医生列表
 */
export const userDoctorList = () => {
	return req({
		url: "doctor/user_doctor",
		method: "get",
	})
}
/* 申请处方 */
export const applyRecipe = data => {
	return req({
		url: "doctor/apply_prescription",
		method: "PUT",
		data
	})
}
/* 饮食指南 */
export const dietaryGuide = data => {
	return req({
		url: "doctor/dietary_guide",
		method: "GET",
		data
	})
}