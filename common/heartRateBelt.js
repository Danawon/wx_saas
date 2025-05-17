import {
  FitnessManager,
  ConnectStatus,
  Version
} from '@/sdk/heart_sdk_cl/fitness';
// 心率索引
let total = 0;
// 数据条数
let count = 0;
// 查询时间
let before = 0;

let data = {
	// 设备信息
	// SDK版本
	sdkversion: Version,
	// 蓝牙是否连接
	connected: false,
	// 成功连接的设备
	device: {},
	// 扫描到的设备
	devices: [],
	// 电池电量
	battery: '--',
	// 软件版本
	software: '--',
	// 心率数据
	heartrate: '--',
	// intervals
	intervals: '--',
	// 步数
	step: '--',
	// 步行距离
	distance: '--',
	// 卡路里
	calorie: '--',
	// 用户信息 (年龄，性别,身高(cm),体重(kg),userId)
	userInfo: '--',
	//手机号码
	mobile: "",
	// 心率列表
	hrList: [],
	// 心率数据
	hrData: [],
	// 是否进入血氧模式
	bloodOxygenModel: '--',
	// 血氧值
	bloodOxygenValue: '--',
	// 手腕姿势
	wristPosture: '--',
	// pi值
	piValue: '--',
	// 是否佩戴
	onWrist: '--',
	// 环境温度
	ambientTemperature: '--',
	// 手腕温度
	wristTemperature: '--',
	// 体温
	bodyTemperature: '--',
	heartRateAlarm: "",
	fmanager: {}, // 蓝牙设备
	modalShow: false, // 显示设备列表modal 
	is_auto: false, // 是否自动连接
}
// 发现设备的callBack
let findEquipment;

/* 心率发生改变的回调 */
let changeHeartRate;
// 状态改变回调
const didUpdateConnectStatus = (res) => {
	if (res.connectStatus === ConnectStatus.connected) {
		wx.hideLoading();
		// 蓝牙是否连接
		data.connected = true;
		data.device = res.device;
		// 接入蓝牙 传参回调
		findEquipment(data, "连接成功状态提示", "success")
	} else if (
		res.connectStatus === ConnectStatus.disconnected
	) {
		wx.closeBluetoothAdapter();
		uni.hideLoading();
		// 蓝牙是否连接
		data.connected = false;
		data.modalShow = false;
		// 断连回调 传参
		if (findEquipment) {
			findEquipment(data, "连接失败--断开提示", 'break')
		}
	}
}

// 发现设备回调
const didDiscoverDevice = (res) => {
	uni.hideLoading();
	if (res.timeout) {
		findEquipment(data, "扫描超时", "timeOut");
	} else {
		let device = res.device;
		if (device) {
			let devices = data.devices;
			devices = devices.filter(
				item =>
				item === null ||
				item.deviceId != device.deviceId
			);
			devices.push(device);
			devices.sort((a, b) => b.RSSI - a.RSSI);
			data.devices = devices;
			// devices => 搜索到的设备列表
			data.modalShow = true;
			// 发现设备调用 传入更新后的数据
			findEquipment(data, "扫描到设备", "discover")
		}
	}
}

// 特征值改变回调
const didUpdateValueForCharacteristic = (res) => {}

// 电池电量变化回调
const didBatteryForCharacteristic = (res) => {
	data.battery = `${res}%`;
	findEquipment(data, "心率带电量改变", 'battery')
}

// 软件版本信息回调
const didSoftwareForCharacteristic = (res) => {
	data.software = res;
}

// 运动变化数据回调
const didSportForCharacteristic = (res) => {
	data.step = res.step;
	data.distance = `${res.distance / 100}m`;
	data.calorie = `${res.calorie / 10}CAL`;
	findEquipment(data, "步数发生改变", "stepChange")
}

// 用户信息回调
const didUserInfoForCharacteristic = (res) => {
	let gender = res.sex === 1 ? '男' : '女';
	data.userInfo = `年龄:${
				res.age
			} 性别:${gender} 体重:${res.weight}kg \n身高:${
				res.height
			}cm 手机:${res.userId}`;
}
// 获取生成的心率日期历史列表回调
const didHeartrateListForCharacteristic = (res) => {
	data.hrList = res.map(value => ({
        ...value,
        time: new Date(value.record).toLocaleString()
      }));
	total = res.length;
	// return
	findEquipment(data, "获取心率带日期列表历史记录", "dateRecordList")
}

// 获取指定日期下心率历史数据回调
const didHeartrateDataForCharacteristic = (res) => {
	// data.hrData = [...data.hrData, ...res];
	data.hrData= res.map(value => ({
	  ...value,
	  time: new Date(value.stamp).toLocaleString()
	}))
	// data.hrData = res.map(value => ({
	// 	...value,
	// 	time: new Date(value.stamp).toLocaleString()
	// }))
	findEquipment(data, "指定日期下的心率历史列表", "heartRecordList")
	if (count < 0) {
		data.userInfo =
			`Length:${data.hrData.length}-Time:` +
			`${Date.now() - before}`;
		data.hrData = [];
		// return;
	} else {
		queryChunk();
	}
	
}
const didHeartrateProgressForCharacteristic = res => {
	let time = new Date(res.stamp).toLocaleString();
	let progress = (res.progress * 100.0) / res.total;
}

