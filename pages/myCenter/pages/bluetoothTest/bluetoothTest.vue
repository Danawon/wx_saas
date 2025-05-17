<template>
  <view>
    <head-nav
      title="心肺运动测试"
      bgColor="#F9F9F9"
      :goBack="timerState != 2"
    ></head-nav>

    <view class="content">
      <view
        class="head-tab flex-row ju-bt padlr40 padtb20"
        :style="{
          background:
            currentTabs == 1
              ? 'url(' + baseUrl + 'test2.png)'
              : 'url(' + baseUrl + 'test1.png)',
          'background-size': '100% 100% ',
        }"
      >
        <view class="tab tab1 flex" @click="changeTbs(1)">
          <!-- 跑步机 -->
        </view>
        <view class="tab tab2 flex" @click="changeTbs(2)">
          <!-- 功率车 -->
        </view>
      </view>
      <!-- 设备模块 -->
      <view class="tabs-device flex-row ju-ar pad-b40">
        <!-- 设备扫描 -->
        <view
          class="scan deviceSty flex"
          :class="{ selectDeviceSty: deviceState }"
          @click="scanQR"
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
          <text>设备扫码</text>
        </view>
        <!-- 历史记录 -->
        <view class="">
          <view class="historyRecord flex-col flex-a flex-j" @click="onHistory">
            <view class="">历史</view>
            <view class="">记录</view>
          </view>
        </view>
        <!-- 蓝牙链接 -->
        <view
          class="bluetooth deviceSty flex"
          :class="{ selectDeviceSty: bluetooth }"
          @click="scanningLinks"
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
          <text>蓝牙连接</text>
        </view>
      </view>
      <!-- 心率模块 -->
      <view class="heartRate-box pad-t20">
        <view
          class="heartRateBg"
          :style="{
            background: 'url(' + baseUrl + 'heartBg.png)',
            'background-size': '100% 100% ',
          }"
        >
          <view class="heart-num flex-col flex-a">
            <view class="num-val">
              <text v-if="currentTabs == 1">
                <!-- {{
									bluetooth ? equipmentObj.heartrate : deviceData.heart_rate? deviceData.heart_rate: 0
								}} -->
                {{ equipmentObj.heartrate || deviceData.heart_rate || 0 }}
              </text>
              <text v-if="currentTabs == 2">
                {{
                  bluetooth
                    ? equipmentObj.heartrate
                    : tcpData.heartRate
                    ? tcpData.heartRate
                    : 0
                }}
              </text>
            </view>
            <view class="num-tit mar-t20"> 心率监测 </view>
          </view>
          <view
            class="heart-other flex-row ju-bt"
            :style="{ bottom: currentTabs == 2 ? '50rpx' : '80rpx' }"
          >
            <view class="other-l other flex-col flex-a">
              <view class="l-tit">
                {{ currentTabs == 1 ? "剩余距离" : "阻力监测" }}
              </view>
              <view class="l-val flex-row flex-a">
                <view class="val-num">
                  <!-- 距离设置 米数 -->
                  <text v-if="currentTabs == 1">
                    {{ deviceData.surplusDistance || 1609 }}
                  </text>
                  <!-- 阻力等级 -->
                  <text v-if="currentTabs == 2">
                    {{ tcpData.resistanceClass || 0 }}
                  </text>
                </view>
                <view class="unit" v-if="currentTabs == 1"> 米 </view>
              </view>
            </view>
            <view class="flex-col flex-a" v-if="currentTabs == 2">
              <view class="r-tit">功率监测</view>
              <view class="r-val val-num">
                {{ tcpData.power || 0 }}
              </view>
            </view>
            <view class="other-r other flex-col flex-a">
              <view class="r-tit">
                {{ currentTabs == 1 ? "速度" : "转速监测" }}
              </view>
              <view class="r-val flex-row flex-a">
                <view class="val-num">
                  <text v-if="currentTabs == 1">
                    {{ realTimeSpeed || 0 }}
                  </text>
                  <!-- 转速检测 -->
                  <text v-if="currentTabs == 2">
                    {{ tcpData.cadence || 0 }}
                  </text>
                </view>
                <view class="unit" v-if="currentTabs == 1"> km </view>
              </view>
            </view>
          </view>
        </view>
      </view>
      <!-- 设备数据统计模块 -->
      <view class="operation-box mar-t20">
        <view class="head-bg"></view>
        <view class="operation-content padlr20 pad-b20">
          <!-- 操作按钮模块 -->
          <view class="switch-btn flex tips-btn">
            <view
              class="switch-btn switch-btn1 switch-btn-box"
              v-if="timerState == 1"
              @click="clickStartTimewait('tips')"
              @longtap="finishTest"
              @touchend="touchendFun"
            >
              <image :src="baseUrl + 'testSwitch1.png'" mode=""></image>
            </view>
            <view
              class="switch-btn switch-btn2"
              v-if="timerState == 2"
              @longtap="finishTest"
              @touchend="touchendFun"
              @click="onOverTips"
            >
              <image :src="baseUrl + 'testSwitch2.gif'" mode=""></image>
            </view>
            <view class="over-tips" v-if="overTipsShow"> 长按3秒结束测试 </view>
            <view class="over-tips-icon" v-if="overTipsShow">
              <u-icon name="integral-fill" size="28" color="#313131"></u-icon>
            </view>
          </view>
          <view class="flex" :class="{ 'mar-b40': currentTabs == 2 }">
            <view class="icon-box flex mar-r20">
              <view class="">
                <view class="section-txt font-24">
                  {{ scopeArr[currentPlan].tit || "" }}
                </view>
                <view class="font-24 mar-r10"> 心率范围 </view>
              </view>

              <u--image
                :showLoading="true"
                :src="baseUrl + 'arrows-icon.png'"
                width="25px"
                height="13px"
              ></u--image>
            </view>
            <!-- 运动强度 -->
            <view
              v-if="currentTabs == 2"
              class="strengthSty flex-col flex-a padlr20 padtb10"
              :style="{
                'background-color':
                  equipmentObj.heartrate >= scopeArr[currentPlan].minHeart &&
                  equipmentObj.heartrate <= scopeArr[currentPlan].maxHeart
                    ? colArr[currentPlan]
                    : '#ccc',
              }"
            >
              <view class="mar-t5 font-32">
                {{ scopeArr[currentPlan].scope || "" }}
              </view>
            </view>
            <!-- 倒计时提示 -->
            <view class="time-tips font-24 pad-l20">
              倒计时：<span class="tips-num font-28 mar-r5">{{
                countDownNum
              }}</span
              >秒
            </view>
          </view>
          <!-- 跑步机模块数据 -->
          <view class="treadmill-box mar-t40">
            <view v-for="(item, index) in testList" :key="index">
              <view
                class="li mar-b40 flex ju-bt"
                v-if="index || currentTabs == 1"
              >
                <view class="li-l flex-row flex-a">
                  <view
                    class="serial-sty flex"
                    :class="{ finishSty1: item.iconState }"
                    v-if="currentTabs == 2 || index > 0"
                  >
                    {{ item.serial }}
                  </view>
                  <view
                    class="li-tit mar-l20 flex-col flex-a"
                    :class="[
                      { finishTxt1: item.iconState == 2 },
                      { finishTxt2: item.iconState == 1 },
                    ]"
                  >
                    <view class="font-20">
                      {{ item.tit }}
                    </view>
                    <view class="sectionSty" v-if="currentTabs == 2">
                      {{ item.section }}
                    </view>
                  </view>
                </view>
                <view class="li-r flex-row flex-a">
                  <!-- 心率数据  -->
                  <view
                    class="r-info flex-row flex-a mar-r40"
                    v-if="currentTabs == 2"
                  >
                    <view class="info-lable flex info-lable2">
                      {{ item.lableOxygen }}
                    </view>
                    <view class="info-val flex-row flex-a ju-bt">
                      <u--input
                        border="none"
                        inputAlign="center"
                        color="#FF7C3C"
                        :customStyle="{
                          width: '95rpx',
                          height: '55rpx',
                          padding: '0 10rpx',
                        }"
                        v-model="item.oxygenVal"
                      >
                      </u--input>
                    </view>
                  </view>
                  <!-- 状态图标 -->
                  <view class="icon-box mar-r20">
                    <!-- 未完成图标 -->
                    <u-avatar
                      :src="`${baseUrl}${testStatusIcons[item.iconState]}`"
                      size="36rpx"
                    ></u-avatar>
                  </view>
                  <view
                    class="r-info flex-row flex-a"
                    v-if="currentTabs == 2 || index >= 1"
                  >
                    <view
                      class="info-lable flex"
                      :class="{ 'w-100': currentTabs == 2 }"
                    >
                      {{ item.lable }}
                    </view>
                    <view class="info-val flex-row flex-a ju-bt">
                      <u--input
                        border="none"
                        inputAlign="center"
                        color="#FF7C3C"
                        :customStyle="{
                          width: '95rpx',
                          height: '55rpx',
                          padding: '0 10rpx',
                        }"
                        v-model="item.val"
                      ></u--input>
                      <view class="val-unit mar-r20" v-if="currentTabs == 1">
                        {{ item.unit }}
                      </view>
                    </view>
                  </view>
                </view>
              </view>
            </view>
          </view>

          <!-- 单位提示 -->

          <view class="unit-tips flex">
            摄氧量（ml/kg/min），心率（bpm），转速（rpm），功率（w）
          </view>
          <!-- 注意事项 -->
          <view class="attention-box mar-t20">
            <view class="attention-tit flex-row flex-a">
              <u-avatar
                :src="baseUrl + 'attentionIcon.png'"
                size="34rpx"
              ></u-avatar>
              <view class="attention-txt mar-l20"> 注意事项 </view>
            </view>
            <view class="attention-info mar-t20">
              <view class="">
                <view class="">测试前：</view>
                <view class="">
                  1、需做问卷调查，对于有运动风险人群禁止测试。
                </view>
                <view class="">
                  2、医生要求不能做中高强度运动的人群，不能测试。
                </view>
                <view class=""> 3、自我感觉身体不佳的人群，不能测试。 </view>
                <view class="mar-t20"> 测试中： </view>
                <view class="">
                  1、出现胸疼，头昏等疼痛情况，要停止测试。
                </view>
                <view class=""> 2、受测者要求停车，则必须停止。 </view>
                <view class="">
                  3、运动中出现心率，血压，血氧饱和度和心电图异常时，要立刻停止测试。
                </view>
                <view class="mar-t20"> 测试后： </view>
                <view class="">
                  1、测试结束后不要立刻停止运动，低强度持续运动冷身3分钟。
                </view>
                <view class="">
                  2、测试结束后，休息5-10分钟，无身体异常，方能离开测试场地。
                </view>

                <view class="mar-t20"> 测试步骤： </view>

                <view class="">
                  <view class=""> 1.先扫码进行功率车绑定，再连接心率设备 </view>
                  <view class="">
                    2.点击开始按钮，根据系统语音提示进行测试；
                  </view>
                  <view class="">
                    3.每一个阶段，通过改变脚踏转速，来控制心率的范围。阻力大小会根据转速的大小自动调节；
                  </view>
                  <view class="">
                    4.第二阶段结束后，系统会根据测试者用力感受来选择继续测试或终止测试；当终止测试后，会自动弹出测试结果；
                  </view>
                  <view class="">
                    5.测试者能坚持到第四阶段，会自动弹出测试结果。测试阶段完成越往后，测试结果误差越小；
                  </view>
                </view>
                <view class="mar-t20"> 血压测试细则： </view>
                <view class="">
                  1.安静血压：需要连接上功率车后，并在测试页面点击开始之前的这段时间内，手动测试的血压值会记录在安静血压数据字段，多次测试，以最后一次的数据为准。
                </view>
                <view class="">
                  2.过程血压：4个阶段，每个阶段开始后120秒的时候，会自动测试血压，如果测试失败，可以手动测试，多次测试的血压，以最后一次的数据来记录。
                </view>
                <view class="">
                  3.结束血压：测试结束后，不要退出测试页面，在功率车处于连接状态下10分钟之内，手动测试的血压，都算作结束血压的数据，多次测试也是以最后一次数据为准。注意结束血压需在测试结束后10分钟之内测完，功率车断开连接后数据无法记录。
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>

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
    <u-toast ref="uToast"></u-toast>
    <u-modal :show="warmUpShow" title="热身结束提示" :showConfirmButton="false">
      <view class="slot-content">
        热身结束啦，心率达到当前测试步骤的心率区间就正式开始测试哦~
      </view>
    </u-modal>
    <u-modal :show="testResultShow" title="提示" :showConfirmButton="false">
      <view class="slot-content">
        第{{ currentPlan - 1 }}步测试结束啦，您的自我感受为？
      </view>
      <view class="" slot="confirmButton">
        <u-button
          text="还不觉得累，继续下一阶段!"
          @click="continueTest"
        ></u-button>
        <view class="mar-t10 flex font-30">
          ({{ autoTestDuration }}秒后自动开始下一阶段)
        </view>
        <view class="mar-t20"></view>
        <u-button
          type="primary"
          text="比较用力了，结束测试吧！"
          @click="terminateTest"
        ></u-button>
        <view class="mar-t20" v-if="currentPlan - 1 == 2">
          <view class="font-30"> 注意： </view>
          <view class="mar-t20 font-30 flex">
            (2个阶段强度较低，测试值误差会较大！)
          </view>
        </view>
      </view>
    </u-modal>
    <u-modal
      :show="fourStageShow"
      title="测试结束提示"
      :showConfirmButton="false"
    >
      <view class="flex flex-col">
        <view class="slot-content">
          {{ fourStageTxt }}
        </view>
        <view class="mar-t20"> 请完成血压测试后点击确认 </view>
      </view>
      <view class="mar-t20" slot="confirmButton">
        <u-button
          type="primary"
          text="已完成，点击查看报告"
          @click="
            () => {
              handleTestComplete();
              finishBloodPressureTest();
            }
          "
        ></u-button>
      </view>
    </u-modal>
  </view>
