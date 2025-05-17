<template>
  <view class="wrap-min">
    <head-nav title="动作库" bgColor="#fff" :goBack="true"></head-nav>
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
          v-model="searchCoachVal"
        ></u-search>
      </view>
      <view class="search-btn flex" @click="searchActionLibraryFun">
        搜索
      </view>
    </view>
    <view class="tab-box padlr20">
      <u-tabs
        :list="tabList"
        lineColor="#FE5E10"
        :activeStyle="{
          color: '#FE5E10',
          fontWeight: 'bold',
          transform: 'scale(1.05)',
        }"
        :inactiveStyle="{
          color: '#606266',
          transform: 'scale(1)',
        }"
        :current="tabsCurrent"
        @change="tabsChange"
      ></u-tabs>
    </view>
    <!-- 动作库列表 -->
    <view class="commodity-list pad20">
      <view class="list flex-row flex-a">
        <view
          class="li mar-b20 pad-b20"
          v-for="(item, index) in commodityList"
          :key="index"
          @click="goDetail(item)"
        >
          <view class="img-box">
            <u--image
              :showLoading="true"
              :src="item.article_images"
              width="100%"
              height="380rpx"
            ></u--image>
          </view>

          <view class="li-tit mar-t20 mar-b20 pad-l20 pad-r20 text-elpis2">
            <!-- {{ item.article_title }} -->
            <u-parse :content="item.article_title"></u-parse>
          </view>
          <view class="time-box flex-row flex-a ju-bt pad-l20 pad-r20">
            <view class="time"> 时长：{{ item.duration || "10" }}秒 </view>
            <view class="watched"> {{ item.page_view }}人观看 </view>
          </view>
        </view>
      </view>
    </view>
    <u-empty
      v-if="!commodityList.length"
      mode="list"
      text="暂无数据..."
    ></u-empty>
  </view>
</template>

<script>
import { baseUrl } from "@/utils/baseUrl.js";
import {
  getActionLibrary,
  searchActionLibrary,
  tabsFilter,
} from "@/api/myCenter.js";
export default {
  data() {
    return {
      baseUrl: baseUrl,
      searchCoachVal: "",
      tabList: [
        {
          name: "全部",
          id: "",
        },
      ],
      // tabs当前选中
      tabsCurrent: 0,
      // 当前页
      current: 1,
      // 动作库列表
      commodityList: [],
      // 父级页面类型
      type: "",
      parentIndex: "", // 父级选中课程下标
    };
  },
  onShow() {
    this.reset();
    this.getActionLibraryFun();
  },
  onLoad(e) {
    this.type = e.type ?? "";
    this.parentIndex = e.index ?? "";
    this.getVideoFilter();
  },
  onReachBottom() {
    this.current++;
    this.getActionLibraryFun();
  },
  methods: {
    // 获取tabs筛选
    getVideoFilter() {
      tabsFilter({
        type: "action_library",
      }).then((res) => {
        this.tabList.push(...res.data);
      });
    },
    // 搜索动作库
    searchActionLibraryFun() {
      this.reset();
      searchActionLibrary({
        keyword: this.searchCoachVal,
      }).then((res) => {
        this.commodityList = res.data;
      });
    },
    // 重置数据
    reset() {
      this.current = 1;
      this.commodityList = [];
    },
    // 获取动作库列表
    getActionLibraryFun() {
      let _this = this;
      getActionLibrary({
        list_rows: 20,
        page: _this.current,
        cid: _this.tabList[this.tabsCurrent].id,
      }).then((res) => {
        _this.commodityList = [..._this.commodityList, ...res.data.data];
      });
    },
    // 跳转详情
    goDetail(eve) {
      if (this.type == "selectVideo") {
        let data = {
          index: this.parentIndex,
          videoUrl: eve.video_url,
        };
        uni.$emit("selectVideo", data);
        uni.navigateBack();
      } else {
        uni.navigateTo({
          url: `/pages/myCenter/pages/actiosDetails/actiosDetails?id=${eve.id}`,
        });
      }
    },
    // tabschange改变
    tabsChange(eve) {
      this.tabsCurrent = eve.index;
      this.reset();
      this.getActionLibraryFun();
    },
  },
};
</script>

<style lang="scss" scoped>
.commodity-list {
  .list {
    .li {
      .img-box {
        height: 380rpx;
        width: 100%;
      }
      .time-box {
        .time {
          font-size: 26rpx;
        }
        .watched {
          font-size: 24rpx;
        }
        font-weight: 400;
        color: #999999;
      }
      .li-tit {
        // padding: 0 10rpx;
        font-weight: 500;
        color: #202020;
        line-height: 20px;
        font-size: 28rpx;
        font-family: PingFang SC-Regular, PingFang SC;
        -webkit-background-clip: text;
        line-height: 40rpx;
      }
      width: 49%;
      border-radius: 20rpx;
      overflow: hidden;
      background-color: #fff;
    }
    justify-content: space-between;
    flex-wrap: wrap;
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
  // margin: 40rpx 0;
}
</style>
