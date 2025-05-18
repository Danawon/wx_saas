import req from "@/utils/request.js"; // 个人中心接口 
/* 获取指定日期运动列表 */
export const exerciseDateChild = data => {
	return req({
		url: "motion_obvious", 
		method: "get",
		data
	})
}
/* 更改课程为开始状态 */
// export const homeStartclass = data => {
// 	return req({
// 		url: "home_startclass", 
// 		method: "PUT",
// 		data
// 	})
// }
/* 一键操作 不可见人员 */
export const onekeyPrivacyAuth = data => {
	return req({
		url: "onekey_privacy_auth", 
		method: "PUT",
		data
	})
}
/* 离开投屏分组 */
export const leaveGroup = data => {
	return req({
		url: "system/leave_group", 
		method: "post",
		data
	})
}
/* 加入投屏分组 */
export const joinScreenGroup = data => {
	return req({
		url: "system/join_group", 
		method: "get",
		data
	})
}
/* 获取运动图表数据 */
export const exerciseChartData = data => {
	return req({
		url: "motion/data_chart", 
		method: "get",
		data
	})
}
/* 获取训练计划 是否设置计划状态 */
export const getPlanState = data => {
	return req({
		url: "training/is_course_complete", 
		method: "put",
		data
	})
}
/* 获取健康问卷历史记录 */
export const getQuestionnaireRecordList = data => {
	return req({
		url: "user/questionnaire_history", 
		method: "get",
		data
	})
}
/* 心率强度列表 */
export const getIntensityList = () => {
	return req({
		url: "equipment/getStrength", 
		method: "get",
		
	})
}
/* 生成燃烧卡卡路里记录 */
export const motionAdd = data => {
	return req({
		url: "motion_add", 
		method: "post",
		data
	})
}
/* 获取卡路里运动列表 */
export const getMotionList = data => {
	return req({
		url: "motion_list", 
		method: "get",
		data
	})
}
/* 获取分享信息 */
export const getShareInfo = () => {
	return req({
		url: "invitation_gift", 
		method: "get",
		
	})
}
/* 获取计算热量信息 */
export const getReduceWeightCounter = data => {
	return req({
		url: "reduce_weight_counter", 
		method: "post",
		data
	})
}
/* 获取个人体脂体重信息 */
export const getBodyInfo = () => {
	return req({
		url: "reduce_weight_counter", 
		method: "get",
		
	})
}
/* 重置密码 */
export const resetPassword = data => {
	return req({
		url: "lockers/reset_password", 
		method: "post",
		data
	})
}
/* 获取储物柜列表 用户端 */
export const getLockerListUser = data => {
	return req({
		url: "lockers/user/list", 
		method: "get",
		data
	})
}
/* 删除我的设备 */
export const delDevice = data => {
	return req({
		url: "heart_rate_meter/delete?sign=" + data, 
		method: "DELETE"
	})
}
/* 修改链接心率带名称 */
export const editDeviceName = data => {
	return req({
		url: "heart_rate_meter/edit", 
		method: "POST",
		data
	})
}
/* 获取蓝牙连接记录 */
export const  getDeviceRecord = () => {
	return req({
		url: "heart_rate_meter/index", 
		method: "get"
	})
}
/* 添加链接记录 */
export const addDeviceRecord = data => {
	return req({
		url: "heart_rate_meter/create", 
		method: "POST",
		data
	})
}
/* 用户扫码签到 */
export const userScanCode = data => {
	return req({
		url: "league_class_sign",
		method: "PUT",
		data
	})
}
/* 获取视频筛选 */
export const tabsFilter = data => {
	return req({
		url: "class_list",
		method: "get",
		data
	})
}
/* 获取测试记录 */
export const testHistoryRecord = data => {
	return req({
		url: "oxygen_uptake/history_list",
		method: "get",
		data
	})
}
/* 用户取消预约 */
export const userCancelCourse = data=> {
	return req({
		url: "cancel_arrangeclass",
		method: "get",
		data
	})
}
/* 获取报告 年选择 */
export const getSelectAnnual = data => {
	return req({
		url: "select_annual",
		method: "get",
		data
	})
}
/* 获取报告 季度选择 */
export const getSelectQuarterly = data => {
	return req({
		url: "select_quarterly",
		method: "get",
		data
	})
}
/* 获取报告 月份选择 */
export const getSelectMonthly = data => {
	return req({
		url: "select_monthly",
		method: "get",
		data
	})
}
/* 获取报告 周选择 */
export const getSelectWeek = data => {
	return req({
		url: "select_week",
		method: "get",
		data
	})
}
/* 获取训练报告生成的图片 */
export const generatePoster = data => {
	return req({
		url: "training_report_create",
		method: "get",
		data
	})
}
/* 获取训练报告 */
export const getTrainingReport = data => {
	return req({
		url: "training_report",
		method: "get",
		data
	})
}
/* 教练结束课程 */
export const overCourse = data => {
	return req({
		url: "coach_end_class",
		method: "PUT",
		data
	})
}
/* 发布反馈信息 */
export const sendFeedback = data => {
	return req({
		url: "send_chat",
		method: "POST",
		data
	})
}
/* 获取返回列表信息 */
export const getFeedbackChat = data => {
	return req({
		url: "training_chat",
		method: "POST",
		data
	})
}

