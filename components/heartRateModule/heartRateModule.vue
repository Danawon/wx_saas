<template>
  <view>
    <!-- 心率数据模块 -->
    <view class="heartRate-box">
      <view
        class="heartRateBg"
        :style="{
          background: 'url(' + baseUrl + 'heartRateIcon.png)',
          'background-size': '100% 100% ',
        }"
      >
        <!-- 心率检测模块 -->
        <view class="heart-num flex-col flex-a">
          <view class="num-val">
            {{ bluetooth ? equipmentObj.heartrate : "--" }}
          </view>
          <view class="num-tit mar-t20">心率监测</view>
        </view>

        <!-- 消耗热量模块 -->
        <view class="calories-box comon-abs">
          <view class="val-box flex mar-t20">
            <view class="vale">
              {{
                parseInt(deviceData.calories)
                  ? parseInt(deviceData.calories)
                  : "--"
              }}
            </view>
          </view>
          <view class="tit flex">卡路里</view>
        </view>

        <!-- 运动时间模块 -->
        <view class="times-box comon-abs">
          <view class="val-box flex mar-t20">
            <view class="vale">
              {{ tiemDurationDate || "--" }}
            </view>
          </view>
          <view class="tit flex">分钟</view>
        </view>
        <view class="distanceAndSpeed heart-other flex-row ju-bt">
          <view class="distance">
            <view class="tit">{{ deviceState ? " 阻力" : "运动距离" }}</view>
            <view class="val-box flex-row flex-a">
              <view class="vale">
                <text v-if="!deviceState">
                  {{
                    Number((deviceData.totalDistance / 1000).toFixed(2)) || "--"
                  }}
                </text>
                <text v-else>
                  {{
                    socketData.resistance_class
                      ? Number(socketData.resistance_class).toFixed(0)
                      : 0
                  }}
                </text>
              </view>
              <view class="unit">{{ deviceState ? "级 " : "km" }}</view>
            </view>
          </view>
          <view class="speed">
            <view class="tit">{{ deviceState ? " 转速" : "运动速度" }} </view>
            <view class="val-box flex-row flex-a">
              <view class="vale">
                <text v-if="!deviceState">
                  {{ deviceData.exerciseSpeed || "--" }}
                </text>
                <text v-else>
                  {{
                    socketData.revolution
                      ? Number(socketData.revolution).toFixed(0)
                      : 0
                  }}
                </text>
              </view>
              <view class="unit">{{ deviceState ? " RPM" : "km/H" }}</view>
            </view>
          </view>
        </view>

        <view class="heart-other flex-row ju-bt">
          <view class="other-item">
            <view class="tit">平均心率</view>
            <view class="val-box flex-row flex-a">
              <view class="vale">
                {{ HRmean || "--" }}
              </view>
              <view class="unit">次/分钟</view>
            </view>
          </view>
          <view class="other-item">
            <view class="tit">燃烧脂肪</view>
            <view class="val-box flex-row flex-a">
              <view class="vale">
                {{ parseInt(deviceData.calories / 7.7) }}
              </view>
              <view class="unit">克</view>
            </view>
          </view>

          <view class="other-item">
            <view class="tit">实时血糖</view>
            <view class="val-box flex-row flex-a">
              <view class="vale">--</view>
              <view class="unit">mmol/L</view>
            </view>
          </view>
        </view>
      </view>
    </view>

    <view class="device-box mar-t40 flex-row ju-ar pad-b40">
      <!-- 设备扫描 -->
      <view
        class="device-content deviceSty flex"
        :class="{ selectDeviceSty: deviceState }"
        @click="connectDevice"
      >
        <image
          v-if="deviceState"
          class="icon-state"
          :src="baseUrl + 'scan-1.png'"
          mode=""
        ></image>
        <image
          v-else
          class="icon-state"
          :src="baseUrl + 'scan-2.png'"
          mode=""
        ></image>
        <image
          v-if="deviceState"
          class="icon-success"
          :src="baseUrl + 'testSelecrt.png'"
          mode=""
        ></image>
        <text>设备连接</text>
      </view>

      <!-- 运动强度 -->
      <view
        class="strengthSty flex flex-col"
        :class="[
          { col1: strengIndex == 0 },
          { col2: strengIndex == 1 },
          { col3: strengIndex == 2 },
          { col4: strengIndex == 3 },
          { col5: strengIndex == 4 },
          { col6: strengIndex == 5 },
        ]"
        @click="strengthShow = true"
      >
        <view class="strength-tit flex-col flex-a">
          <view class="">
            {{ strengthArr[strengIndex].new_name || "-" }}
          </view>
          <view class="">
            {{ strengthArr[strengIndex].key.range || "-" }}
          </view>
        </view>
        <view class="tips-box" @click.stop="tipsShow = true">
          <image :src="baseUrl + 'tips.png'" mode=""></image>
        </view>
        <view
          class="tips-box exercise-box flex"
          @click.stop="onTeachingVideoShow"
        >
          <image :src="baseUrl + 'play-icon.png'" mode=""></image>
        </view>
      </view>

      <!-- 蓝牙链接 -->
      <view
        class="bluetooth deviceSty flex"
        :class="{ selectDeviceSty: bluetooth }"
        @click="scanningLinks('auto')"
      >
        <image
          v-if="bluetooth"
          class="icon-state"
          :src="baseUrl + 'bluetooth-1.png'"
          mode=""
        ></image>
        <image
          v-else
          class="icon-state"
          :src="baseUrl + 'bluetooth-2.png'"
          mode=""
        ></image>
        <image
          v-if="bluetooth"
          class="icon-success"
          :src="baseUrl + 'testSelecrt.png'"
          mode=""
        ></image>
        <!-- 设备电量 -->
        <view class="electric-quantity flex-row flex-a" v-if="bluetooth">
          <u--image
            v-if="kwhNum >= 50"
            :showLoading="true"
            :src="baseUrl + 'kwh.png'"
            width="85rpx"
            height="35rpx"
          ></u--image>
          <u--image
            v-if="kwhNum < 50 && kwhNum > 10"
            :showLoading="true"
            :src="baseUrl + 'kwh50.png'"
            width="85rpx"
            height="35rpx"
          ></u--image>
          <u--image
            v-if="kwhNum <= 10"
            :showLoading="true"
            :src="baseUrl + 'kwh10.png'"
            width="85rpx"
            height="35rpx"
          ></u--image>
          <view class="electric-num" :class="{ kwhCor: kwhNum <= 10 }">
            {{ equipmentObj.battery }}
          </view>
        </view>
        <text>心率带连接</text>
      </view>
    </view>
    <!-- 操作按钮模块 -->
    <view class="flex">
      <view class="btn-box felx-row flex-a ju-ar">
        <!--  开始 -->
        <view
          class="start-btn"
          v-if="btnState == 0 || btnState == 2 || btnState == 3"
          @click="onBtn(1)"
        >
          <u-avatar :src="baseUrl + 'start.png'" size="80"></u-avatar>
        </view>
        <!--  暂停 -->
        <view class="start-btn" v-if="btnState == 1" @click="onBtn(2)">
          <u-avatar :src="baseUrl + 'pause.png'" size="80"></u-avatar>
        </view>
        <!-- 停止 -->
        <view class="start-btn" v-if="btnState == 2" @click="onBtn(3)">
          <u-avatar :src="baseUrl + 'finish.png'" size="80"></u-avatar>
        </view>
      </view>
    </view>
    <!-- <view class="" @click="demoHrlist">
			历史数据
		</view> -->
    <u-action-sheet
      :actions="strengthArr"
      title="运动强度"
      :show="strengthShow"
      cancelText="关闭"
      @close="strengthShow = false"
      @select="selectStrength"
    ></u-action-sheet>

    <modal-tips
      :modalShow="tipsShow"
      title="强度提示"
      :showConfirmButton="true"
      :showCancelButton="false"
      confirmText="关闭"
      @parentConfirm="
        () => {
          tipsShow = false;
        }
      "
    >
      <view class="mar-b20">
        系统会为根据您身体的评估结果AI推荐运动强度。您也可以根据下表的自感用力度来选择适合自己的运动强度。
      </view>
      <view class="img-box">
        <image :src="baseUrl + 'strengthTips.png'" mode=""></image>
      </view>
    </modal-tips>
    <!-- 心率设备列表 -->
    <modal-tips
      :modalShow="equipmentObj.modalShow"
      title="设备列表"
      :showConfirmButton="true"
      :showCancelButton="false"
      confirmText="关闭"
      @parentConfirm="modalConfirm"
    >
      <view class="li-box pad20">
        <view class="li" v-for="(item, index) in deviceList" :key="index">
          <view class="flex-row ju-bt">
            <view class="name">
              {{ item.deviceName || item.name }}
            </view>
            <view class="btn" @click="_connect(item)"> 链接 </view>
          </view>
          <u-line margin="20rpx 0 40rpx"></u-line>
        </view>
      </view>
    </modal-tips>
    <!-- 授权使用位置信息 -->
    <modal-tips
      :modalShow="locationBackgroundShow"
      title="开启位置"
      :showConfirmButton="true"
      :showCancelButton="false"
      confirmText="去开启"
      confirmColor="#ff7d3d"
      @parentConfirm="goLocationBackgroundShow"
      :confirmButtonShape="{ fontWeight: 'bold' }"
    >
      <view class="flex-col flex-a">
        <view class="">请选择</view>
        <view class="martb20"> 【使用小程序期间和离开小程序后】 </view>
        <view class="mar-b40">才能正常使用</view>
      </view>
    </modal-tips>
    <teachingVideo
      ref="teachingVideoRef"
      @setMetaChange="setMetaChange"
    ></teachingVideo>
    <u-toast ref="uToast"></u-toast>
    <u-loading-page
      :loading="loadingShow"
      loading-text="数据获取中请稍等..."
    ></u-loading-page>
  </view>
