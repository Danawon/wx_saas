<template>
  <view class="padlr20">
    <view class="">
      <view class="tit martb40">负责门店</view>
      <u-checkbox-group v-model="selectCheck" placement="row">
        <view class="li-box flex-row flex-a ju-bt">
          <view
            class="li mar-b40 flex"
            v-for="(item, index) in shopList"
            :key="index"
          >
            <u-checkbox
              :checked="selectCheck.includes(item.id)"
              :label="item.name"
              :name="item.id"
            ></u-checkbox>
          </view>
        </view>
      </u-checkbox-group>
    </view>

    <view class="fot-box">
      <view class="btn flex" @click="confirmFun"> 确定 </view>
    </view>
  </view>
</template>

<script>
import { storeColumn } from "@/api/living.js";
import { editProduct } from "@/api/admin.js";
export default {
  data() {
    return {
      selectCheck: [],
      shopList: [],
      uId: "",
      cardId: "",
    };
  },
  onLoad(opt) {
    this.storeColumn();
    this.cardId = opt.cardId;
    this.selectCheck = opt.ids && opt.ids.split(",").map(Number);
  },
  methods: {
    confirmFun() {
      this.editProductFun();
    },
    editProductFun() {
      editProduct({
        id: this.cardId,
        multiple_stores: this.selectCheck.join(","),
      }).then((res) => {
        uni.showToast({
          title: res.msg,
        });
        setTimeout(() => {
          uni.navigateBack();
        }, 1500);
      });
    },
    storeColumn() {
      storeColumn().then((res) => {
        this.shopList = res.data;
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.fot-box {
  .btn {
    width: 100%;
    height: 80rpx;
    color: #fff;
    border-radius: 40rpx;
    background-color: #fe5e10;
  }
  padding: 20rpx 20rpx 50rpx;
  position: fixed;
  bottom: 0rpx;
  left: 0;
  width: 100%;
  background-color: #fff;
}
.tit {
  font-weight: 400;
  color: rgba(0, 0, 0, 0.9);
  font-size: 35rpx;
}
.li-box {
  .li {
    margin-right: 30rpx;
  }
  flex-wrap: wrap;
}
</style>
