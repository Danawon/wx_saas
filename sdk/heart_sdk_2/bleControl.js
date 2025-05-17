//已连接的设备,全局变量，同时只允许一个设备连接
const app = getApp();
var device = {
  deviceId: null,
  serviceId: "0000FD00-0000-1000-8000-00805F9B34FB",
  name: null,
  connected: false,
  stopDiscovery: true, //停止扫码状态，默认停止
  sending: false, //正在发送数据
  headerNumber: 0,//指令序号，从0开始，断开置为0
};
/**
 * 初始化蓝牙，回调返回蓝牙列表
 */
function initBleBluetooth(initBluetoothListener, connectDeviceListener, connectDateListener) {
  wx.openBluetoothAdapter({
    success: (res) => {
      getTheBlueDisConnectWithAccident(initBluetoothListener, connectDeviceListener, connectDateListener); //监听蓝牙是否会异常断开
      startBluetoothDevicesDiscovery(initBluetoothListener, connectDeviceListener, connectDateListener); //搜索蓝牙
    },
    fail: (res) => { //调用失败直接提示信息
      // callback(res);
	  if(res.errCode === 10001) {
		wx.showToast({
			title: "蓝牙未打开",
			icon: "error"
		})
	  }
    }
  })
}
//监听蓝牙设备是否会异常断开,并回调
function getTheBlueDisConnectWithAccident(callback, connectDeviceListener, connectDateListener) {
  //开启蓝牙断开监听
  wx.onBLEConnectionStateChange(function (res) {
    device.sending = false;
    if (!res.connected) {
      res.errCode = "disConnect";
      callback(res);
      device.headerNumber = 0; //重新置为0
      //先关闭再打开蓝牙适配器
      wx.closeBluetoothAdapter({
        success: function (res) {
          wx.openBluetoothAdapter({
            success: function (res) {
              startBluetoothDevicesDiscovery(callback, connectDeviceListener, connectDateListener); //重新搜索
            },
            fail: function (res) {
              callback(res);
            }
          })
        },
        fail: function (res) {
          callback(res);
        }
      })
    }
  })
}
//开始搜寻附近的蓝牙外围设备。此操作比较耗费系统资源，请在搜索并连接到设备后调用 wx.stopBluetoothDevicesDiscovery 方法停止搜索
function startBluetoothDevicesDiscovery(callback, connectDeviceListener, connectDateListener) {
  device.stopDiscovery = false;
  wx.startBluetoothDevicesDiscovery({
    allowDuplicatesKey: true,
    success: (res) => {
      onBluetoothDeviceFound(callback, connectDeviceListener, connectDateListener);
    },
  })
}
//监听寻找到新设备的事件,并判断新设备中是否存在已经连接的设备
function onBluetoothDeviceFound(callback, connectDeviceListener, connectDateListener) {
  wx.onBluetoothDeviceFound((res) => {
    res.errCode = 0;
    var deviceList = [];
    res.devices.forEach(deviceInfo => {
      //限制只能过滤出对应的设备
      if ((!!deviceInfo.name || !!deviceInfo.localName) && deviceInfo.name.indexOf("HW") >= 0) {
        deviceList.push(deviceInfo);
        //存在已连接的设备
        if (device.connected && deviceInfo.deviceId == device.deviceId) {
          reCreateBLEConnection(connectDeviceListener, connectDateListener);//重新连接设备
        }
      }
    });
    res.devices = deviceList; //过滤后的结果
    callback(res); //返回监听到的设备
  })
}
//蓝牙连接,连接成功返回数据接收监听
function createBLEConnection(deviceId, deviceName, callbackDevice, callbackData) {
  executeBLEConnection(deviceId, deviceName, callbackDevice, callbackData);
}
//重新连接蓝牙
function reCreateBLEConnection(connectDeviceListener, connectDateListener) {
  if (!device.connected) {
    return;
  }
  executeBLEConnection(device.deviceId, device.name, connectDeviceListener, connectDateListener);
}
//执行蓝牙连接
function executeBLEConnection(deviceId, deviceName, callbackDevice, callbackData) {
  app.globalData.headArray = []; //蓝牙连接的时候设置数据头为空
  wx.createBLEConnection({
    deviceId,
    success: (res) => {
      device.deviceId = deviceId;//已连接的设备id
      device.name = deviceName;
      device.connected = true;
      if (!!callbackDevice && typeof callbackDevice == "function") {
        res.device = device;
        callbackDevice(res);
      }
      if (!!callbackData && typeof callbackData == "function") {
        getBLEDeviceServices(deviceId, callbackData);
      }
    },
    fail: (res) => {
      if (res.errCode == -1) {
        res.device = device;
      }
      callbackDevice(res);
    }
  })
  stopBluetoothDevicesDiscovery() //连接完成后关闭蓝牙搜索
}
//停止蓝牙搜索
function stopBluetoothDevicesDiscovery() {
  if (!device.stopDiscovery) {
    wx.stopBluetoothDevicesDiscovery();
    device.stopDiscovery = true;
  }
}
//获取在蓝牙模块生效期间所有已发现的蓝牙设备。包括已经和本机处于连接状态的设备
function getBLEDeviceServices(deviceId, callback) {
  wx.getBLEDeviceServices({
    deviceId,
    success: (res) => {
      for (let i = 0; i < res.services.length; i++) {
        if (res.services[i].isPrimary) {
          getBLEDeviceCharacteristics(deviceId, res.services[i].uuid, callback);
        }
      }
    }
  })
}
//获取蓝牙设备某个服务中所有特征值(characteristic)
function getBLEDeviceCharacteristics(deviceId, serviceId, callback) {
  wx.getBLEDeviceCharacteristics({
    deviceId,
    serviceId,
    success: (res) => {
      for (let i = 0; i < res.characteristics.length; i++) {
        let item = res.characteristics[i];
        if (item.properties.read) {
          //读取低功耗蓝牙设备的特征值的二进制数据值。注意：必须设备的特征值支持 read 才可以成功调用
          wx.readBLECharacteristicValue({
            deviceId,
            serviceId,
            characteristicId: item.uuid,
          });
        }
        //启用低功耗蓝牙设备特征值变化时的 notify 功能，订阅特征值。注意：必须设备的特征值支持 notify 或者 indicate 才可以成功调用。
        //另外，必须先启用 notifyBLECharacteristicValueChange 才能监听到设备 onBleCharacteristicValueChange 事件
        if (item.properties.notify || item.properties.indicate) {
          wx.notifyBLECharacteristicValueChange({
            deviceId,
            serviceId,
            characteristicId: item.uuid,
            state: true,
          })
        }
      }
    },
    fail: (res) => {
    }
  })
  // 操作之前先监听，保证第一时间获取数据, 如果是断开重连，则是已经创建过监听
  if (!!callback && typeof callback == "function") {
    onBLECharacteristicValueChange(callback);
  }
}
//蓝牙接收数据监听
function onBLECharacteristicValueChange(callback) {
  wx.onBLECharacteristicValueChange((characteristic) => {
    // if (characteristic.characteristicId.toUpperCase() == UUID_HEARTRATE_NOTIFY.toUpperCase()) {
    //     return;
    // }
   // characteristic.characteristicId + ', value: ' + ab2hex(characteristic.value) + '}'); //ab2hex(characteristic.value) + '}');
    //解析数据
    analysisBleData(characteristic.characteristicId, characteristic.value, callback);
  })
}
//向蓝牙设备发送16进制数据,
//单通道，只能一条指令执行完成返回后，再进行下一条指令的发送
function sendBLECmdValue(sendCmd, type, callback) {
  if (device.sending) {
    wx.showToast({
      title: 'on sending',
      icon: 'fails',
      duration: 3000,
      type : type,
    })
    return;
  }
  device.sending = true;
  var cmdCharacteristicId = UUID_COMMON_WRITE.toUpperCase(); //写命令uuid
  device.headerNumber += 1;
  var sendIndex = 0;
  //一次只能发送一条指令，上条指令未收到处理成功时，不进行下一条发送
  do {
    var sendCmdValue = sendCmd[sendIndex];
    var delay = 1000;
    if (sendIndex == 0) {
      delay = 0;
    }
    //多包发送设置延迟发送
    setTimeout(function () {
      wwriteBLECharacteristicCmdValue(cmdCharacteristicId, sendCmdValue, type, callback);
    }, delay);
  } while (!device.sending)
}

