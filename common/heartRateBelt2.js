import {
	initBleBluetooth,
	createBLEConnection,
	closeBLEConnection,
	stopBluetoothDevicesDiscovery,
	sendVersionCmd,
	sendTotalRecordCmd,
	sendUtcCmd,
	sendMaxHrvCmd,
	sendsetShock,
	getShock,
	closeShock,
	sendCustomModeSetting,
	getCustomModeState
} from '@/sdk/heart_sdk_2/bleControl.js'
import logrecord from "@/common/log.js"
import {
	UUID_COMMON_POWER,
	UUID_COMMON_FIRMVERSION,
	UUID_COMMON_HARDVERSION,
	UUID_COMMON_SOFTVERSION
} from '@/sdk/heart_sdk_2/fitareBleUuid.js'
import {
	inArray,
	int2byte,
	str2byte,
	ab2hex,
	str2ab
} from '@/sdk/heart_sdk_2/convertUtf.js'
import {
	formatTime
} from '@/sdk/heart_sdk_2/dateUtil.js'
let wxConfig =  __wxConfig.envVersion
let data = {
	devices: [], // 扫描到的设备列表
	connected: false,  // 是否连接成功
	chs: [], // 未知
	modalShow: false, 
	name: "", // 连接成功的设备name
	deviceId: "", // 连接成功的设备id
	battery: "--", // 电量
	heartrate: 0, // 实时心率
	step: "--",
	is_auto: false, //是否自动连接
	historyHR: [], // 历史心率数据
}
// 发现设备的callBack
let findEquipment;
/* 心率发生改变的回调 */
let changeHeartRate;
//初始化蓝牙,只调用一次
const openBluetoothAdapter = (callBack,changeHeartCallBack,isAuto) => {
	// uni.showLoading({
	// 	title: '扫描设备中...'
	// });
	
	findEquipment = callBack;
	changeHeartRate = changeHeartCallBack
	data.devices = [];
	data.connected = false;
	data.modalShow = Boolean(isAuto) ? false : true;
	data.is_auto = Boolean(isAuto)
	// = {
	// 	devices: [],
	// 	connected: false,
	// 	chs: [],
	// }
	/* 
		@ connectDateListener 监听实时返回数据的 监听器
		@ initBluetoothListener 监听返回扫描到的蓝牙列表
		@ connectDeviceListener 链接成功的监听器
	*/
	initBleBluetooth(initBluetoothListener, connectDeviceListener, connectDateListener);
}
/** 监听蓝牙初始化，返回蓝牙列表 */
const initBluetoothListener = (res) => {
	if (res.errCode == "disConnect") {
		data.connected = false;
		data.chs = []
		findEquipment(data, "心率带断开连接", "break")
		return;
	}
	if (res.errCode == 0) {
		if (!!!res.devices || res.devices.length == 0) {
			return;
		}
		uni.hideLoading()
		res.devices.forEach(device => {
			if (!device.name && !device.localName) {
				return
			}
			const foundDevices = data.devices
			const idx = inArray(foundDevices, 'deviceId', device.deviceId)
			if (idx === -1) {
				// data[`devices[${foundDevices.length}]`] = device
				data.devices[foundDevices.length] = device
			} else {
				// data[`devices[${idx}]`] = device
				data.devices[idx] = device
			}
		})
		findEquipment(data, "扫描到的心率带设备列表", "discover")
	} else { //错误提示内容
		wx.showToast({
			title: res.errMsg,
			icon: 'fail',
			duration: 2000
		})
	}
}
//蓝牙连接
const createBLEConnectionFun = (e) => {
	// const ds = e.currentTarget.dataset;
	createBLEConnection(e.deviceId, e.name, connectDeviceListener, connectDateListener)
}

/** 连接上的设备监听 */
const connectDeviceListener = (res) => {
	if (res.errCode != 0 && res.errCode != -1) {
		return;
	}
	
	var name = res.device.name;
	var deviceId = res.device.deviceId;
	data.connected = true;
	data.name = name;
	data.deviceId = deviceId;
	data.modalShow = false;
	setTimeout(() => {
		setUtc();
	},300)
	
	findEquipment(data, "连接成功状态提示", "success")
}
/** 蓝牙连接返回数据监听 
 *  1：实时数据，4：历史数据，5：版本号, 6硬件版本， 7软件版本，8固件版本，0电量
 * 5：版本号, 6硬件版本， 7软件版本，8固件版本，0电量 连接上就自动读取， 10：设备接收指令的结果
 * 11：心率震动阈值设置，12：心率震动阈值获取，13，心率震动阈值关闭
 */
