<template>
  <view class="wrap">
    <head-nav
      bgColor="#fff"
      :goBack="true"
      titColor="#000"
      title="运动处方"
    ></head-nav>
    <view class="content-box">
      <view class="head-box padlr20 flex ju-bt">
        <view class="li-avatar flex-row flex-a">
          <u-avatar :src="uInfo.avatar" size="100rpx"></u-avatar>
          <view class="name mar-l20">
            <view class="">
              {{ uInfo.nickname }}
            </view>
            <view class="mar-t"> ID: {{ uInfo.id }} </view>
          </view>
        </view>
      </view>
      <view class="list-box mar-t20 pad20">
        <u-line margin=" 20rpx 0"></u-line>
        <view class="block-form">
          <view class="form-item flex-row flex-a">
            <view class="form-lable"> 处方名称： </view>
            <view class="form-val">
              <u--input
                v-model="form.title"
                placeholder="请输入处方名称"
              ></u--input>
            </view>
          </view>
          <view class="form-item mar-t20 flex-row flex-a">
            <view class="form-lable"> 运动目标： </view>
            <view class="form-val">
              <u--textarea
                v-model="form.target"
                placeholder="请输入或选择运动目标"
              ></u--textarea>
            </view>
          </view>
          <view class="form-item mar-t20 flex-row flex-j">
            <u-tag
              text="快捷选择运动目标"
              type="success"
              @click="clickShow('moving_target', 0)"
            ></u-tag>
          </view>
          <view class="form-item mar-t20 flex-row flex-a">
            <view class="form-lable"> 运动周期： </view>
            <view class="form-val" @click="clickShow('moving_period', 0)">
              <u-input
                v-model="form.motion_period"
                placeholder="请输入运动周期"
                disabled
                disabledColor="#ffffff"
              >
                <u-icon
                  name="arrow-down"
                  color="#333"
                  size="16"
                  bold
                  slot="suffix"
                ></u-icon>
              </u-input>
            </view>
          </view>
        </view>
        <u-line margin="20rpx 0"></u-line>
        <u-button
          type="primary"
          icon="plus"
          text="运动类型"
          @click="addMotionType()"
        ></u-button>
        <view
          class="prescription-li pad20 mar-t20"
          v-for="(item2, index2) in form.list"
          :key="index2"
        >
          <view class="li-head flex-row ju-bt">
            <view
              class="exercise-type flex flex-a"
              @click="clickShow('movement_type', index2)"
            >
              <text class="type-txt">
                {{ item2.motion_type || "请选择" }}
              </text>
              <u-icon name="arrow-down" color="#333" size="16" bold></u-icon>
            </view>
            <view class="btn-del" @click="delFun(index2)">
              <u-button size="mini" type="error" text="删除"></u-button>
            </view>
          </view>
          <u--form labelPosition="left" labelWidth="90">
            <u-form-item label="方式：" borderBottom>
              <view class="flex-a">
                <!-- <u--input
									v-model="item2.motion_method"
									disabled
									disabledColor="#ffffff"
									placeholder="请选择方式"
									border="none"
								></u--input>
								<u-icon
									slot="right"
									name="arrow-down-fill"
								></u-icon> -->
                <u--textarea
                  v-model="item2.motion_method"
                  placeholder="请选择方式"
                ></u--textarea>
              </view>
            </u-form-item>
            <view class="flex flex-j mar-t20">
              <u-tag
                text="选择方式快捷语"
                @click="clickShow('motion_method', index2)"
              ></u-tag>
            </view>
            <u-form-item label="时间：" borderBottom>
              <view class="flex-a" @click="clickShow('movement_time', index2)">
                <u--input
                  v-model="item2.motion_time"
                  disabled
                  disabledColor="#ffffff"
                  placeholder="请选择时间"
                  border="none"
                ></u--input>
                <u-icon slot="right" name="arrow-down-fill"></u-icon>
              </view>
            </u-form-item>
            <u-form-item label="频率：" borderBottom>
              <view
                class="flex-a"
                @click="clickShow('movement_frequency', index2)"
              >
                <u--input
                  v-model="item2.motion_frequency"
                  disabled
                  disabledColor="#ffffff"
                  placeholder="请选择频率"
                  border="none"
                ></u--input>
                <u-icon slot="right" name="arrow-down-fill"></u-icon>
              </view>
            </u-form-item>
            <u-form-item label="强度：" borderBottom>
              <view class="flex-a" @click="clickShow('strength', index2)">
                <u--input
                  v-model="item2.motion_strength"
                  disabled
                  disabledColor="#ffffff"
                  placeholder="请选择强度"
                  border="none"
                ></u--input>
                <u-icon slot="right" name="arrow-down-fill"></u-icon>
              </view>
            </u-form-item>
            <u-form-item label="感受：" borderBottom>
              <view class="flex-a" @click="clickShow('feel_arr', index2)">
                <u--textarea
                  v-model="item2.feel"
                  placeholder="请输入感受"
                  disabled
                ></u--textarea>
              </view>
            </u-form-item>
            <u-form-item label="注意事项：" borderBottom>
              <view class="flex-a">
                <u--textarea
                  v-model="item2.remark"
                  placeholder="请输入注意事项"
                ></u--textarea>
              </view>
            </u-form-item>
            <u-form-item label="饮食指南：" borderBottom>
              <view class="flex-a" @click="showDietary(index2)">
                <u--input
                  v-model="item2.dietTit"
                  disabled
                  disabledColor="#ffffff"
                  placeholder="请选择饮食指南"
                  border="none"
                ></u--input>
                <u-icon slot="right" name="arrow-down-fill"></u-icon>
              </view>
            </u-form-item>
            <view v-if="item2.dietary_guide">
              <u-parse :content="item2.dietary_guide"></u-parse>
            </view>
          </u--form>
        </view>
      </view>
    </view>
    <view class="fot-box padlr20">
      <view class="btn flex" @click="confirmFun"> 保存 </view>
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
import {
  recipeSelectData,
  preserveRecipe,
  dietaryGuide,
} from "@/api/doctor.js";
/* 快捷语弹框 */
import shortcutModal from "@/components/shortcutModal/shortcutModal.vue";
export default {
  components: {
    shortcutModal,
  },
  data() {
    return {
      pickerColumns: [], // picker 数据
      show: false,
      exerciseIndex: 0, // 选中运动类型列表项的 index
      form: {
        title: "",
        target: "",
        motion_period: "",
        list: [],
      },
      uInfo: {}, // 用户信息
      selectObj: {
        movement_type: {}, // 运动类型
        strength_movement: {}, // 力量运动方式
        aerobic_movement: {}, // 有氧运动方式
        movement_time: {}, // 运动时间
        movement_frequency: {}, // 运动频率
        strength: {}, // 运动强度
        moving_target: {}, // 运动目标
        moving_period: {}, // 运动周期
        feel_arr: {}, // 感受
      }, // 弹出层 数据
      clickSelectType: "", // 选中下拉类型
      clickTypeArr: {
        movement_type: "motion_type",
        aerobic_movement: "motion_method",
        strength_movement: "motion_method",
        flexibility_movement: "motion_method",
        balance_movement: "motion_method",
        movement_time: "motion_time",
        movement_frequency: "motion_frequency",
        strength: "motion_strength",
        moving_target: "target",
        moving_period: "motion_period",
        feel_arr: "feel",
      },
      fileArr: [
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
      ],
      dietIndex: "", // 选中的第N个节点
      dietShow: false,
      dietList: [], // 饮食指南列表
    };
  },
  onLoad(op) {
    this.uInfo = op.uInfo ? JSON.parse(op.uInfo) : {};
    // this.getpPtientRecipe();
    this.getRecipeSelectData();
    /* 获取饮食指南 */
    this.getDietaryGuide();
  },

  methods: {
    /* 选中饮食指南 */
    confirmDiet(eve) {
      this.form.list[this.dietIndex]["dietTit"] = eve.value[0].title;
      this.form.list[this.dietIndex]["dietary_guide"] = eve.value[0].content;
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
      let str = "";
      if (
        this.fileArr.filter((item) => item.filed == this.clickSelectType).length
      ) {
        let obj1 =
          this.form["list"][this.exerciseIndex][
            this.clickTypeArr[this.clickSelectType]
          ];
        if (obj1) {
          str = obj1 + "," + item;
        } else {
          str = item;
        }
        this.form["list"][this.exerciseIndex][
          this.clickTypeArr[this.clickSelectType]
        ] = str;
      } else if (this.clickSelectType == "moving_target") {
        let obj2 = this.form[this.clickTypeArr[this.clickSelectType]];
        if (obj2) {
          str = obj2 + "," + item;
        } else {
          str = item;
        }
        this.form[this.clickTypeArr[this.clickSelectType]] = str;
      }
    },
    // 删除运动处方
    delFun(index2) {
      this.form.list.splice(index2, 1);
    },
    // 添加运动类型
    addMotionType(index) {
      this.form.list.unshift({
        motion_type: "有氧运动",
        motion_method: "", // 方式
        motion_time: "", // 时间
        motion_frequency: "", // 频率
        motion_strength: "", // 强度
        feel: "", // 感受
        remark: "", // 备注
        dietTit: "", // 饮食指南tit
        dietary_guide: "", // 饮食指南富文本
      });
    },
    // 唤起选项
    clickShow(type, index2) {
      this.exerciseIndex = index2;
      if (type == "motion_method") {
        this.clickSelectType = this.fileArr.filter(
          (item) => item.name == this.form.list[this.exerciseIndex].motion_type
        )[0].filed;
      } else {
        this.clickSelectType = type; // 选中下拉类型
      }
      this.pickerColumns = [this.selectObj[this.clickSelectType]];
      if (type == "motion_method" || type == "moving_target") {
        this.showChildNode();
      } else {
        this.show = true;
      }
    },
    // 选中选项
    confirmPicker(e) {
      if (
        this.clickSelectType === "movement_type" &&
        e.value[0].name !== this.form["list"][this.exerciseIndex].motion_type
      ) {
        this.form.list[this.exerciseIndex].motion_method = "";
        this.form.list[this.exerciseIndex].motion_time = "";
        this.form.list[this.exerciseIndex].motion_frequency = "";
        this.form.list[this.exerciseIndex].motion_strength = "";
      }
      this.show = false;
      if (
        this.clickSelectType == "moving_target" ||
        this.clickSelectType == "moving_period"
      ) {
        if (this.clickSelectType == "moving_target") {
          let str = `${this.form[this.clickTypeArr[this.clickSelectType]]},${
            e.value[0].name
          }`;
          this.form[this.clickTypeArr[this.clickSelectType]] = str
            .split(",")
            .filter(Boolean)
            .join(",");
        } else {
          this.form[this.clickTypeArr[this.clickSelectType]] = e.value[0].name;
        }
      } else {
        this.form["list"][this.exerciseIndex][
          this.clickTypeArr[this.clickSelectType]
        ] = e.value[0].name;
      }
    },
    /* 保存处方 */
    preserveRecipeFun() {
      preserveRecipe({
        uid: this.uInfo.id,
        ...this.form,
      }).then((res) => {
        uni.showToast({
          title: res.msg,
        });
        setTimeout(() => {
          uni.navigateBack();
        }, 1500);
      });
    },
    // 点击保存
    confirmFun() {
      for (let key in this.form) {
        if (!this.form[key] && key != "dietTit" && key != "remark") {
          uni.showToast({
            title: "请填写或输入完整内容后保存",
            icon: "none",
            duration: 2000,
          });
          return;
        }
      }
      if (!this.form.list.length) {
        uni.showToast({
          title: "请至少增加一个运动类型！",
          icon: "none",
        });
        return;
      }
      let status = "";
      for (let i = 0; i < this.form.list.length; i++) {
        let item = this.form.list[i];
        if (
          !item.motion_type ||
          !item.motion_method ||
          !item.motion_time ||
          !item.motion_frequency ||
          !item.motion_strength
        ) {
          status = true;
          break;
        }
      }
      if (status) {
        uni.showToast({
          title: "请选填完整的运动类型！",
          icon: "none",
        });
        return;
      }
      this.preserveRecipeFun();
    },

    /* 获取新增处方时的下拉数据 */
    getRecipeSelectData() {
      recipeSelectData({
        uid: this.uInfo.id,
      }).then((res) => {
        this.selectObj = res.data;
      });
    },
  },
};
</script>

