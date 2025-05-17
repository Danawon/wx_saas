<template>
  <view class="">
    <view
      class="img-bg"
      :style="{
        background: 'url(' + baseUrl + 'loginBg.png)',
        'background-size': '100% 100%',
      }"
    ></view>
    <view class="btn-box pad20">
      <button class="wxbtn flex" @click="login">一键授权登录</button>
      <button class="wxbtn wxbtn2 flex" @click="onGoIndex">
        暂不登录返回首页
      </button>
    </view>
    <modal-tips
      ref="modalTipsRef"
      :modalShow="modalShow"
      confirmText="点击授权"
      :showCancelButton="false"
      :showConfirmButton="false"
      confirmColor="#FE5E10"
      title="提示"
    >
      <view class="modalTxt pad-b40">
        <view class=""> 请授权您的手机号，以提供更好的服务 </view>
        <view class="btn mar-t40">
          <button
            type="default"
            style="width: 100%"
            class="confirm flex"
            @getphonenumber="onGetPhoneNumber"
            open-type="getPhoneNumber"
          >
            授权
          </button>
        </view>
      </view>
    </modal-tips>
  </view>
</template>

<script>
import { baseUrl } from "@/utils/baseUrl.js";
import { loginFun, mandateTel } from "@/api/storeApis.js";
// modal弹框组件
import modalTips from "@/components/modalTips/modalTips.vue";
export default {
  components: {
    modalTips,
  },
  data() {
    return {
      baseUrl: baseUrl,
      userinfo: {},
      modalShow: false,
      // 登录信息
      loginData: {},
    };
  },
  onLoad() {},
  methods: {
    onGoIndex() {
      uni.switchTab({
        url: "/pages/store/index/index",
        success: function (e) {
          var page = getCurrentPages().pop(); // 返回页面数组的最后一个页面数据
          if (page == undefined || page == null) return; //如果最后一个页面为undefined或null，即当前就在首页 return出去，不调用onLoad
          page.onLoad();
        },
      });
    },
    // 授权手机号
    onGetPhoneNumber(eve) {
      wx.login({
        success: () => {
          mandateTel({
            code: eve.detail.code,
            token: "Bearer" + " " + this.loginData.tokenConfig.token,
          }).then((res) => {
            uni.showToast({
              title: res.msg,
            });
            if (!Array.isArray(res.data)) {
              this.loginData.tokenConfig.token = res.data.tokenConfig.token;
            }
            this.loginSuccess();
          });
        },
      });
    },
    confirmLogin(code) {
      let _this = this;
      loginFun({
        code,
        avatar: _this.userinfo.avatarUrl,
        nickname: _this.userinfo.nickName,
        gender: _this.userinfo.gender,
      }).then((res) => {
        this.loginData = res.data;
        if (res.data.user.mobile) {
          uni.showToast({
            title: "登录成功",
            icon: true,
          });
          this.loginSuccess();
        } else {
          this.modalShow = true;
        }
      });
    },
    // 登录成功的回调
    loginSuccess() {
      let _this = this;
      uni.setStorageSync("token", this.loginData.tokenConfig.token);
      /* 记录安静心率 */
      uni.setStorageSync("rhr", this.loginData.user.rhr);
      /* 存储会员绑定的设备 */
      if (!!this.loginData.user.device_type) {
        uni.setStorageSync(
          "selectedScanDevice",
          this.loginData.user.device_type
        );
      }
      /* 体重 */
      uni.setStorageSync("weight", this.loginData.user.weight);
      uni.removeStorageSync("relation_id");
      uni.removeStorageSync("role");
      uni.removeStorageSync("uid");
      _this.$store.dispatch("setUserInfo", this.loginData.user);
      setTimeout(() => {
        /* 根据手机号判断角色 */
        uni.switchTab({
          url: "/pages/store/index/index",
          success: function (e) {
            var page = getCurrentPages().pop(); // 返回页面数组的最后一个页面数据
            if (page == undefined || page == null) return; //如果最后一个页面为undefined或null，即当前就在首页 return出去，不调用onLoad
            page.onLoad();
          },
        });
      }, 1500);
    },
    login() {
      let _this = this;
      uni.getUserProfile({
        desc: "用于展示用户信息",
        success: (infoRes) => {
          _this.userinfo = infoRes.userInfo;
          uni.login({
            provider: "weixin",
            success: (loginRes) => {
              _this.confirmLogin(loginRes.code);
            },
          });
        },
        fail: (err) => {
          uni.showModal({
            title: "登录异常提示！",
            content:
              "由于您未同意隐私协议，如需继续使用请10秒钟之后重试并同意隐私协议！",
            showCancel: false,
          });
        },
      });
    },
  },
};
</script>

<style lang="scss">
button {
  height: 70rpx;
  background: linear-gradient(108deg, #fb9118 0%, #ff7a27 99%);
  border-radius: 84rpx;
  font-size: 32rpx;
  color: #fff !important;
}
page {
  background-color: #ffffff;
}
.img-bg {
  width: 100%;
  height: 50vh;
}
.wxbtn {
  margin-top: 100rpx;
  width: 712rpx;
  height: 90rpx;
  background: linear-gradient(108deg, #fb9118 0%, #ff7a27 99%);
  border-radius: 84rpx;
  font-size: 32rpx;
  font-weight: bold;
  color: #ffffff;
  margin-bottom: 46rpx;
}
.wxbtn2 {
  background: #eee;
  color: #333 !important;
  margin-top: 10rpx;
}
</style>