const connectDateListener = (cmdKey, dataE) => {
	if (parseInt(cmdKey) == 0) {
		// data.battery = dataE;
		data.battery = `${dataE}%`;
		findEquipment(data, "心率带电量改变", 'battery')
		return;
	}
	if (parseInt(cmdKey) == 5) {
		/* 设备版本号:version=" + dataE */
		return;
	}
	if (parseInt(cmdKey) == 6) {
		/* 硬件版本 dataE */
		return;
	}
	if (parseInt(cmdKey) == 7) {
		return;
	}
	if (parseInt(cmdKey) == 8) {
		return;
	}
	if (parseInt(cmdKey) == 9) { //实时心率
		data.heartrate = dataE.heartRate;
		findEquipment(data, "心率change", 'heartChange')
		changeHeartRate(dataE.heartRate);
		return;
	}
	if (parseInt(cmdKey) == 10) { //设备接受指令结果
		return;
	}
	if (parseInt(cmdKey) == 11) { //心率震动阈值设置结果
		if(dataE == "success") {
			uni.showToast({
				title: "设置成功"
			})
		}
		return;
	}
	if (parseInt(cmdKey) == 12) { //心率震动阈值获取结果
		//switchMark : 是否开启震动 0-为开启 1-开启
		//shockNumber : 震动阀值
		return;
	}
	if (parseInt(cmdKey) == 13) { //心率震动阈值关闭结果
		//dataE：success 或 failure
		return;
	}

	if (parseInt(cmdKey) == 1 || parseInt(cmdKey) == 2) { //步数，步频,卡路里
		if ("step" == dataE.type) { //实时步数、卡路里
			data.step = dataE.steps;
			findEquipment(data, "步数发生改变","stepChange")
		} else if ("custom" == dataE.type) { //自定义数据
		}
		return;
	}
	if (parseInt(cmdKey) == 3) { //步数，步频,卡路里
		if ("custom" == dataE.type) { //自定义数据
		}
		return;
	}
	if (parseInt(cmdKey) == 4) {
		if (dataE.type == 'step') {
			for (let i = 0; i < dataE.steps.length; i++) {
				// console.log("步数历史第" + i + "组时间:" +  dataE.steps[i].createTime);
			}
		} else if (dataE.type == 'rate') {
			console.log(dataE, "--dataE");
			if(['develop', 'trial'].includes(wxConfig)) {
				logrecord.warn('SDK推送历史数据',{
					historyHRLength: data.historyHR.length
				})
			}
			data.historyHR.push(...dataE.heartRate);
			findEquipment(data, "心率历史数据","historyListHW", dataE)
			// for (let i = 0; i < dataE.heartRate.length; i++) {
				// console.log("心率历史第" + i + "组时间:" +  dataE.heartRate[i].createTime);
			// }
		} else if (dataE.type == 'step15') {
			for (let i = 0; i < dataE.steps.length; i++) {
				// console.log("15分钟步数历史第" + i + "组时间:" +  dataE.steps[i].createTime);
			}
		} else if (dataE.type == 'calorie') {
			// console.log("训练卡路里数据:" + dataE.calories.length + "组");
		}
		return;
	}
}
/** 读取命令回调 */
const readCharacteristicValueListener = (res) => {
}
/** 发送指令回调 */
const sendCmdCallBackListener = (res) => {
}
//关闭蓝牙连接，需要先关闭蓝牙连接，再停止监听，顺序不能变，不然会异常
const closeBLEConnectionFun = () => {
	closeBLEConnection();
	data.connected = false;
	data.chs = [];
	data.canWrite = false;
	data.modalShow = false;
}
/* 停止扫描 */
const stopBluetoothDevicesDiscoveryFun = () => {
	stopBluetoothDevicesDiscovery();
}
//结束流程, 关闭蓝牙适配器
const closeBluetoothAdapter = () => {
	closeBLEConnectionFun();
	wx.closeBluetoothAdapter();
	//关闭蓝牙状态变更监听
	wx.offBLEConnectionStateChange();
	//关闭蓝牙数据变更监听
	wx.offBLECharacteristicValueChange();
	data.connected = false;
	data.devices = [];
	data.modalShow = false;
	if(!findEquipment) return
	findEquipment(data, "关闭扫描蓝牙", "break")
}
//获取设备版本（私有简单协议）
const getVersion = () => {
	var headNum = sendVersionCmd('version', sendCmdCallBackListener);
	return;
}
//获取历史数据
const getHistory = () => {
	if(['develop', 'trial'].includes(wxConfig)) {
		logrecord.warn('SDK进入获取历史数据HW',{})
	}
	var headNum = sendTotalRecordCmd('history', sendCmdCallBackListener);
	return;
}
//设置utc
const setUtc = () => {
	var date = new Date();
	var date = formatTime(date);
	var headNum = sendUtcCmd(date, 'utc', sendCmdCallBackListener);
	return;
}
/** 设置最大心率 */
const sendMaxHrvCmdFun = (val) => {
	var headNum = sendMaxHrvCmd(val, 'maxHrv', sendCmdCallBackListener);
	return;
}

/** 简单协议-设置心率振动阈值 */
const sendsetShockFun = (val) => {
	sendsetShock(val, 'setShockNumber', sendCmdCallBackListener);
	return;
}

/** 简单协议-获取心率振动阈值 */
const getShockNumber = () => {
	getShock('getShockNumber', sendCmdCallBackListener);
	return;
}

/** 简单协议-关闭心率振动阈值 */
const closeShockFun = () => {
	closeShock('closeShockNumber', sendCmdCallBackListener);
	return;
}

/**进入锻炼模式 */
const sendCustomModeSettingOn = () => {
	//返回指令的头序列号
	var headNum = sendCustomModeSetting(0, 'customSetting', sendCmdCallBackListener);
	return;
}
/**退出锻炼模式 */
const sendCustomModeSettingOff = () => {
	//返回指令的头序列号
	var headNum = sendCustomModeSetting(1, 'customSetting', sendCmdCallBackListener);
	return;
}
/** 设置自定义模式 0:进入模式，1：退出模式*/
const sendCustomModeSettingFun = (mode) => {
	//返回指令的头序列号
	var headNum = sendCustomModeSetting(mode, 'customSetting', sendCmdCallBackListener);
	return headNum;
}
/** 获取自定义模式状态*/
const getCustomModeStateFun = () => {
	//返回指令的头序列号
	var headNum = getCustomModeState('customMode', sendCmdCallBackListener);
	
	return;
}
export default {
	data,
	openBluetoothAdapter, // 点击扫描
	createBLEConnectionFun, // 点击连接蓝牙
	closeBluetoothAdapter, // 结束流程
	stopBluetoothDevicesDiscoveryFun, // 停止扫描
	getHistory, // 获取历史数据
	sendMaxHrvCmdFun,
	sendsetShockFun, // 设置心率震动阈值
	setUtc, // 矫正时间
}