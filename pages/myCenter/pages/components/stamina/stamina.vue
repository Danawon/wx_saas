<template>
  <view>
    <view class="list-box">
      <view class="list-item" v-for="(item, index) in listData" :key="index">
        <view class="item-li">
          <view class="tit-box flex-row flex-a ju-bt martb40">
            <view class="tit-txt flex-row flex-a">
              <view class="">
                {{ item.tit.titTxt }}
              </view>
              <view class="pdfBtn mar-l20" v-if="index == 1">
                <navigator id="report" :url="navigatorUrl">
                  查看体测报告
                </navigator>
              </view>
              <view
                class="pdfBtn mar-l20"
                v-if="index == 1 && report_path"
                @click="handleCopyReport"
              >
                下载报告
              </view>
            </view>
            <view class="tit-score">{{ item.tit.num }}分</view>
          </view>
          <view class="flex-row flex-a li-itemBox ju-bt">
            <view
              v-for="(liItem, liIndex) in item.list"
              :key="liIndex"
              class="li-itemBox-item"
              :class="{
                item50: !liItem.arr && index,
                item100: !index || liItem.mode,
              }"
            >
              <view
                class="gather-box mar-t20 pad20 flex-r flex-a"
                v-if="liItem.arr"
              >
                <!-- 左侧信息 -->
                <view class="gather-l padtb10 flex-col ju-bt">
                  <view class="l-topBox flex-row felx-a">
                    <view class="top-icon l-icon">
                      <image :src="liItem.arr[0].icon" mode=""></image>
                    </view>
                    <view class="top-txt mar-l20">
                      {{ liItem.arr[0].tit }}
                    </view>
                  </view>
                  <view class="l-bomBox flex-row felx-a">
                    <view class="top-icon">
                      <image :src="liItem.arr[1].icon" mode=""></image>
                    </view>
                    <view class="top-txt mar-l20">
                      {{ liItem.arr[1].tit }}
                    </view>
                  </view>
                </view>
                <!-- 中间显示上传图片 -->
                <view class="gather-up" @click="previewFun(liItem.imgSrc)">
                  <u-image
                    radius="10rpx"
                    :showLoading="true"
                    :src="liItem.imgSrc"
                    width="100%"
                    height="180rpx"
                    mode="scaleToFill"
                  ></u-image>
                </view>
                <!-- 右边输入框 -->
                <view class="gather-r pad-r20 padtb15 flex-col ju-bt flex-a">
                  <view class="r-top flex-row flex-a select-sty ju-bt">
                    <!-- 状态1 -->
                    <text>
                      {{ liItem.arr[0].state }}
                    </text>
                  </view>
                  <view class="r-bom flex-row flex-a select-sty ju-bt">
                    <!-- 状态2 -->
                    <text>
                      {{ liItem.arr[1].state }}
                    </text>
                  </view>
                </view>
                <view class="showRemark flex-a" @click="onShowRemark(liItem)">
                  <text class="mar-r5">展开描述</text>
                  <u-icon
                    v-if="true"
                    name="arrow-up"
                    color="#808695"
                    size="10"
                  ></u-icon>
                  <u-icon
                    v-else
                    name="arrow-down"
                    color="#808695"
                    size="10"
                  ></u-icon>
                </view>
              </view>
              <view class="li-item mar-t20 pad20 flex-row ju-bt flex-a" v-else>
                <view class="li-l flex-row flex-a">
                  <view class="l-icon">
                    <image :src="liItem.icon" mode=""></image>
                  </view>
                  <view class="l-info flex-col ju-bt mar-l20">
                    <view class="info-tit">
                      {{ liItem.tit }}
                    </view>
                    <view class="info-num">
                      {{
                        liItem.info != null && liItem.info != undefined
                          ? liItem.info
                          : "--"
                      }}
                      <text class="unit-sty">{{ liItem.unit }}</text>
                    </view>
                  </view>
                </view>
                <view
                  class="gather-up"
                  v-if="liItem.mode"
                  @click="previewFun(liItem.imgSrc)"
                >
                  <u-image
                    radius="10rpx"
                    :showLoading="true"
                    :src="liItem.imgSrc"
                    width="100%"
                    height="180rpx"
                    mode="scaleToFill"
                  ></u-image>
                </view>
                <view class="li-r flex pad-r20">
                  {{ liItem.state }}
                </view>
                <view class="showRemark flex-a" @click="onShowRemark(liItem)">
                  <view class="mar-r5">
                    {{
                      selectRemarksIds.includes(liItem.id) ? "收起" : "展开"
                    }}描述
                  </view>
                  <u-icon
                    v-if="selectRemarksIds.includes(liItem.id)"
                    name="arrow-up"
                    color="#808695"
                    size="10"
                  ></u-icon>
                  <u-icon
                    v-else
                    name="arrow-down"
                    color="#808695"
                    size="10"
                  ></u-icon>
                </view>
              </view>
              <view
                v-if="selectRemarksIds.includes(liItem.id)"
                class="remark-txt pad20"
              >
                <!-- {{  }} -->
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
    <!-- area -->
    <view class="area-box pad20 mar-t20" v-if="desc">
      {{ desc }}
    </view>
  </view>
