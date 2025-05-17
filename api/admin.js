import req from "@/utils/request.js"; // 管理端、
/* 会员卡向上排序 */
export const sortUp = data => {
	return req({
		url: "shopowner/membercard/update_sort",
		method: "PUT",
		data
	})
}
/* 获取分组列表 */
export const groupingList = data => {
	return req({
		url: "store_group_datalist",
		method: "GET",
		data
	})
}
/* 编辑会员卡 */
export const editMembercard = data => {
	return req({
		url: "user/membercard_edit",
		method: "post",
		data
	})
}
/* 获取模板分类 */
export const templateClassify = () => {
	return req({
		url: "coach/course_template_class",
		method: "get",
	})
}
/* 获取课程模板列表 */
export const getTemplateList = data => {
	return req({
		url: "coach/course_template",
		method: "get",
		data
	})
}
/* 区域经理编辑店长权限 */
export const editStoreJurisdiction = data => {
	return req({
		url: "shopowner_edit",
		method: "post",
		data
	})
}
/* 获取投屏二维码 */
export const getScreenQr = () => {
	return req({
		url: "system/enter_the_system",
		method: "GET",
	})
}
/* 解散分组接口 */
export const unGroup = () => {
	return req({
		url: "system/un_group",
		method: "post",
	})
}
/* 提交心电仪数据 */
export const ecgInfoSet = data => {
	return req({
		url: "oxygen_uptake/ecg_submit",
		method: "post",
		data
	})
}
/* 释放储物柜 */
export const  releaseLocker = data => {
	return req({
		url: "lockers/release_box",
		method: "PUT",
		data
	})
}
/* 获取门店分组数据 */
export const storeDataDisplay = data => {
	return req({
		url: "store_data_display",
		method: "get",
		data
	})
}
/* 编辑角色权限信息 */
export const editRoleInfo = data => {
	return req({
		url: "become/manager_edit",
		method: "POST",
		data
	})
}
/* 获取角色详情信息 */
export const roleInfoDetail = data => {
	return req({
		url: "become/manager_detail",
		method: "get",
		data
	})
}
/* 获取模板对应富文本 */
export const templateRichText = data => {
	return req({
		url: "clockon/task_template_details",
		method: "get",
		data
	})
}
/* 训练模板列表 */
export const trainingTemplateList = data => {
	return req({
		url: "clockon/task_template",
		method: "get",
		data
	})
}
/* 获取优惠卷产品列表 */
export const couponProductList = data => {
	return req({
		url: "coupon/product_list",
		method: "get",
		data
	})
}
/* 获取优惠卷发放产品列表 */
export const couponProductTypeList = () => {
	return req({
		url: "coupon/product",
		method: "get",
	})
}
/* 获取优惠卷范围类型 */
export const couponScope = () => {
	return req({
		url: "coupon/grant_range",
		method: "get",
	})
}
/* 编辑节假日 */
export const editHolidays = data => {
	return req({
		url: "holiday/edit",
		method: "POST",
		data
	})
}
/* 教练添加标签 */
export const addLable = data => {
	return req({
		url: "label_add",
		method: "POST",
		data
	})
}
/* 开箱 */
export const openLockerStore = data => {
	return req({
		url: "lockers/forced_onebox",
		method: "PUT",
		data
	})
}
/* 店长端删除储物柜 */
export const delLockerStore = data => {
	return req({
		url: "lockers/del",
		method: "DELETE",
		data
	})
}
/* 删除储物柜设备 */
export const delLockerDevice = data => {
	return req({
		url: "lockers/equipment_del",
		method: "DELETE",
		data
	})
}
/* 获取设备详情数据 */
export const getEditLockerInfo = data => {
	return req({
		url: "lockers/equipment_details",
		method: "get",
		data
	})
}
/* 编辑储物柜设备 */
export const editLockerDevice = data => {
	return req({
		url: "lockers/equipment_edit",
		method: "post",
		data
	})
}
/* 新增储物柜设备 */
export const addLockerDevice = data => {
	return req({
		url: "lockers/equipment_add",
		method: "post",
		data
	})
}
/* 门店储物柜设备列表 */
export const lockersEquipmentLst = () => {
	return req({
		url: "lockers/equipmentLst",
		method: "get",
		
	})
}
/* 获取体测仪二维码 */
export const bodytestQRcode = data => {
	return req({
		url: "zhaiker/bodytest_QRcode",
		method: "get",
		data
	})
}
/* 获取运动强度列表 */
export const getStrength = data => {
	return req({
		url: "training/getStrength",
		method: "get",
		data
	})
}
/* 编辑训练计划标题 */
export const coachTrainingEdit = data => {
	return req({
		url: "coach/training_edit",
		method: "POST",
		data
	})
}
// 获取医疗数据
export const getMedicalInfo = data => {
	return req({
		url: "edicaltest_history_detail",
		method: "get",
		data
	})
}
// 取消查看权限
export const cancelPrivacyAuth = data => {
	return req({
		url: "cancel_privacy_auth",
		method: "PUT",
		data
	})
}
// 设置查看权限
export const setPrivacyAuth = data => {
	return req({
		url: "privacy_auth",
		method: "PUT",
		data
	})
}
// 获取不可见人员列表
export const getPrivacyAuthList = data => {
	return req({
		url: "privacy_auth_list",
		method: "get",
		data
	})
}
// 转移用户门店分组
export  const addGroupingUser = data => {
	return req({
		url: `move_group`,
		method: "POST",
		data
	})
}
// 当前用户移除
export const removeUser = data => {
	return req({
		url: `remove_group`,
		method: "POST",
		data
	})
}
// 获取个人数据展示
export const userDataDisplay = data => {
	return req({
		url: `user_data_display`,
		method: "GET",
		data
	})
}
// 获取健康数据种类列表
export const  healthKind = data => {
	 return req({
	 	url: `type_sof_health`,
	 	method: "GET",
	 	data
	 })
}
// 门店下的用户
export const storeUserList = data => {
	return req({
		url: `grouping/store_group`,
		method: "GET",
		data
	})
}
// 产品审核操作
export const productOperation = data => {
	return req({
		url: `membercard_put_examine`,
		method: "POST",
		data
	})
}
// 产品审核列表
export const productAudit = data => {
	return req({
		url: `membercard_put_examine`,
		method: "GET",
		data
	})
}

