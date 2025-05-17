<template>
  <view>
    <head-nav title="患者列表" bgColor="#fff" :goBack="true"></head-nav>
    <view class="search-box pad20">
      <view class="search-ipt">
        <u-search
          borderColor="#FE5E10"
          shape="round"
          bgColor="#fff"
          height="70rpx"
          placeholder="搜索关键词"
          :showAction="false"
          :inputStyle="{
            'padding-right': '95rpx',
          }"
          v-model="searUserVal"
        ></u-search>
      </view>
      <view class="search-btn flex" @click="searchUserFun"> 搜索 </view>
    </view>
    <view class="list-box pad20 mar-t20">
      <view class="li" v-for="(item, index) in list" :key="index">
        <view class="apply-tips" v-if="item.apply">
          <u--image
            :showLoading="true"
            :src="`${baseUrl}apply-icon.png`"
            width="60rpx"
            height="50rpx"
          ></u--image>
        </view>
        <view class="flex-row flex-a ju-bt">
          <view class="li-avatar flex-row flex-a">
            <view class="" @click="goRouter(item, 2)">
              <u-avatar :src="item.avatar" size="100rpx"></u-avatar>
            </view>
            <view class="name mar-l20">
              <view class="">
                {{ item.nickname }}
              </view>
              <view class="mar-t">
                电话:
                {{ item.mobile || "未授权" }}
              </view>
              <view class="mar-t"> ID: {{ item.id }} </view>
            </view>
          </view>
          <view class="li-r">
            <view class="btn flex" @click="goRouter(item, 1)"> 运动处方 </view>
          </view>
        </view>
        <u-line margin="20rpx 0"></u-line>
      </view>
    </view>
    <u-empty v-if="!list.length" mode="list" text="暂无数据..."></u-empty>
  </view>
</template>

<script>
import { baseUrl } from "@/utils/baseUrl.js";
import { patientList } from "@/api/doctor.js";
export default {
  data() {
    return {
      baseUrl: baseUrl,
      list: [],
      current: 1,
      searUserVal: "",
      doctorId: "", // 医生id
      roleId: "",
      role: "",
    };
  },
  onLoad(op) {
    this.roleId = op.role_id;
    this.role = op.role;
    if (this.roleId && this.role) {
      uni.setStorageSync("relation_id", this.roleId);
      uni.setStorageSync("role", this.role);
    }
  },
  onShow() {
    this.resetFun();
  },
  onReachBottom() {
    this.current++;
    this.getPatientList();
  },
  methods: {
    goRouter(e, type) {
      let url = "";
      if (type === 1) {
        url = `/pages/doctor/exercisePrescription/exercisePrescription?uInfo=${JSON.stringify(
          e
        )}`;
      } else {
        url = `/pages/admin/pages/userDetail/userDetail?id=${e.id}`;
      }
      uni.navigateTo({
        url,
      });
    },
    resetFun() {
      this.current = 1;
      this.list = [];
      this.getPatientList();
    },
    /* 点击搜索 */
    searchUserFun() {
      this.resetFun();
    },
    // 获取患者列表
    getPatientList() {
      patientList({
        list_rows: 20,
        page: this.current,
        keyword: this.searUserVal,
        condition: "doctor",
      }).then((res) => {
        this.list = [...this.list, ...res.data.data];
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.list-box {
  .li {
    position: relative;
    .apply-tips {
      position: absolute;
      top: 7rpx;
      right: -3rpx;
    }
    .li-r {
      .btn {
        font-weight: 400;
        // color: #fe5e10;
        font-size: 24rpx;
        width: 120rpx;
        height: 45rpx;
        border-radius: 10rpx;
        background-color: #19be6b;
        color: #fff;
        line-height: 45rpx;
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
</style>