//血氧数据回调
const didBloodOxygenDataForCharacteristic = (res) => {
	let pi;
	switch (res.piValue) {
		case 0:
			pi = '未检测到 ';
			break;
		case 8:
			pi = '信号较弱 ';
			break;
		case 15:
			pi = '信号良好 ';
			break;
	}
	// 血氧模式  0：退出血氧模式  1：进入血氧模式  2：查询血氧模式（APP）
	// 血氧值
	// 手腕姿势，0：表示手腕姿势不对，1：姿势佩戴正确
	// 红光Pi值，0：未检测到脉搏，<8,信号较弱，>15信号良好
	// Onwrist，0：表示脱腕，1：佩戴
	data.bloodOxygenModel =
		res.bloodOxygenModel == 1 ? '进入 ' : '退出 ';
	data.bloodOxygenValue = res.bloodOxygenValue;
	data.wristPosture =
		res.wristPosture == 1 ? '正确 ' : '错误 ';
	data.piValue = pi;
	data.onWrist = res.onWrist == 1 ? '佩戴  ' : '脱腕 ';
}

//实时温度数据
const didRealTimeTemperatureDataForCharacteristic = (res) => {
	data.ambientTemperature =
		res.ambientTemperature + 'C ';
	data.wristTemperature = res.wristTemperature + 'C ';
	data.bodyTemperature = res.bodyTemperature + 'C ';
}

// 心率变化数据回调
const didHeartrateForCharacteristic = (res) => {
	data.heartrate = `${res.heartRate}`;
	data.intervals = `${res.intervals}`;
	findEquipment(data, "心率发生改变提示")
	if (changeHeartRate) {
		changeHeartRate(res.heartRate);
	}
}

// 扫描
const _scan = (callBack, callBack2, isAuto) => {
	// 发现设备的回调
	findEquipment = callBack;
	/* 心率发生改变的回调 */
	if (callBack2) {
		changeHeartRate = callBack2;
	}
	data.is_auto = Boolean(isAuto)
	data.devices = [];
	data.fmanager
		.scan({
			services: [],
			allowDuplicatesKey: false,
			interval: 0,
			timeout: 15000,
			deviceName: '',
			containName: 'CL831'
		})
		.then(res => {
			// uni.showLoading({
			// 	title: '扫描设备中...'
			// });
		})
		.catch(e => {
			// showToast({
			// 	title: e.message,
			// 	icon: 'none'
			// });
		});
}
// 停止扫描
const _stopScan = () => {
	uni.hideLoading();
	data.fmanager.autoconnect(false).then(res => {
	  console.log('home autoconnect success', res);
	});
	data.fmanager
		.stopScan()
		.then(res => {})
		.catch(e => {});
}
// 连接
const _connect = (e) => {
	data.fmanager.stopScan();
	let device = e;
	data.fmanager
		.connect(device, false)
		.then(res => {
			uni.showToast({
				title: '连接设备成功'
			});
			data.modalShow = false;
		})
		.catch(e => {
			uni.showToast({
				title: e.message
			});
		});
	// uni.showLoading({
	// 	title: '连接中...'
	// });
}
// 断开连接
const _disconnect = (type) => {
	data.fmanager
		.disconnect(false)
		.then(res => {
			data.modalShow = false;
			data.devices = [];
			if (findEquipment) {
				findEquipment(data, "断开连接提示", 'break')
			}
		})
		.catch(e => {
			// home disconnect fail
		});
}
// 获取心率历史列表
const _heartrateList = (e) => {
	uni.navigateTo({
		url: '/pages/hrlist/hrlist'
	});
}
// 获取运动历史数据
const _sportHistory = (e) => {
	uni.navigateTo({
		url: '/pages/sport/sport'
	});
}
// 获取和查询心率设置数据
const _heartSeeting = (e) => {
	uni.navigateTo({
		url: '/pages/hrsetting/hrsetting'
	});
}
// 获取指定片段数据
const _heartrateChunk = (e) => {
	count = 5;
	before = Date.now();
	if (total >= count) {
		queryChunk();
	} else {
		uni.showToast({
			title: '心率列表为空',
			icon: 'none'
		});
	}
}
const queryChunk = () => {
	showToast({
		title: '查询中...'
	});
	// 索引=total-1
	let stamp = data.hrList[total - count - 1].stamp;
	data.fmanager.getHeartrateData(stamp);
	count--;
}
// 用户信息:手机号码
const bindUserId = (e) => {
	data.mobile = e.detail.value;
}
// 设置用户信息
const _setUserInfo = () => {
	data.userInfo = '--'; //界面清除用户信息，便于查看获取用户信息是否成功
	data.fmanager.setUserInfo(
		18,
		1,
		55,
		175,
		data.mobile
	);
}
// 获取用户信息
const _getUserInfo = () => {
	data.fmanager.getUserInfo();
}

//设置血氧模式
const _setBloodOxygenMode = () => {
	data.fmanager.setBloodOxygenMode(1); //0：退出血氧模式   1：进入血氧模式  2：查询血氧模式（）
}