// 新增投资人
export const addInvestor = data => {
	return req({
		url: `become/investor_add`,
		method: "POST",
		data
	})
}
// 删除投资人
export const deleteInvestor = data => {
	return req({
		url: `become/investor_del?id=${data.id}`,
		method: "DELETE",
		
	})
}
// 投资人列表
export const investorList = data =>{
	return req({
		url: `become/investor_list`,
		method: "get",
	})
} 

/* 
	新增医生
 */
export const addDoctor = data => {
	return req({
		url: `become/doctor_add`,
		method: "POST",
		data
	})
}
/* 
	医生列表
 */
export const doctorList = () => {
	return req({
		url: `become/doctor_list`,
		method: "get",
	})
}
/* 
	删除医生
 */
export const deleteDoctor = data => {
	return req({
		url: `become/doctor_del?id=${data.id}`,
		method: "DELETE",
		
	})
}
// 新增分区财务
export const addFinance = data => {
	return req({
		url: `become/finance_add`,
		method: "POST",
		data
	})
}
// 删除分区财务
export const deleteFinance = data => {
	return req({
		url: `become/finance_del?id=${data.id}`,
		method: "DELETE",
		
	})
}
// 获取分区财务列表
export const financeList = () => {
	return req({
		url: `become/finance_list`,
		method: "get",
	})
}
// 编辑用户医疗数据
export const editUserMedical = data => {
	return req({
		url: `keep_edicaltest`,
		method: "POST",
		data
	})
}
// 获取健康历史详情 医疗数据数据 
// export const healthHistoryDetailMedical = data => {
// 	return req({
// 		url: `bodytest_history_detail`,
// 		method: "get",
// 		data
// 	})
// }
// 获取健康历史详情 体适能数据
export const healthHistoryDetailFitness = data => {
	return req({
		url: `bodytest_history_detail`,
		method: "get",
		data
	})
}
// 获取健康问卷数据
export const getKHQ = data => {
	return req({
		url: `user/questionnaire`,
		method: "get",
		data
	})
}
// 保存健康问卷数据
export const saveKHQ = data => {
	return req({
		url: `user/questionnaire`,
		method: "post",
		data
	})
}
// 获取历史信息 体适能数据
export const getHistoryFitness = data => {
	return req({
		url: `bodytest_history`,
		method: "get",
		data
	})
}
// 设置计划给客户
export const setOrderTraining = data => {
	return req({
		url: `training/set_order_training`,
		method: "put",
		data
	})
}
// 编辑用户信息 体适能数据
export const editKeepBody = data => {
	return req({
		url: `keep_bodytest`,
		method: "post",
		data
	})
}
// 获取用户数据详情
export const getUserinfo = data => {
	return req({
		url: `user/${data.id}`,
		method: "get",
	})
}
// 修改教练信息
export const editCoachInfo = data => {
	return req({
		url: `position/edit`,
		method: "POST",
		data
	})
}
// 修改添加课程内容（有氧运动）
export const addAerobicExercise = data => {
	return req({
		url: `coach/training_course_add`,
		method: "POST",
		data
	})
}
// 其他 课程添加分组
// 添加一级分组 和子节点
export const otherAddStairGrouping = data => {
	return req({
		url: `coach/coach_training_class`,
		method: "POST",
		data
	})
}
// 教练 其他门店约课训练计划编辑 
export const otherTrainingDetailsEdit = data => {
	return req({
		url: `training/coach_edit_template`,
		method: "GET",
		data
	})
}
// 设置私教课上课内容
export const setCourse = data => {
	return req({
		url: `training/set_course`,
		method: "PUT",
		data
	})
}
// 课程内容模板列表
export const courseInfoTemplate = data => {
	return req({
		url: `coach/training_list`,
		method: "GET",
		data
	})
}
// 删除计划子节点
export const delPlanChildNode = data => {
	return req({
		url: `coach/training_class_del`,
		method: "DELETE",
		data
	})
}
// 增加计划动作数据
export const addAction = data => {
	return req({
		url: `coach/training_course_add`,
		method: "post",
		data
	})
}
// 获取大纲 子节点课程详情
export const courseOutlineList = data => {
	return req({
		url: `coach/training/course_type`,
		method: "GET",
		data
	})
}
// 获取子节点信息
export const getChildNodeInfo = data => {
	return req({
		url: `coach/training/course_show`,
		method: "GET",
		data
	})
}
// 添加一级分组 和子节点
export const addStairGrouping = data => {
	return req({
		url: `coach/training_class_add`,
		method: "POST",
		data
	})
}
// 门店约课训练计划编辑 
export const trainingDetailsEdit = data => {
	return req({
		url: `coach/training_details`,
		method: "GET",
		data
	})
}
// 取消训练计划
export const cencelPlan = data => {
	return req({
		url: `coach/cancel_training`,
		method: "put",
		data
	})
}
// 设置当前计划
export const setPlan = data => {
	return req({
		url: `training/set_user_training`,
		method: "put",
		data
	})
}
// 训练计划模板
export const trainingPlanTemplate = data => {
	return req({
		url: `coach/training_show`,
		method: "get",
		data
	})
}
// 约课订单详情
export const courseOrderDetail = data => {
	return req({
		url: `arrange_details`,
		method: "get",
		data
	})
}
// 获取约课订单管理
export const courseOrderAdmin = data => {
	return req({
		url: `coach/coachorderlist`,
		method: "get",
		data
	})
}
// 发布团课
export const leagueclassPublish = data => {
	return req({
		url: `leagueclass/publish`,
		method: "post",
		data
	})
}
// 获取教练发布时间段列表
export const templatePeriod = data => {
	return req({
		url: `leagueclass/publish`,
		method: "get",
		data
	})
}
// 门店约课详情
export const storeCourseDetail = data => {
	return req({
		url: `arrange_details`,
		method: "get",
		data
	})
}
// 门店约课记录
export const storeCourseRecord = data => {
	return req({
		url: `shopowner/coachorderlist`,
		method: "get",
		data
	})
}
// 教练信息
export const coachInfo = () => {
	return req({
		url: `position/info`,
		method: "get",
	})
}
// 编辑门店信息
export const editStoreInfo = data => {
	return req({
		url: `shopowner/update`,
		method: "POST",
		data
	})
}
// 设置自习课数据
export const editSelfStudyCourse = data => {
	return req({
		url: `autonomy_period`,
		method: "POST",
		data
	})
}
// 获取自习课管理
export const selfStudyCourseInfo = data => {
	return req({
		url: `autonomy_period`,
		method: "get",
		data
	})
}
// 编辑团课模板
export const editLeagueClass = data => {
	return req({
		url: `leagueclass/edit`,
		method: "post",
		data
	})
}
// 获取团课模板详情
export const leagueClassDetail = data => {
	return req({
		url: `leagueclass/info`,
		method: "get",
		data
	})
}
// 添加团课模板
export const addLeagueClass = data => {
	return req({
		url: `leagueclass/add`,
		method: "post",
		data
	})
}
// 删除团课模板
export const delLeagueClass = data => {
	return req({
		url: `leagueclass/del?id=${data.id}`,
		method: "DELETE",
	})
}
// 获取团课列表
export const LeagueClassList = data => {
	return req({
		url: `leagueclass/list`,
		method: "get",
		data
	})
}
// 删除节假日
export const delHoliday = data => {
	return req({
		url: `holiday/del/${data.id}`,
		method: "DELETE",
	})
}
// 增加节假日
export const addHoliday = data => {
	return req({
		url: `holiday/add`,
		method: "post",
		data
	})
}
export const holidayList = () => {
	return req({
		url: `holiday/list`,
		method: "get",
	})
}
// 删除优惠卷
export const delCoupon = data => {
	return req({
		url: `coupon_del?id=${data.id}`,
		method: "DELETE",
	})
}
// 优惠卷记录
export const couponRecord = data => {
	return req({
		url: "coupon/grantrecord",
		method: "get",
		data
	})
}
// 添加优惠卷
export const addCoupon = data => {
	return req({
		url: "coupon_add",
		method: "post",
		data
	})
}
// 获取优惠卷产品数据
export const productData = () => {
	return req({
		url: "coupon/linkage_store",
		method: "get",
	})
}
// 发布教练时段
export const releaseTime = data => {
	return req({
		url: "periodadd",
		method: "post",
		data
	})
}
// 获取教练时段发布
export const coachTimeFrame = data => {
	return req({
		url: "periodinfo",
		method: "get",
		data
	})
}
// 设置教练信息
export const editCoach = data => {
	return req({
		url: "shopowner/formal_coach/edit",
		method: "post",
		data
	})
}
// 获取教练详情
export const selectCoachDetail = data => {
	return req({
		url: "shopowner/formal_coach/info",
		method: "GET",
		data
	})
}
// 获取教练管理列表
export const coachList = data => {
	return req({
		url: "shopowner/formal_coach",
		method: "GET",
		data
	})
}
// 编辑产品
export const editProduct = data => {
	return req({
		url: "shopowner/membercard/edit",
		method: "post",
		data
	})
}
// 获取产品详情
export const getProductDetail = data => {
	return req({
		url: "shopowner/membercard/info",
		method: "get",
		data
	})
}
// 新增会员卡 发布会员卡 固定卡 & 自定义卡
export const addCardFixedAndCustom = data => {
	return req({
		url: "shopowner/membercard/add",
		method: "post",
		data
	})
}

