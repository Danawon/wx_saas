<template>
  <view class="wrap-min">
    <head-nav
      title="个人中心"
      titColor="#fff"
      iconC="#fff"
      bgColor="rgba(0,0,0,0)"
      :goBack="true"
      :leftSlot="true"
    ></head-nav>
    <view
      class="head-bg"
      :style="
        'background:url(' + baseUrl + 'myBg.png);background-size: 100% 100%;'
      "
    ></view>
    <view class="user-box flex-row flex-a pad20">
      <view class="user-avatar">
        <u-avatar :src="userInfo.avatar" size="140rpx"></u-avatar>
      </view>
      <view
        class="user-r flex-row flex-a ju-bt padtb40 palrd"
        @click="goRouter('/pages/myCenter/pages/myInfo/myInfo')"
      >
        <view class="user-name mar-l20">
          {{ userInfo.nickname }}
        </view>
        <view class="user-set flex-row flex-a">
          <view class="txt">前往完善资料</view>
          <u-icon name="arrow-right" color="#fff" size="24rpx"></u-icon>
        </view>
        <view class="tips-icon" v-if="!userInfo.is_complete">
          <image :src="baseUrl + 'tips-icon.png'" mode=""></image>
        </view>
      </view>
    </view>
    <!-- 我的余额 -->
    <view class="balance pad20">
      <view
        class="price-box pad40 flex-col ju-bt"
        :style="
          'background:url(' +
          baseUrl +
          'priceBg.png);background-size: 100% 100%;'
        "
      >
        <view class="txt">我的余额(元)</view>
        <view class="price-num flex-row flex-a ju-bt">
          <view class="num">{{ userInfo.money }}</view>
          <view
            class="payBtn flex"
            @click="goRouter('/pages/myCenter/pages/pay/pay')"
          >
            充值
          </view>
        </view>
      </view>
    </view>
    <!-- 我的账户 -->
    <view class="account-box">
      <view class="account-info pad40">
        <view class="tit">我的账户</view>
        <view class="account-list flex-row">
          <view
            class="account-li flex-col flex-a flex-j"
            v-for="(item, index) in accountLi"
            :key="index"
            @click="goRouter(item.url)"
          >
            <image
              :src="item.img"
              mode=""
              :style="{
                width: item.width ? item.width : '50rpx',
              }"
            ></image>
            <view class="txt">{{ item.txt }}</view>
          </view>
        </view>
      </view>
    </view>
    <!-- 我的服务 -->
    <view class="service-box pad20">
      <view class="service-info pad40">
        <view class="tit">我的服务</view>
        <view class="servic-list flex-row mar-t20">
          <view
            class="servic-li flex-col flex-a flex-j martb20"
            v-for="(item, index) in servicLi"
            :key="index"
            @click="goRouter(item.url)"
          >
            <image :src="item.img" mode=""></image>
            <view class="txt">{{ item.txt }}</view>
            <view
              class="tips-icon"
              v-if="item.type === 'questionnaire' && !userInfo.is_questionnaire"
            >
              <image :src="baseUrl + 'tips-icon.png'" mode=""></image>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { baseUrl } from "@/utils/baseUrl.js";
