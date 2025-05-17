import {
  str2ascii,
  int2byte,
  str2byte,
  ab2hex,
  str2ab
} from './convertUtf.js';
export {
  closeShockNumber,
  getShockNumber,
  setShockNumber,
  setHeartRateMax,
  getAckCmdValue,
  getUtcCmdValue,
  getVersionCmdValue,
  getHistoryRecordCmdValue,
  packageSendCmd,
  setCustomMode
};
// 协议版本号
var protocolVersion = 1;

/**
 * 封住发送的完整指令
 */
function packageSendCmd(headerNumber, value) {
  var cmdValue = new Uint8Array(value);
  var sortHi = headerNumber / 256;
  var sortLow = headerNumber % 256;
  var valueNum = 2;
  var addValue = new ArrayBuffer(cmdValue.length + 2);
  var bufView = new Uint8Array(addValue);
  bufView[0] = int2byte(sortHi);
  bufView[1] = int2byte(sortLow); //添加发送序号，占两位
  for (var i = 0; i < cmdValue.length; i++) {
    bufView[valueNum + i] = cmdValue[i];
  }
  var m_cmdArray = [];
  if (bufView.length <= 16) {
    var lenght = bufView.length + 4;
    var checkNum = 255 + lenght;
    var myCmd = new ArrayBuffer(lenght);
    var myCmdView = new Uint8Array(myCmd);
    myCmdView[0] = int2byte(255);
    myCmdView[1] = int2byte(0);
    myCmdView[2] = int2byte(lenght);
    for (var i = 0; i < bufView.length; i++) {
      myCmdView[3 + i] = bufView[i];
      checkNum = checkNum + parseInt(bufView[i]);
    }
    myCmdView[lenght - 1] = int2byte(checkNum % 256);
    m_cmdArray.push(myCmd);
  } else {
    var cmdNum = parseInt(bufView.length / 16);
    if (bufView.length % 16 != 0) {
      cmdNum = cmdNum + 1;
    }
    for (var i = 0; i < cmdNum; i++) {
      if (i == cmdNum - 1) {
        var mark = 128 + 64 + i;
        var lenght = bufView.length - i * 16 + 4;
        var checkNum = 255 + mark + lenght;
        var myCmd = new ArrayBuffer(lenght);
        var myCmdView = new Uint8Array(myCmd);
        myCmdView[0] = int2byte(255);
        myCmdView[1] = int2byte(mark);
        myCmdView[2] = int2byte(lenght);
        for (var j = i * 16; j < bufView.length; j++) {
          myCmdView[3 + j - (i * 16)] = bufView[j];
          checkNum = checkNum + parseInt(bufView[j]);
        }
        myCmdView[lenght - 1] = int2byte(checkNum % 256);
        m_cmdArray.push(myCmd);
      } else {
        var mark = 128 + i;
        var lenght = 20;
        var checkNum = 255 + mark + lenght;
        var myCmd = new ArrayBuffer(lenght);
        var myCmdView = new Uint8Array(myCmd);
        myCmdView[0] = int2byte(255);
        myCmdView[1] = int2byte(mark);
        myCmdView[2] = int2byte(lenght);
        for (var j = i * 16; j < i * 16 + 16; j++) {
          myCmdView[3 + j - (i * 16)] = bufView[j];
          checkNum = checkNum + parseInt(bufView[j]);
        }
        myCmdView[lenght - 1] = int2byte(checkNum % 256);
        m_cmdArray.push(myCmd);
      }
    }
  }
  return m_cmdArray;
}
/**设置时间**/
function getUtcCmdValue(timeDate) {
  var cmdId = 1;
  var version = protocolVersion * 16 + 0 * 8;
  var keyMark = 8;
  var ackType = 1;
  var valueLong = 4;
  var myUtc = (new Date(timeDate).getTime()) / 1000 - (new Date().getTimezoneOffset()) * 60;
  var time4 = myUtc / (256 * 256 * 256);
  var time3 = (myUtc % (256 * 256 * 256)) / 65536;
  var time2 = (myUtc % 65536) / 256;
  var time1 = myUtc % 256;
  var cmdByte = new ArrayBuffer(9);
  var cmdView = new Uint8Array(cmdByte);
  cmdView[0] = int2byte(cmdId);
  cmdView[1] = int2byte(version);
  cmdView[2] = int2byte(keyMark);
  cmdView[3] = int2byte(ackType);
  cmdView[4] = int2byte(valueLong);
  cmdView[5] = int2byte(time4);
  cmdView[6] = int2byte(time3);
  cmdView[7] = int2byte(time2);
  cmdView[8] = int2byte(time1);
  return cmdByte;
}

/**获取所有历史数据**/
function getHistoryRecordCmdValue() {
  var cmdId = 4;
  var version = protocolVersion * 16 + 0 * 8;
  var keyMark = 0;
  var ackType = 2;
  var valueLong = 0;

  var cmdByte = new ArrayBuffer(5);
  var cmdView = new Uint8Array(cmdByte);
  cmdView[0] = int2byte(cmdId);
  cmdView[1] = int2byte(version);
  cmdView[2] = int2byte(keyMark);
  cmdView[3] = int2byte(ackType);
  cmdView[4] = int2byte(valueLong);
  return cmdByte;
}
/**获取运动历史数据***/
function getStepRecordCmdValue() {
  var cmdId = 4;
  var version = protocolVersion * 16 + 0 * 8;
  var keyMark = 1;
  var ackType = 2;
  var valueLong = 0;

  var cmdByte = new ArrayBuffer(5);
  var bufView = new Uint8Array(cmdByte);
  bufView[0] = int2byte(cmdId);
  bufView[1] = int2byte(version);
  bufView[2] = int2byte(keyMark);
  bufView[3] = int2byte(ackType);
  bufView[4] = int2byte(valueLong);
  return cmdByte;
}
/**获取心率历史数据*/
function getHeartRateRecordCmdValue() {
  var cmdId = 4;
  var version = protocolVersion * 16 + 0 * 8;
  var keyMark = 2;
  var ackType = 2;
  var valueLong = 0;
  var cmdByte = new ArrayBuffer(5);
  var bufView = new Uint8Array(cmdByte);
  bufView[0] = int2byte(cmdId);
  bufView[1] = int2byte(version);
  bufView[2] = int2byte(keyMark);
  bufView[3] = int2byte(ackType);
  bufView[4] = int2byte(valueLong);
  return cmdByte;
}
/**
 * 获取版本号命令
 */
