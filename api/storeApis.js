import req from "@/utils/request.js" // 门店接口 
/* 会员卡作废 */
export const membercardNullify = data => {
	return req({
		url: 'shopowner/membercard_nullify',
		method: 'POST',
		data
	})
}
/* 基本配置 */
export const base_config = data => {
	return req({
		url: 'base_config',
		method: 'get',
		data
	})
}
/* 更新会员卡停卡时间 */
export const updateStopDate = data => {
	return req({
		url: 'shopowner/membercard_stopusing_update',
		method: 'POST',
		data
	})
}
/* 绑定uid */
export const bindingUid = data => {
	return req({
		url: 'uid_binding',
		method: 'GET',
		data
	})
}
/* 编辑绑定NFC */
export const editBindingNfc = data => {
	return req({
		url: 'shopowner/nfc_edit',
		method: 'POST',
		data
	})
}
/* 删除nfc */
export const delNfc = data => {
	return req({
		url: 'shopowner/nfc_del?id=14',
		method: 'DELETE',
		data
	})
}
/* 获取nfc管理列表 */
export const getNfcList = data => {
	return req({
		url: 'shopowner/nfc_list',
		method: 'GET',
		data
	})
}
/* 删除门店门禁 列表用户 */
export const entrance_authorize_del = data => {
	return req({
		url: 'shopowner/entrance_authorize_del',
		method: 'DELETE',
		data
	})
}
/* 新增门禁权限 */
export const entrance_authorize_add = data => {
	return req({
		url: 'shopowner/entrance_authorize_add',
		method: 'POST',
		data
	})
}
/* 编辑门店门禁 */
export const entrance_authorize_edit = data => {
	return req({
		url: 'shopowner/entrance_authorize_edit',
		method: 'POST',
		data
	})
}
/* 获取门禁详情 */
export const entrance_authorize_details = data => {
	return req({
		url: 'shopowner/entrance_authorize_details',
		method: 'GET',
		data
	})
}
/* 门店门禁授权列表 */
export const entrance_authorize_list = data => {
	return req({
		url: 'shopowner/entrance_authorize_list',
		method: 'GET',
		data
	})
}
/* 获取消课记录列表 */
export const cancel_classes_list = data => {
	return req({
		url: 'finance/use_membercard_record_details_list',
		method: 'GET',
		data
	})
}
/* 获取门店消课记录详情 */
export const cancel_classes_detail = data => {
	return req({
		url: 'finance/use_membercard_record_details',
		method: 'GET',
		data
	})
}
/* 删除灯光 */
export const deleteLight = data => {
	return req({
		url: 'lighting/del',
		method: 'delete',
		data
	})
}
/* 刷新二维码 */
export const refreshQr = data => {
	return req({
		url: 'update_code',
		method: 'get',
		data
	})
}
/* 获取门禁码信息 */
export const getQrCode = data => {
	return req({
		url: 'use_code_list',
		method: 'get',
		data
	})
}
/* 获取灯控详情 */
export const getLightingDetail = data => {
	return req({
		url: 'lighting/detail',
		method: 'get',
		data
	})
}
/* 查询电路状态 */
export const lightingQuery = data => {
	return req({
		url: 'lighting/query',
		method: 'put',
		data
	})
}
/* 编辑灯光名称 */
export const editLampControl = data => {
	return req({
		url: 'lighting/edit',
		method: 'post',
		data
	})
}
/* 获取灯光设备列表 */
export const  equipmentList = () => {
	return req({
		url: 'lighting/equipment_list',
		method: 'get',
		
	})
}
/* 检测门禁 */
export const entranceGuard = data => {
	return req({
		url: 'entrance_guard_show',
		method: 'POST',
		data
	})
}
/* 获取团课签到二维码 */
export const getLeagueClassQr = data => {
	return req({
		url: 'coach/league_qrcode_show',
		method: 'GET',
		data
	})
}

/* 获取会员卡购买记录 */
export const getBuyCardRecord = data => {
	return req({
		url: 'shopowner/purchase_record',
		method: 'GET',
		data
	})
}
// 获取店长是存在发放优惠卷权限
export const ifJurisdictionJurisdiction = () => {
	return req({
		url: 'position/info',
		method: 'GET'
	})
}
// 训练计划模板列表
export const trainingProgramList = data => {
	return req({
		url: 'template/training_program_list',
		method: 'GET',
		data
	})
}
// 门店收入
export const storeIncome = data => {
	return req({
		url: 'statistics/store_income',
		method: 'GET',
		data
	})
}
// 教练月销售统计
export const coachMoneysaleReport = data => {
	return req({
		url: 'statistics/coach_moneysale_report',
		method: 'GET',
		data
	})
}