</template>

<script>
import { baseUrl } from "@/utils/baseUrl.js";
export default {
  data() {
    return {
      baseUrl: baseUrl,
      listData: [
        {
          tit: {
            titTxt: "心肺能力数据",
            num: "40分",
          },
          list: [
            {
              icon: `${baseUrl}oxygenation.png`,
              tit: "心肺耐力值",
              info: "",
              type: "bluetooth",
              state: "暂无",
              unit: "ml/kg/min",
              id: 1,
            },
            {
              icon: `${baseUrl}vitalCapacity.png`,
              tit: "肺活量",
              info: "",
              type: "vitalCapacity",
              state: "",
              unit: "ml",
              id: 2,
            },
          ],
        },
        {
          tit: {
            titTxt: "体成分及体态",
            num: "40分",
          },
          list: [
            {
              icon: `${baseUrl}stamina13.png`,
              tit: "身体年龄",
              info: "<=420 umol/L",
              type: "gaodi",
              imgSrc: "",
              id: 3,
              arr: [
                {
                  icon: `${baseUrl}gaoD.png`,
                  tit: "高低肩风险",
                  state: "",
                  id: 1,
                },
                {
                  icon: `${baseUrl}oXing.png`,
                  tit: "O型风险",
                  state: "",
                  id: 2,
                },
              ],
            },
            {
              icon: `${baseUrl}stamina13.png`,
              tit: "身体年龄",
              info: "<=420 umol/L",
              type: "gupen",
              imgSrc: "",
              id: 4,
              arr: [
                {
                  icon: `${baseUrl}stamina16.png`,
                  tit: "骨盆前倾",
                  state: "",
                  id: 3,
                },
                {
                  icon: `${baseUrl}stamina17.png`,
                  tit: "驼背风险",
                  state: "",
                  id: 4,
                },
              ],
            },
            {
              icon: `${baseUrl}stamina1.png`,
              tit: "体重",
              info: "",
              state: "1",
              unit: "KG",
              id: 5,
            },
            {
              icon: `${baseUrl}stamina2.png`,
              tit: "体脂",
              info: "",
              state: "",
              unit: "%",
              id: 6,
            },
            {
              icon: `${baseUrl}stamina3.png`,
              tit: "BMI",
              info: "",
              state: "",
              unit: "kg/㎡",
              id: 7,
            },
            {
              icon: `${baseUrl}yaoW.png`,
              tit: "腰围",
              info: "",
              state: "",
              unit: "CM",
              id: 8,
            },
            {
              icon: `${baseUrl}stamina5.png`,
              tit: "骨量",
              info: "",
              state: "",
              unit: "KG",
              id: 9,
            },

            {
              icon: `${baseUrl}yaoT.png`,
              tit: "腰臀比",
              info: "",
              state: "",
              unit: "",
              id: 10,
            },
            {
              icon: `${baseUrl}guG.png`,
              tit: "骨骼肌",
              info: "",
              state: "",
              unit: "KG",
              id: 11,
            },
            {
              icon: `${baseUrl}stamina7.png`,
              tit: "肌肉率",
              info: "",
              state: "",
              unit: "%",
              id: 12,
            },
            {
              icon: `${baseUrl}stamina8.png`,
              tit: "蛋白质",
              info: "",
              state: "",
              unit: "%",
              id: 13,
            },
            {
              icon: `${baseUrl}stamina9.png`,
              tit: "体水分",
              info: "",
              state: "",
              unit: "%",
              id: 14,
            },
            {
              icon: `${baseUrl}stamina10.png`,
              tit: "内脏脂肪",
              info: "",
              state: "",
              unit: "级",
              id: 15,
            },
            {
              icon: `${baseUrl}stamina11.png`,
              tit: "基础代谢",
              info: "",
              state: "",
              unit: "kcal",
              id: 16,
            },
            {
              icon: `${baseUrl}stamina12.png`,
              tit: "静息心率",
              info: "",
              state: "",
              unit: "BPM",
              id: 17,
            },
            {
              icon: `${baseUrl}stamina20.png`,
              tit: "左大臂维度",
              info: "",
              state: "",
              unit: "CM",
              id: 18,
            },
            {
              icon: `${baseUrl}stamina21.png`,
              tit: "右大臂维度",
              info: "",
              state: "",
              unit: "CM",
              id: 19,
            },
            {
              icon: `${baseUrl}stamina22.png`,
              tit: "左大腿维度",
              info: "",
              state: "",
              unit: "CM",
              id: 20,
            },
            {
              icon: `${baseUrl}stamina23.png`,
              tit: "右大腿维度",
              info: "",
              state: "",
              unit: "CM",
              id: 21,
            },
            {
              icon: `${baseUrl}zuoTuiW.png`,
              tit: "左小腿维度",
              info: "",
              state: "",
              unit: "CM",
              id: 22,
            },
            {
              icon: `${baseUrl}youW.png`,
              tit: "右小腿维度",
              info: "",
              state: "",
              unit: "CM",
              id: 23,
            },
          ],
        },

        {
          tit: {
            titTxt: "肌耐力数据",
            num: "20分",
          },
          list: [
            {
              icon: `${baseUrl}stamina25.png`,
              tit: "俯卧撑",
              info: "",
              state: "暂无",
              unit: "个",
              id: 24,
            },
            {
              icon: `${baseUrl}stamina26.png`,
              tit: "深蹲",
              info: "",
              state: "暂无",
              unit: "个",
              id: 25,
            },
            {
              icon: `${baseUrl}stamina27.png`,
              tit: "卷腹",
              info: "",
              state: "暂无",
              unit: "个",
              id: 26,
            },
          ],
        },
        {
          tit: {
            titTxt: "平衡 / 敏捷 / 柔韧性",
            num: "40分",
          },
          list: [
            {
              icon: `${baseUrl}healthBalance.png`,
              tit: "平衡能力",
              info: "",
              state: "",
              unit: "级",
              id: 27,
            },
            {
              icon: `${baseUrl}agility.png`,
              tit: "敏捷性",
              info: "",
              state: "",
              unit: "ms",
              id: 28,
            },
            {
              icon: `${baseUrl}LorRQu.png`,
              tit: "左右肩屈",
              info: "",
              state: "暂无",
              imgSrc: "",
              mode: "LorRQu",
              unit: "度",
              id: 29,
            },
            {
              icon: `${baseUrl}LorRShen.png`,
              tit: "左右肩伸",
              info: "",
              state: "暂无",
              imgSrc: "",
              mode: "LorRShen",
              unit: "度",
              id: 30,
            },
            {
              icon: `${baseUrl}leftZhiTai.png`,
              tit: "左直腿抬高",
              info: "",
              state: "暂无",
              imgSrc: "",
              mode: "leftZhiTai",
              unit: "度",
              id: 31,
            },
            {
              icon: `${baseUrl}rightZhiTai.png`,
              tit: "右直腿抬高",
              info: "",
              state: "暂无",
              imgSrc: "",
              mode: "rightZhiTai",
              unit: "度",
              id: 32,
            },
            {
              type: "",
              imgSrc: "",
              id: 33,
              arr: [
                {
                  icon: `${baseUrl}tms-left.png`,
                  tit: "托马斯.左大腿",
                  state: "",
                  id: 5,
                  unit: "度",
                },
                {
                  icon: `${baseUrl}tms-left.png`,
                  tit: "托马斯.左小腿",
                  state: "",
                  id: 6,
                  unit: "度",
                },
              ],
            },
            {
              type: "",
              imgSrc: "",
              id: 34,
              arr: [
                {
                  icon: `${baseUrl}tms-right.png`,
                  tit: "托马斯.右大腿",
                  state: "",
                  id: 7,
                  unit: "度",
                },
                {
                  icon: `${baseUrl}tms-right.png`,
                  tit: "托马斯.右大腿",
                  state: "",
                  id: 7,
                  unit: "度",
                },
              ],
            },
          ],
        },
      ],
      gaodiFile: "", // 高低 图片
      gupenFile: "", // 骨盆
      desc: "这是一段文字",
      infoData: {},
      /* 体侧仪地址路径 */
      navigatorUrl: "",
      selectRemarksIds: [],
      report_path: "",
    };
  },
  onReady() {},
  methods: {
    // 编辑数据
    exitStateTxt(e) {
      if (e == "low") {
        return "低风险";
      } else if (e == "medium") {
        return "中风险";
      } else {
        return "高风险";
      }
    },
    getData(e, apiKey) {
      /* 体侧仪插件地址 */
      // this.navigatorUrl = `plugin://hello-plugin/health-report?no=${
      //   e.phone
      // }&apiKey=${encodeURIComponent(apiKey)}`;
      this.infoData = e;
      this.report_path = e.report_path;
      this.desc = e.feedback;
      this.listData[1].list[0].arr[0].state = this.exitStateTxt(
        e.dimension.gd_assess
      );
      this.listData[1].list[0].arr[1].state = this.exitStateTxt(
        e.dimension.typeo_assess
      );
      this.listData[1].list[1].arr[0].state = this.exitStateTxt(
        e.dimension.pelvis_assess
      );
      this.listData[1].list[1].arr[1].state = this.exitStateTxt(
        e.dimension.hunchback_assess
      );
      // this.gupenFile =  e.dimension.shape_lower_images ? e.dimension.shape_lower_images : ""
      // this.gaodiFile =  e.dimension.shape_upper_images ? e.dimension.shape_upper_images : ""
      this.listData[1].list[0].imgSrc = e.dimension.shape_upper_images
        ? e.dimension.shape_upper_images
        : "";
      this.listData[1].list[1].imgSrc = e.dimension.shape_lower_images
        ? e.dimension.shape_lower_images
        : "";
      this.listData[0].tit.num = e.oxygen_scorea;
      this.listData[0].list[0].state = e.oxygen_uptake_standard.name; // 最大摄氧量
      this.listData[0].list[0].info = e.oxygen_uptake_standard.value; // 最大摄氧量

      this.listData[0].list[1].info = e.vitalCapacity_standard; // 肺活量
      this.listData[1].tit.num = e.physical_scorea;
      this.listData[1].list[2].state = e.physical.weight_standard.name; // 体重
      this.listData[1].list[2].info = e.physical.weight_standard.value; // 体重
      this.listData[1].list[3].state = e.physical.fat_standard.name; // 体脂
      this.listData[1].list[3].info = e.physical.fat_standard.value; // 体脂
      this.listData[1].list[4].state = e.physical.bmi_standard.name; // BMI
      this.listData[1].list[4].info = e.physical.bmi_standard.value; // BMI
      this.listData[1].list[5].state = e.physical.waist_standard.name; // 腰围
      this.listData[1].list[5].info = e.physical.waist_standard.value; // 腰围
      this.listData[1].list[6].state = e.physical.bone_standard.name; // 骨量
      this.listData[1].list[6].info = e.physical.bone_standard.value; // 骨量
      this.listData[1].list[7].state = e.physical.wc_standard.name; // 腰臀比
      this.listData[1].list[7].info = e.physical.wc_standard.value; // 腰臀比
      this.listData[1].list[8].state = e.physical.skeletal_muscle_standard.name; // 骨骼肌
      this.listData[1].list[8].info = e.physical.skeletal_muscle_standard.value; // 骨骼肌

      this.listData[1].list[9].state = e.physical.muscle_standard.name; // 肌肉率
      this.listData[1].list[9].info = e.physical.muscle_standard.value; // 肌肉率
      this.listData[1].list[10].state = e.physical.protein_standard.name; // 蛋白质
      this.listData[1].list[10].info = e.physical.protein_standard.value; // 蛋白质
      this.listData[1].list[11].state = e.physical.water_standard.name; // 体水分
      this.listData[1].list[11].info = e.physical.water_standard.value; // 体水分
      this.listData[1].list[12].state = e.physical.inFat_standard.name; // 内脏脂肪
      this.listData[1].list[12].info = e.physical.inFat_standard.value; // 内脏脂肪
      this.listData[1].list[13].state = e.physical.bmr_standard.name; // 基础代谢
      this.listData[1].list[13].info = e.physical.bmr_standard.value; // 基础代谢
      this.listData[1].list[14].state =
        e.physical.restingHeartRate_standard.name; // 静息心率
      this.listData[1].list[14].info =
        e.physical.restingHeartRate_standard.value; // 静息心率
      this.listData[1].list[15].info = e.dimension.left_boom_dimension; // 左大臂维度
      this.listData[1].list[16].info = e.dimension.right_boom_dimension; // 右大臂维度
      this.listData[1].list[17].info = e.dimension.left_thigh_dimension; // 左大腿维度
      this.listData[1].list[18].info = e.dimension.right_thigh_dimension; // 右大腿维度
      this.listData[1].list[19].info = e.dimension.left_lower_dimension; // 左小腿维度
      this.listData[1].list[20].info = e.dimension.right_lower_dimension; // 右小腿维度

      // 肌耐力数据
      this.listData[2].tit.num = e.endurance_scorea;
      this.listData[2].list[0].info = e.endurance.push_up_count_standard.value; // 俯卧撑
      this.listData[2].list[0].state = e.endurance.push_up_count_standard.name; // 俯卧撑
      this.listData[2].list[1].info = e.endurance.squat_count_standard.value; // 深蹲
      this.listData[2].list[1].state = e.endurance.squat_count_standard.name; // 深蹲
      this.listData[2].list[2].info = e.endurance.rolled_abdomen_standard.value; // 卷腹
      this.listData[2].list[2].state = e.endurance.rolled_abdomen_standard.name; // 卷腹

      // 平衡及柔韧性
      this.listData[3].tit.num = e.balance_scorea;
      this.listData[3].list[0].info = e.balanceAngle_standard; // 平衡能力
      this.listData[3].list[1].info = e.agility_standard; // 敏捷性
      // 左右肩屈
      this.listData[3].list[2].info = e.exitems.flexion_standard.value;
      this.listData[3].list[2].state = e.exitems.flexion_standard.name;
      this.listData[3].list[2].imgSrc = e.exitems.flexion_standard.image;
      // 左右肩伸
      this.listData[3].list[3].info = e.exitems.stretch_standard.value;
      this.listData[3].list[3].state = e.exitems.stretch_standard.name;
      this.listData[3].list[3].imgSrc = e.exitems.stretch_standard.image;
      // 左直腿抬高
      this.listData[3].list[4].info = e.exitems.leftLegRaise_standard.value;
      this.listData[3].list[4].state = e.exitems.leftLegRaise_standard.name;
      this.listData[3].list[4].imgSrc = e.exitems.leftLegRaise_standard.image;
      // 右直腿抬高
      this.listData[3].list[5].info = e.exitems.rightLegRaise_standard.value;
      this.listData[3].list[5].state = e.exitems.rightLegRaise_standard.name;
      this.listData[3].list[5].imgSrc = e.exitems.rightLegRaise_standard.image;
      // 托马斯左
      this.listData[3].list[6].imgSrc =
        e.exitems.thomasLeftThigh_standard.image;
      this.listData[3].list[6].arr[0].state =
        e.exitems.thomasLeftThigh_standard.name;
      this.listData[3].list[6].arr[1].state =
        e.exitems.thomasLeftShank_standard.name;
      // 托马斯右
      this.listData[3].list[7].imgSrc =
        e.exitems.thomasRightThigh_standard.image;
      this.listData[3].list[7].arr[0].state =
        e.exitems.thomasRightThigh_standard.name;
      this.listData[3].list[7].arr[1].state =
        e.exitems.thomasRightShank_standard.name;
    },
    onShowRemark(eve) {
      let indexOf = this.selectRemarksIds.indexOf(eve.id);
      if (indexOf == -1) {
        this.selectRemarksIds.push(eve.id);
      } else {
        this.selectRemarksIds.splice(indexOf, 1);
      }
    },
    // 图片预览
    previewFun(img) {
      // 预览图片
      uni.previewImage({
        urls: [img],
        longPressActions: {
          success: function (data) {},
          fail: function (err) {},
        },
      });
    },
    handleCopyReport() {
    if (this.report_path) {
      uni.setClipboardData({
        data: this.report_path,
        success: () => {
          uni.showToast({
            title: '已复制链接，通过PC端浏览器进行打印',
            icon: 'none',
            duration: 2000
          });
        },
        fail: (err) => {
          console.error('Failed to copy text: ', err);
          uni.showToast({
            title: '复制失败，请重试',
            icon: 'none',
            duration: 2000
          });
        }
      });
    } else {
      uni.showToast({
        title: '报告路径为空，无法复制',
        icon: 'none',
        duration: 2000
      });
    }
  },
  },
};
</script>