function getVersionCmdValue() {
  var cmdByte = new ArrayBuffer(4);
  var bufView = new Uint8Array(cmdByte);
  bufView[0] = int2byte(162);
  bufView[1] = int2byte(4);
  bufView[2] = int2byte(129);
  bufView[3] = int2byte(0);
  var checkNum = 0;
  for (var i = 0; i < bufView.length; i++) {
    checkNum = checkNum + parseInt(bufView[i]);
  }
  bufView[3] = int2byte(checkNum % 256);
  return cmdByte;
}

/** 回复命令 **/
function getAckCmdValue(sortNumber) {
  var checkNumber = 255 + 32 + 6 + (sortNumber / 256) + (sortNumber % 256);
  var cmdByte = new ArrayBuffer(6);
  var bufView = new Uint8Array(cmdByte);
  bufView[0] = int2byte(255);
  bufView[1] = int2byte(32);
  bufView[2] = int2byte(6);
  bufView[3] = int2byte(sortNumber / 256);
  bufView[4] = int2byte(sortNumber % 256);
  bufView[5] = int2byte(checkNumber % 256);
  return cmdByte;
}
/** 设置最大心率 */
function setHeartRateMax(maxHR) {
  var cmdId = 1;
  var version = protocolVersion * 16 + 0 * 8;
  var keyMark = 13;
  var ackType = 1;
  var valueLong = 1;
  var cmdByte = new ArrayBuffer(6);
  var bufView = new Uint8Array(cmdByte);
  bufView[0] = int2byte(cmdId);
  bufView[1] = int2byte(version);
  bufView[2] = int2byte(keyMark);
  bufView[3] = int2byte(ackType);
  bufView[4] = int2byte(valueLong);
  bufView[5] = int2byte(maxHR);
  return cmdByte;
}

 /** 简单协议-设置心率振动阈值 */
function setShockNumber(shockNumber){
    var cmdByte = new ArrayBuffer(5);
    var bufView = new Uint8Array(cmdByte);
    bufView[0] = int2byte(178);
    bufView[1] = int2byte(5);
    bufView[2] = int2byte(9);
    bufView[3] = int2byte(shockNumber);
    bufView[4] = int2byte(0); 
    var checkNum = 0;
    for (var i = 0; i< bufView.length; i++) {
        checkNum = checkNum + parseInt(bufView[i]);
    }
    bufView[4] = int2byte(checkNum % 256);
    return cmdByte; 
}

 /** 简单协议-获取心率振动阈值 */
 function getShockNumber(){
    var cmdByte = new ArrayBuffer(4);
    var bufView = new Uint8Array(cmdByte);
    bufView[0] = int2byte(178);
    bufView[1] = int2byte(4);
    bufView[2] = int2byte(10);
    bufView[3] = int2byte(0); 
    var checkNum = 0;
    for (var i = 0; i< bufView.length; i++) {
        checkNum = checkNum + parseInt(bufView[i]);
    }
    bufView[3] = int2byte(checkNum % 256);
    return cmdByte; 
}

 /** 简单协议-关闭心率振动 */
 function closeShockNumber(){
    var cmdByte = new ArrayBuffer(4);
    var bufView = new Uint8Array(cmdByte);
    bufView[0] = int2byte(178);
    bufView[1] = int2byte(4);
    bufView[2] = int2byte(11);
    bufView[3] = int2byte(0); 
    var checkNum = 0;
    for (var i = 0; i< bufView.length; i++) {
        checkNum = checkNum + parseInt(bufView[i]);
    }
    bufView[3] = int2byte(checkNum % 256);
    return cmdByte; 
}

/** 设置自定义模式:0xFE */
function setCustomMode(mode) {
  var cmdId = 1;
  var version = protocolVersion * 16 + 0 * 8;
  var keyMark = 254;
  var ackType = 1;
  var dataKey = 4;
  var valueLong = 2;
  var cmdByte = new ArrayBuffer(7);
  var bufView = new Uint8Array(cmdByte);
  bufView[0] = int2byte(cmdId);
  bufView[1] = int2byte(version);
  bufView[2] = int2byte(keyMark);
  bufView[3] = int2byte(ackType);
  bufView[4] = int2byte(valueLong);
  bufView[5] = int2byte(dataKey);
  bufView[6] = int2byte(mode);
  return cmdByte;
}
/** 获取自定义模式 */
export function getCustomMode() {
  var cmdId = 1;
  var version = protocolVersion * 16 + 0 * 8;
  var keyMark = 254;
  var ackType = 1;
  var dataKey = 5;
  var valueLong = 1;
  var cmdByte = new ArrayBuffer(6);
  var bufView = new Uint8Array(cmdByte);
  bufView[0] = int2byte(cmdId);
  bufView[1] = int2byte(version);
  bufView[2] = int2byte(keyMark);
  bufView[3] = int2byte(ackType);
  bufView[4] = int2byte(valueLong);
  bufView[5] = int2byte(dataKey);
  return cmdByte;
}
