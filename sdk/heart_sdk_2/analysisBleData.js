const app = getApp();
import {
  hex2str,
  getIntBit,
  str2ascii,
  int2byte,
  str2byte,
  ab2hex,
  byte2hexStr,
  str2ab
} from './convertUtf.js'
import {
  UUID_COMMON_WRITE,
  UUID_COMMON_NOTIFY,
  UUID_COMMON_POWER,
  UUID_COMMON_FIRMVERSION,
  UUID_COMMON_HARDVERSION,
  UUID_COMMON_SOFTVERSION,
  UUID_HEARTRATE_NOTIFY,
  UUID_COMMON_NOTIFY09
} from './fitareBleUuid.js'
import {
  getAckCmdValue
} from './packageCmd.js'
import {
  sendAckCmd
} from './bleControl.js'

import {
  formatTime
} from './dateUtil.js'
export {
  analysisBleData
}
var headerArray = []; //数据接收头数组
var byteArray = []; //定义一个全局变量
/***  接收ble数据解析 ********/
/** 校验数据 */
function checkByte(bleByte) {
  if (!bleByte || bleByte.length < 5) {
    return false;
  }
  var lastNumber = bleByte[bleByte.length - 1] & 0xFF;
  var checkNumber = 0;
  for (var i = 0; i < bleByte.length - 1; i++) {
    checkNumber = checkNumber + bleByte[i] & 0xFF;
  }
  if (lastNumber != checkNumber % 256) {
    return false;
  }
  return true;
}

//ble 数据解析value,返回 {type, data} 
function analysisBleData(uuid, value, callback) {
  var bleByte = new Uint8Array(value);
  if (uuid.toLowerCase() == UUID_COMMON_NOTIFY09) { //震动阈值设置
    var sendsetShock = byte2hexStr(bleByte); //设置成功一般会返回：D2050901E1
    var first = bleByte[0] & 0xFF;
    var keyMark = bleByte[2] & 0xFF;
    if(first == 210){
        if(keyMark == 9){ //设置
            var setResultValue = bleByte[3] & 0xFF;
            if(setResultValue == 1 ){ //设置成功
                //回调函数
                callback(11, 'success');  
             }else{
                callback(11, 'failure');  
             }
        }else if(keyMark == 10){ //获取
            var switchMark = bleByte[3] & 0xFF;
            var shockNumber = bleByte[4] & 0xFF;
            var result = {
                switchMark :switchMark,
                shockNumber: shockNumber
              };
               //回调函数
               callback(12, result);  
        }else if(keyMark == 11){ //关闭
            var closeResultValue = bleByte[3] & 0xFF;
            if(closeResultValue == 1 ){ //关闭成功
                //回调函数
                callback(13, 'success');  
             }else{
                callback(13, 'failure');
             }
        }
    }
    return;
  }

  if (uuid.toLowerCase() == UUID_COMMON_POWER) { //电量数据
    //回调函数
    callback(0, bleByte[0] & 0xFF);
    return;
  }
  if (uuid.toLowerCase() == UUID_COMMON_FIRMVERSION) { //固件版本
    //回调函数
    callback(8, hex2str(bleByte));
    return;
  }
  if (uuid.toLowerCase() == UUID_COMMON_HARDVERSION) { //硬件版本
    //回调函数
    callback(6, hex2str(bleByte));
    return;
  }
  if (uuid.toLowerCase() == UUID_COMMON_SOFTVERSION) { //软件版本
    //回调函数
    callback(7, hex2str(bleByte));
    return;
  }
  if (uuid.toLowerCase() == UUID_HEARTRATE_NOTIFY) { //心率数据
    var result = getHeartRateData(bleByte);
    callback(9, result);
    return;
  }
  if (!checkByte(bleByte)) { //接收数据无效
    return;
  }
  var byte1 = bleByte[1] & 0xFF;
  if (byte1 == 32 && bleByte.length >= 5) {
    var byte3 = bleByte[3] & 0xFF;
    var byte4 = bleByte[4] & 0xFF;
    var headerNumber = (byte3 << 8) + byte4;
    callback(10, headerNumber);
    //处理回复结果回调
    return;
  }
  var valueByte = getCompleteValueByte(value); //获取完整数据
  if (valueByte == "") {
    return; //非完整数据，不处理
  }
  //if (uuid.toLowerCase() == UUID_COMMON_NOTIFY) { //通用通知，统一处理
    // var ackBuffer = getAckCmdValue(headerNumber); //获取ack命令值
    // sendAckCmd(ackBuffer, UUID_COMMON_WRITE.toUpperCase()); //发送指令
    // if (headerArray.indexOf(headerNumber) >= 0) {
    //   return;
    // }
    // headerArray.push(headerNumber);
    // if (headerArray.length > 20) {
    //   headerArray.splice(5);
    // }
    dowithValueByte(valueByte, callback);
    return;
  //} 
}
/** 处理接收的数据 */
function dowithValueByte(value, callback) {
  var valueByte = new Uint8Array(value);
  var byte0 = valueByte[0] & 0xFF;
  var byte1 = valueByte[1] & 0xFF;
  var sortNum  = (byte0<<8) + byte1;
  var cmdId = valueByte[2] & 0xFF; //命令
  var keyMark = valueByte[4] & 0xFF;
  var valueLong = valueByte[6] & 0xFF;
  var byteNum = 7;
  var ackBuffer = getAckCmdValue(sortNum); //获取ack命令值
  sendAckCmd(ackBuffer, UUID_COMMON_WRITE.toUpperCase()); //发送指令
  let headArray = app.globalData.headArray;
  // 已处理过的数据
  if (headArray.indexOf(sortNum) >= 0) {
    return;
  }
  headArray.push(sortNum);
  if (headArray.length > 20) {
    headArray.splice(5);
  }
  getApp().globalData.headArray = headArray;
  for (var i = 0; i < 32; i++) {
    var resultByteBuffer = new ArrayBuffer(valueLong + 1);
    var resultByte = new Uint8Array(resultByteBuffer);
    resultByte[0] = int2byte(keyMark);
    for (var j = byteNum; j < valueLong + byteNum; j++) {
      resultByte[1 + j - byteNum] = valueByte[j];
    }
    var result;
    switch (cmdId) {
      case 1: {
        result = realtimeData(resultByte);
        break;
      }
      case 3: {
        result = customData(resultByte);
        break;
      }
      case 4: {
        analyticalRecord(resultByte);
        break;
      }
      case 5: { //版本号
        if (keyMark == 1 && resultByte.length == 2) {
          result = resultByte[1] & 0xFF;
        }
        if (keyMark == 0) {
          result = customData(resultByte);
        }
        break;
      }
      default: {
        break;
      }
    }
    //第一次读完三个字节，即已经处理完成，第二次不再继续
    if (valueLong + byteNum == valueByte.byteLength) {
      if (cmdId == 4) { //历史数据一次处理不完整
        result = analyticalComplete();
      }
      callback(cmdId, result);
      //break;
    }
    keyMark = resultByte[byteNum + valueLong] & 0xFF;
    valueLong = resultByte[byteNum + valueLong + 2] & 0xFF;
    //ackType = resultByte[byteNum + valueLong + 1] & 0xFF;
    byteNum = byteNum + valueLong + 3;
  }
}
/**
 * 获取完整的命令值
 */