</template>

<script>
import { baseUrl } from "@/utils/baseUrl.js";
// 心率带设备1 js文件
import heartRateBelt from "@/common/heartRateBelt.js";
// 心率带设备2 js文件
import heartRateBelt2 from "@/common/heartRateBelt2.js";
// 引入modal组件
import modalTips from "@/components/modalTips/modalTips.vue";
import teachingVideo from "@/components/heartRateModule/teachingVideo.vue";
/* 时间格式化 */
import { filterMinuteAndS, formatTime } from "@/utils/util.js";
/* 引入socket公共服务 */
import { ws } from "@/common/ws.js";
/* 引入公共js文件 */
import {
  authorizationBluetoothStatus,
  getAuthorizeUserLocationBackgroundState,
  createInnerAudio,
  audioPlay,
  audioDestroy,
  startLocationUpdateBackground,
  closeLocaionListener,
} from "@/common/common.js";
import {
  getDeviceRecord,
  ellipticalsIndex,
  addDeviceRecord,
  motionAdd,
  getIntensityList,
  joinScreenGroup,
  leaveGroup,
  // homeStartclass,
  setUserSportRecord,
  delUserSportRecord,
} from "@/api/myCenter.js";
export default {
  name: "heartRateModule",
  components: {
    modalTips,
    teachingVideo,
  },
  data() {
    return {
      baseUrl: baseUrl,
      bluetooth: false, // 蓝牙是否链接
      equipmentObj: {}, // 心率带数据
      deviceList: [], // 心率带设备列表
      connectType: "", // 链接设备类型
      deviceState: false, // 设备是否连接 加入分组成功
      /* 按钮状态 0 => 未开始  1 => 开始 2 => 暂停 3 => 停止 */
      btnState: 0,
      /* socket服务链接次数 */
      linkNums: 1,
      /* 设备id */
      device_id: "",
      /* 客户端id' */
      client_id: "",
      /* socket服务链接状态 */
      wsConnectState: false,
      /* ws返回数据 */
      socketData: {},
      /* 跑步机设备数据 */
      deviceData: {
        startDistAnce: 0, // 开始运动米数
        totalDistance: 0, // 运动总米数
        pauseTotalDistance: 0, // 暂停运行总米数
        exerciseSpeed: 0, // 运动速度
        calories: 0, // 热量
      },
      /* 计时定时器 */
      timer: "",
      /* 运动时长 */
      tiemDuration: 0,
      startTimestamp: 0, // 开始运动时间戳
      pauseTotalTime: 0, // 暂停时的总时长
      /* 运动时长格式化 */
      tiemDurationDate: 0,
      /* 平均心率 */
      HRmean: 0,
      /* 平均心率数组 */
      HRmeanArr: [],
      /* 心率列表 */
      heartRateArr: [],
      heartRateArr_noConnection: [], // 未连接心率带 心率数组列表
      /* 运动强度show */
      strengthShow: false,
      /* 运动强度数组 */
      strengthArr: [],
      /* 选中强度 下标 判断显示对应颜色 */
      strengIndex: 2,
      /* 父级页面类型参数 */
      fromType: "",
      /* 提示状态 show */
      tipsShow: false,
      /* 电量 */
      kwhNum: 100,
      /* 未连接心率带的热量 */
      noConnectionCalories: 0,
      /* 强度次数统计 */
      strength_statistics: {
        low: 0,
        m_low: 0,
        medium: 0,
        m_high: 0,
        "m_high+": 0,
        high: 0,
      },
      /* 记录强度时长工具 */
      strength_timer: "",
      /* 授权位置信息modal */
      locationBackgroundShow: false,
      /* 是否授权 离开小程序定位服务 */
      locationStatus: false,
      /* 心率臂运动 信息 */
      stepInfo: {
        startStep: 0, // 开始步数
        toatalStep: 0, // 总步数
        pauseStep: 0, // 暂停步数
        firstRecordStep: true, // 是否首次记录步数
      },
      timeout: "", // 防抖定时器
      /* 语音播报间隔 */
      broadcastTime: [
        {
          time: 0,
        },
        {
          time: 0,
        },
        {
          time: 0,
        },
        {
          time: 0,
        },
        {
          time: 0,
        },
        {
          time: 0,
        },
      ],
      /* 是否第一次开始 */
      firstStart: true,
      /* 发送ws消息时间 */
      startSendtime: "",
      /* 是否加入投屏分组 */
      joinScreenGroupStatus: false,
      existConnectSocketS: false /* 是否存在socket实例 */,
      roomId: "" /* 投屏房间id */,
      /* socket是否出错 */ socketError: false,
      requestProjectionScreen: false /* 是否存在请求投屏 */,
      courseType: "" /* 课程类型 */,
      courseStartTime: "", // 居家训练计划 课程开始时间
      courseId: "", // 课程id
      devicesLength: 0, // 扫面到的设备列表是否重复
      selectedScanDevice: "", // 绑定的设备类型
      firstTimestamp: 0, // 首次点击开始运动的时间戳
      hrDateList: [], // cl 历史日期数据
      hrCurrent: 0, // cl 当前请求的下标
      logrecord: require("@/common/log.js"),
      wxConfig: {},
      heartRateHistoryUnderway: 0, // 是否正在请求历史数据
      pageDestroy: true,
      loadingShow: false,
      loadingTimer: null,
      loadingNUmber: 1,
      autoConnectTimer: null,
      historyIfSuccess: 0,
      isPageShow: false,
    };
  },
  onReady() {
    this.wxConfig = __wxConfig.envVersion;
    let errRecordData =
      uni.getStorageSync("errRecordData") &&
      JSON.parse(uni.getStorageSync("errRecordData"));
    if (errRecordData) {
      if (errRecordData.length_time_second >= 300) {
        this.errConfirm(errRecordData);
      } else {
        uni.removeStorageSync("errRecordData");
      }
    }
    if (uni.getStorageSync("selectedScanDevice")) {
      this.selectedScanDevice = uni.getStorageSync("selectedScanDevice");
    }
    /* 初始化蓝牙 */
    if (this.selectedScanDevice === "CL") {
      heartRateBelt.init_fmanager();
    }
    // 自动连接心率臂带
    this.onAutoConnectTimer();
    let _this = this;
    /* 监听蓝牙状态 */
    uni.onBLEConnectionStateChange((res) => {
      console.log(res, "---监听蓝牙状态 官方");
      /* 断开蓝牙连接  */
      if (!res.connected) {
        /* 断开心率带连接 */
        if (_this.selectedScanDevice === "CL") {
          wx.closeBluetoothAdapter();
          heartRateBelt._disconnect();
        }
        _this.bluetooth = false;
      }
    });
    // this.connectSocket();
  },

  watch: {
    strengIndex: {
      handler(newV, oldV) {
        this.strengthStatisticsFun();
        if (this.btnState == 1) {
          if (this.broadcastTime[newV].time === 0) {
            this.broadcastTime[newV].time = new Date().getTime() / 1000;
            // this.switchAudio();
            this.debounce(this.switchAudio, 5000)();
          } else {
            if (
              new Date().getTime() / 1000 - this.broadcastTime[newV].time >
              30
            ) {
              this.broadcastTime[newV].time = new Date().getTime() / 1000;
              this.debounce(this.switchAudio, 5000)();
            }
          }
        }
      },
      immediate: true,
      deep: true,
    },
    btnState: {
      handler(newV, oldV) {
        /* 返回父级页面按钮状态 */
        this.$emit("getSportsState", newV);
      },
      immediate: true,
      deep: true,
    },
    bluetooth(newV) {
      if (["develop", "trial"].includes(this.wxConfig)) {
        this.logrecord.warn("蓝牙状态发生改变", {
          bluetooth: newV,
        });
      }
      console.log(newV, "---newV watch");
      if (!newV) {
        if (["develop", "trial"].includes(this.wxConfig)) {
          this.logrecord.warn("进去蓝牙状态改变判断", {
            bluetooth: newV,
          });
        }
        this.onAutoConnectTimer();
        console.log("蓝牙断开 watch");
      }
    },
  },

  methods: {
    onShowChange(showStatus) {
      this.isPageShow = showStatus;
    },
    setMetaChange() {
      this.$emit("setMetaChange");
    },
    onTeachingVideoShow() {
      this.$refs.teachingVideoRef.onTeachingVideoShow();
    },
    demoHrlist() {
      this.heartRateBreakpoint();
    },
    /* 心率带打历史数据断点 */
    heartRateBreakpoint(isFirst = "") {
      if (["develop", "trial"].includes(this.wxConfig)) {
        this.logrecord.warn("打断点", {
          bluetooth: this.bluetooth,
          heartRateArr: this.heartRateArr,
        });
      }
      if (this.selectedScanDevice === "HW" && !isFirst) {
        if (["develop", "trial"].includes(this.wxConfig)) {
          this.logrecord.warn("获取历史数据HW", {
            bluetooth: this.bluetooth,
            heartRateArr: this.heartRateArr,
          });
        }
        this.historyIfSuccess = 0;
        heartRateBelt2.getHistory();
        setTimeout(() => {
          if (!this.historyIfSuccess) {
            if (["develop", "trial"].includes(this.wxConfig)) {
              this.logrecord.warn("HW获取失败", {
                bluetooth: this.bluetooth,
                heartRateArr: this.heartRateArr.length,
                historyIfSuccess: this.historyIfSuccess,
              });
            }
            heartRateBelt2.getHistory();
          }
        }, 3000);
      }
      if (this.selectedScanDevice === "CL") {
        heartRateBelt.getHeartrateListFun();
      }
    },
    // 自动连接心率带
    autoConnect() {
      if (!uni.getStorageSync("armletInfo")) return;
      this.armletInfo = JSON.parse(uni.getStorageSync("armletInfo"));
      if (
        this.selectedScanDevice &&
        this.armletInfo &&
        this.pageDestroy &&
        !this.isPageShow
      ) {
        console.log("进入扫描判断---");
        // 扫描设备
        this.scanningLinks("auto");
      }
    },

    /* 处理ios切换后台后 蓝牙停止传输数据问题 */
    recordIosHideDate(osName) {
      if (
        this.btnState === 1 &&
        this.bluetooth &&
        this.firstTimestamp &&
        osName === "ios"
      ) {
        this.heartRateBreakpoint();
      }
    },
    /* 获取课程类型 */
    getCourseType(type, courseStartTime, courseId) {
      /* 
				type == sporty == 居家训练计划
			 */
      // 课程类型
      this.courseType = type;
      /* 课程是否存在开始时间 */
      this.courseStartTime = courseStartTime;
      /* 课程id */
      this.courseId = courseId;
    },
    /* 更改课程状态 为开始 */
    // homeStartclassFun() {
    // 	homeStartclass({
    // 		id: this.courseId
    // 	}).then(res => {
    // 	})
    // },
    //简单的防抖函数
    debounce(func, wait) {
      //定时器变量
      return () => {
        //每次触发scrolle，先清除定时器
        clearTimeout(this.timeout);
        //指定多少秒后触发事件操作handler
        this.timeout = setTimeout(func, wait);
      };
    },
    /* 判断播放那条音频 */
    switchAudio(eve) {
      let markArr = {
        0: "low",
        1: "middle_low",
        2: "middle",
        3: "middle_h",
        4: "middle_h_add",
        4: "height",
      };
      /* 播放音频 */
      this.audioPlayFun(`${this.baseUrl}${markArr[this.strengIndex]}.mp3`);
    },
    /* 音频实例 初始化 */
    createInnerAudioFun() {
      /* 创建音频实例 */
      createInnerAudio();
    },
    /* 语音播报 回调 */
    audioPlayFun(url) {
      if (uni.getStorageSync("voiceBroadcast")) {
        audioPlay(url);
      }
    },
    /* 销毁音频实例 回调 停止不放 */
    audioDestroyFun() {
      audioDestroy();
    },
    /* 去授权实时定位 */
    goLocationBackgroundShow() {
      this.locationBackgroundShow = false;
      wx.openSetting({
        success: (res) => {},
      });
    },
    /* 停止定时器 */
    /* 强度统计方法 */
    strengthStatisticsFun() {
      if (this.btnState == 1) {
        this.strength_statistics[this.strengthArr[this.strengIndex].value]++;
        this.strength_timer && clearInterval(this.strength_timer);
        this.strength_timer = setInterval(() => {
          this.strength_statistics[this.strengthArr[this.strengIndex].value]++;
        }, 1000);
      }
    },
    /* 页面卸载触发 */
    onUnloadFun() {
      /* 关闭实时位置监听 */
      this.closeLocaionListenerFun();
      this.pageDestroy = false;
      if (this.wsConnectState || this.deviceState || this.existConnectSocketS) {
        ws.stop(() => {
          this.existConnectSocketS = false;
          this.deviceState = false;
          uni.removeStorageSync("deviceId");
        });
      }
      /* 销毁音频实例 停止播放 */
      this.audioDestroyFun();
      this.deviceState = false;
      /* 断开蓝牙链接 */
      if (this.selectedScanDevice === "HW") {
        heartRateBelt2.closeBluetoothAdapter();
      } else if (this.selectedScanDevice === "CL") {
        wx.closeBluetoothAdapter();
        heartRateBelt._disconnect();
      }
      this.bluetooth = false;
      this.btnState = 0;
      /* 停止记录强度时长 */
      clearInterval(this.strength_timer);
      /* 暂停停止记录时长 */
      clearInterval(this.timer);
    },
    /* 获取心率强度列表 */
    getIntensityListFun(paremtType) {
      /* 
				父级页面传递参数
				type ->
				clockIn -> 打卡页面
				fatBurning -> 燃烧卡路里页面
				training -> 训练计划页面
			 */
      this.fromType = paremtType;
      getIntensityList().then((res) => {
        this.strengthArr = res.data;
        this.strengthArr.map((item, index) => {
          item.color = index;
        });
        /* 统计强度 记录*/
        this.strengthStatisticsFun();
      });
    },
    /* 选中强度 */
    selectStrength(e) {
      /* 选中的强度下标 */
      this.strengIndex = e.color;
    },
    /* 生成卡路里记录 */
    motionAddFun() {
      motionAdd({
        deviceId: this.device_id,
        speed: this.deviceData.exerciseSpeed,
        lengthTime: this.tiemDurationDate,
        distance: this.deviceData.totalDistance,
        calories: this.deviceData.calories,
        heartRate: this.HRmean,
        avgHeartRateArr: this.HRmeanArr.join(","),
        lengthTimeSecond: this.tiemDuration,
        strength: this.strengthArr[this.strengIndex].value,
        burnFat: parseInt(this.deviceData.calories / 7.7), // 燃烧脂肪
        strengthStatistics: JSON.stringify(this.strength_statistics), // 强度统计
        aerobicHeartRateArr: this.heartRateArr.length
          ? this.heartRateArr.join(",")
          : "", // 心率数组列表
        steps: this.stepInfo.toatalStep, // 心率带步数
        noConnectionCalories: this.noConnectionCalories, // 未连接心率带 计算的热量
        deviceSystem: uni.getSystemInfoSync().osName,
      }).then((res) => {
        uni.showToast({
          title: res.msg,
        });
        /* 删除异常未保存数据 */
        uni.removeStorageSync("errRecordData");
        /* 重置数据 */
        this.resetData();
        setTimeout(() => {
          if (this.fromType == "fatBurning") {
            /* 结束有效运动之后 调用 燃烧卡路里页 运动历史接口 更新页面历史记录 */
            this.$emit("getMotionListFun");
          }
        }, 1500);
      });
    },
    /* 异常数据 重保存 */
    errConfirm(obj) {
      motionAdd(obj).then((res) => {
        /* 删除异常未保存数据 */
        this.$emit("getMotionListFun");
        uni.removeStorageSync("errRecordData");
      });
    },
    /* 记录运动数据 */
    setStorageExerciseData() {
      /* 记录当前页面数据 */
      let exerciseData = {
        deviceId: this.device_id,
        speed: this.deviceData.exerciseSpeed,
        lengthTime: this.tiemDurationDate,
        distance: this.deviceData.totalDistance,
        calories: this.deviceData.calories,
        heartRate: this.HRmean,
        avgHeartRateArr: this.HRmeanArr.join(","),
        lengthTimeSecond: this.tiemDuration,
        strength: this.strengthArr[this.strengIndex].value,
        burnFat: parseInt(this.deviceData.calories / 7.7), // 燃烧脂肪
        strengthStatistics: JSON.stringify(this.strength_statistics), // 强度统计
        aerobicHeartRateArr: this.heartRateArr.length
          ? this.heartRateArr.join(",")
          : "", // 心率数组列表
        steps: this.stepInfo.toatalStep, // 心率带步数
        noConnectionCalories: this.noConnectionCalories, // 未连接心率带 计算的热量
				deviceSystem: uni.getSystemInfoSync().osName
      };
      uni.setStorageSync("errRecordData", JSON.stringify(exerciseData));
    },
    /* 记录数据回调 */
    recordFun() {
      this.timer = setInterval(() => {
        // this.tiemDuration += 1;
        this.tiemDuration =
          this.pauseTotalTime +
          (new Date().getTime() - this.startTimestamp) / 1000;
        this.tiemDurationDate = filterMinuteAndS(this.tiemDuration);
        /* 记录当前页面数据 */
        this.setStorageExerciseData();
        return;
        if (!this.bluetooth) {
          /* 心率指数 = 实时心率 / 安静心率  */
          /* this.strengHeart /Number(uni.getStorageSync('rhr')); */
          this.heartRateArr_noConnection.push(
            Number(this.strengthArr[this.strengIndex].key.range1)
          );
          let heartNum = 0;
          this.heartRateArr_noConnection.map((item) => {
            heartNum += item;
          });
          /* 平均心率 */
          this.HRmean = (
            heartNum / this.heartRateArr_noConnection.length
          ).toFixed(1);
          this.HRmeanArr.push(this.HRmean);
          /* 心率指数 = 平均心率 / 安静心率  */
          let index = this.HRmean / Number(uni.getStorageSync("rhr"));
          // let index =
          // 	Number(this.strengthArr[this.strengIndex].key.value) / Number(uni.getStorageSync('rhr'));
          /* 梅脱值 = 心率指数 * 6 - 5 */
          let met = index * 6 - 5;
          /* 运动分钟 */
          let minute = Number((this.tiemDuration / 60).toFixed(1));
          /* 热量=  体重 * 分钟 * 0.0175 * 梅脱值 */
          this.deviceData.calories = (
            Number(uni.getStorageSync("weight")) *
            minute *
            0.0175 *
            met
          ).toFixed(1);
          /* 记录未连接心率带的热量 */
          this.noConnectionCalories = this.deviceData.calories;
        }
      }, 1000);
    },
    /* 获取授权位置信息状态 */
    getAuthorizeUserLocationBackground() {
      let _this = this;
      getAuthorizeUserLocationBackgroundState((eve) => {
        _this.locationStatus = eve;
      });
    },
    /* 结束监听位置变化 */
    closeLocaionListenerFun() {
      if (this.locationUpdate) {
        this.locationUpdate = false;
        closeLocaionListener();
      }
    },
    /* 开始位置更新 */
    startLocationUpdateBackgroundFun() {
      this.locationUpdate = true;
      startLocationUpdateBackground();
    },
    /* 是否授权 后台定位 */
    autoLocationStatus(back) {
      let status = true;
      if (!this.locationStatus) {
        this.locationBackgroundShow = true;
        status = false;
      } else {
        /* 判断是否已存在监听 */
        if (!this.locationUpdate && !back) {
          this.startLocationUpdateBackgroundFun();
        }
      }
      return status;
    },
    // 设置用户运动的记录
    setUserSportRecord() {
      setUserSportRecord().then((res) => {
        console.log(res, "---添加");
      });
    },
    // 删除用户运动记录
    delUserSportRecord() {
      delUserSportRecord().then((res) => {
        console.log(res, "---添加");
      });
    },
    /* 暂停 开始  停止 按钮操作 */
    onBtn(e, back) {
      if (
        !Number(uni.getStorageSync("rhr")) ||
        !Number(uni.getStorageSync("weight"))
      ) {
        uni.showModal({
          content: "请去个人信息页填写安静心率和体重后再训练！",
          showCancel: false,
        });
        return;
      }
      if (!this.autoLocationStatus(back)) {
        return;
      }
      /* 按钮状态 */
      this.btnState = e;
      if (this.btnState == 1) {
        /* 判断是否是居家训练计划 同时课程未开始 */
        // if(this.courseType == 'sporty' && !this.courseStartTime) {
        // 	this.courseStartTime = new Date();
        // 	this.homeStartclassFun();
        // }
        // 首次点击开始运动时间
        if (!this.firstTimestamp) {
          this.firstTimestamp = new Date().getTime() - 1200;
          this.setUserSportRecord();
          this.heartRateBreakpoint("first");
        }
        /* 点击开始运动的时间戳 */
        this.startTimestamp = new Date().getTime();
        if (this.firstStart) {
          this.firstStart = false;
          this.audioPlayFun(`${this.baseUrl}startExercise.mp3`);
        } else {
          this.audioPlayFun(`${this.baseUrl}continue.mp3`);
        }
        /* 开始记录强度时长 */
        this.strengthStatisticsFun();
        if (this.connectType == "treadmill") {
          if (this.socketData.distance && this.socketData.status == 3) {
            /* 记录首次点击开始跑步机米数 */
            this.deviceData.startDistAnce = this.socketData.distance;
          }
        } else if (this.connectType == "ellipticals") {
          if (this.socketData.status == 1 && this.socketData.cadence) {
          }
          {
            /* 记录首次点击开始跑步机米数 */
            this.deviceData.startDistAnce = this.socketData.distance;
          }
        }
        this.recordFun();
      }
      if (this.btnState == 2) {
        /* 记录暂停运动时的运动总时长 */
        this.pauseTotalTime = this.tiemDuration;
        this.audioPlayFun(`${this.baseUrl}pauseExercise.mp3`);
        /* 停止记录强度时长 */
        clearInterval(this.strength_timer);
        /* 暂停停止记录时长 */
        clearInterval(this.timer);
        /*
					connectType 类型
					treadmill => 跑步机
					ellipticals => 功率车
				*/
        if (this.connectType == "treadmill") {
          if (this.socketData.distance && this.socketData.status == 3) {
            /* 记录暂停时 运动总米数 */
            this.deviceData.pauseTotalDistance = this.deviceData.totalDistance;
          }
        } else if (this.connectType == "ellipticals") {
          if (this.socketData.status == 1 && this.socketData.cadence) {
            /* 记录暂停时 运动总米数 */
            this.deviceData.pauseTotalDistance = this.deviceData.totalDistance;
          }
        }
      }
      /* 停止运动 */
      if (this.btnState == 3) {
        if (["develop", "trial"].includes(this.wxConfig)) {
          this.logrecord.warn("btnstate3", {
            bluetooth: this.bluetooth,
            steps: this.stepInfo.toatalStep,
            heartRateArr: this.heartRateArr,
          });
        }
        let _this = this;
        /* 停止记录强度时长 */
        clearInterval(this.strength_timer);
        /* 停止记录时长 */
        clearInterval(this.timer);
        if (this.tiemDuration >= 300) {
          /* 重置位置更新监听 */
          this.closeLocaionListenerFun();
          this.motionAddFun();
          /* 打卡页面 | 训练计划 传递父级页面运动时长秒数  */
          if (this.fromType == "clockIn" || this.fromType == "training") {
            this.$emit("getDuration", {
              totalDistance: this.deviceData.totalDistance, // 运动距离
              exerciseSpeed: this.deviceData.exerciseSpeed, // 运动速度
              calories: this.deviceData.calories, // 卡路里
              heartrate: this.equipmentObj.heartrate, // 实时心率
              tiemDurationDate: this.tiemDurationDate, // 运动分钟
              tiemDuration: this.tiemDuration,
              HRmean: this.HRmean, // 平均心率
              strengName: this.strengthArr[this.strengIndex].value, // 强度类型
              heartRateArr: this.heartRateArr, // 心率数组列表
              burn_fat: parseInt(this.deviceData.calories / 7.7), // 燃烧脂肪
              btnState: this.btnState, // 运动状态
              strength_statistics: this.strength_statistics, // 强度统计
              steps: this.stepInfo.toatalStep, // 心率带步数
            });
          }
          /* 重置数据 */
          _this.closeFun();
        } else {
          /* 
						back 参数是父级页面在运行中点击
						返回按钮传递的参数 表示 小于5分钟直接结束运动 不提示 
					*/
          if (back) {
            this.closeFun();
          } else {
            uni.showModal({
              title:
                "本次运动时长过短，确定结束运动，不生成记录。点击取消，继续运动。",
              cancelText: "继续运动",
              confirmText: "结束运动",
              success: function (res) {
                if (res.confirm) {
                  /* 重置位置更新监听 */
                  _this.closeLocaionListenerFun();
                  _this.closeFun();
                } else if (res.cancel) {
                  _this.startTimestamp = new Date().getTime();
                  _this.recordFun();
                  _this.btnState = 1;
                }
              },
            });
          }
        }
      }
    },
    /* 结束锻炼 断开设备 重置数据 */
    closeFun() {
      let _this = this;
      this.delUserSportRecord();
      /* 设备链接断开 */
      if (
        _this.wsConnectState ||
        _this.deviceState ||
        this.existConnectSocketS
      ) {
        ws.stop(() => {
          _this.existConnectSocketS = false;
          _this.deviceState = false;
          uni.removeStorageSync("deviceId");
        });
      }
      // if (_this.bluetooth) {
      // 	/* 断开蓝牙链接 */
      // 	if (this.selectedScanDevice === 'HW') {
      // 		heartRateBelt2.closeBluetoothAdapter();
      // 	} else if (this.selectedScanDevice === 'CL') {
      // 		heartRateBelt._disconnect();
      // 	}
      // }

      /* 重置记录时长秒数 */
      _this.tiemDuration = 0;
      /* 重置数据 */
      _this.resetData();
    },
    /* 重置数据 */
    resetData() {
      /* 重置强度统计 */
      this.strength_statistics = {
        low: 0,
        m_low: 0,
        medium: 0,
        m_high: 0,
        "m_high+": 0,
        high: 0,
      };
      /* 是否第一次点击开始 */
      this.firstStart = true;
      let _this = this;
      /* 重置重连次数 */
      this.linkNums = 1;
      /* 重置开始米数 */
      _this.deviceData.startDistAnce = 0;
      /* 重置总米数 */
      _this.deviceData.pauseTotalDistance = 0;
      /* 重置运动总距离 */
      _this.deviceData.totalDistance = 0;
      /* 重置运动速度 */
      _this.deviceData.exerciseSpeed = 0;
      /* 重置卡路里 */
      _this.deviceData.calories = 0;
      /* 重置分钟 */
      _this.tiemDurationDate = 0;
      /* 重置分钟秒数 */
      _this.tiemDuration = 0;
      /* 重置心率列表 */
      _this.heartRateArr = [];
      _this.heartRateArr_noConnection = [];
      /* 重置平均心率 */
      _this.HRmean = 0;
      this.HRmeanArr = [];
      /* 重置开始步数 */
      this.stepInfo.startStep = 0;
      /* 重置总步数 */
      this.stepInfo.toatalStep = 0;
      /* 重置暂停步数 */
      this.stepInfo.pauseStep = 0;
      /* 重置 记录开始步数判断  */
      this.stepInfo.firstRecordStep = true;
      /* 重置 加入投屏分组状态 */
      this.joinScreenGroupStatus = false;
      /* 重置 skcket是否链接成功 */
      this.wsConnectState = false;
      /* 重置开始时间 */
      this.startSendtime = "";
      /* 重置 是否存在请求投屏 */
      this.requestProjectionScreen = false;
      /* 重置扫码类型 */
      this.connectType = "";
      // 重置开始时间戳
      this.startTimestamp = 0;
      /* 重置暂停运动时的运动总时长 */
      this.pauseTotalTime = 0;
      this.firstTimestamp = 0;
      /*  */
      this.noConnectionCalories = 0;
    },
    /* 扫码设备链接 */
    connectDevice() {
      if (this.deviceState) {
        return;
      }
      uni.scanCode({
				success: (res) => {
					this.connectType = res.result.split("#")[0]
					if(this.connectType.includes("=")) {
						this.connectType = this.connectType.split("=")[1];
					}
					console.log(res.result, "---扫码结果");
					// 设备id
					this.device_id = res.result;
					uni.setStorageSync("deviceId", this.device_id);
					if (this.deviceState) {
						uni.showToast({
							title: "已连接设备！",
							icon: "error",
							duration: 2000,
						});
						return;
					}
					console.log("wsConnectState:", this.wsConnectState);
					//连接设备
					this.ellipticalsIndexFun();
				}
			});
    },
    /* 链接socket */
    connectSocket() {
      /*
					connectType 类型
					treadmill => 跑步机
					ellipticals => 功率车
				*/
      /* 存在socket实例 */
      this.existConnectSocketS = true;
      // 链接socket
      ws.socket(
        (eve) => {
          /* socket抛出错误的回调 */
          this.linkNums = 1;
          uni.showLoading({
            title: "连接设备中,请稍等...",
          });
          this.socketError = false;
          this.joinScreenGroupStatus = false;
          this.requestProjectionScreen = false;
          /* socket已断开 */
          this.wsConnectState = false;
        },
        () => {
          uni.hideLoading();
          this.socketError = true;
        },
        this.wsMessageFun
      );
    },
    /* 加入投屏分组 */
    joinScreenGroupFun() {
      if (!this.autoLocationStatus()) {
        return;
      }
      this.requestProjectionScreen = true;
      joinScreenGroup({
        client_id: this.client_id,
        groupId: this.roomId,
      }).then((res) => {
        uni.showModal({
          title: "提示",
          content: res.msg,
          showCancel: false,
          confirmText: "知道了",
        });
        this.joinScreenGroupStatus = true;
      });
    },
    /* 离开投屏分组 */
    leaveGroupFun() {
      leaveGroup({
        client_id: this.client_id,
        groupId: this.roomId,
      }).then((res) => {});
    },
    /* 功率车设备逻辑处理 */
    powerFun(index) {
      /*
				 'status', // 设备状态 0 = 待机 1 = 运行中 2 = 暂停
				 'status_text'
				 'speed'=>,  //速度
				 'cadence'=>  //瞬间踏频  转速
				 'av_cadence'=  //平均踏频
				 'distance'=>, //距离
				 'resistance_class'=>  //阻力等级
				 'power'=>  //功率
				 'av_power'=>  //平均功率
				 'total_energy'=>  //总能量
				 'heart_rate'=> //心率
				 'Running_time'=> //运行时间
				*/
      if (
        this.socketData.status == 1 && // 设备状态为运行中
        this.socketData.cadence && // 有踏频数据
        this.btnState == 1 // 按钮状态为开始运动
      ) {
        // 计算总运动距离
        this.deviceData.totalDistance =
          this.socketData.distance -
          this.deviceData.startDistAnce +
          this.deviceData.pauseTotalDistance;

        // 计算运动速度
        this.deviceData.exerciseSpeed = (
          (this.socketData.cadence * 6.28 * 0.2 * 60) /
          1000
        ).toFixed(1);
      }
    },
    /* 跑步机设备逻辑处理 */
    treadmillFun() {
      /*
				 'length_time'=>,  //时间长度
				 'distance'=>,  //距离单位 1m
				 'calories'=>,  //热量单位 0.1 大卡
				 'step_number'=,  //步数
				 'heart_rate'=> //心率
				 speed => "实时速度"
				*/
      /*
				   btnState == 1 -> 开始运动
				   socketData.status == 3 -> 跑步机运行中
				   distance -> 跑步机运行正常
			   */
      if (
        this.socketData.distance &&
        this.socketData.status == 3 &&
        this.btnState == 1
      ) {
        /* 运行中状态*/
        /* 运动总距离米数 = 即时米数 - 开始米数 + 暂停时 运动总米数*/
        this.deviceData.totalDistance =
          this.socketData.distance -
          this.deviceData.startDistAnce +
          this.deviceData.pauseTotalDistance;
        /* 运动速度*/
        this.deviceData.exerciseSpeed = (this.socketData.speed * 0.1).toFixed(
          1
        );
      }
    },
    /* 发送消息 到socket端 */
    sendMsgFun(heart) {
      if (!this.startSendtime) {
        this.startSendtime = parseInt(new Date().getTime() / 1000);
      }
      ws.sendMsg(
        JSON.stringify({
          type: "heart_rate_system",
          heart_rate: heart,
          starttime: this.startSendtime,
        })
      );
    },

    /* 接收socket服务数据 */
    wsMessageFun(e) {
      /* ws服务链接成功 */
      this.wsConnectState = true;
      let tcpDData = JSON.parse(e);
      if (tcpDData.event == "heartLung") {
        this.socketData = tcpDData;
      }
      // this.socketData = JSON.parse(e);
      if (!this.client_id && this.socketData.client_id) {
        this.client_id = this.socketData.client_id ?? "";
      }
      /* 判断投屏服务端是否断开链接 */
      if (this.socketData.status == "ungroup") {
        this.joinScreenGroupStatus = false;
        this.requestProjectionScreen = false;
        this.wsConnectState = false;
        /* 重置类型 */
        this.connectType = "";
        /* 重置开始时间 */
        this.startSendtime = "";
        if (
          this.wsConnectState ||
          this.deviceState ||
          this.existConnectSocketS
        ) {
          ws.stop(() => {
            this.existConnectSocketS = false;
            this.deviceState = false;
            uni.removeStorageSync("deviceId");
          });
        }
      }
      if (this.connectType == "treadmill" && this.deviceState) {
        /* 跑步机判断 */
        this.treadmillFun();
      } else if (this.connectType == "ellipticals" && this.deviceState) {
        /* 功率车判断 */
        this.powerFun();
      }
      if (!this.client_id && this.connectType == "HeartRateSystem") {
        // uni.showToast({
        // 	title: `客户端id异常--${this.client_id}`,
        // 	icon: "none",
        // 	duration: 3000
        // })
      }
      /* 加入投屏分组 */
      if (
        this.connectType == "HeartRateSystem" &&
        !this.joinScreenGroupStatus &&
        this.bluetooth &&
        !this.requestProjectionScreen
      ) {
        // &&
        // this.client_id
        this.joinScreenGroupFun();
      }
      // 设备id 和 客户id存在 加入分组
      if (
        this.device_id &&
        this.linkNums <= 1 &&
        (this.connectType == "ellipticals" || this.connectType == "treadmill")
      ) {
        // this.client_id &&
        this.ellipticalsIndexFun();
        this.linkNums += 1;
      }
    },
    /* socket服务 设备加入分组 */
    ellipticalsIndexFun() {
			ellipticalsIndex({
				deviceId: this.device_id,
			}).then((res) => {
				this.deviceState = true; // 加入分组代表链接设备成功
			});
		},

    // 链接设备
    _connect(item) {
      if (this.selectedScanDevice === "HW") {
        heartRateBelt2.createBLEConnectionFun(item);
      } else if (this.selectedScanDevice === "CL") {
        heartRateBelt._connect(item);
      }
    },
    /* 扫描附近心率带 */
    scanningLinks(isAuto) {
      /* 判断是否授权使用蓝牙 */
      authorizationBluetoothStatus();
      if (this.bluetooth) {
        return;
      }
      if (!this.selectedScanDevice) {
        uni.showToast({
          title: "请去我的设备页面绑定设备后再扫描！",
          icon: "none",
        });
        return;
      }
      this.devicesLength = 0;
      if (this.selectedScanDevice === "HW") {
        /* 连接新设备 心率带2 */
        heartRateBelt2.openBluetoothAdapter(
          this.cloneFun,
          this.changeHeartRate,
          isAuto
        );
      } else if (this.selectedScanDevice === "CL") {
        wx.openBluetoothAdapter({
          success: (res) => {
            /* 心率带设备1链接 */
            heartRateBelt._scan(this.cloneFun, this.changeHeartRate, isAuto);
          },
          fail: (err) => {
            if (err.errCode === 10001) {
              wx.showToast({
                title: "蓝牙未打开",
                icon: "error",
              });
            }
            //调用失败直接提示信息
          },
        });
      }
    },
    // 关闭modal
    modalConfirm() {
      if (this.selectedScanDevice === "HW") {
        heartRateBelt2.closeBluetoothAdapter();
      } else if (this.selectedScanDevice === "CL") {
        wx.closeBluetoothAdapter();
        heartRateBelt._disconnect();
      }
    },
    /* 心率发生改变的回调 */
    changeHeartRate(e, type) {
      /* 如果加入投屏分组成功 发送消息到sock */
      console.log(this.socketError, this.bluetooth, e, "进入判断");
      if (
        // this.joinScreenGroupStatus &&
        this.socketError &&
        this.bluetooth &&
        e
      ) {
        this.sendMsgFun(e);
      }
      
      try {
        if (
          (this.btnState == 1 && e && !this.heartRateHistoryUnderway) ||
          type == "history"
        ) {
          /* 心率列表 */
          this.heartRateArr.push(e);
          let heartNum = 0;
          this.heartRateArr.map((item) => {
            heartNum += item;
          });
          /* 平均心率 */
          this.HRmean = (heartNum / this.heartRateArr.length).toFixed(1);
          this.HRmeanArr.push(this.HRmean);
          /* 心率指数 = 平均心率 / 安静心率  */
          let index = this.HRmean / Number(uni.getStorageSync("rhr"));
          /* 梅脱值 = 心率指数 * 6 - 5 */
          let met = index * 6 - 5;
          /* 运动分钟 */
          let minute = Number((this.tiemDuration / 60).toFixed(1));
          /* 
						如果未连接心率带之前记录过热量就 叠加之前的热量
					 */
          // if (this.noConnectionCalories) {
          // 	/* 热量=  体重 * 分钟 * 0.0175 * 梅脱值 */
          // 	this.deviceData.calories = (Number(uni.getStorageSync('weight')) * minute * 0.0175 * met + Number(this.noConnectionCalories)).toFixed(1);
          // } else {
          /* 热量=  体重 * 分钟 * 0.0175 * 梅脱值 */
          this.deviceData.calories = (
            Number(uni.getStorageSync("weight")) *
            minute *
            0.0175 *
            met
          ).toFixed(1);
          // }

          /* 判断如果心率至小于最低强度心率 赋值数据为最低强度 */
          if (Number(e) < Number(this.strengthArr[0].key.range1)) {
            this.strengIndex = 0;
          }
          if (
            Number(e) >=
            Number(this.strengthArr[this.strengthArr.length - 1].key.range2)
          ) {
            this.strengIndex = this.strengthArr.length - 1;
          }
          this.strengthArr.map((item) => {
            if (
              Number(e) >= Number(item.key.range1) &&
              Number(e) <= Number(item.key.range2)
            ) {
              this.strengIndex = item.color;
            }
          });
        }
      } catch (err) {
        uni.showModal({
          content: `运行异常请联系管理员，${err}`,
          showCancel: false,
        });
      }
    },
    /* 记录心率带步数 */
    stepsRecord() {
      /* 
				this.equipmentObj.step -> 心率臂带 步数
				stepInfo.startStep -> 开始步数
				stepInfo.toatalStep -> 总步数
				stepInfo.pauseStep -> 暂停步数
			*/
      if (this.btnState == 1) {
        /* 开始运动进入判断 */
        /* 开始运动步数 */
        if (this.stepInfo.firstRecordStep && this.equipmentObj.step != "--") {
          /* 重置 是否允许记录开始步数 */
          this.stepInfo.firstRecordStep = false;
          this.stepInfo.startStep = this.equipmentObj.step;
        }
        this.stepInfo.toatalStep =
          this.equipmentObj.step -
          this.stepInfo.startStep +
          this.stepInfo.pauseStep;
      } else if (this.btnState == 2) {
        /* 暂停进入判断 */
        this.stepInfo.firstRecordStep = true;
        this.stepInfo.pauseStep = this.stepInfo.toatalStep;
      }
    },
    /* 心率数组 push 满足条件的心率历史列表数据 */
    heartHirstPush() {
      this.heartRateArr = [];
      this.HRmeanArr = [];
      if (["develop", "trial"].includes(this.wxConfig)) {
        this.logrecord.warn("进入HW历史数据", {
          historyHRLength: this.equipmentObj.historyHR.length,
          firstTimestamp: this.firstTimestamp,
        });
      }
      if (this.equipmentObj.historyHR.length) {
        if (["develop", "trial"].includes(this.wxConfig)) {
          this.logrecord.warn("进入HW获取数据判断", {
            heartRateArr: this.heartRateArr.length,
            firstTimestamp: this.firstTimestamp,
          });
        }
        this.heartRateHistoryUnderway = 1;
        // let meanArr = [];
        this.equipmentObj.historyHR.forEach((item, index) => {
          if (item.timeStamps >= this.firstTimestamp / 1000) {
            // console.log(parseInt(this.firstTimestamp / 1000),item.timeStamps ,"进入判断");
            this.changeHeartRate(item.heartRateNum, "history");
            if (index < this.equipmentObj.historyHR.length - 1) {
              let heartPlus =
                this.equipmentObj.historyHR[index + 1].heartRateNum;
              let meanHeart = Number(
                ((item.heartRateNum + heartPlus) / 2).toFixed(2)
              );
              // meanArr.push(meanHeart)
              this.changeHeartRate(item.heartRateNum, "history");
              // console.log(index, "计算平均心率");
            }
          }
          if (index == this.equipmentObj.historyHR.length - 1) {
            this.loadingShow = false;
            clearInterval(this.loadingTimer);
            this.loadingTimer = null;
            this.heartRateHistoryUnderway = 0;
            this.logrecord.warn("进入判断结束", {
              heartRateArr: this.heartRateArr.length,
            });
            this.logrecord.warn("获取HW历史数据结束", {
              heartRateArrLength: this.heartRateArr.length,
              historyHRLen: this.equipmentObj.historyHR.length,
              loadingNUmber: this.loadingNUmber,
            });
            this.loadingNUmber = 1;
            // console.log("循环结束", index, this.equipmentObj.historyHR.length - 1);
          }
        });
      }
    },
    /* 获取指定日期下的历史心率数据 */
    gethistoryHR() {
      if (["develop", "trial"].includes(this.wxConfig)) {
        this.logrecord.warn("获取指定日期下的历史心率数据", {
          hrCurrent: this.hrCurrent,
          hrDateList: this.hrDateList,
        });
      }
      heartRateBelt.getHeartrateDataFun(this.hrDateList[this.hrCurrent].stamp);
      this.hrCurrent += 1;
    },
    onAutoConnectTimer() {
      if (!this.autoConnectTimer) {
        console.log(!this.autoConnectTimer, "--12");
        this.autoConnectTimer = setInterval(() => {
          if (this.bluetooth) {
            clearInterval(this.autoConnectTimer);
            this.autoConnectTimer = null;
          }
          this.autoConnect();
        }, 3000);
      }
    },
    // cloneData 赋值设备数据
    cloneFun(eve, txt, type = "") {
      if (type == "timeOut") {
        this.onAutoConnectTimer();
        return;
      }
      if (type == "break") {
        // if(['develop', 'trial'].includes(this.wxConfig)) {
        this.logrecord.warn("心率带break", {
          type,
          txt,
          bluetooth: eve.connected,
          heartRateArr: this.heartRateArr,
        });
        // }
        console.log(
          {
            type,
            txt,
            bluetooth: eve.connected,
            date: formatTime(new Date()),
          },
          "break_debug"
        );
        this.bluetooth = false;
        this.equipmentObj.heartrate = 0;
        this.joinScreenGroupStatus = false;
        this.requestProjectionScreen = false;
        /* 重置开始时间 */
        this.startSendtime = "";
        /* 心率带断开 离开投屏分组 */
        this.leaveGroupFun();
      }
      if (type == "success") {
        console.log("连接成功");

        /* 添加设备链接记录 */
        addDeviceRecord({
          // device_id: eve.device.name,
          device_id: eve.device ? eve.device.name : eve.name,
        }).then((res) => {});
        /* 如果开始运动时间存在  代表心率带异常断开后重连*/
        if (this.btnState === 1 && this.firstTimestamp) {
          if (["develop", "trial"].includes(this.wxConfig)) {
            this.logrecord.warn("获取历史户断点", {
              type: type,
              heartRateArr: this.heartRateArr,
              firstTimestamp: this.firstTimestamp,
            });
          }
          this.heartRateBreakpoint();
        }
      }
      if (this.selectedScanDevice === "HW") {
        this.equipmentObj = { ...eve };
      } else if (this.selectedScanDevice === "CL") {
        let {
          step, // 步数
          distance, // 步行距离
          calorie, // 卡路里
          heartrate, // 心率数据
          devices, // 扫描到的设备
          connected, // 蓝牙是否连接
          modalShow, // 显示设备列表modal
          intervals, // 间隔
          battery, // 电量
          hrList, // 日期历史列表
          hrData, // 指定日期下的心率列表
        } = eve;
        this.equipmentObj = {
          step, // 步数
          distance, // 步行距离
          calorie, // 卡路里
          heartrate, // 心率数据
          devices, // 扫描到的设备
          connected, // 蓝牙是否连接
          modalShow: eve.is_auto ? false : modalShow, // 显示设备列表modal
          intervals, // 间隔
          battery, // 电量
          hrList, // 心率日期历史列表
          hrData, // 指定日期下的心率列表
        };
      }
      /* 心率带步数发生改变 调用记录步数 回调 */
      if (type === "stepChange") {
        this.stepsRecord();
      }
      /* 电量发生改变 */
      if (type === "battery") {
        this.kwhNum = this.equipmentObj.battery.split("%")[0];
      }
      if (type === "historyListHW") {
        if (["develop", "trial"].includes(this.wxConfig)) {
          this.logrecord.warn("获取HW历史数据", {
            type,
            historyHR: this.equipmentObj.historyHR.slice(
              this.equipmentObj.historyHR.length - 6
            ),
            firstTimestamp: this.firstTimestamp,
          });
        }
        this.historyIfSuccess = 1;
        if (!this.loadingShow) {
          this.loadingShow = true;
          this.loadingTimer = setInterval(() => {
            this.loadingNUmber += 1;
          }, 1000);
        }

        // console.log(this.equipmentObj.historyHR.slice(this.equipmentObj.historyHR.length - 4), ">>>>Hw历史数据");
        this.$u.debounce(this.heartHirstPush, 2000);
      }
      /* CL推送心率带历史日期列表 */
      if (type == "dateRecordList") {
        if (!this.firstTimestamp) return;
        this.hrCurrent = 0;
        this.hrDateList = [];
        // if(['develop', 'trial'].includes(this.wxConfig)) {
        this.logrecord.warn("check历史数据", {
          type,
          hrList: this.equipmentObj.hrList.length,
          hrList: this.equipmentObj.hrList.slice(
            this.equipmentObj.hrList.length - 5
          ),
          firstTimestamp: this.firstTimestamp,
        });
        // }
        this.equipmentObj.hrList.map((item) => {
          if (item.record >= this.firstTimestamp) {
            this.hrDateList.push(item);
          }
        });
        this.logrecord.warn("CL满足条件的条数", {
          hrDateListLength: this.hrDateList.length,
        });
        this.logrecord.warn("CL获取满足条件的历史数据", {
          type,
          hrDateList: this.hrDateList,
        });
        if (this.hrDateList.length) {
          this.heartRateHistoryUnderway = 1;
          this.heartRateArr = [];
          this.HRmeanArr = [];
          this.gethistoryHR();
          if (!this.loadingShow) {
            this.loadingShow = true;
            this.loadingTimer = setInterval(() => {
              this.loadingNUmber += 1;
            }, 1000);
          }
        }
      }
      /* 推送指定日期下的心率数据列表 */
      if (type === "heartRecordList") {
        this.equipmentObj.hrData.map((item) => {
          // this.heartRateArr.push(item.heart)
          this.changeHeartRate(item.heart, "history");
        });
        // if(['develop', 'trial'].includes(this.wxConfig)) {
        this.logrecord.warn("查新设备推送数据", {
          deviceHrData: this.equipmentObj.hrData,
        });
        this.logrecord.warn("具体心率数据", {
          hrCurrent: this.hrCurrent,
          heartRateArr: this.heartRateArr,
        });

        // }
        // 是否还存在未请求数据
        if (this.hrCurrent < this.hrDateList.length) {
          this.gethistoryHR();
        } else {
          this.loadingShow = false;
          clearInterval(this.loadingTimer);
          this.loadingTimer = null;
          this.heartRateHistoryUnderway = 0;
          this.logrecord.warn("进入判断结束", {
            heartRateArr: this.heartRateArr.length,
          });
          this.logrecord.warn("获取Cl历史数据结束", {
            heartRateArrLength: this.heartRateArr.length,
            loadingNUmber: this.loadingNUmber,
          });
          this.loadingNUmber = 1;
        }
      }
      // type =>discover 代表发现设备回调 打断后边代码执行
      if (type == "discover") {
        this.discoverFun(eve);
      }
      this.bluetooth = this.equipmentObj.connected;
    },
    // 发现扫描到的心率臂带
    discoverFun(eve) {
      if (
        this.equipmentObj.devices.length &&
        this.devicesLength != eve.devices.length
      ) {
        this.devicesLength = eve.devices.length;
        getDeviceRecord().then((res) => {
          this.equipmentObj.devices.map((deItem, deIndex) => {
            res.data.map((resItem, resIndex) => {
              if (deItem.name == resItem.device_id) {
                deItem.deviceName = resItem.name;
              }
            });
          });
          this.deviceList = JSON.parse(
            JSON.stringify(this.equipmentObj.devices)
          );
          // 如果是自动连接心率逻辑 进入判断
          if (eve.is_auto) {
            this.deviceList.forEach((item) => {
              if (item.name == this.armletInfo.name) {
                this._connect(item);
              }
            });
          }
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.kwhCor {
  color: #f00 !important;
}
.img-box {
  width: 100%;
  height: 750rpx;
  image {
    width: 100%;
    height: 100%;
  }
}
.btn {
  border-radius: 20rpx;
  color: #fff;
  padding: 7rpx 25rpx;
  background-color: #3c9cff;
  font-size: 26rpx;
}
.times-box {
  right: 82rpx;
  .tit {
    margin-right: 25rpx;
  }
}
.calories-box {
  left: 85rpx;
  .tit {
    margin-left: 25rpx;
  }
}
.comon-abs {
  .val-box {
    color: #fff;
    font-size: 40rpx;
    font-weight: bold;
  }
  .tit {
    font-size: 20rpx;
    font-weight: 300;
    color: rgba(255, 255, 255, 0.9);
    margin-top: 32rpx;
  }
  width: 115rpx;
  height: 115rpx;
  position: absolute;
  top: 179rpx;
}
.col1 {
  background-color: #17c815;
}
.col2 {
  background-color: #87dc29;
}
.col3 {
  background-color: #fdcb2c;
}
.col4 {
  background-color: #fd9b1e;
}
.col5 {
  background-color: #ef5b9c;
}
.col6 {
  background-color: #f4551d;
}
.strengthSty {
  width: 160rpx;
  text-align: center;
  color: #fff;
  padding: 0 20rpx;
  font-size: 26rpx;
  border-radius: 10rpx;
  border: 4px solid #ccc;
  position: relative;
  .tips-box {
    width: 40rpx;
    height: 40rpx;
    position: absolute;
    top: -30rpx;
    left: -28rpx;
    image {
      width: 100%;
      height: 100%;
    }
  }
  .exercise-box {
    left: unset;
    right: -28rpx;
    width: 40rpx;
    height: 34rpx;
    // background-color: #fa6626;
    // border-radius: 50%;
    image {
      width: 100%;
      height: 100%;
    }
  }
}
.electric-quantity {
  .electric-num {
    font-weight: 400;
    color: #fff;
    font-size: 19rpx;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
  }
  position: absolute;
  right: 15rpx;
  top: -19rpx;
}
.btn-box {
  width: 50%;
}
.selectDeviceSty {
  border: 1px solid #6ac2f1;
  color: #6ac2f1 !important;
  background: #f2fbff !important;
}
.options-box {
  .icon-box {
    width: 80rpx;
    height: 80rpx;
    margin: 0 20rpx;
    image {
      width: 100%;
      height: 100%;
    }
  }
  position: absolute;
  top: -60rpx;
  left: 0;
  height: 100rpx;
  width: 100%;
  justify-content: center;
}
.posi-rel {
  position: relative;
}
.heartRate-box {
  .heartRateBg {
    .calories-tips {
      position: absolute;
      bottom: 100rpx;
      left: 50%;
      transform: translateX(-50%);
      color: #fff;
      font-size: 25rpx;
    }
    .distanceAndSpeed {
      top: 35rpx;
      padding: 0 90rpx;
    }
    .heart-num {
      .num-tit {
        font-size: 20rpx;
        font-weight: 300;
        color: rgba(255, 255, 255, 0.9);
      }
      .num-val {
        font-size: 64rpx;
        font-weight: bold;
      }
      position: absolute;
      left: 320rpx;
      top: 180rpx;
      color: #fff;
      width: 120rpx;
      height: 120rpx;
    }
    .heart-other {
      .other-item {
        .tit {
          text-align: center;
        }
        width: 33.33%;
      }
      .val-box {
        .unit {
          font-size: 20rpx;
          color: rgba(255, 255, 255, 0.9);
          margin-left: 5rpx;
        }
        marign-top: 12rpx;
        justify-content: center;
      }
      .tit {
        font-size: 26rpx;
      }
      position: absolute;
      bottom: 90rpx;
      left: 0;
      width: 100%;
      color: #fff;
    }
    position: relative;
    height: 610rpx;
  }
}
.deviceSty {
  .icon-success {
    width: 35rpx;
    height: 35rpx;
    position: absolute;
    right: -1px;
    bottom: -1px;
    z-index: 99;
  }
  .icon-state {
    width: 55rpx;
    height: 55rpx;
    position: absolute;
    top: -25rpx;
    left: 50%;
    transform: translateX(-50%);
    z-index: 99;
  }
  width: 35%;
  height: 90rpx;
  border-radius: 15rpx;
  background-color: #f8f8f8;
  color: #999999;
  font-size: 26rpx;
  position: relative;
  text {
    margin-top: 10rpx;
  }
}
</style>