import { getMyInfo } from "@/api/myCenter.js";
export default {
  data() {
    return {
      baseUrl: baseUrl,
      // 账户操作列表
      accountLi: [
        {
          img: `${baseUrl}account11.png`,
          txt: "会员卡",
          url: "/pages/myCenter/pages/vipCard/vipCard",
        },
        {
          img: `${baseUrl}account22.png`,
          txt: "我的设备",
          url: "/pages/myCenter/pages/myFacility/myFacility",
          width: "61rpx",
        },
        {
          img: `${baseUrl}account33.png`,
          txt: "优惠劵",
          url: "/pages/myCenter/pages/coupons/coupons",
        },
        {
          img: `${baseUrl}account44.png`,
          txt: "积分商城",
          url: "/pages/myCenter/pages/integrateShop/integrateShop",
        },
        {
          img: `${baseUrl}calorie.png`,
          txt: "燃烧卡路里",
          url: "/pages/myCenter/pages/fatBurning/fatBurning",
        },
      ],
      // 服务列表
      servicLi: [
        {
          img: `${baseUrl}servicLi1.png`,
          txt: "约课记录",
          url: "/pages/myCenter/pages/appointmentRecord/appointmentRecord",
        },
        {
          img: `${baseUrl}servicLi2.png`,
          txt: "居家训练计划",
          url: `/pages/myCenter/pages/trainingPlan/trainingPlan?enterInto=living`,
        },
        {
          img: `${baseUrl}servicLi3.png`,
          txt: "交易记录",
          url: "/pages/myCenter/pages/tradingRecord/tradingRecord",
        },
        {
          img: `${baseUrl}heartIcon.png`,
          txt: "心肺运动测试",
          url: "/pages/myCenter/pages/bluetoothTest/bluetoothTest?fromType=myCenter",
        },
        {
          img: `${baseUrl}servicLi4.png`,
          txt: "健康数据",
          url: "/pages/myCenter/pages/healthData/healthData",
        },
        {
          img: `${baseUrl}servic3.png`,
          txt: "商城订单",
          url: "/pages/myCenter/pages/mallOrder/mallOrder",
        },

        {
          img: `${baseUrl}servicLi5.png`,
          txt: "运动健康报告",
          url: "/pages/myCenter/pages/trainingReport/trainingReport",
        },
        {
          img: `${baseUrl}servicLi6.png`,
          txt: "私教训练计划",
          url: "/pages/myCenter/pages/trainingPlan/trainingPlan",
        },
        {
          img: `${baseUrl}servic7.png`,
          txt: "知识库",
          url: "/pages/myCenter/pages/issueLibrary/issueLibrary",
        },
        {
          img: `${baseUrl}servicLi7.png`,
          txt: "动作库",
          url: "/pages/myCenter/pages/actionLibrary/actionLibrary",
        },
        {
          img: `${baseUrl}servicLi8.png`,
          txt: "储物柜",
          url: "/pages/myCenter/pages/storeLocker/storeLocker",
        },
        {
          img: `${baseUrl}servicLi9.png`,
          txt: "邀请有礼",
          url: "/pages/myCenter/pages/Invitation/Invitation",
        },
        {
          img: `${baseUrl}servicLi10.png`,
          txt: "减脂计算器",
          url: "/pages/myCenter/pages/calculator/calculator",
        },
        {
          img: `${baseUrl}servic10.png`,
          txt: "管理员入口",
          url: "/pages/admin/index/index",
        },
        {
          img: `${baseUrl}servic11.png`,
          txt: "健康问卷",
          url: "/pages/myCenter/pages/healthQuestionnaire/healthQuestionnaire",
          type: "questionnaire",
        },
        {
          img: `${baseUrl}chufang-yundong.png`,
          txt: "运动处方",
          url: "/pages/doctor/recipeAdmin/recipeAdmin?type=user",
        },
      ],
      // 用户数据
      userInfo: {},
    };
  },
  onLoad(e) {},
  onShow() {
    /* 判断是否存在身份权限 存在 -> 删除 */
    if (uni.getStorageSync("relation_id") || uni.getStorageSync("role")) {
      uni.removeStorageSync("relation_id");
      uni.removeStorageSync("role");
    }

    this.getUserInfo();
  },
  methods: {
    // 获取个人信息
    getUserInfo() {
      getMyInfo().then((res) => {
        this.userInfo = res.data;
        /* 语音播报状态 */
        uni.setStorageSync("voiceBroadcast", this.userInfo.voice_broadcast);
      });
    },
    goRouter(eve) {
      uni.navigateTo({
        url: `${eve}?id=${this.userInfo.id}&score=${this.userInfo.score}`,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.tips-icon {
  position: absolute;
  width: 35rpx;
  height: 35rpx;
  image {
    width: 100% !important;
    height: 100% !important;
  }
}
.service-box {
  .service-info {
    .servic-list {
      flex-wrap: wrap;
    }
    .servic-li {
      width: 25%;
      position: relative;
      .txt {
        color: rgba(0, 0, 0, 0.6);
        font-size: 24rpx;
        font-weight: 400;
        margin-top: 10rpx;
      }
      image {
        width: 50rpx;
        height: 50rpx;
      }
      .tips-icon {
        top: -15rpx;
        right: 45rpx;
      }
    }
    width: 100%;
    background-color: #fff;
    border-radius: 20rpx;
    padding: 40rpx 30rpx;
  }
  width: 100%;
}
.account-box {
  .account-info {
    .account-list {
      margin-top: 30rpx;
    }
    .account-li {
      .txt {
        color: rgba(0, 0, 0, 0.6);
        font-size: 24rpx;
        font-weight: 400;
        margin-top: 10rpx;
      }
      image {
        width: 50rpx;
        height: 50rpx;
      }
      width: 20%;
    }

    width: 100%;
    background-color: #fff;
    border-radius: 20rpx;
    padding: 40rpx 30rpx;
  }
  width: 100%;
  padding: 10rpx 20rpx;
}
.tit {
  color: #434343;
  font-weight: 400;
  font-size: 28rpx;
}
.balance {
  .price-box {
    .price-num {
      .payBtn {
        width: 130rpx;
        height: 60rpx;
        font-size: 26rpx;
        border-radius: 40rpx;
        background-color: #8f7162;
      }
      .num {
        font-size: 45rpx;
        font-weight: bold;
      }
    }
    .txt {
      color: rgba(255, 243, 237, 0.8);
      font-size: 26rpx;
    }
    width: 100%;
    height: 190rpx;
    border-radius: 20rpx;
    color: #fff;
  }
  width: 100%;
  z-index: 99;
  position: relative;
}
.user-box {
  .user-r {
    .tips-icon {
      top: 20rpx;
      right: 15rpx;
    }
    .user-name {
      font-size: 38rpx;
    }
    .user-set {
      .txt {
        margin-right: 10rpx;
        color: rgba(255, 255, 255, 0.6);
      }
      font-size: 22rpx;
      font-weight: 400;
    }
    width: 80%;
    color: #fff;
    position: relative;
  }
  .user-avatar {
    width: 20%;
  }
  width: 100%;
  z-index: 99;
  position: relative;
  // margin-top: 40rpx;
}
.head-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 500rpx;
  z-index: 1;
  // background: linear-gradient(
  // 	180deg,
  // 	#0dbc14 0%,
  // 	rgba(13, 188, 20, 0) 100%
  // );
}
::v-deep .u-navbar__content {
  z-index: 99;
}
</style>
