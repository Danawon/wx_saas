<template>
  <view>
    <head-nav
      bgColor="#fff"
      :goBack="true"
      titColor="#000"
      title="处方管理"
    ></head-nav>
    <view class="search-box pad20" v-if="roleType == 'doctor'">
      <view class="search-ipt">
        <u-search
          borderColor="#FE5E10"
          shape="round"
          bgColor="#fff"
          height="70rpx"
          placeholder="搜索患者关键词"
          :showAction="false"
          :inputStyle="{
            'padding-right': '95rpx',
          }"
          v-model="searUserVal"
        ></u-search>
      </view>
      <view class="search-btn flex" @click="resetRequ"> 搜索 </view>
    </view>
    <view class="padlr20 pad-b40">
      <view class="" v-if="roleType == 'user'">
        <u-button
          type="primary"
          text="申请处方"
          @click="applyRecipe"
        ></u-button>
      </view>
      <view class="list-box">
        <view
          class="li-box mar-t40"
          v-for="(item, index) in recipeList"
          :key="index"
          @click="onSelectLi(item)"
        >
          <view class="li flex-row ju-bt pad20">
            <view class="li-l">
              <u-avatar :src="item.user_avatar" size="70"></u-avatar>
            </view>
            <view class="li-r flex-row ju-bt flex-a">
              <view class="r-box flex-col ju-bt">
                <view class="r-userinfo">
                  <view class="">
                    {{ item.user_name
                    }}<text class="uid-txt">({{ item.uid }})</text>
                  </view>
                  <view class="uid-txt tel-box">
                    电话: {{ item.mobile || "--" }}
                  </view>
                </view>
                <view class="r-tit">
                  {{ item.title }}
                </view>
              </view>
              <view class="r-time flex-row flex-a">
                <view class="date-box-txt flex-col flex-a">
                  <view class="">
                    {{ item.createtime_text.Ymd }}
                  </view>
                  <view class="time-txt">
                    {{ item.createtime_text.His }}
                  </view>
                </view>
                <u-icon
                  :name="selectLiId == item.id ? 'arrow-up' : 'arrow-down'"
                  color="#999"
                  size="20"
                ></u-icon>
              </view>
            </view>
          </view>
          <view class="" v-if="selectLiId == item.id">
            <view class="mar-t20" v-if="detailLoading">
              <u-loading-icon></u-loading-icon>
            </view>
            <view v-else>
              <u-empty
                v-if="!detailsData.length"
                mode="list"
                text="暂无数据..."
              ></u-empty>
              <view
                class="li-card pad20 mar-t20"
                v-for="(itemB, indexB) in detailsData"
                :key="indexB"
              >
                <view @click.stop="() => {}">
                  <u--form labelPosition="left" labelWidth="80">
                    <u-form-item label="目标:" borderBottom>
                      {{ itemB.target }}
                    </u-form-item>
                    <u-form-item label="运动周期:" borderBottom>
                      {{ itemB.motion_period }}
                    </u-form-item>
                  </u--form>
                  <view
                    class="card-li mar-t20"
                    v-for="(itemC, indexC) in itemB.list"
                    :key="indexC"
                  >
                    <view class="recipe-list">
                      <view class="list-li mar-b20 pad20">
                        <view class="li-tit flex mar-t20">
                          <view class="btn-box" v-if="roleType == 'doctor'">
                            <u-button
                              v-if="selectBtnIndex === indexC"
                              type="success"
                              text="保存"
                              size="mini"
                              @click.stop="confirmEdit(itemC)"
                            ></u-button>

                            <u-button
                              v-else
                              type="primary"
                              text="编辑"
                              size="mini"
                              @click.stop="clickEditFun(indexB, indexC)"
                            ></u-button>
                          </view>
                        </view>
                        <u-line margin="20rpx 0"></u-line>
                        <u--form labelPosition="left" labelWidth="80">
                          <u-form-item label="运动类型:" borderBottom>
                            <view
                              v-if="selectBtnIndex === indexC"
                              class="flex-a"
                              @click.stop="clickShow('movement_type')"
                            >
                              <u--input
                                v-model="itemC.motion_type"
                                disabled
                                disabledColor="#ffffff"
                                placeholder="请选择类型"
                                border="none"
                              ></u--input>
                              <u-icon
                                slot="right"
                                name="arrow-down-fill"
                              ></u-icon>
                            </view>
                            <view v-else>
                              {{ itemC.motion_type }}
                            </view>
                          </u-form-item>
                          <u-form-item label="方式:" borderBottom>
                            <view
                              v-if="selectBtnIndex === indexC"
                              class="flex-a"
                            >
                              <u--textarea
                                v-model="itemC.motion_method"
                                placeholder="请选择方式"
                              ></u--textarea>
                            </view>
                            <view v-else>
                              {{ itemC.motion_method }}
                            </view>
                          </u-form-item>
                          <view
                            class="flex flex-j mar-t20"
                            v-if="selectBtnIndex === indexC"
                          >
                            <u-tag
                              text="选择方式快捷语"
                              @click.stop="clickShow('motion_method')"
                            ></u-tag>
                          </view>
                          <u-form-item label="时间:" borderBottom>
                            <view
                              v-if="selectBtnIndex === indexC"
                              class="flex-a"
                              @click.stop="clickShow('movement_time')"
                            >
                              <u--input
                                v-model="itemC.motion_time"
                                disabled
                                disabledColor="#ffffff"
                                placeholder="请选择时间"
                                border="none"
                              ></u--input>
                              <u-icon
                                slot="right"
                                name="arrow-down-fill"
                              ></u-icon>
                            </view>
                            <view v-else>
                              {{ itemC.motion_time }}
                            </view>
                          </u-form-item>
                          <u-form-item label="频率:" borderBottom>
                            <view
                              v-if="selectBtnIndex === indexC"
                              class="flex-a"
                              @click.stop="clickShow('movement_frequency')"
                            >
                              <u--input
                                v-model="itemC.motion_frequency"
                                disabled
                                disabledColor="#ffffff"
                                placeholder="请选择频率"
                                border="none"
                              ></u--input>
                              <u-icon
                                slot="right"
                                name="arrow-down-fill"
                              ></u-icon>
                            </view>
                            <view v-else>
                              {{ itemC.motion_frequency }}
                            </view>
                          </u-form-item>
                          <u-form-item label="强度:" borderBottom>
                            <view
                              v-if="selectBtnIndex === indexC"
                              class="flex-a"
                              @click.stop="clickShow('strength')"
                            >
                              <u--input
                                v-model="itemC.motion_strength"
                                disabled
                                disabledColor="#ffffff"
                                placeholder="请选择强度"
                                border="none"
                              ></u--input>
                              <u-icon
                                slot="right"
                                name="arrow-down-fill"
                              ></u-icon>
                            </view>
                            <view class="" v-else>
                              {{ itemC.motion_strength }}
                            </view>
                          </u-form-item>
                          <u-form-item label="感受:" borderBottom>
                            <view
                              class="flex-a"
                              v-if="selectBtnIndex === indexC"
                              @click.stop="clickShow('feel_arr')"
                            >
                              <u--textarea
                                v-model="itemC.feel"
                                placeholder="请输入感受"
                                disabled=""
                              ></u--textarea>
                            </view>
                            <view class="" v-else>
                              {{ itemC.feel }}
                            </view>
                          </u-form-item>
                          <u-form-item label="注意事项:" borderBottom>
                            <view
                              class="flex-a"
                              v-if="selectBtnIndex === indexC"
                            >
                              <u--textarea
                                v-model="itemC.remark"
                                placeholder="请输入注意事项"
                              ></u--textarea>
                            </view>
                            <view class="" v-else>
                              {{ itemC.remark }}
                            </view>
                          </u-form-item>
                          <u-form-item label="饮食指南:" borderBottom>
                            <view
                              v-if="selectBtnIndex === indexC"
                              class="flex-a"
                              @click.stop="showDietary"
                            >
                              <u--input
                                v-model="itemC.dietTit"
                                disabled
                                disabledColor="#ffffff"
                                placeholder="请选择饮食指南"
                                border="none"
                              ></u--input>
                              <u-icon
                                slot="right"
                                name="arrow-down-fill"
                              ></u-icon>
                            </view>
                            <view class="" v-else>
                              {{ itemC.dietTit || "" }}
                            </view>
                          </u-form-item>
                          <view v-if="itemC.dietary_guide">
                            <u-parse :content="itemC.dietary_guide"></u-parse>
                          </view>
                        </u--form>
                      </view>
                    </view>
                    <view
                      class="padlr20 signature-box flex-col"
                      v-if="itemC.signature"
                    >
                      <view class="tit-sty"> 医师签字： </view>
                      <view class="box-sign flex-col">
                        <view class="img-box">
                          <view class="img-tans">
                            <image
                              :src="itemC.signature"
                              mode="scaleToFill"
                            ></image>
                          </view>
                        </view>
                        <view class="time mar-t20">
                          {{ itemC.hospital_name || "星怡康体检中心" }}
                        </view>
                        <view class="time mar-t20" v-if="itemC.releasetime">
                          {{ itemC.releasetime || "" }}
                        </view>
                      </view>
                    </view>
                    <u-line margin="20rpx 0"></u-line>
                  </view>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>

      <u-empty
        v-if="!recipeList.length"
        mode="list"
        text="暂无处方..."
      ></u-empty>
    </view>

    <!-- 快捷语组件 -->
    <shortcut-modal
      ref="shortcutModalRef"
      @selectedShortcut="selectedShortcut"
    ></shortcut-modal>
    <!-- 各种下拉选择 -->
    <u-picker
      :show="show"
      ref="uPicker"
      :columns="pickerColumns"
      keyName="name"
      @confirm="confirmPicker"
      @close="show = false"
      @cancel="show = false"
    ></u-picker>
    <!-- 饮食指南下拉选择 -->
    <u-picker
      :show="dietShow"
      ref="uPicker"
      :columns="dietList"
      keyName="title"
      @confirm="confirmDiet"
      @close="dietShow = false"
      @cancel="dietShow = false"
    ></u-picker>
  </view>