// 获取功率车误差
export const getEllipticalsMaxCalculationUpdate = data => {
	return req({
		url: 'ellipticals_max_calculation_update',
		method: "POST",
		data
	})
}
// 通过功率车获取 摄氧量
export const getEllipticalsCalculation = data => {
	let reqUrl = ""
	if(data.deviceType) {
		reqUrl = 'bt_ellipticals_calculation'
	}else {
		reqUrl = 'ellipticals_calculation'
	}
	return req({
		url: reqUrl,
		method: "POST",
		data
	})
	
}
// 获取最大摄氧量
export const getMaxOxygenUptake = data => {
	return req({
		url: "treadmill_calculation",
		method: "POST",
		data
	})
}
// 椭圆机加入分组 跑步机
export const ellipticalsIndex = data => {
	return req({
		url: "device/connect",
		method: "POST",
		data
	})
}
// 灯控加入分组
export const ellipticals_connect = data => {
	return req({
		url: "ellipticals_connect",
		method: "POST",
		data
	})
}
// 获取上课二维码
export const getCourseQR = data => {
	return req({
		url: "coach_class_qrcode",
		method: "get",
		data
	})
}
// 编辑个人信息
export const editUserinfo = data => {
	return req({
		url: "personal",
		method: "post",
		data
	})
}
// 优惠卷列表
export const couponList = data => {
	return req({
		url: "usercouponlist",
		method: "get",
		data
	})
}
// 获取购买储物柜信息
export const getBuyLockerInfo = data => {
	return req({
		url: "lockers/confirm",
		method: "POST",
		data
	})
}
// 获取储物柜租赁记录
export const lockerRecord = data => {
	return req({
		url: "lockers/log_list",
		method: "get",
		data
	})
}
// 打开储物柜
export const openLocker = data => {
	return req({
		url: "lockers/openboxNo",
		method: "post",
		data,
	})
}
// 获取已租储物柜信息
export const myLockerInfo = data => {
	return req({
		url: "lockers/user_lease",
		method: "get",
		data
	})
}
// 提交储物柜订单
export const submitLockerOrder = data => {
	return req({
		url: "lockers/sumbit",
		method: "post",
		data,
	})
}
// 获取储物柜列表
export const getLockerList = data => {
	return req({
		url: "lockers/lst",
		method: "get",
		data,
	})
}
// 获取门店列表 带距离
export const getStoreList = data => {
	return req({
		url: "storelist",
		method: "get",
		data
	})
}
// 获取视频
export const getVideoExplain = data => {
	return req({
		url: "training/videoexplanation",
		method: "get",
		data
	})
}
// 实名认证
export const certification = data => {
	return req({
		url: "authentication",
		method: "post",
		data
	})
}
// 获取个人信息
export const personalDetails = data => {
	return req({
		url: "personal",
		method: "get",
	})
}
// 获取知识详情
export const knowledgeDetail = data => {
	return req({
		url: "article_details",
		method: "get",
		data
	})
}
// 训练计划课程提交
export const userTrainingFeedback = data => {
	return req({
		url: "user_training_feedback",
		method: "post",
		data
	})
}
// 获取训练课程详情计划页 设备页
export const trainingProgramDetailPlan = data => {
	return req({
		url: "user_training_group_details",
		method: "GET",
		data
	})
}
// 获取知识库
export const knowledgeBase = data => {
	return req({
		url: "knowledge_base",
		method: "GET",
		data
	})
}
// 获取训练计划详情
export const trainingProgramDetail = data => {
	return req({
		url: "coach/training_details",
		method: "GET",
		data
	})
}
// 获取训练计划列表
export const trainingProgram = data => {
	return req({
		url: "user_training_show",
		method: "GET",
		data
	})
}
// 动作库详情
export const actionLibraryDetail = data => {
	return req({
		url: "video_details",
		method: "GET",
		data
	})
}
// 搜索动作库
export const searchActionLibrary = data => {
	return req({
		url: "action_library_search",
		method: "GET",
		data
	})
}
// 获取动作库
export const getActionLibrary = data => {
	return req({
		url: "action_library",
		method: "GET",
		data
	})
}
// 扫码签到
export const scanCode = data => {
	return req({
		url: "scan_have_class",
		method: "GET",
		data
	})
}
// 获取约课详情
export const getCourseInfo = data => {
	return req({
		url: "arrange_details",
		method: "GET",
		data
	})
}
// 获取交易记录
export const getTransactionRecord = data => {
	return req({
		url: "transaction",
		method: "GET",
		data
	})
}
// 获取用户约课记录
export const getSubscribeCourse = data => {
	return req({
		url: "arrangeclasslog",
		method: "GET",
		data
	})
}