// 会员卡消课记录
export const cardCancelClasses = data => {
	return req({
		url: 'finance/use_membercard_record',
		method: 'GET',
		data
	})
}
// 灯控开关
export const lightingSwitch = data => {
	return req({
		url: 'lighting/operate', 
		method: 'PUT',
		data
	})
}
// 添加灯控
export const addLighting = data => {
	return req({
		url: 'lighting/add',
		method: 'post',
		data
	})
}
// 获取灯控列表
export const lightingList = data => {
	return req({
		url: 'lighting/list',
		method: 'get',
		data,
		cancelLoading: 1
	})
} 
// 提交业绩申报
export const submitPerformanceReport = data => {
	return req({
		url: 'shopowner/membercard_declaresth',
		method: 'POST',
		data
	})
}
// 获取业绩申报护具
export const performanceReport = data => {
	return req({
		url: 'shopowner/membercard_declaresth',
		method: 'get',
		data
	})
}
// 会员卡退卡
export const refundCard = data => {
	return req({
		url: 'shopowner/membercard_cardreturn',
		method: 'POST',
		data
	})
}
// 会员卡停卡
export const stopCard = data => {
	return req({
		url: 'shopowner/membercard_stopusing',
		method: 'POST',
		data
	})
}
// 会员卡转卡
export const cardAssignment = data=> {
	return req({
		url: 'shopowner/membercard_transfercard',
		method: 'POST',
		data
	})
}
// 获取会员卡信息列表
export const vipCardList = data => {
	return req({
		url: 'shopowner/membercardList',
		method: 'get',
		data
	})
}
// 绑定身份
export const assignRoles = () => {
	return req({
		url: 'assign_roles',
		method: 'get'
	})
}
// 授权手机号
// 在storeApis.js中修改mandateTel函数
// 在你的storeApis.js文件中修改mandateTel函数
export const mandateTel = data => {
	return req({
		url: 'wechat/getPhoneNumber',
		method: 'post',
		header: {
			'Authorization': data.token,
			'Content-Type': 'application/json;charset=UTF-8'
		},
		data
	})
}
// 登录
export const loginFun = data => {
	return req({
		url: 'wechat/mp_auth',
		method: 'post',
		data
	})
}
// 搜索门店
export const searchShop = data => {
	return req({
		url: "store_search",
		method: "post",
		data
	})
}
// 获取当前卡次数数据
export const getCardNumInfo = data => {
	return req({
		url: "membercard/discount",
		method: "get",
		data
	})
}
// 支付购卡
export const payCard = data => {
	return req({
		url: "membercard/sumbit",
		method: "post",
		data
	})
}
// 获取会员卡详情
export const getCardDetail = data => {
	return req({
		url: "membercard/confirm",
		method: "GET",
		data
	})
}
// 获取门店详情
export const getStoreDetail = data => {
	return req({
		url: "store_details",
		method: "GET",
		data
	})
}
// 获取会员卡信息
export const getVipCard = data => {
	return req({
		url: "store/membercard_list",
		method: "GET",
		data
	})
}
// 获取教练详情
export const getCoachDetail = data => {
	return req({
		url: "coach_details",
		method: "GET",
		data
	})
}
// 获取教练列表
export const getCoachList= data => {
	return req({
		url: "coachlist",
		method: "GET",
		data
	})
}
// 获取当前位置
export const getLocation = data => {
	return req({
		url: "getCity",
		method: "post",
		data
	})
}
// 获取协议
export const getAgreement = () => {
	return req({
		url: "service_agreement",
		method: "get",
	})
}
// 支付购买课程
export const payForCourses = data => {
	return req({
		url: "appointment/submit",
		method: "post",
		data
	})
}
// 获取选中课程信息   约课订单确定
export const getSelectCourseInfo = data => {
	return req({
		url: "appointment/confirm",
		method: "post",
		data
	})
}
// 私教选择时间段
export const getCoachSelectTime = data => {
	return req({
		url: "select_time_period",
		method: "post",
		data
	})
}
// 获取课程列表
export const getCourseList = data => {
	return req({
		url: "store_appointment_list",
		method: "get",
		data
	})
}
// 获取门店约课列表
export const getShopList = data => {
	return req({
		url: "storelist",
		method: "get",
		data
	})
}
// 更新人脸信息
export const update_face_image = data => {
	return req({
		url: "update_face_image",
		method: "post",
		data
	})
}
// 获取人脸信息
export const get_update_face_image = data => {
	return req({
		url: "update_face_image",
		method: "get",
		data
	})
}
// 删除人脸信息
export const delete_face_image = data => {
	return req({
		url: "delete_face_image",
		method: "delete",
		data
	})
}