/* 获取指定日期时段历史心率记录表 */
const getHeartrateDataFun = (timestamp) => {
	/* 获取心率历史列表表 */
	if (data.fmanager) {
		data.fmanager.getHeartrateData(timestamp);
	}
}
/* 获取心率日期列表历史记录表 */
const getHeartrateListFun = () => {
	/* 获取心率历史列表表 */
	if (data.fmanager) {
		data.fmanager.getHeartrateList();
	}
}
/* 设置心率带报警值 */
const setHeartRateSetting = (val) => {
	if (data.fmanager) {
		// data.fmanager.setHeartRateSetting(1, val)
		data.fmanager.setHeartRateSetting(0, val, 0)
	}
}
  // 设置心率报警开关回调
const didHeartRateEnabledForCharacteristic = (res) => {
    getHeartRateSetting()
    /**
     * 返回最大心率计算方式
        0  上下限
        1  根据年龄计算
        心率最大值
        1：最大心率计算采用上下限设置时，则返回上限值
        2：根据年龄计算则返回年龄计算的最大值
        心率下限值
        1：最大心率计算采用上下限设置时，则返回下限值
        2：根据年龄计算则返回0
     */
	data.heartRateAlarm = `${res.enabled ? "报警值" : "年龄"}`
}
//获取心率设置信息
const getHeartRateSetting = () => {
      data.fmanager.getHeartRateSetting();
}
// 设置及获取区间及目标心率回调
const didHeartRateSettingUpdateCB = (res) => {
	if (res.isQuery == 0) { //查询回调
		console.log(`心率上限值: ${res.heartTop}`);
	} else { //设置回调
		wx.showToast({
			title: '报警设置成功',
			icon: 'success',
			duration: 1000
		});
		data.fmanager.setHeartRateAlarmEnabled(0);
	}
}

const init_fmanager = () => {
	
	// 初始化蓝牙管理器
	data.fmanager = new FitnessManager({
		debug: false
	});
	// 设置及获取区间及目标心率数据回调
	data.fmanager.registerHeartrateSettingForCharacteristic(didHeartRateSettingUpdateCB)
	// 注册设置心率报警开关回调
	data.fmanager.registerHeartrateEnabledForCharacteristic(didHeartRateEnabledForCharacteristic)
	
	// 注册状态回调
	data.fmanager.registerDidUpdateConnectStatus(
		didUpdateConnectStatus
	);
	// 注册发现设备回调
	data.fmanager.registerDidDiscoverDevice(
		didDiscoverDevice
	);
	// 注册特征值改变回调
	data.fmanager.registerDidUpdateValueForCharacteristic(
		didUpdateValueForCharacteristic
	);
	// 注册电池电量变化回调
	data.fmanager.registerBatteryForCharacteristic(
		didBatteryForCharacteristic
	);
	// 注册软件版本信息回调
	data.fmanager.registerSoftwareForCharacteristic(
		didSoftwareForCharacteristic
	);
	// // 注册心率变化数据回调
	data.fmanager.registerHeartrateForCharacteristic(
		didHeartrateForCharacteristic
	);
	// 注册运动数据回调
	data.fmanager.registerSportForCharacteristic(
		didSportForCharacteristic
	);
	// 注册用户信息回调
	data.fmanager.registerUserInfoForCharacteristic(
		didUserInfoForCharacteristic
	);
	// 注册心率历史列表回调
	data.fmanager.registerHeartrateListForCharacteristic(
		didHeartrateListForCharacteristic
	);
	// 注册心率历史数据回调
	data.fmanager.registerHeartrateDataForCharacteristic(
		didHeartrateDataForCharacteristic
	);
	// 注册心率历史数据进度回调
	data.fmanager.registerHeartrateProgressForCharacteristic(didHeartrateProgressForCharacteristic);
	// 注册血氧数据回调
	data.fmanager.registerBloodOxygenForCharacteristic(
		didBloodOxygenDataForCharacteristic
	);
	// 注册实时温度数据回调
	data.fmanager.registerRealTimeTemperatureForCharacteristic(
		didRealTimeTemperatureDataForCharacteristic
	);
	
}
export default {
	data,
	didUpdateConnectStatus,
	didDiscoverDevice,
	didUpdateValueForCharacteristic,
	didBatteryForCharacteristic,
	didSoftwareForCharacteristic,
	didHeartrateForCharacteristic,
	didSportForCharacteristic,
	didUserInfoForCharacteristic,
	_scan,
	_stopScan,
	_connect,
	_disconnect,
	_heartrateList,
	_sportHistory,
	_heartSeeting,
	_heartrateChunk,
	queryChunk,
	didHeartrateListForCharacteristic,
	bindUserId,
	didHeartrateDataForCharacteristic,
	didBloodOxygenDataForCharacteristic,
	didRealTimeTemperatureDataForCharacteristic,
	_setUserInfo,
	_getUserInfo,
	_setBloodOxygenMode,
	init_fmanager,
	
	getHeartrateDataFun,
	getHeartrateListFun,
	setHeartRateSetting
}