</template>

<script>
/* 快捷语弹框 */
import shortcutModal from "@/components/shortcutModal/shortcutModal.vue";
import {
  patientRecipe,
  recipeChildDetail,
  recipeSelectData,
  editRecipe,
  dietaryGuide,
} from "@/api/doctor.js";
export default {
  components: {
    shortcutModal,
  },
  data() {
    return {
      pickerColumns: [], // picker 数据
      show: false,
      roleType: "", // 角色类型
      currentPage: 1,
      recipeList: [], // 处方列表
      detailsData: [], // 选中处方的详情数据
      detailLoading: false, // 处方列表下的详情加载状态
      selectBtnIndex: "", // 选中的按钮 选中的处方下的运动类型下标
      selectIndexB: "", // 选中的处方下标

      clickSelectType: "", // 选中下拉类型
      selectObj: {
        movement_type: {}, // 运动类型
        strength_movement: {}, // 力量运动方式
        aerobic_movement: {}, // 有氧运动方式
        flexibility_movement: {}, // 柔韧性训练
        balance_movement: {}, // 平衡性训练
        movement_time: {}, // 运动时间
        movement_frequency: {}, // 运动频率
        strength: {}, // 运动强度
        feel_arr: {}, // 感受
      }, // 弹出层 数据
      clickTypeArr: {
        movement_type: "motion_type",
        aerobic_movement: "motion_method",
        flexibility_movement: "motion_method",
        balance_movement: "motion_method",
        strength_movement: "motion_method",
        movement_time: "motion_time",
        movement_frequency: "motion_frequency",
        strength: "motion_strength",
        feel_arr: "feel",
      },
      selectLiId: "", // 选中的处方id
      searUserVal: "",
      uid: "",

      dietIndex: "", // 选中的第N个节点
      dietShow: false,
      dietList: [], // 饮食指南列表
    };
  },
  onLoad(op) {
    this.roleType = op.type;
    this.selectLiId = op.recipeId ?? "";
    this.getpPtientRecipe();
    this.getDietaryGuide();
    if (op.recipeId) this.getRecipeChildDetail(op.recipeId);
  },
  onReachBottom() {
    this.currentPage++;
    this.getpPtientRecipe();
  },
  methods: {
    /* 选中饮食指南 */
    confirmDiet(eve) {
      this.detailsData[this.selectIndexB].list[this.selectBtnIndex]["dietTit"] =
        eve.value[0].title;
      this.detailsData[this.selectIndexB].list[this.selectBtnIndex][
        "dietary_guide"
      ] = eve.value[0].content;
      this.dietShow = false;
    },
    /* 获取饮食指南 */
    getDietaryGuide() {
      dietaryGuide().then((res) => {
        this.dietList = [res.data];
      });
    },
    /* 选中饮食指南 */
    showDietary(index) {
      this.dietShow = true;
      this.dietIndex = index;
    },

    /* 选中快捷语 */
    showChildNode() {
      this.$refs.shortcutModalRef.toggleShow({
        list: this.pickerColumns[0],
        arouseType: "doctor",
      });
    },
    /* 选中快捷语句 */
    selectedShortcut(item) {
      let indexItem =
        this.detailsData[this.selectIndexB]["list"][this.selectBtnIndex];
      let str = "";
      if (indexItem[this.clickTypeArr[this.clickSelectType]]) {
        str = indexItem[this.clickTypeArr[this.clickSelectType]] + "," + item;
      } else {
        str = item;
      }
      indexItem[this.clickTypeArr[this.clickSelectType]] = str;
    },
    /* 申请处方 */
    applyRecipe() {
      uni.navigateTo({
        url: "/pages/doctor/doctorList/doctorList",
      });
    },
    /* 点击编辑 */
    clickEditFun(indexB, indexC) {
      this.selectBtnIndex = indexC;
      this.selectIndexB = indexB;
    },
    // 唤起选项
    clickShow(type) {
      // this.clickSelectType = type; // 选中下拉类型
      if (type == "motion_method") {
        let arr = [
          {
            name: "力量运动",
            filed: "strength_movement",
          },
          {
            name: "有氧运动",
            filed: "aerobic_movement",
          },
          {
            name: "柔韧性训练",
            filed: "flexibility_movement",
          },
          {
            name: "平衡性训练",
            filed: "balance_movement",
          },
        ];
        let indexItem =
          this.detailsData[this.selectIndexB]["list"][this.selectBtnIndex];
        this.clickSelectType = arr.filter(
          (item) => item.name == indexItem.motion_type
        )[0].filed;
      } else {
        this.clickSelectType = type; // 选中下拉类型
      }
      this.pickerColumns = [this.selectObj[this.clickSelectType]];
      if (type == "motion_method") {
        this.showChildNode();
      } else {
        this.show = true;
      }
    },
    // 选中选项
    confirmPicker(e) {
      let indexItem =
        this.detailsData[this.selectIndexB]["list"][this.selectBtnIndex];
      if (
        this.clickSelectType === "movement_type" &&
        e.value[0].name !== indexItem.motion_type
      ) {
        indexItem.motion_method = "";
        indexItem.motion_time = "";
        indexItem.motion_frequency = "";
        indexItem.motion_strength = "";
      }
      indexItem[this.clickTypeArr[this.clickSelectType]] = e.value[0].name;
      this.show = false;
    },
    /* 获取新增处方时的下拉数据 */
    getRecipeSelectData() {
      recipeSelectData({
        uid: this.uid,
      }).then((res) => {
        this.selectObj = res.data;
      });
    },
    /* 保存编辑 */
    confirmEdit(itemC) {
      if (
        !itemC.motion_method ||
        !itemC.motion_time ||
        !itemC.motion_frequency ||
        !itemC.motion_strength ||
        !itemC.dietary_guide
      ) {
        uni.showToast({
          title: "请填写完整内容后保存！",
          icon: "none",
        });
        return;
      }
      this.selectBtnIndex = "";
      this.editRecipeFun(this.detailsData[this.selectIndexB].list);
    },
    /* 处方编辑保存 */
    editRecipeFun(list) {
      editRecipe({ list }).then((res) => {
        uni.showToast({
          title: res.msg,
        });
        setTimeout(() => {
          this.getRecipeChildDetail(this.selectLiId);
        }, 1500);
      });
    },
    // 选中li
    onSelectLi(item, index) {
      this.detailLoading = true;
      this.uid = item.uid;
      if (this.selectLiId == item.id) {
        this.selectLiId = "";
      } else {
        this.selectLiId = item.id;
        this.getRecipeChildDetail(item.id);
        this.getRecipeSelectData();
      }
    },
    /* 重置请求 */
    resetRequ() {
      this.currentPage = 1;
      this.recipeList = [];
      this.selectLiId = "";
      this.getpPtientRecipe();
    },

    /* 获取处方下的详情 */
    getRecipeChildDetail(id) {
      recipeChildDetail({
        prescription_id: id,
      }).then((res) => {
        this.detailLoading = false;
        this.detailsData = res.data;
      });
    },
    /* 获取患者处方 */
    getpPtientRecipe() {
      patientRecipe({
        list_rows: 10,
        page: this.currentPage,
        prescription_desc_id: this.roleType == "user" ? this.selectLiId : "",
        keyword: this.searUserVal,
      }).then((res) => {
        this.recipeList = [...this.recipeList, ...res.data.data];
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.search-box {
  .search-btn {
    width: 150rpx;
    height: 75rpx;
    color: #fff;
    font-size: 28rpx;
    margin-left: -20rpx;
    background: linear-gradient(102deg, #ff7c3c 0%, #fe5e10 100%);
    border-radius: 50rpx;
    position: absolute;
    top: 20rpx;
    right: 20rpx;
  }
  .search-ipt {
    width: 95%;
  }
  width: 100%;
  position: relative;
}
/deep/ .u-textarea--disabled {
  background-color: #fff !important;
}
.tit-sty {
  font-weight: bold;
  font-size: 28rpx;
}
.img-box {
  .img-tans {
    transform: rotate(270deg);
    position: absolute;
    top: 0rpx;
    left: -25%;
    width: 120rpx;
    height: 480rpx;
    transform-origin: right top;
    image {
      width: 100%;
      height: 100%;
    }
  }
  position: relative;
  width: 480rpx;
  height: 120rpx;
  overflow: hidden;
}
.signature-box {
  .time {
    font-weight: 400;
    color: rgba(0, 0, 0, 0.4);
    font-size: 22rpx;
  }
  .box-sign {
    align-items: flex-end;
  }
  border-radius: 5rpx;
  background: #fff;
  border-radius: 20rpx;
}
.list-box {
  .li-box {
    .li {
      border-radius: 20rpx;
      box-shadow: 1px 1px 10rpx 5rpx #ccc;
      .li-l {
        width: 20%;
      }
      .li-r {
        width: 79%;
        .r-box {
          width: 67%;
          padding-left: 10rpx;
          .r-tit {
            font-size: 28rpx;
            font-weight: bold;
            margin-top: 8rpx;
          }
          .r-userinfo {
            font-size: 22prx;
            color: #999999;
            .uid-txt {
              font-size: 20rpx;
            }
            .tel-box {
              font-size: 24rpx;
              margin-top: 10rpx;
            }
          }
        }
        .r-time {
          font-size: 22rpx;
          color: #999;
          width: 33%;
          .date-box-txt {
            margin-right: 10rpx;
          }
          .time-txt {
            margin-top: 10rpx;
          }
        }
      }
    }
    .li-card {
      border-radius: 10rpx;
      min-height: 100rpx;
      box-shadow: 1px 1px 10rpx 5rpx #ccc;
      .card-li {
        .li-tit {
          justify-content: flex-end;
        }
        .recipe-list {
          .list-li {
            box-shadow: 1px 1px 10rpx 5rpx #ccc;
            border-radius: 15rpx;
          }
        }
      }
    }
  }
}
</style>