//向蓝牙设备发送16进制数据,
//单通道，只能一条指令执行完成返回后，再进行下一条指令的发送
function sendBLECmdValue2(sendCmd, type, callback) {
    var cmdCharacteristicId = UUID_COMMON_WRITE0A.toUpperCase(); //写命令uuid
    wwriteBLECharacteristicCmdValue(cmdCharacteristicId, sendCmd, type, callback);
 }


//关闭蓝牙连接，需要先关闭蓝牙连接，再停止监听，顺序不能变，不然会异常
function closeBLEConnection() {
  if (!device.connected) {
    return
  }
  //关闭蓝牙连接
  wx.closeBLEConnection({
    deviceId: device.deviceId
  });
  //关闭蓝牙状态变更监听
  wx.offBLEConnectionStateChange();
  //关闭蓝牙数据变更监听
  wx.offBLECharacteristicValueChange();
  device.connected = false; //设置连接的设备断开
  device.sending = false;
  device.deviceId = null;
}
//关闭蓝牙适配器
function closeBluetoothAdapter() {
  wx.closeBluetoothAdapter();
  //关闭蓝牙状态变更监听
  wx.offBLEConnectionStateChange();
  //关闭蓝牙数据变更监听
  wx.offBLECharacteristicValueChange();
  device.deviceId = null; //已连接的设备id
  device.name = null;
  device.connected = false;
  device.sending = false;
}
/** 向蓝牙设备发送指令*/
function wwriteBLECharacteristicCmdValue(cmdCharacteristicId, cmdValue, type, callback) {
  var ss = device.deviceId + "-" + device.serviceId+'-'+cmdCharacteristicId+'--' + byte2hexStr(cmdValue);
  wx.writeBLECharacteristicValue({
    deviceId: device.deviceId,
    serviceId: device.serviceId,
    characteristicId: cmdCharacteristicId,
    value: cmdValue,
    success: (res) => {
      device.sending = false;
      res.type = type;
      callback(res);
    }, fail: (res) => {
      device.sending = false;
      res.type = type;
      callback(res);
    }
  })
}
/** 发送ack回复*/
function sendAckCmd(cmdValue, cmdCharacteristicId) {
  wx.writeBLECharacteristicValue({
    deviceId: device.deviceId,
    serviceId: device.serviceId,
    characteristicId: cmdCharacteristicId,
    value: cmdValue,
    success: (res) => {
    }, fail: (res) => {
    }
  })
}
/** 根据uuid读取特征值 */
function readCharacteristicValue(characteristicId, callback) {
  wx.readBLECharacteristicValue({
    characteristicId: characteristicId,
    deviceId: device.deviceId,
    serviceId: device.serviceId,
    success: (res) => {
      callback(res);
    },
    fail: (res) => {
      callback(res);
    },
    complete: (res) => {
      callback(res);
    },
  })
}
/**
 * 发送获取版本指令
 */