<style lang="scss" scoped>
/deep/ .u-textarea--disabled {
  background-color: #fff !important;
}
.content-box {
  padding-bottom: 120rpx;
}
.fot-box {
  .btn {
    width: 100%;
    height: 80rpx;
    color: #fff;
    border-radius: 40rpx;
    background-color: #fe5e10;
  }
  background-color: #fff;
  width: 100%;
  position: fixed;
  bottom: 20rpx;
  left: 0;
  z-index: 22;
}
.prescription-li {
  .li-head {
    .exercise-type {
      .type-txt {
        margin-right: 10rpx;
        font-weight: bold;
        font-size: 26rpx;
      }
      border-radius: 5rpx;
      border: 1px solid #eee;
      padding: 7rpx 15rpx;
    }
  }
  .li-form {
    .form-lable {
      width: 15%;
    }
  }
  box-shadow: 1px 1px 10rpx 5rpx #eee;
  border-radius: 20rpx;
}
.block-form {
  .form-lable {
    width: 25%;
  }
  .form-val {
    width: 75%;
  }
}
.tit-txt {
  font-weight: bold;
  font-size: 32rpx;
  text-align: center;
}
.li-avatar {
  .name {
    font-weight: 400;
    color: #202020;
    font-size: 32rpx;
    .mar-t {
      margin-top: 10rpx;
      font-size: 26rpx;
      color: #999;
    }
  }
}
.head-box {
  height: 100rpx;
  background-color: #fff;
}
</style>
