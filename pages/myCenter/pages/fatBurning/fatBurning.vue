<template>
  <page-meta
    :page-style="`overflow:${teachingVideoShow ? 'hidden' : 'visible'};`"
  ></page-meta>
  <view>
    <head-nav title="燃烧卡路里" bgColor="#fff" :goBack="true"></head-nav>
    <heart-rate-module
      ref="heartRateRef"
      @getMotionListFun="resetFun"
      @getSportsState="getSportsState"
      @setMetaChange="setMetaChange"
    ></heart-rate-module>
    <!-- 历史记录 -->
    <view class="record-box mar-t40 pad20">
      <view class="record-tit flex-row flex-a">
        <u-avatar :src="baseUrl + 'record.png'" size="30"></u-avatar>
        <view class="tit-txt">历史记录</view>
      </view>

      <!-- <view class="list-box mar-t40">
        <view
          class="li pad20 mar-b40"
          v-for="(item, index) in list"
          :key="index"
          @click="onSelectLi(item, index)"
        >
          <view class="li-tit flex-row flex-a">
            <view class="tit-l">
              <view class="tit-date">
                {{ item.time_name }}
              </view>
              <view class="tit-info flex-row flex-a ju-bt">
                <view class="calories info-width text-elpis">
                  {{ item.total_calories }}千卡
                </view>
                <view class="km info-width text-elpis">
                  {{ item.total_distance }}公里
                </view>
                <view class="info-width text-elpis">
                  {{ item.total_steps }}步
                </view>
                <view class="time info-width26 info-width text-elpis">
                  {{ item.total_length_time }}
                </view>
                <view class="times info-width14 info-width text-elpis">
                  {{ item.total_count }}次
                </view>
              </view>

              <view class="tit-info flex-row flex-a">
                <view class="mar-r20"> 燃脂{{ item.total_burn_fat }}克 </view>
                <view class="mar-r20 highlight" style="color: black">
                  有效燃脂{{ item.total_fa_burning }}分钟
                </view>
                <view class="mar-r20 highlight" style="color: black">
                  力量训练{{ item.total_power }}次
                </view>
              </view>
            </view>
            <view class="tit-r flex-row">
              <u-icon
                v-if="selectLiIndex !== index"
                name="arrow-down"
                size="20"
              ></u-icon>
              <u-icon
                v-if="selectLiIndex === index"
                name="arrow-up"
                size="20"
              ></u-icon>
            </view>
          </view>
          <view class="" v-if="selectLiIndex === index">
            <view
              class="li-subset flex-row flex-a ju-bt mar-t20"
              v-for="(subsetItem, subsetIndex) in childList"
              :key="subsetIndex"
              @click.stop="onSelectLiChild(subsetItem)"
            >
              <view class="subset-l flex">
                <view class="img-box flex">
                  <image :src="baseUrl + 'exercise.png'" mode=""></image>
                </view>
              </view>
              <view class="subset-r pad-l20">
                <view class="r-top flex-row flex-a ju-bt">
                  <view class="top-tit">
                    第{{ subsetItem.key }}次运动({{ subsetItem.type_text }})
                  </view>
                  <view class="top-date">
                    {{ subsetItem.createtime }}
                  </view>
                </view>
                <view class="r-info flex-row flex-a ju-bt">
                  <view class="info-km flex-row">
                    <view class="km-val">
                      {{ subsetItem.calories }}
                    </view>
                    <view class="km-tit"> 千卡 </view>
                  </view>
                  <view class="info-time">
                    {{ subsetItem.length_time }}
                  </view>
                  <view class="info-Calories">
                    {{ (subsetItem.distance / 1000).toFixed(2) }}公里
                  </view>
                  <view class=" "> {{ subsetItem.steps || 0 }}步 </view>
                  <view class=""> 燃脂{{ subsetItem.burn_fat || 0 }}克 </view>
                </view>
                <u-line margin="25rpx  0 "></u-line>
              </view>
            </view>
          </view>
        </view>
      </view> -->

      <u-empty mode="list" text="暂无历史数据..."></u-empty>
    </view>
  </view>
</template>