function sendVersionCmd(type, callback) {
  var cmdBuffer = getVersionCmdValue();
  var headNum = device.headerNumber;
  var valueBuffer = packageSendCmd(headNum, cmdBuffer);
  sendBLECmdValue(valueBuffer, type, callback);
  return headNum;
}
/**
 * 发送设置Utc指令
 */
function sendUtcCmd(date, type, callback) {
  var cmdBuffer = getUtcCmdValue(date);
  var headNum = device.headerNumber;
  var valueBuffer = packageSendCmd(headNum, cmdBuffer);
  sendBLECmdValue(valueBuffer, type, callback);
  return headNum;
}
/**
 * 发送获取历史数据指令
 */
function sendTotalRecordCmd(type, callback) {
  var cmdBuffer = getHistoryRecordCmdValue();
  var headNum = device.headerNumber;
  var valueBuffer = packageSendCmd(headNum, cmdBuffer);
  sendBLECmdValue(valueBuffer, type, callback);
  return headNum;
}
/** 设置最大心率 */
function sendMaxHrvCmd(maxHrv, type, callback) {
  var cmdBuffer = setHeartRateMax(maxHrv);
  var headNum = device.headerNumber;
  var valueBuffer = packageSendCmd(headNum, cmdBuffer);
  //console.log("sendMaxHrvCmd valueBuffer = " + valueBuffer);
  sendBLECmdValue(valueBuffer, type, callback);
  return headNum;
}
/** 简单协议-设置心率振动阈值 */
function sendsetShock(shockNumber, type, callback) {
    var cmdBuffer = setShockNumber(shockNumber);
    //console.log("sendsetShock 设置心率振动阈值 命令 = " + byte2hexStr(cmdBuffer));
    sendBLECmdValue2(cmdBuffer, type, callback);
    return 0;
  }

  /** 简单协议-获取心率振动阈值 */
function getShock(type, callback) {
    var cmdBuffer = getShockNumber();
    sendBLECmdValue2(cmdBuffer, type, callback);
    return 0;
  }

    /** 简单协议-关闭心率振动阈值 */
function closeShock(type, callback) {
    var cmdBuffer = closeShockNumber();
    console.log("closeShock 关闭心率振动 命令 = " + byte2hexStr(cmdBuffer));
    sendBLECmdValue2(cmdBuffer, type, callback);
    return 0;
  }

/** 设置自定义模式 */
function sendCustomModeSetting(mode, type, callback) {
  var cmdBuffer = setCustomMode(mode);
  var headNum = device.headerNumber;
  var valueBuffer = packageSendCmd(headNum, cmdBuffer);
  sendBLECmdValue(valueBuffer, type, callback);
  return headNum;
}
/** 获取自定义模式 */
function getCustomModeState(type, callback) {
  var cmdBuffer = getCustomMode();
  var headNum = device.headerNumber;
  var valueBuffer = packageSendCmd(headNum, cmdBuffer);
  sendBLECmdValue(valueBuffer, type, callback);
  return headNum;
}
export {
  initBleBluetooth, closeBLEConnection, closeBluetoothAdapter, createBLEConnection,
  stopBluetoothDevicesDiscovery, sendAckCmd, sendTotalRecordCmd, sendVersionCmd, sendUtcCmd,
  sendMaxHrvCmd,sendsetShock,getShock,closeShock,readCharacteristicValue, sendCustomModeSetting, getCustomModeState
};
import { UUID_COMMON_WRITE,UUID_COMMON_WRITE0A, UUID_HEARTRATE_NOTIFY } from './fitareBleUuid.js';
import { analysisBleData } from './analysisBleData.js';
import { getCustomMode, setCustomMode, setHeartRateMax,setShockNumber,getShockNumber,closeShockNumber, getUtcCmdValue, getVersionCmdValue, getHistoryRecordCmdValue, packageSendCmd } from './packageCmd.js';
import { inArray, int2byte, byte2hexStr, ab2hex, str2ab } from './convertUtf.js'