function getCompleteValueByte(value) {
  var bleByte = new Uint8Array(value);
  var byte1 = bleByte[1] & 0xFF;
  var isMore = getIntBit(byte1, 7, 7);
  var isEnd = getIntBit(byte1, 6, 6);
  var bagNo = getIntBit(byte1, 0, 3);
  //获取要处理的数据，最后一位checkSum,第一位固定值，第二位标识符，第三位包长度，都去掉
  var valueByte = new ArrayBuffer(bleByte.length - 4);
  var valuebyteView = new Uint8Array(valueByte);
  //从第三位开始截取
  for (var i = 3; i < bleByte.length - 1; i++) {
    valuebyteView[i - 3] = bleByte[i];
  }
  if (isMore == 0) { //单个包数据，直接返回
    return valueByte;
  }
  //多包发送
  if (isEnd == 0 && bagNo == 0) {
    byteArray = [];
    byteArray.push(valueByte);
    return ""; //多包没有处理完成，返回空
  } 
  if (isEnd == 0 && bagNo != 0) {
    byteArray.push(valueByte);
    return ""; //多包没有处理完成，返回空
  }
  //最后一个包，处理数据
  byteArray.push(valueByte);
  var valueLong = 0;
  for (var i = 0; i < byteArray.length; i++) {
    valueLong = valueLong + byteArray[i].byteLength;
  }
  var resultRow = 0;
  var resultByte = new ArrayBuffer(valueLong);
  var resultByteView = new Uint8Array(resultByte);
  for (var i = 0; i < byteArray.length; i++) {
    var listByte = byteArray[i];
    var listByteView = new Uint8Array(listByte);
    for (var j = 0; j < listByteView.length; j++) {
      resultByteView[resultRow] = listByteView[j];
      resultRow = resultRow + 1;
    }
  }
  if (byteArray.length != bagNo + 1) {
    return ""; //丢包了，返回空
  }
  byteArray = []; //变量初始化为空
  return resultByte;
}
/** 解析自定义数据 */
function customData(byteData) {
  var value = "";
  if (byteData.length > 0) {
    var byte0 = byteData[0] & 0xFF;
    var keyMark = getIntBit(byte0, 0, 3);
    if (keyMark == 254 && byteData.length >= 2) {
     value = byteData[1] & 0xFF;
    }
  }
  var result = {
    type : "custom",
    value: value
  };
  return result;
}
/** 解析实时数据 */
function realtimeData(byteData) {
  if (byteData.length > 0) {
    var keyMark = byteData[0] & 0xFF;
    if (keyMark == 2 && byteData.length >= 5) { //步频
      var stepHi = byteData[1] & 0xFF;
      var stepMin = byteData[2] & 0xFF;
      var stepLow = byteData[3] & 0xFF;
      var steps = (stepHi << 16) + (stepMin << 8) + stepLow; //步数
      var frequency = byteData[4] & 0xFF; //步频
      //卡路里计算
      var calorie = "0";
      if (byteData.length >= 8) {
        var calHi = byteData[5] & 0xFF;
        var calpMin = byteData[6] & 0xFF;
        var calLow = byteData[7] & 0xFF;
        calorie = (calHi << 16) + (calpMin << 8) + calLow;
      }
      //处理数据
      return {
        type: "step",
        steps: steps,
        frequency: frequency,
        calorie: calorie
      };
    }
  }
}
/** 解析历史数据 */
function analyticalRecord(recordByte) {
  var byte0 = recordByte[0] & 0xFF;
  var keyMark = getIntBit(byte0, 0, 3);
  if (keyMark == 1) { //一分钟的步数数据
    analysisStepRecordMark1(recordByte);
  } else if (keyMark == 8) { //心率数据
    analysisHeartRateRecord(recordByte);
  } else if (keyMark == 9) { //15分钟的步数数据
    analysisStepRecordMark9(recordByte);
  } else if (keyMark == 12) { //训练时间及卡路里数据
    analysisCaloriesRecord(recordByte);
  }
}
/**
 * 解析数据结束，返回结果
 */
