<template>
  <view>
    <head-nav title="医生列表" bgColor="#fff" :goBack="true"></head-nav>
    <view class="list-box pad20 mar-t20">
      <view class="li" v-for="(item, index) in list" :key="index">
        <view class="flex-row flex-a ju-bt">
          <view class="li-avatar flex-row flex-a">
            <view class="" @click="goRouter(item)">
              <u-avatar :src="item.avatar" size="100rpx"></u-avatar>
            </view>
            <view class="name mar-l20">
              <view class="">
                {{ item.name }}
              </view>
              <view class="mar-t">
                电话:
                {{ item.mobile || "未授权" }}
              </view>
              <view class="mar-t"> ID: {{ item.id }} </view>
            </view>
          </view>
          <view class="li-r">
            <view class="btn btn2 flex" v-if="item.status == 1"> 申请中 </view>
            <view class="btn btn1 flex" @click="applyRecipeFun(item)" v-else>
              申请处方
            </view>
          </view>
        </view>
        <u-line margin="20rpx 0"></u-line>
      </view>
    </view>
    <u-empty v-if="!list.length" mode="list" text="暂无数据..."></u-empty>
  </view>
</template>

<script>
import { userDoctorList, applyRecipe } from "@/api/doctor.js";
export default {
  data() {
    return {
      list: [],
    };
  },
  onLoad(op) {
    this.getUserDoctorList();
  },
  methods: {
    /* 申请处方 */
    applyRecipeFun(eve) {
      applyRecipe({
        leader_id: eve.id,
      }).then((res) => {
        uni.showToast({
          title: "申请处方成功",
        });
        setTimeout(() => {
          this.getUserDoctorList();
        }, 1500);
      });
    },
    goRouter(eve) {
      uni.navigateTo({
        url: `/pages/store/pages/coachDetail/coachDetail?coachId=${eve.id}&roleType=doctor`,
      });
    },
    // 获取医生列表
    getUserDoctorList() {
      userDoctorList().then((res) => {
        this.list = res.data;
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.list-box {
  .li {
    .li-r {
      .btn {
        font-weight: 400;
        font-size: 24rpx;
        width: 120rpx;
        height: 45rpx;
        border-radius: 10rpx;
      }
      .btn1 {
        color: #fe5e10;
        border: 1px solid #fe5e10;
      }
      .btn2 {
        color: #19be6b;
        border: 1px solid #19be6b;
      }
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
  }
}
</style>
