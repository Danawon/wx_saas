<script>
export default {
  onLaunch: function () {
    this.checkUpdateVersion();
    // this.checkLoginStatus();
  },
  onShow: function () {},
  onHide: function () {},
  methods: {
    checkLoginStatus() {
      const token = uni.getStorageSync("token");
      if (!token) {
        uni.navigateTo({
          url: "/pages/login/login",
        });
      }
    },
    checkUpdateVersion() {
      //判断微信版本是否 兼容小程序更新机制API的使用
      if (wx.canIUse("getUpdateManager")) {
        const updateManager = wx.getUpdateManager();
        //检测版本更新
        updateManager.onCheckForUpdate(function (res) {
          if (res.hasUpdate) {
            updateManager.onUpdateReady(function () {
              wx.showModal({
                title: "温馨提示",
                content: "检测到新版本，是否重启小程序？",
                showCancel: false,
                success: function (res) {
                  if (res.confirm) {
                    // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                    updateManager.applyUpdate();
                  }
                },
              });
            });
            updateManager.onUpdateFailed(function () {
              // 新版本下载失败
              wx.showModal({
                title: "已有新版本",
                content: "请您删除小程序，重新搜索进入",
              });
            });
          }
        });
      } else {
        wx.showModal({
          title: "溫馨提示",
          content:
            "当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。",
        });
      }
    },
  },
};
</script>

<style lang="scss">
/*每个页面公共css */
@import "@/uni_modules/uview-ui/index.scss";
@import "@/common/common.scss";
</style>