// 获取发布会员卡所需信息
export const getCardSelectInfo = data => {
	return req({
		url: "shopowner/membercard/add",
		method: "GET",
		data
	})
}

// 会员卡删除
export const delCard = data => {
	return req({
		url: "shopowner/membercard",
		method: "DELETE",
		data
	})
}
// 会员卡下架
export const soldOutCard = data => {
	return req({
		url: "shopowner/membercard/shelf",
		method: "PUT",
		data
	})
}
// 会员卡上架
export const addedCard = data => {
	return req({
		url: "shopowner/membercard/shelve",
		method: "GET",
		data
	})
}
// 获取门店会员卡列表
export const storeVipCard = data => {
	return req({
		url: "shopowner/membercard",
		method: "GET",
		data
	})
}
// 获取门店销售审核列表
export const saleAuditList = data => {
	return req({
		url: "become/sale_examine_list",
		method: "GET",
		data
	})
}
// 通过教练申请
export const passCoachAudit = data => {
	return req({
		url: "become/examine",
		method: "post",
		data
	})
}
// 获取门店教练审核列表
export const coachAuditList = data => {
	return req({
		url: "become/coach_examine_list",
		method: "GET",
		data
	})
}
// 新增储物柜
export const addLocker = data => {
	return req({
		url: "lockers/add",
		method: "post",
		data
	})
}
// 获取门店储物柜信息
export const getLockerInfo = data => {
	return req({
		url: "lockers/config_edit",
		method: "get",
		data
	})
}