// 激活会员卡
export const activationCard = data => {
	return req({
		url: "usermembercard/activation",
		method: "PUT",
		data
	})
}
// 会员卡列表
export const vipCardlist = data => {
	return req({
		url: "usermembercard",
		method: "get",
		data
	})
}
// 充值余额
export const payBalance = data => {
	return req({
		url: "recharge_amount",
		method: "post",
		data
	})
}
// 获取我的信息
export const getMyInfo = () => {
	return req({
		url: "personal",
		method: "get",
	})
}
// 蓝牙校正
export const calibration = data => {
	return req({
		url: "calibration",
		method: "PUT",
		data
	})
}

/**
 * 获取雁阵吗
 * @prams {Object}
 */
export const sendCode = data => {
	return req({
		url: "send_code",
		method: "post",
		data
	})
}
/* 记录错误日志 */
export const device_error_log = data => {
	return req({
		url: "device_error_log",
		method: "post",
		data,
		cancelLoading: true,
	})
}
/* 获取体侧仪key */
export const getBodytestApikey = data => {
	return req({
		url: "bodytest_apikey",
		method: "GET",
		data
	})
}
/* 功率车开始测试 */
export const on_start_test = data => {
	return req({
		url: "start_test",
		method: "GET",
		data
	})
}
/* 获取心率区间*/
export const heart_rate_zones = data => {
	return req({
		url: "heart_rate_zones",
		method: "GET",
		data
	})
}
/* 心电图*/
export const send_blood_pressure_test = data => {
	return req({
		url: "send_blood_pressure_test",
		method: "post",
		data
	})
}
/* 血压测试完成*/
export const finish_blood_pressure_test = data => {
	return req({
		url: "ellipticals_end",
		method: "post",
		data
	})
}
/* 设置用户运动的记录*/
export const setUserSportRecord = data => {
	return req({
		url: "setUserSportRecord",
		method: "post",
		data
	})
}
/* 删除用户运动记录*/
export const delUserSportRecord = data => {
	return req({
		url: "delUserSportRecord",
		method: "post",
		data
	})
}
/* 点击终止*/
export const stop_heartrate_test = data => {
	return req({
		url: "stop_heartrate_test",
		method: "post",
		data
	})
}
