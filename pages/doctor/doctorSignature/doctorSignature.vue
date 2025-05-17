<template>
  <view>
    <head-nav
      bgColor="#fff"
      :goBack="true"
      titColor="#000"
      title="签名"
    ></head-nav>
    <view class="mar-t40 pad20 signature-box flex-col flex-a" v-if="signUrl">
      <view class="img-box">
        <view class="img-tans">
          <u--image
            :showLoading="true"
            :src="signUrl"
            width="190rpx"
            height="600rpx"
            mode="scaleToFill"
          ></u--image>
        </view>
      </view>
    </view>
    <view class="flex martb40">
      <view class="btn-box">
        <u-button
          type="primary"
          :text="signUrl ? '修改签名' : '去签名'"
          @click="goSign"
        ></u-button>
      </view>
    </view>
    <view class="fot-box">
      <view class="btn flex" @click="confirmFun"> 保存 </view>
    </view>
  </view>
</template>

<script>
import { baseUrl, baseUrlApi } from "@/utils/baseUrl.js";
import { timestampToTime } from "@/utils/util.js";
import { sportsTeacherInfo, sportsTeacherEdit } from "@/api/sportsTeacher.js";
export default {
  data() {
    return {
      baseUrl: baseUrl,
      signUrl: "", // 签名路径
      // siginTime: '', // 签名时间
    };
  },
  onLoad() {
    uni.$off("q-sign");
    // 监听生成签字的图片地址
    uni.$on("q-sign", (img) => {
      uni.uploadFile({
        url: `${baseUrlApi}upload/file`, // 仅为示例，非真实的接口地址
        filePath: img,
        name: "image",
        header: {
          "Authori-zation": "Bearer" + " " + uni.getStorageSync("token"),
        },
        formData: {
          image: img,
          type: "clockin",
        },
        success: (res) => {
          let data = JSON.parse(res.data);
          this.signUrl = data.data;
          // this.siginTime = timestampToTime(
          // 	new Date().getTime() / 1000
          // );
        },
        fail: (err) => {},
      });
    });

    this.getSportsTeacherInfo();
  },
  methods: {
    // 获取信息
    getSportsTeacherInfo() {
      sportsTeacherInfo().then((res) => {
        // this.infoData = res.data;
        this.signUrl = res.data.signature;
        // this.siginTime = res.data.
      });
    },
    /* 编辑签名信息 */
    sportsTeacherEditFun() {
      sportsTeacherEdit({
        signature: this.signUrl,
      }).then((res) => {
        uni.showToast({
          title: res.msg,
        });
        setTimeout(() => {
          uni.navigateBack();
        }, 1500);
      });
    },
    // 保存签名
    confirmFun() {
      if (!this.signUrl) {
        uni.showToast({
          title: "请签名后再保存！",
          icon: "none",
        });
        return;
      }
      this.sportsTeacherEditFun();
    },
    // 去签名
    goSign() {
      uni.navigateTo({
        url: "/uni_modules/q-sign/pages/q-sign",
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
}
.btn-box {
  width: 200rpx;
}
.img-box {
  .img-tans {
    transform: rotate(270deg);
    position: absolute;
    top: -200rpx;
    left: 207rpx;
  }
  position: relative;
  width: 600rpx;
  height: 200rpx;
  overflow: hidden;
}
.signature-box {
  background: #f5f5f5;
  border-radius: 20rpx;
}
</style>