// 设置储物柜信息
export const setLockerInfo = data => {
	return req({
		url: "lockers/config_edit",
		method: "post",
		data
	})
}
// 获取门店储物柜列表
export const storeLockerList = data => {
	return req({
		url: "lockers/lst",
		method: "get",
		data
	})
}
// 获取门店信息
export const storeInfo = () => {
	return req({
		url: "shopowner/update",
		method: "get"
	})
}
// 搜索用户get
export const searchUserGet = data => {
	return req({
		url: "userlist",
		method: "get",
		data
	})
}
// 搜索用户 post
export const searchUserPost = data => {
	return req({
		url: "userlist",
		method: "post",
		data
	})
}
// 删除店长
export const delShopManager = data => {
	return req({
		url: `shopowner_del?id=${data.id}`,
		method: "DELETE"
	})
}
// 新增区域店长
export const addShopManager = data => {
	return req({
		url: "shopowner_add",
		method: "post",
		data
	})
}
// 店长管理列表
export const shopManagerList = data => {
	return req({
		url: "shopowner_list",
		method: "get",
		data
	})
}
// 分区经理选择门店
export const managerStoreSelect = () => {
	return req({
		url: "manager_store_select",
		method: "get",
	})
}
// 删除分区经理
export const delManager = data => {
	return req({
		url: `become/manager_del/${data.id}`,
		method: "delete"
	})
}
// 新增分区经理
export const addManager = data => {
	return req({
		url: "become/manager_add",
		method: "post",
		data
	})
}
// 分区经理列表
export const managerList = () => {
	return req({
		url: "become/manager_list",
		method: "get",
	})
}
// 销售申请
export const saleApply = data => {
	return req({
		url: "become/sale",
		method: "post",
		data
	})
}
// 运动管理师申请
export const sportManagementApply = data => {
	return req({
		url: "become/sporty",
		method: "post",
		data
	})
}
// 营养师申请
export const dieticianApply = data => {
	return req({
		url: "become/nutrition",
		method: "post",
		data
	})
}
// 获取门店列表
export const shopList = () => {
	return req({
		url: "store/column",
		method: "get"
	})
}
// 教练申请
export const coachApply = data => {
	return req({
		url: "become/coach",
		method: "post",
		data
	})
}
// 判断用户是否此角色
export const ifExistRole = data => {
	return req({
		url: "pd_role",
		method: "get",
		data
	})
}
// 获取管理员列表
export const getAdminList = data => {
	return req({
		url: "admin/entrance",
		method: "get",
		data
	})
}
// 获取用户运动记录
export const getUserExerciseList = data => {
	return req({
		url: "admin_motion_obvious",
		method: "get",
		data
	})
}
// 标记用户运动状态
export const againAdminSports = data => {
	return req({
		url: "again_admin_sports",
		method: "post",
		data
	})
}
// 设置人脸权限开关
export const setFaceOpen = data => {
	return req({
		url: "setFaceOpen",
		method: "post",
		data
	})
}
// 最新的体测记录
export const bodytest_record = data => {
	return req({
		url: "bodytest_record",
		method: "get",
		data
	})
}