<script>
import { baseUrl } from "@/utils/baseUrl.js";
/* 心率表模块组件 */
import heartRateModule from "@/components/heartRateModule/heartRateModule.vue";
import {
  getMotionList,
  exerciseChartData,
  exerciseDateChild,
} from "@/api/myCenter.js";
export default {
  components: {
    heartRateModule,
  },
  data() {
    return {
      baseUrl: baseUrl,
      /* 记录列表 */
      list: [],

      /* 选中列表下标 */
      selectLiIndex: "",
      backStatus: "", // 点击返回按钮时 获取页面运行状态
      platform: "", // 设备状态
      current: 1,
      childList: [],
      teachingVideoShow: false,
    };
  },
  onLoad() {
    /* 获取心率组件强度列表 */
    this.$refs.heartRateRef.getIntensityListFun("fatBurning");
    /* 初始化组件音频实例 */
    this.$refs.heartRateRef.createInnerAudioFun();
  },
  onShow() {
    this.$nextTick(() => {
      this.$refs.heartRateRef.onShowChange(false);
    });
    this.current = 1;
    this.list = [];
    /* 获取运动记录 */
    this.getMotionListFun();
    this.platform = uni.getSystemInfoSync().platform;
    if (this.platform === "ios") {
      this.$refs.heartRateRef.recordIosHideDate(this.platform);
    }
    /* 获取是否授权离开时获取定位 达到小程序离开不被杀死 */
    this.$refs.heartRateRef.getAuthorizeUserLocationBackground();
    /* 保持屏幕常亮 */
    uni.setKeepScreenOn({
      keepScreenOn: true,
      fail() {
        uni.setKeepScreenOn({
          keepScreenOn: true,
        });
      },
    });
  },
  onHide() {
    this.$nextTick(() => {
      this.$refs.heartRateRef.onShowChange(true);
    });
  },
  onReachBottom() {
    this.current++;
    this.getMotionListFun();
  },
  onUnload() {
    /* 页面卸载断开socket */
    this.$refs.heartRateRef.onUnloadFun();
    if (this.backStatus == 1 || this.backStatus == 2) {
      /* 调用组件更改按钮状态方法 */
      this.$refs.heartRateRef.onBtn(3, "back");
    }
    uni.removeStorageSync("scope.bluetooth");
  },
  watch: {
    backStatus: {
      handler(newV, oldV) {
        if (newV == 1 || newV == 2) {
          wx.enableAlertBeforeUnload({
            message: "运动中，提前退出吗？",
          });
        } else {
          wx.disableAlertBeforeUnload();
        }
      },
      immediate: true,
      deep: true,
    },
  },
  methods: {
    setMetaChange() {
      this.teachingVideoShow = !this.teachingVideoShow;
    },
    /* 获取组件 开始按钮状态 */
    getSportsState(e) {
      /*
				是否正在 运动状态
				1 || 2 提示弹框
			*/
      this.backStatus = e;
    },
    /* 选中li child node 跳转查看图表页 */
    onSelectLiChild(e) {
      exerciseChartData({
        id: e.id,
      }).then((res) => {
        uni.navigateTo({
          url: `/pages/admin/pages/sportsTeacherUser/heartRate/heartRate?data=${encodeURIComponent(
            JSON.stringify({
              aerobic_cylinder: res.data.aerobic_cylinder,
              aerobic_diagram: res.data.aerobic_diagram,
              ...res.data.data,
            })
          )}`,
        });
      });
    },
    /* 选中 展开收起li */
    onSelectLi(item, index) {
      if (index === this.selectLiIndex) {
        this.selectLiIndex = "";
        return;
      } else {
        this.getChildList(item.c_time);
      }
      this.selectLiIndex = index;
    },
    /* 获取月份下的child列表 */
    getChildList(c_time) {
      exerciseDateChild({ c_time }).then((res) => {
        this.childList = res.data;
      });
    },
    resetFun() {
      this.current = 1;
      this.list = [];
      this.selectLiIndex = "";
      this.getMotionListFun();
    },
    /* 获取运动记录 */
    getMotionListFun() {
      getMotionList({
        page: this.current,
        list_rows: 10,
      }).then((res) => {
        this.list = [...this.list, ...res.data.data];
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.record-box {
  .list-box {
    .li {
      .li-subset {
        .subset-l {
          width: 10%;
          height: 100rpx;
          .img-box {
            width: 70rpx;
            height: 70rpx;
            background-color: #fa6626;
            border-radius: 50%;
            image {
              width: 80%;
              height: 80%;
            }
          }
        }
        .subset-r {
          .r-info {
            font-size: 24rpx;
            color: #181818;
            margin-top: 10rpx;
            .info-km {
              .km-val {
                font-size: 30rpx;
                font-weight: bold;
              }
              .km-tit {
                margin-bottom: 3rpx;
                margin-left: 5rpx;
              }
              align-items: flex-end;
            }
          }

          .r-top {
            font-size: 24rpx;
            color: #656565;
          }
          width: 90%;
          height: 100rpx;
        }
      }
      .li-tit {
        .tit-l {
          .tit-date {
            font-size: 30rpx;
            font-weight: bold;
          }
          .tit-info {
            font-size: 24rpx;
            margin-top: 15rpx;
            color: #a6a6a6;
            .info-width {
              width: 20%;
            }
            .info-width14 {
              width: 14%;
            }
            .info-width26 {
              width: 26%;
            }
          }
          width: 93%;
        }
        .tit-r {
          width: 7%;
        }
      }
      border-radius: 20rpx;
      box-shadow: 1px 1px 10rpx 5rpx #ccc;
    }
    .li-date {
      color: #999999;
      font-size: 24rpx;
    }

    .li-time {
      color: #999999;
      font-size: 24rpx;
      margin: 10rpx 0;
    }
  }
  .record-tit {
    .tit-txt {
      margin-left: 10rpx;
    }
    background-color: #fafafa;
    font-size: 35rpx;
  }
}
</style>