function analyticalComplete() {
  var result = {};
  if (stepArray.length > 0) {
    result.type = 'step';
    result.steps = stepArray;
    stepArray = [];
  }
  if (step15Array.length > 0) {
    result.type = 'step15';
    result.steps = step15Array;
    step15Array = [];
  }
  if (heartRateArray.length > 0) {
    result.type = 'rate';
    result.heartRate = heartRateArray;
    heartRateArray = [];
  }
  if (caloriesArray.length > 0) {
    result.type = 'calorie';
    result.calories = caloriesArray;
    caloriesArray = [];
  }
  return result;
}
/** 解析步数的历史数据 */
var stepArray = [];
var step15Array = [];
function analysisStepRecordMark9(recordByte) {
  var offSet = 0;
  while (offSet < recordByte.length - 1) {
    var dataLength = recordByte[offSet + 1] & 0xFF;
    offSet = offSet + 1;
    var utc1 = recordByte[offSet + 1] & 0xFF;
    var utc2 = recordByte[offSet + 2] & 0xFF;
    var utc3 = recordByte[offSet + 3] & 0xFF;
    var utc4 = recordByte[offSet + 4] & 0xFF;
    var myUtc = (utc1 << 24) + (utc2 << 16) + (utc3 << 8) + utc4 + new Date().getTimezoneOffset() * 60;
    offSet = offSet + 4;
    var timeCount = recordByte[offSet + 1] & 0xFF;
    for (var i = 0; i < dataLength / 2; i++) {
      var stepHi = recordByte[offSet + 1] & 0xFF;
      var stepLow = recordByte[offSet + 2] & 0xFF;
      var steps = (stepHi << 8) + stepLow;
      offSet = offSet + 2;
      var timeStamps = myUtc * 1000;
      var date = new Date(timeStamps);
      var timeString = formatTime(date);
      var spendCount = 15;
      if (i == dataLength/2 - 1) {
          spendCount = timeCount;
      }
      var data = {
        timeStamps: myUtc,
        createTime: timeString,
        steps: steps,
        spendCount: spendCount
      };
      step15Array.push(data);
      myUtc = myUtc + 900;
    }
  }
}
function analysisStepRecordMark1(recordByte) {
  var offSet = 0;
  while (offSet < recordByte.length - 1) {
    var dataLength = recordByte[offSet + 1] & 0xFF;
    offSet = offSet + 1;

    var utc1 = recordByte[offSet + 1] & 0xFF;
    var utc2 = recordByte[offSet + 2] & 0xFF;
    var utc3 = recordByte[offSet + 3] & 0xFF;
    var utc4 = recordByte[offSet + 4] & 0xFF;
    var myUtc = (utc1 << 24) + (utc2 << 16) + (utc3 << 8) + utc4 + new Date().getTimezoneOffset() * 60;
    offSet = offSet + 4;

    for (var i = 0; i < dataLength / 2; i++) {
      var steps = recordByte[offSet + 1] & 0xFF;
      var calories = recordByte[offSet + 2] & 0xFF;
      offSet = offSet + 2;

      var timeStamps = myUtc * 1000;
      var date = new Date(timeStamps);
      var timeString = formatTime(date);

      var data = {
        timeStamps: myUtc,
        createTime: timeString,
        steps: steps,
        calories: calories
      };
      stepArray.push(data);
      myUtc = myUtc + 60;
    }
  }
}
/** 解析心率历史数据 */
var heartRateArray = [];
function analysisHeartRateRecord(recordByte) {
  var offSet = 0;
  while (offSet < recordByte.length - 1) {
    var dataLength = recordByte[offSet + 1] & 0xFF;
    offSet = offSet + 1;

    var utc1 = recordByte[offSet + 1] & 0xFF;
    var utc2 = recordByte[offSet + 2] & 0xFF;
    var utc3 = recordByte[offSet + 3] & 0xFF;
    var utc4 = recordByte[offSet + 4] & 0xFF;
    var myUtc = (utc1 << 24) + (utc2 << 16) + (utc3 << 8) + utc4 + new Date().getTimezoneOffset() * 60;
    offSet = offSet + 4;

    for (var i = 0; i < dataLength; i++) {
      var heartRateNum = recordByte[offSet + 1] & 0xFF;
      offSet = offSet + 1;

      var timeStamps = myUtc * 1000;
      var date = new Date(timeStamps);
      var timeString = formatTime(date);

      var data = {
        timeStamps: myUtc,
        createTime: timeString,
        heartRateNum: heartRateNum
      };
      heartRateArray.push(data);
      myUtc = myUtc + 2;
    }
  }
}
/**
 * 解析心率数据
 */