<style lang="scss" scoped>
.unit-sty {
  font-size: 22rpx;
  color: 999;
}
.pdfBtn {
  border-radius: 14rpx;
  padding: 8rpx 20rpx;
  background-color: #3c9cff;
  font-weight: 400;
  font-size: 24rpx;
  color: #fff;
}
.li-itemBox {
  .li-itemBox-item {
    width: 100%;
    .remark-txt {
      background: #f5f7fa;
      border: 2rpx solid #e5e7ec;
      border-radius: 12rpx;
      font-size: 24rpx;
      font-family: PingFang SC, PingFang SC-Regular;
      font-weight: Regular;
      text-align: left;
      color: #808695;
    }
  }
  flex-wrap: wrap;
}
.bluetooth {
  width: 140rpx;
  height: 40rpx;
  image {
    width: 100%;
    height: 100%;
  }
}
.area-box {
  border: 2px solid #eee;
  border-radius: 10rpx;
  font-size: 24rpx;
  white-space: pre-wrap;
}
.tit-box {
  .tit-score {
    font-weight: 400;
    color: #fe5e10;
    padding-right: 35rpx;
  }
  .tit-txt {
    font-weight: 500;
    color: rgba(32, 32, 32, 0.9);
    font-weight: 600;
  }
  font-size: 28rpx;
}
.fot-btn {
  margin-top: 60rpx;
  .btn {
    width: 100%;
    height: 80rpx;
    background-color: #fe5e10;
    border-radius: 40rpx;
    color: #fff;
  }
}
/deep/ .u-textarea {
  background-color: #f9f9f9 !important;
}
.padtb10 {
  padding: 10rpx 0;
}
.list-box {
  .gather-box {
    position: relative;
    .gather-l {
      .top-txt {
        font-weight: 400;
        color: #202020;
        font-size: 28rpx;
      }
      .top-icon {
        width: 35rpx;
        height: 40rpx;
        image {
          width: 100%;
          height: 100%;
        }
      }
      width: 40%;
      height: 180rpx;
    }

    .gather-r {
      .select-sty {
        font-weight: 400;
        color: #fe5e10;
        font-size: 28rpx;
      }
      align-items: flex-end;
      width: 25%;
      height: 180rpx;
    }
    width: 100%;
    // height: 100rpx;
    box-shadow: 0px 0px 15rpx 0px rgba(0, 0, 0, 0.25);
    border-radius: 10rpx;
  }
  .gather-up {
    image {
      width: 100%;
      height: 100%;
    }
    width: 35%;
    height: 180rpx;
  }
  .item50 {
    width: 48% !important;
  }
  .item100 {
    width: 100% !important;
  }
  .showRemark {
    position: absolute;
    right: 15rpx;
    bottom: 5rpx;
    font-size: 22rpx;
    font-family: PingFang SC, PingFang SC-Regular;
    font-weight: Regular;
    text-align: justify;
    color: #808695;
  }
  .li-item {
    position: relative;

    .li-r {
      font-weight: 400;
      color: #fe5e10;
      font-size: 28rpx;
      // width: 100rpx;
      // width: 25%;
    }
    .li-l {
      // width: 40%;
      .l-info {
        .info-num {
          font-weight: 400;
          color: rgba(32, 32, 32, 0.9);
          font-size: 32rpx;
        }
        .info-tit {
          font-weight: 300;
          color: #999999;
          font-size: 22rpx;
        }
        height: 80rpx;
      }
      .l-icon {
        width: 45rpx;
        height: 45rpx;
        image {
          width: 100%;
          height: 100%;
        }
      }
    }
    width: 100%;
    // height: 100rpx;
    border-radius: 10rpx;
    background-color: #fff;
    box-shadow: 0px 0px 15rpx 0px rgba(0, 0, 0, 0.25);
  }
}
</style>