</template>

<script>
import { baseUrl } from "@/utils/baseUrl.js";
// 心率设备CLjs
import heartRateBelt from "@/common/heartRateBelt.js";
// 心率带设备2 HW js文件
import heartRateBelt2 from "@/common/heartRateBelt2.js";
// 引入modal组件
import modalTips from "@/components/modalTips/modalTips.vue";
import {
  ellipticalsIndex,
  getMaxOxygenUptake,
  getEllipticalsCalculation,
  getEllipticalsMaxCalculationUpdate,
  addDeviceRecord,
  getDeviceRecord,
  device_error_log,
  on_start_test,
  heart_rate_zones,
  send_blood_pressure_test,
  stop_heartrate_test,
  finish_blood_pressure_test,
} from "@/api/myCenter.js";
import { ws } from "@/common/ws.js";
import {
  authorizationBluetoothStatus,
  createInnerAudio,
  audioPlay,
  audioDestroy,
} from "@/common/common.js";
export default {
  components: {
    modalTips,
  },
  data() {
    return {
      baseUrl: baseUrl,
      // 当前选中
      currentTabs: 2,
      // 蓝牙链接状态
      bluetooth: false,
      // 设备数据
      equipmentObj: {},
      // 测试数据列表
      testList: [],
      testList1: [
        {
          serial: "",
          tit: "热身3分钟",
          val: "",
          unit: "",
          lable: "",
          iconState: 0, // 0 => 未完成 1 => 进行中 2 => 已完成
        },
        {
          serial: 1,
          tit: "计时快走",
          val: "",
          unit: "分钟",
          lable: "时间记录",
          iconState: 0,
        },
      ],
      testList2: [
        {
          serial: 0,
          tit: "血压值mmHg",
          section: "--/--",
          val: "",
          lable: "功率",
          lableOxygen: "摄氧量",
          oxygenVal: "",
          iconState: 0, // 0 => 未完成 1 => 进行中 2 => 已完成
        },
        {
          serial: 1,
          tit: "血压值mmHg",
          section: "--/--",
          val: "",
          lable: "功率",
          lableOxygen: "摄氧量",
          oxygenVal: "",
          iconState: 0, // 0 => 未完成 1 => 进行中 2 => 已完成
        },
        {
          serial: 2,
          tit: "血压值mmHg",
          section: "--/--",
          val: "",
          lable: "功率",
          lableOxygen: "摄氧量",
          oxygenVal: "",
          iconState: 0, // 0 => 未完成 1 => 进行中 2 => 已完成
        },
        {
          serial: 3,
          tit: "血压值mmHg",
          section: "--/--",
          val: "",
          lable: "功率",
          lableOxygen: "摄氧量",
          oxygenVal: "",
          iconState: 0, // 0 => 未完成 1 => 进行中 2 => 已完成
        },
        {
          serial: 4,
          tit: "血压值mmHg",
          section: "--/--",
          val: "",
          lable: "功率",
          lableOxygen: "摄氧量",
          oxygenVal: "",
          iconState: 0, // 0 => 未完成 1 => 进行中 2 => 已完成
        },
      ],
      // 设备id
      device_id: "",
      // 客户端id
      client_id: "",
      // 倒计时
      countDownNum: 0,
      // 计时状态 1 => 未开始 2 => 进行中
      timerState: 1,
      // 定时器容器
      timer: "",
      // 当前执行的计划
      currentPlan: 0,
      // tcp数据
      tcpData: {},
      // 跑步机设备数据
      deviceData: {
        totalDistance: 1609, // 总米数
        surplusDistance: 0, // 剩余米数 距离
        startDistAnce: 0, // 开始距离
      },
      // 设备链接状态
      deviceState: false,
      // 最大摄氧量
      // 运动时长
      exerciseDurationNum: 1,
      // 运动时长定时器
      exerciseDurationTimer: "",
      // 功率车测试是否点击确定
      powerCarConfirmState: false,
      // 运动结束心率
      endHeart: 0,
      // 心率列表
      heartRateArr: [],
      // 平均心率
      meanHeartRate: "",
      // 是否开始记录心率
      recordHeartState: false,
      // socket 是否链接
      wsConnectState: false,
      /* 避免重复链接 */
      linkNums: 1,
      /* 是否允许自动下一步 */
      autoNext: false,
      /* 设备列表 */
      deviceList: [],
      /* 跑步机平均速度数组 */
      avgSpeedArr: [],
      /* 实时速度 */
      realTimeSpeed: 0,
      /* 心率带电量 */
      kwhNum: 100,
      /* 长按计时工具 */
      longPressTimewait: "",
      /* 结束测试 提示 show */
      overTipsShow: false,
      /* 是否点击过开始运动按钮 */
      onBtnRecord: false,
      /* 是否允许显示风险showModal */
      riskShowModal: true,
      selectedScanDevice: "", // 绑定的设备类型
      devicesLength: 0, // 扫描到的数据条数
      // is_power_car2: 0, // 是否连接的功率车2
      powerArray: [], // 平均功率数组
      if_showToast: true, // 是否重新弹框 提示警告
      resetTest: 0, // 是否是未达标区间 重新测试
      armletInfo: "", // 已绑定的心率臂带信息
      warmUpShow: false, // 热身结束 modal show
      testResultShow: false, // 测试结果modal show
      autoTestDuration: 15,
      autoTestTimer: null,
      /* 状态图标 */
      testStatusIcons: [
        "errorIcon.png", // 未开始测试图标
        "icon2.gif", // 进行中图标
        "successIcon.png", // 测试完成图标
      ],
      colArr: ["#17c815", "#fdcb2c", "#fd9b1e", "#ef5b9c", "#f4551d"],
      /* 运动心率区间 */
      scopeArr: [],
      // 步骤提醒语音
      testSpeech: ["start_test", "stage1", "stage2", "stage3", "stage4"],
      logrecord: require("@/common/log.js"),
      wxConfig: "",
      fourStageShow: false,
      fourStageTxt: ``,
      testOverStatus: false,
      bloodPressureTestCompleted: false, // 血压测试是否完成
    };
  },
  watch: {
    equipmentObj: {
      handler(newV, oldV) {
        // timerState "---计时按钮状态");
        // bluetooth "---蓝牙链接状态");
        // deviceState "---设备链接状态");
        // currentTabs "---当前选中的设备");
        // (autoNext "----是否自动开始计划");
        if (
          this.timerState == 1 &&
          this.bluetooth &&
          this.deviceState &&
          this.currentTabs == 2
        ) {
          let gtVal =
            newV.heartrate >= this.testList[this.currentPlan].minHeart;
          let ltVal =
            newV.heartrate <= this.testList[this.currentPlan].maxHeart;
          if (gtVal && ltVal) {
            if (this.autoNext) {
              this.autoNext = false;
              this.logrecord.warn("power", {
                type: "进入满足预启动判断",
              });
              this.$u.debounce(() => this.clickStartTimewait("auto"), 1000);
              // if (!this.currentPlan) {
              // 	this.audioPlayFun(`start_test`);
              // }
            }
          }
        }

        /* => 2 设备测试中 */
        if (
          this.timerState == 2 &&
          this.bluetooth &&
          this.deviceState &&
          this.currentTabs == 2
        ) {
          if (this.currentPlan) {
            if (newV.heartrate < this.testList[this.currentPlan].minHeart) {
              this.showToastFun(0);
            } else if (
              newV.heartrate > this.testList[this.currentPlan].maxHeart
            ) {
              this.showToastFun(1);
            }
          }
        }
        if (
          this.testOverStatus &&
          newV.heartrate < Number(uni.getStorageSync("rhr")) * 1.1
        ) {
          this.testOverStatus = false;
          this.send_blood_pressure_test("heart");
        }
      },
      immediate: true,
      deep: true,
    },
    bluetooth(newV) {
      if (!newV) {
        this.autoConnect();
      }
    },
  },
  onShow() {
    uni.setKeepScreenOn({
      keepScreenOn: true,
      fail() {
        uni.setKeepScreenOn({
          keepScreenOn: true,
        });
      },
    });
  },
  onLoad(option) {
    // this.testResultShow = true;
    // this.autoTestDurationInterval();
    this.wxConfig = __wxConfig.envVersion;
    // 绑定的心率带类型
    this.selectedScanDevice = uni.getStorageSync("selectedScanDevice");
    if (this.selectedScanDevice === "CL") {
      heartRateBelt.init_fmanager();
    }
    // 自动连接心率臂带
    this.autoConnect();
    if (!uni.getStorageSync("token")) {
      uni.reLaunch({
        url: "/pages/login/login",
      });
      return;
    }
    this.getHeart_rate_zones();
    // 获取测试数据
    this.getCurrentData();
    /* 创建音频实例 */
    createInnerAudio();
    /* 播放音频 */
    this.audioPlayFun(`prepare`);
    this.connectWS();
  },
  onHide() {},
  onUnload() {
    if (this.wsConnectState || this.deviceState) {
      ws.stop(() => {
        this.deviceState = false;
        uni.removeStorageSync("deviceId");
      });
    }
    this.deviceState = false;
    /* 断开蓝牙链接 */
    this.disconnectWristband();
    clearInterval(this.exerciseDurationTimer);
    /* 销毁语音实例 */
    this.audioDestroyFun();
  },
  methods: {
    wsClose() {
      if (this.deviceState || this.wsConnectState) {
        ws.stop(() => {
          this.linkNums = 1;
          this.deviceState = false;
          uni.removeStorageSync("deviceId");
        });
      }
    },
    /* 继续测试 */
    continueTest() {
      this.testResultShow = false;
      /* 开启自动开始计划 */
      this.autoNext = true;
      this.autoTestDurationClear();
      console.log("继续测试");
    },
    /* 结束测试 */
    terminateTest() {
      this.testResultShow = false;
      this.getMaxCalculationFun();
      this.autoTestDurationClear();
    },
    autoTestDurationClear() {
      this.autoTestTimer && clearInterval(this.autoTestTimer);
      this.autoTestTimer = null;
      this.autoTestDuration = 15;
    },
    autoTestDurationInterval() {
      this.autoTestTimer = setInterval(() => {
        this.autoTestDuration -= 1;
        if (this.autoTestDuration < 1) {
          this.continueTest();
          this.autoTestDurationClear();
        }
      }, 1000);
    },
    // 自动连接心率带
    autoConnect() {
      this.armletInfo =
        uni.getStorageSync("armletInfo") &&
        JSON.parse(uni.getStorageSync("armletInfo"));
      if (this.selectedScanDevice && this.armletInfo) {
        // 扫描设备
        this.scanningLinks("auto");
      }
    },
    // 心率异常提示
    showToastFun(type) {
      if (this.if_showToast) {
        let toastType = type
          ? `高于${this.testList[this.currentPlan].maxHeart}`
          : `低于${this.testList[this.currentPlan].minHeart}`;
        this.$refs.uToast.show({
          type: "default",
          message: `您的心率已经${toastType},请保持心率到${
            this.testList[this.currentPlan].minHeart
          }-${this.testList[this.currentPlan].maxHeart}左右`,
          duration: 3000,
        });
        this.audioPlayFun("not_standard");
        this.if_showToast = false;
        setTimeout(() => {
          this.if_showToast = true;
        }, 5000);
      }
    },
    /* 语音播报 回调 */
    audioPlayFun(url) {
      if (uni.getStorageSync("voiceBroadcast")) {
        audioPlay(`${baseUrl}${url}.mp3`);
      }
    },
    /* 销毁音频实例 回调 停止播放 */
    audioDestroyFun() {
      audioDestroy();
    },
    /* 点击进行中测试图标 */
    onOverTips() {
      this.overTipsShow = true;
      setTimeout(() => {
        this.overTipsShow = false;
      }, 2000);
    },
    onstop_heartrate_test() {
      stop_heartrate_test({
        device_id: this.device_id,
      }).then((res) => {
        console.log(res, "--终止");
        this.logrecord.warn("测试终止接口", {
          type: "调用终止接口",
        });
      });
    },
    /* 长按结束测试 */
    finishTest() {
      /* 如果没点击过开始运动按钮 打断代码执行 */
      if (!this.onBtnRecord) {
        return;
      }
      let longPressSeconds = 1;
      this.longPressTimewait = setInterval(() => {
        longPressSeconds += 1;
        if (longPressSeconds >= 3) {
          /* 重置测试数据 */
          this.resetTestData();
          this.onstop_heartrate_test();
          this.logrecord.warn("测试终止", {
            type: "功率车长按终止",
          });
          uni.showModal({
            title: "测试终止",
            showCancel: false,
          });
        }
      }, 1000);
    },
    /* 重置测试数据 */
    resetTestData() {
      /* 是否点击过开始运动按钮 */
      this.onBtnRecord = false;
      /* 跑步机平均速度数组 */
      this.avgSpeedArr = [];
      /* 是否允许自动下一步 */
      this.autoNext = false;
      /* 是否开始记录心率 */
      this.recordHeartState = false;
      /* 平均心率 */
      this.meanHeartRate = 0;
      /* 重置运动时心率列表 */
      this.heartRateArr = [];
      /* 结束是心率 */
      this.endHeart = 0;
      /* 运动时长 */
      this.exerciseDurationNum = 0;
      // 设备数据重置
      this.equipmentObj = {};
      /* 重置按钮状态 */
      this.timerState = 1;
      /* 停止记录长按秒数 */
      clearInterval(this.longPressTimewait);
      /* change tabs 重置点击结束状态 */
      this.powerCarConfirmState = false;

      // if (this.deviceState) {
      // 	ws.stop(() => {
      // 		this.deviceState = false;
      // 	});
      // }
      if (this.bluetooth) {
        /* 断开蓝牙链接 */
        // this.disconnectWristband();
      }

      /* 重置当前进行中训练下标 */
      this.currentPlan = 0;
      /* 重置当前训练数据 */
      this.getCurrentData();
      /* 关闭运动时长定时器 跑步机 */
      clearInterval(this.exerciseDurationTimer);
      // this.deviceState = false;
      /* 重置跑步机剩余距离 */
      this.deviceData.surplusDistance = 0;
      /* 重置跑步机速度 */
      this.realTimeSpeed = 0;
      this.tcpData.cadence = 0;
      this.tcpData.power = 0;
      /* 重置功率车阻力监测 */
      this.tcpData.resistanceClass = 0;
      /* 重置倒计时定时器 */
      clearInterval(this.timer);
      /* 倒计时清0 */
      this.countDownNum = 0;
      /* 重置链接socket次数 */
      this.linkNums = 1;
      /* 重置设备开始米数 */
      this.deviceData.startDistAnce = 0;
      this.testList.forEach((item) => {
        item.iconState = 0;
      });
    },
    /* 长按结束 */
    touchendFun() {
      /* 停止记录长按秒数 */
      clearInterval(this.longPressTimewait);
    },

    /* 查看历史记录 */
    onHistory() {
      // 如果是第四阶段且未完成血压测试，提示用户
      if (this.currentPlan - 1 >= 4 && !this.bloodPressureTestCompleted) {
        uni.showToast({
          title: "请先完成血压测试",
          icon: "none",
        });
        return;
      }

      this.fourStageShow = false;
      uni.navigateTo({
        url: "/pages/myCenter/pages/testRecord/testRecord",
      });
    },
    // 通过功率车1获取摄氧量
    getEllipticalsCalculationFun() {
      this.changeIconState(2);
      // 当前计划步骤 + 1
      this.currentPlan += 1;
      /* 功率车功率总和 */
      let powerTotal = 0;
      this.powerArray.map((item) => {
        powerTotal += Number(item);
      });
      // 平均功率
      let meanPower = 0;
      if (powerTotal && this.powerArray.length) {
        meanPower = powerTotal / this.powerArray.length;
      }
      // if(['develop', 'trial'].includes(this.wxConfig)) {
      this.logrecord.warn("power", {
        type: "进入power 请求接口",
        powerArray: this.powerArray,
        powerArrayLength: this.powerArray.length,
        meanPower,
      });
      // }
      getEllipticalsCalculation({
        step: this.currentPlan - 1, // 步骤
        avg_heart_rate: this.meanHeartRate, // 平均心率
        // deviceType: this.is_power_car2, // 设备类型
        power: meanPower,
      }).then((res) => {
        // if(['develop', 'trial'].includes(this.wxConfig)) {
        this.logrecord.warn("power", {
          type: "进入power 返回结果",
        });
        this.logrecord.debug("power", {
          type: "进入power 返回结果22",
        });
        // }
        if (this.currentPlan == 2) {
          this.autoNext = true;
        }

        /* 获取测试摄氧量 */
        this.testList[this.currentPlan - 1].oxygenVal = res.data.oxygen_uptake;
        /* 获取功率 */
        this.testList[this.currentPlan - 1].val = res.data.power;
        // this.testList[this.currentPlan - 1].section = `${res.data.systolic_pressure || '--'}/${res.data.diastolic_pressure  || '--'}`
        // 清空心率
        this.heartRateArr = [];
        // 重置功率
        this.powerArray = [];
        if (
          this.currentPlan - 1 >= 2 &&
          this.currentPlan < this.testList.length
        ) {
          this.testResultShow = true;
          this.autoTestDurationInterval();
        }
        if (this.currentPlan >= this.testList.length) {
          this.getMaxCalculationFun();
        }
      });
    },
    // 获取心率测试结果
    getMaxCalculationFun() {
      this.logrecord.warn("power", {
        type: "进入请求接口层面",
        key: "1001",
      });
      getEllipticalsMaxCalculationUpdate({
        step: this.currentPlan - 1,
      }).then((res) => {
        this.logrecord.warn("power", {
          type: "进入获取心率测试结果",
          currentPlan: this.currentPlan - 1,
        });
        if (this.currentPlan - 1 >= 4) {
          this.fourStageTxt = `测试完成，结果为${res.data.interval_name},超过${res.data.interval_exceed}人群.第4阶段血压测试是否完成?`;
          this.fourStageShow = true;
        } else {
          uni.showModal({
            title: `测试结束，最大摄氧量为${res.data.interval_vmax}, 测试结果：${res.data.interval_name},超过${res.data.interval_exceed}的人`,
            confirmText: "知道了",
            showCancel: false,
            success: (eve) => {
              this.logrecord.warn("over 测试结束", {
                type: "测试结束进入",
                currentPlan: this.currentPlan - 1,
              });
              // if(this.currentPlan - 1 == 2) {
              // 	uni.showModal({
              // 		title: "结束提示",
              // 		content: "此阶段运动强度较小，会导致测试结果误差较大！",
              // 		showCancel: false,
              // 	})
              // }
              // this.finishCallback();
            },
          });
        }
        this.testOverStatus = true;
        this.finishCallback();
      });
    },
    finishCallback() {
      this.powerCarConfirmState = true;
      /* 重置测试数据 */
      this.resetTestData();
    },
    // 获取跑步机运动最大摄氧量
    getMaxOxygenUptakeFun() {
      /* 平均速度 */
      let averageSpeed = 0;
      this.avgSpeedArr.forEach((item) => {
        averageSpeed += item;
      });
      getMaxOxygenUptake({
        heart_rate: this.bluetooth
          ? this.equipmentObj.heartrate
          : this.deviceData.heart_rate, // 心率
        length_time: this.exerciseDurationNum, // 时间 时长
        end_heart_rate: this.endHeart, // 结束心率
        avg_speed: averageSpeed / this.avgSpeedArr.length, // 平均速度
      }).then((res) => {
        /* 时长重置 */
        this.exerciseDurationNum = 1;
        uni.showModal({
          title: `运动结束啦 最大摄氧量是:${res.data.Vmax}, 用时：${
            this.testList[this.currentPlan].val
          },测试评分为：${res.data.standard.score}分，结果为：${
            res.data.standard.name
          },超过${res.data.standard.exceed}的人`,
          showCancel: false,
          success: () => {
            if (this.deviceState) {
              // ws.stop(() => {
              // 	this.deviceState = false;
              // });
            }
          },
        });
      });
    },
    /*  扫码链接数据 */
    scanQR() {
      /* 设备链接成功避免重复链接 */
      if (this.deviceState) {
        return;
      }
      console.log("进入扫码判断");
      /* 扫码 */
      uni.scanCode({
        success: (res) => {
          let resultType = res.result.split("#")[0].split("=")[1];
          if (this.currentTabs == 1 && resultType != "treadmill") {
            uni.showModal({
              title: "您当前所在是跑步机测试，请扫描跑步机设备二维码哦~",
              showCancel: false,
            });
            return;
          } else if (
            this.currentTabs == 2 &&
            resultType != "ellipticals" &&
            resultType != "bt_ellipticals"
          ) {
            uni.showModal({
              title: "您当前所在是功率车测试，请扫描功率车设备二维码哦~",
              showCancel: false,
            });
            return;
          }
          // 当前连接的功率车 设备是否是 功率车2
          // if (resultType == 'bt_ellipticals') {
          // 	this.is_power_car2 = 1;
          // }

          // 设备id
          this.device_id = res.result.split("=")[1];
          uni.setStorageSync("deviceId", this.device_id);
          // 设备id 和 客户id存在 加入分组
          // this.client_id &&
          if (this.device_id && this.linkNums <= 1) {
            this.ellipticalsIndexFun();
            this.linkNums += 1;
          }
        },
        fail: (err) => {},
      });
    },
    // 连接WS
    connectWS() {
      if (this.wsConnectState) return;
      uni.showLoading({
        title: "连接中...",
      });
      // 链接socket
      ws.socket(
        (eve) => {
          this.deviceState = false;
          this.linkNums = 1;
          uni.showLoading({
            title: "重新连接中...",
          });
        },
        () => {
          console.log("连接成功");
          uni.hideLoading();
        },
        this.wsMessageFun
      );
    },
    // 获取当前选中设备类型 获取 处理数据
    getCurrentData() {
      // 1 => 跑步机 2 => 功率车
      if (this.currentTabs == 1) {
        this.testList = this.testList1;
      } else if (this.currentTabs == 2) {
        this.testList = this.testList2;
      }
    },
    /* 更改当前计划状态 */
    changeIconState(type) {
      this.testList[this.currentPlan].iconState = type;
    },
    // 结束计时
    clickEndTimewait() {
      clearInterval(this.timer);
      this.countDownNum = 0; // 倒计时 清零
      this.timerState = 1; // 更改倒计时运行状态
      // this.autoNext = false;
      if (this.currentTabs == 2) {
        /* 测试结束播报语音 */
        if (!this.currentPlan) {
          // this.audioPlayFun(`over`);
          this.changeIconState(2);
        }
        /* 当前计划 == 1 允许功率车达到指定心率 开始下一步运动 */
        if (this.currentPlan) {
          /* 获取功率车最大摄氧量 */
          this.powerFun(this.currentPlan);
          /* 结束计时 关闭心率带 记录心率 */
          this.recordHeartState = false;
        }
      }
      // 更改计划状态
      if (!this.currentPlan) {
        this.autoNext = true;
        this.currentPlan += 1;
      }
    },
    // 开始计时
    clickStartTimewait(onType) {
      // 是否链接设备
      if (!this.deviceState) {
        uni.showModal({
          title: "请扫码链接设备后开始哦~",
          showCancel: false,
        });
        return;
      }
      /* 判断功率车测试是否点击确定获取结果 */
      if (
        this.powerCarConfirmState ||
        this.currentPlan >= this.testList.length
      ) {
        uni.showModal({
          title: "训练计划已结束!",
          showCancel: false,
        });
        return;
      }
      /* 逻辑调整 暂时 hide */
      if (!this.bluetooth) {
        uni.showModal({
          title: "请链接心率带后点击开始",
          showCancel: false,
        });
        return;
      }
      /* 如果 点击过开始运动按钮就进入判断条件 */
      if (this.onBtnRecord && onType == "tips") {
        /* 显示 强制终止运动提示 */
        this.onOverTips();
      }

      /* 功率车判断 */
      if (this.currentTabs == 2) {
        if (this.currentPlan >= 1 && onType != "auto") {
          return;
        }
        this.logrecord.warn("power", {
          type: "进入预启动判断",
        });
        this.$u.throttle(this.on_start_test_fun, 1500);
        // this.on_start_test_fun();
        return;
      }
      /* 判断是否启动跑步机 */
      if (this.currentTabs == 1) {
        /* 判断tcp是否链接成功 */
        if (this.currentPlan != 0 && this.tcpData.status == undefined) {
          uni.showModal({
            title: "当前设备链接失败请重新扫码链接！",
            showCancel: false,
          });
          this.deviceState = false;
          return;
        }
        /* 状态 == 0 代表设备 待机中 */
        if (this.tcpData.status == 0) {
          uni.showModal({
            title: "当前设备待机中，请启动设备后开始训练哦~",
            showCancel: false,
          });
          return;
        }
        /* 状态 == 3 代表设备 运行中 */
        if (
          this.tcpData.status == 3 &&
          this.testList[this.currentPlan].iconState == 0
        ) {
          /* 点击开始 记录跑步机当前起始米数 */
          this.deviceData.startDistAnce = this.tcpData.distance;
        }
        /* 判断当前计划不是热身 同时判断当前计划是未开始状态 */
        if (
          this.currentPlan != 0 &&
          this.testList[this.currentPlan].iconState == 0
        ) {
          /* 运动秒数计时 定时器 */
          this.exerciseDurationTimer = setInterval(() => {
            this.exerciseDurationNum += 1;
          }, 1000);
        }
        this.onStartChange();
      }
    },
    /* 心率区间 */
    getHeart_rate_zones() {
      let keyArr = ["热身", "一", "二", "三", "四"];
      heart_rate_zones().then(({ data }) => {
        data.map((item, index) => {
          this.testList2[index]["minHeart"] = item.front;
          this.testList2[index]["maxHeart"] = item.after;
          this.scopeArr.push({
            tit: `${index ? "第" : ""}${keyArr[index]}阶段`,
            scope: `${item.front}~${item.after}`,
            minHeart: item.front,
            maxHeart: item.after,
          });
        });
      });
    },
    onStartChange() {
      if (this.currentPlan) {
        /* 开始记录 心率带心率 */
        this.recordHeartState = true;
        // this.resetTest = 0;
      }
      // 当前计划 == 0 => 热身
      /* 
					resetTest == 1 是否是未达标 重新测试 进入判断
				 */
      if (!this.currentPlan || !this.resetTest) {
        this.countDownNum = 180;// 倒计时 秒数
        // this.countDownNum = 90; // 倒计时 秒数

      }
      this.logrecord.warn("power", {
        type: "进入传递步骤回调 1247",
      });
      if (this.currentPlan && !this.resetTest) {
        this.logrecord.warn("power", {
          type: "进入步骤传递 进入判断",
        });
        this.send_blood_pressure_test();
      }
      if (this.resetTest) this.resetTest = 0;
      this.timewaitTimer();
      this.timerState = 2; // 更改倒计时图标状态为运行中
      /* 点击开始运动按钮 修改 是否存在触发过开始按钮字段状态 */
      this.onBtnRecord = true;
      // 更改计划状态
      this.changeIconState(1);
    },
    /* 功率车启动 */
    on_start_test_fun() {
      on_start_test({
        device_id: this.device_id,
      }).then((res) => {
        this.audioPlayFun(`${this.testSpeech[this.currentPlan]}`);
        this.onStartChange();
        this.logrecord.warn("power", {
          type: "进入功率车启动",
        });
      });
    },
    // 计时定时器
    timewaitTimer() {
      if (typeof this.countDownNum == "number" && this.countDownNum > 0) {
        this.timer = setInterval(() => {
          if (this.countDownNum <= 0) {
            if (this.currentPlan == 0 && this.currentTabs == 1) {
              this.warmUpShow = true;
              setTimeout(() => {
                this.warmUpShow = false;
                // if (this.currentTabs == 1) {
                /* 开始计划 */
                this.clickStartTimewait("auto");
                // }
              }, 5000);
            }
            /* 结束倒计时回调 */
            this.clickEndTimewait();
          } else {
            this.countDownNum--;
          }
        }, 1000);
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
      /* 获取实时转速*/
      if (this.timerState == 2) {
        let speedNum = 0;
        if (this.tcpData.speed) {
          speedNum = this.tcpData.speed;
        } else {
          speedNum = 0;
        }
        this.avgSpeedArr.push(Number((speedNum * 0.1).toFixed(1)));
        this.realTimeSpeed = (speedNum * 0.1).toFixed(1);
      }
      /* 加入分组成功接收参数 */
      /* 判断是否结构接收tcp */
      /*  判断设备是运行状态  */

      if (
        this.tcpData.distance &&
        this.tcpData.status == 3 &&
        this.timerState == 2 &&
        this.deviceState &&
        this.currentPlan != 0
      ) {
        // 解构tcp数据
        this.deviceData = {
          ...this.deviceData,
          ...this.tcpData,
        };
        /* 获取当前运动时长 */
        let date = new Date(this.exerciseDurationNum * 1000);
        this.testList[this.currentPlan].val = `${date.getMinutes()}:${
          date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds()
        }`;
        /*
		   		总距离 -（即时距离 - 开始距离） <= 0  剩余米数 = 0 关闭倒计时状态
		   	*/
        if (
          this.deviceData.totalDistance -
            (this.deviceData.distance - this.deviceData.startDistAnce) <=
          0
        ) {
          /* 剩余距离清0 */
          this.deviceData.surplusDistance = 0;
          this.timerState = 1; // 关闭倒计时状态 更改

          /*
		   			 跑步机数据 判断运动米数清0 请求接口获取最大摄氧量
		   			 currentTabs == 1 跑步机判断 currentTabs == 2 功率车判断
		   		 */
          /* 关闭运动时长定时器 */
          clearInterval(this.exerciseDurationTimer);
          if (this.currentPlan == this.testList.length - 1) {
            // 更改计划状态
            this.changeIconState(2);
            this.endHeart = this.bluetooth ? this.equipmentObj.heartrate : 0;
            /* 获取最大摄氧量 */
            this.getMaxOxygenUptakeFun();
          }
        } else {
          /* 剩余距离 = 总距离 - 当前距离 */
          this.deviceData.surplusDistance =
            this.deviceData.totalDistance -
            (this.deviceData.distance - this.deviceData.startDistAnce);
        }
      }
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
      /* status == 1 = 设备运行中*/
      // if(['develop', 'trial'].includes(this.wxConfig)) {

      // }
      let condition_status =
        !this.testList[this.currentPlan].val &&
        this.countDownNum <= 0 &&
        this.testList[this.currentPlan].iconState == 1;
      // 当前计划不能超过测试步骤总长度 避免报错
      let length_status = index < this.testList.length;
      this.logrecord.warn("power", {
        type: "进入power",
        val: this.testList[this.currentPlan].val,
        countDownNum: this.countDownNum,
        iconState: this.testList[this.currentPlan].iconState,
        index: index,
        currentPlan: this.currentPlan,
        testList: this.testList,
        status: this.tcpData.status,
        condition_status,
        length_status,
      });
      // this.tcpData.status == 1
      // [1,2].includes(this.tcpData.status) &&
      if (condition_status && length_status) {
        this.logrecord.warn("power", {
          type: "进入power判断逻辑层",
        });
        // if (index < this.testList.length) {
        // if (!this.testList[this.currentPlan].val && this.countDownNum <= 0 && this.testList[this.currentPlan].iconState == 1) {
        /* 心率总和 */
        let heartTotal = 0;
        this.heartRateArr.map((item) => {
          heartTotal += item;
        });
        /* 平均心率 */
        this.meanHeartRate = heartTotal / this.heartRateArr.length;

        // if (this.is_power_car2) {
        let minHeart = this.testList[this.currentPlan].minHeart;
        let maxHeart = this.testList[this.currentPlan].maxHeart;

        /* 判断当前平均心率是否达标 */
        if (this.meanHeartRate < minHeart || this.meanHeartRate > maxHeart) {
          // if(['develop', 'trial'].includes(this.wxConfig)) {
          this.logrecord.warn("power", {
            type: "进入power心率不达标",
          });
          // }
          uni.showModal({
            title: "提示",
            content: "当前测试心率不达标，是否继续测试？",
            confirmText: "继续测试",
            cancelText: "结束测试",
            success: (eve) => {
              /* 点击确定 */
              if (eve.confirm) {
                // 重置功率记录
                this.powerArray = [];
                // 清空心率
                this.heartRateArr = [];
                // 增加60秒继续测试
                this.countDownNum = 60;
                /* 开启自动开始计划 */
                this.autoNext = true;
                this.resetTest = 1;
                this.logrecord.warn("power", {
                  type: "进入点击继续",
                  key: "1511",
                  currentPlan: this.currentPlan,
                });
              } else {
                /* 重置测试数据 */
                // this.finishCallback();
                this.logrecord.warn("power", {
                  type: "进入点击结束",
                  key: "1510",
                  currentPlan: this.currentPlan,
                });
                if (this.currentPlan > 1) {
                  this.logrecord.warn("power", {
                    type: "进入结束判断",
                    key: "1511",
                  });
                  this.getMaxCalculationFun();
                }
              }
            },
          });
        } else {
          // if(['develop', 'trial'].includes(this.wxConfig)) {
          this.logrecord.warn("power", {
            type: "进入power心率达标",
          });
          // }
          /* 通过功率车获取最大摄氧量 */
          this.getEllipticalsCalculationFun();
        }
      }
    },
    /* 发送血压测量指令 */
    send_blood_pressure_test(status) {
      send_blood_pressure_test({
        device_id: this.device_id,
        step: status ? "" : this.currentPlan,
        // step: "",
        uid: "",
      }).then((res) => {
        this.logrecord.warn("power", {
          type: "进入传递步骤回调 返回结果",
        });
      });
    },
    // 接收socket数据
    wsMessageFun(eve) {
      uni.hideLoading();
      this.wsConnectState = true;
      // var uint8_msg = new Uint8Array(eve.message); // 解析tcp数据
      // tcp 返回数据
      // this.tcpData = JSON.parse(decodeURIComponent(escape(String.fromCharCode(...uint8_msg))));
      let tcpDData = JSON.parse(eve);
      if (tcpDData.event == "heartLung") {
        this.tcpData = tcpDData;
      }
      // if(this.tcpData.client_id) {
      // 	this.client_id = this.tcpData.client_id ?? '';
      // }
      // console.log(tcpDData, "--tcpDData");
      console.log(this.tcpData, "--this.tcpData");
      // console.log(this.client_id, "--this.client_id");
      /* 收缩压 舒张压数据 */
      if (tcpDData.type == "ecg") {
        this.logrecord.info("section", {
          type: "收缩压 舒张压数据",
          step: tcpDData.step,
          tcpData: tcpDData,
        });
        this.testList[tcpDData.step].section = `${
          tcpDData.systolic_pressure || "--"
        }/${tcpDData.diastolic_pressure || "--"}`;
      }
      if (tcpDData.type == "cloneClient") {
        this.$u.debounce(() => this.wsClose(), 1000);
      }
      /* 运动风险监控 */
      if (this.tcpData.status == "warning_tips") {
        let _this = this;
        /* 打断重复显示modal */
        if (this.riskShowModal) {
          uni.showModal({
            title: "提示",
            content: `您当前的运动${this.tcpData.text}，是否继续运动？`,
            cancelText: "继续运动",
            confirmText: "结束运动",
            success(e) {
              _this.riskShowModal = true;
              if (e.confirm) {
                _this.resetTestData();
              }
            },
          });
        }
        this.riskShowModal = false;
      }
      // this.is_power_car2 &&
      if (this.tcpData.power) {
        this.logrecord.info("section", {
          type: "实时power数据",
          power: this.tcpData.power,
          tcpData: this.tcpData,
          timerState: this.timerState,
          currentTabs: this.currentTabs,
          tcPstatus: this.tcpData.status,
          currentPlan: this.currentPlan,
        });
      }
      if (
        this.timerState == 2 &&
        this.currentTabs == 2 &&
        this.tcpData.status &&
        this.currentPlan
      ) {
        // 记录功率数据
        if (this.tcpData.power) {
          this.powerArray.push(this.tcpData.power);
        }
      }
      if (this.currentTabs == 1) {
        this.treadmillFun();
      }
      // 设备id 和 客户id存在 加入分组
      // this.client_id &&
      if (this.device_id && this.linkNums <= 1) {
        this.ellipticalsIndexFun();
        this.linkNums += 1;
      }
    },
    // 椭圆机加入分组 跑步机
    ellipticalsIndexFun() {
      ellipticalsIndex({
        device_id: this.device_id,
        client_id: this.client_id,
      })
        .then((res) => {
          this.deviceState = true; // 加入分组代表链接设备成功
        })
        .catch((err) => {
          this.linkNums = 1;
          this.device_id = "";
        });
    },
    changeTbs(e) {
      if (this.timerState == 2) {
        uni.showModal({
          title: "当前正在测试中请勿切换！",
          showCancel: false,
        });
        return;
      }

      /* 重置测试数据 */
      this.resetTestData();
      /* 选中 tabs index */
      this.currentTabs = e;
      /* 获取测试数据 */
      this.getCurrentData();
    },
    /* 心率发生改变的回调 */
    changeHeartRate(e) {
      if (this.recordHeartState && e) {
        this.heartRateArr.push(e);
      }
    },
    // 关闭modal
    modalConfirm() {
      /* 断开蓝牙链接 */
      this.disconnectWristband();
    },
    // 断开连接蓝牙臂带设备
    disconnectWristband() {
      if (this.selectedScanDevice === "HW") {
        heartRateBelt2.closeBluetoothAdapter();
      } else if (this.selectedScanDevice === "CL") {
        wx.closeBluetoothAdapter();
        heartRateBelt._disconnect();
      }
      this.bluetooth = false;
    },
    // cloneData 赋值设备数据
    cloneFun(eve, txt, type) {
      if (type == "timeOut") {
        this.autoConnect();
        return;
      }
      if (type == "break") {
        /* 心率带断开 */
        this.bluetooth = false;
        this.equipmentObj.heartrate = 0;
        return;
      }
      if (type == "success") {
        /* 添加设备链接记录 */
        addDeviceRecord({
          // device_id: eve.device.name,
          device_id: eve.device ? eve.device.name : eve.name,
        }).then((res) => {});
      }
      // this.equipmentObj = {...eve};
      if (this.selectedScanDevice === "HW") {
        this.equipmentObj = {
          ...eve,
        };
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
      /* 电量发生改变 */
      if (type === "battery") {
        this.kwhNum = this.equipmentObj.battery.split("%")[0];
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
    // 链接设备
    _connect(item) {
      if (this.selectedScanDevice === "HW") {
        heartRateBelt2.createBLEConnectionFun(item);
      } else if (this.selectedScanDevice === "CL") {
        heartRateBelt._connect(item);
      }
    },
    // 扫描 链接设备
    scanningLinks(isAuto) {
      /* 判断是否授权使用蓝牙 */
      authorizationBluetoothStatus();
      if (this.bluetooth) {
        return;
      }
      if (!this.selectedScanDevice) {
        uni.showToast({
          title: "请去我的设备页面绑定设备！",
          icon: "none",
        });
        return;
      }
      this.devicesLength = 0;
      // if (!this.deviceState) {
      // 	uni.showToast({
      // 		title: '请连接设备后再连接蓝牙!',
      // 		icon: 'none'
      // 	});
      // 	return;
      // }
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
    // 处理测试完成
    handleTestComplete() {
      // 发送血压测试完成请求
      send_blood_pressure_test({
        device_id: this.device_id,
        step: "",
        uid: "",
      })
        .then((res) => {
          this.logrecord.warn("blood_pressure_test", {
            type: "血压测试完成",
          });

          // 设置血压测试完成状态
          this.bloodPressureTestCompleted = true;

          // 关闭弹窗
          this.fourStageShow = false;

          // 跳转到记录页面
          uni.navigateTo({
            url: "/pages/myCenter/pages/testRecord/testRecord",
          });
        })
        .catch((err) => {
          uni.showToast({
            title: "请确保血压测试完成",
            icon: "none",
          });
        });
    },
    // 血压测试完成
    finishBloodPressureTest() {
      finish_blood_pressure_test({
        device_id: this.device_id,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.strengthSty {
  width: 160rpx;
  text-align: center;
  color: #fff;
  font-size: 26rpx;
  border-radius: 10rpx;
  box-shadow: 0rpx 0rpx 5rpx 5rpx #ccc;
  position: relative;
  font-weight: bold;
}

.slot-content {
  text-align: center;
}
.tips-btn {
  position: relative;
  margin: 20rpx auto 40rpx;

  .over-tips {
    position: absolute;
    top: -60rpx;
    left: 50%;
    transform: translateX(-50%);
    width: 220rpx;
    font-size: 25rpx;
    background-color: #313131;
    border-radius: 5rpx;
    // padding: 5rpx 0rpx;
    text-align: center;
    color: #fff;
    z-index: 99;
    height: 45rpx;
    line-height: 45rpx;
  }

  .over-tips-icon {
    position: absolute;
    top: -54rpx;
    left: 50%;
    z-index: -1;
    transform: translateX(-50%);
  }
}

.kwhCor {
  color: #f00 !important;
}

.electric-quantity {
  .electric-num {
    font-weight: 400;
    color: #fff;
    // color: #f99;
    font-size: 19rpx;
    // margin-left: 10rpx;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
  }

  position: absolute;
  right: 15rpx;
  top: -19rpx;
}

.historyRecord {
  color: #fff;
  width: 110rpx;
  height: 80rpx;
  font-size: 24rpx;
  background-color: #69d36c;
  border-radius: 10rpx;
}

.unit-tips {
  font-weight: 400;
  color: #999999;
  font-size: 22rpx;
  line-height: 35rpx;
  // padding-left: 55rpx;
}

.sectionSty {
  color: #ff7c3c;
}

.attention-box {
  .attention-info {
    font-weight: 400;
    color: #999999;
    font-size: 26rpx;
    line-height: 45rpx;
    padding-left: 55rpx;
  }

  .attention-tit {
    .attention-txt {
      font-weight: 400;
      color: #333333;
      font-size: 34rpx;
    }
  }
}

.finishTxt2 {
  color: #ff7c3c !important;
}

.finishTxt1 {
  color: #333333 !important;
}

.finishSty1 {
  background: linear-gradient(180deg, #ff673b 0%, #ff9d3b 100%);
  color: #fff !important;
  box-shadow: 0rpx 0rpx 5rpx 10rpx #ffebe2;
}

.operation-box {
  .operation-content {
    .treadmill-box {
      .li-r {
        .r-info {
          .info-val {
            .val-unit {
              font-weight: 400;
              color: #999999;
              font-size: 22rpx;
            }
            .val-num {
              color: #ff7c3c;
              font-weight: 500;
              font-size: 28rpx;
              margin: 0 30rpx;
            }
            height: 55rpx;
          }

          .info-lable2 {
            width: 100rpx !important;
          }

          .info-lable {
            background-color: #ff7c3c;
            border-radius: 5rpx;
            color: #ffffff;
            font-size: 26rpx;
            width: 140rpx;
            height: 55rpx;
          }

          border-radius: 10rpx;
          border: 1px solid #ff7c3c;
          background-color: #fef4ef;
        }
      }

      .li-l {
        .li-tit {
          color: #999999;
          font-weight: 400;
          font-size: 26rpx;
        }

        .serial-sty {
          width: 40rpx;
          height: 40rpx;
          border-radius: 50%;
          font-weight: 500;
          color: #999999;
          font-size: 28rpx;
          background-color: #cdcdcd;
        }
      }
    }

    .time-tips {
      font-weight: 400;
      color: #333333;
      .tips-num {
        font-weight: bold;
      }
    }

    .switch-btn {
      width: 220rpx;
      height: 220rpx;

      image {
        width: 100%;
        height: 100%;
      }
    }

    .switch-btn-box {
      position: relative;

      .next-btn {
        position: absolute;
        right: -100rpx;
        bottom: 0;
        background-color: #5ac725;
        width: 100rpx;
        height: 45rpx;
        border-radius: 20rpx;
        color: #fff;
        text-align: center;
        line-height: 44rpx;
        font-size: 26rpx;
      }
    }
  }

  .head-bg {
    background: linear-gradient(
      180deg,
      #ffe7dc 0%,
      rgba(255, 255, 255, 0) 100%
    );
    border-radius: 30rpx 30rpx 0 0;
    height: 55rpx;
  }

  border-radius: 30rpx 30rpx 0 0;
  height: 400rpx;
}

.heartRate-box {
  .heartRateBg {
    .heart-num {
      .num-tit {
        font-size: 20rpx;
        font-weight: 300;
        color: rgba(255, 255, 255, 0.5);
      }

      .num-val {
        font-size: 64rpx;
        font-weight: bold;
      }

      position: absolute;
      left: 320rpx;
      top: 170rpx;
      color: #fff;
      width: 120rpx;
      height: 120rpx;
    }

    .heart-other {
      .r-val,
      .l-val {
        align-items: flex-end;
      }

      .l-tit,
      .r-tit {
        font-size: 24rpx;
        font-weight: 400;
      }

      .unit {
        font-size: 24rpx;
        font-weight: 300;
        color: rgba(255, 255, 255, 0.6);
        margin-bottom: 18rpx;
        margin-left: 6rpx;
      }

      .val-num {
        font-size: 60rpx;
        font-weight: bold;
        margin-top: 15rpx;
      }

      position: absolute;
      bottom: 80rpx;
      left: 0;
      width: 100%;
      padding: 0 60rpx;
      color: #fff;
    }

    position: relative;
    height: 610rpx;
  }

  background-color: #f9f9f9;
}

.tabs-device {
  .selectDeviceSty {
    border: 1px solid #6ac2f1;
    color: #6ac2f1 !important;
    background: #f2fbff !important;
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
}

.tabs-Device {
  background-color: #f99;
  border-radius: 48rpx 48rpx 0 0;
  margin-top: -45rpx;
  height: 100rpx;
}

.head-tab {
  border-radius: 60rpx 60rpx 0 0;
  background: #ffece2;
  height: 130rpx;
  background-repeat: no-repeat;

  .tab {
    color: #fff;
    height: 50rpx;
    width: 46%;
  }
}

.btn {
  border-radius: 20rpx;
  color: #fff;
  padding: 7rpx 25rpx;
  background-color: #3c9cff;
  font-size: 26rpx;
}

.tips-box {
  width: 100%;

  .tips-txt {
    width: 80%;
    font-weight: 300;
    color: #000000;
    font-size: 24rpx;
  }
}

.fot-btn {
  .btn-list {
    width: 80%;

    .select-btn {
      background-color: #fe5e10 !important;
      border: 1px solid #fe5e10 !important;
      color: #fff !important;
    }

    .btn-li {
      width: 30%;
      height: 80rpx;
      color: #999999;
      border: 1px solid #999999;
      background-color: #fff;
      font-weight: 400;
      font-size: 28rpx;
      border-radius: 40rpx;
    }
  }

  width: 100%;
}

.begin-box {
  .begin-txt {
    font-weight: 400;
    color: #999999;
    font-size: 32rpx;
  }

  .begin-ben {
    width: 350rpx;
    height: 350rpx;
    border-radius: 50%;
    background: linear-gradient(180deg, #fe5e10 0%, #ffc8ad 100%);
  }

  margin: 95rpx 0;
}

.val-box {
  .box-info {
    width: 60%;
    height: 100%;
  }

  width: 100%;
  height: 70rpx;
}

.btn-box {
  color: #fe5e10;
  border: 1px solid #fe5e10;
  height: 90rpx;
  border-radius: 10rpx;
}
</style>