function getHeartRateData(bleByte) {
  var length = bleByte[0] & 0xFF;
  var heartRate = bleByte[1] & 0xFF;
  var intervalArray = [];
  if (bleByte.length > 2 && bleByte.length % 2 == 0) {
    for (var i = 2; i < bleByte.length; i++) {
      if (i % 2 == 0) {
        var lowByte = bleByte[i] & 0xFF;
        var hiByte = bleByte[i + 1] & 0xFF;
        var interval = (hiByte << 8) + lowByte;
        intervalArray.push(interval);
      }
    }
  }
  var result = {
    heartRate : heartRate,
    dataLength: length,
    interval: intervalArray
  };
  return result;
}
/** 解析训练时间与卡路里 */
var caloriesArray = [];
function analysisCaloriesRecord() {
  var offSet = 0;
  while (offSet < recordByte.length - 1) {
    var calorie1 = recordByte[offSet + 1] & 0xFF;
    var calorie2 = recordByte[offSet + 2] & 0xFF;
    var calorie3 = recordByte[offSet + 3] & 0xFF;
    var calorie4 = recordByte[offSet + 4] & 0xFF;
    //计算卡路里
    var calorie = (calorie1 << 24) + (calorie2 << 16) + (calorie3 << 8) + calorie4;
    offSet = offSet + 4;
    var startUtc1 = recordByte[offSet + 1] & 0xFF;
    var startUtc2 = recordByte[offSet + 2] & 0xFF;
    var startUtc3 = recordByte[offSet + 3] & 0xFF;
    var startUtc4 = recordByte[offSet + 4] & 0xFF;
    var startUtc = (startUtc1 << 24) + (startUtc2 << 16) + (startUtc3 << 8) + startUtc4 + new Date().getTimezoneOffset() * 60;
    offSet = offSet + 4;
    var endUtc1 = recordByte[offSet + 1] & 0xFF;
    var endUtc2 = recordByte[offSet + 2] & 0xFF;
    var endUtc3 = recordByte[offSet + 3] & 0xFF;
    var endUtc4 = recordByte[offSet + 4] & 0xFF;
    var endUtc = (endUtc1 << 24) + (endUtc2 << 16) + (endUtc3 << 8) + endUtc4 + new Date().getTimezoneOffset() * 60;
    offSet = offSet + 4;
  
    var data = {
      startUtc: startUtc,
      endUtc: endUtc,
      calorie: calorie
    };
    caloriesArray.push(data);
  }
}
