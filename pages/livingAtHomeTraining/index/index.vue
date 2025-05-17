<template>
  <view class="wrap">
    <head-nav :leftSlot="true" title="翰思运动健康" :goBack="false">
      <slot><u-icon name="map" size="0rpx"></u-icon></slot>
    </head-nav>

    <view class="content-box pad20">
      <view class="swiper-box">
        <u-swiper
          :list="swiperArr"
          mgMode=""
          keyName="image"
          height="220rpx"
          radius="10"
        ></u-swiper>
      </view>
      <!-- 选购会员卡 -->
      <view class="select-vipCard mar-t20 pad20">
        <view class="select-tit flex">选购会员卡</view>
        <u-line margin="30rpx 0"></u-line>
        <view
          class="cart-list flex-row flex-a"
          v-for="(listItem, listIndex) in vipCardList"
          :key="listIndex"
          @click="buyCard(listItem)"
        >
          <view class="list-img">
            <u--image
              :showLoading="true"
              :src="listItem.image"
              width="210rpx"
              height="160rpx"
              radius="10rpx"
            ></u--image>
          </view>
          <view class="cart-info flex-col">
            <view class="info-tit">
              {{ listItem.name }}
            </view>
            <view class="info-tips">
              {{ listItem.info }}
            </view>
          </view>
          <view class="cart-buy flex-col flex-a">
            <view class="cart-price flex-row">
              <u-icon
                top="4rpx"
                name="rmb"
                color="#FE5E10"
                size="24rpx"
              ></u-icon>
              <text class="price-num">
                {{ listItem.price }}
              </text>
            </view>
            <view class="cart-buy-btn flex"> 购买 </view>
          </view>
        </view>
        <!-- 查看更多 -->
        <view class="more flex">
          <view class="flex-row" @click="toggleMore">
            <view class="more-icon">
              <u-icon
                :name="moreState ? 'arrow-left-double' : 'arrow-right-double'"
                color="#939393"
                size="25rpx"
              ></u-icon>
            </view>
            <text>
              {{ moreState ? "收起更多" : "展开更多" }}
            </text>
          </view>
        </view>
      </view>

      <!-- 可约人员 教练列表-->
      <view class="coach-box pad20 mar-t20">
        <view class="coach-tit flex-row flex-a mar-t20">
          <u--image
            :showLoading="true"
            :src="baseUrl + 'img11.png'"
            width="40rpx"
            height="40rpx"
          ></u--image>
          <text class="tit-txt">可约人员</text>
        </view>
        <view class="search-box">
          <view class="search-ipt">
            <u-search
              borderColor="#FE5E10"
              shape="round"
              bgColor="#fff"
              height="75rpx"
              placeholder="请输入教练名称"
              :showAction="false"
              :inputStyle="{
                'padding-right': '90rpx',
              }"
              v-model="searchCoachVal"
            ></u-search>
          </view>
          <view class="search-btn flex" @click="searchCoach"> 搜索 </view>
        </view>
        <!-- 预约列表 -->
        <view class="appointment-list">
          <view class="daySelect-box ju-ar">
            <view
              class="day-item flex-col flex-a"
              v-for="(dayItem, dayIndex) in dayArr"
              :key="dayIndex"
              :class="{
                'select-item': selectDateIndex == dayIndex,
              }"
              @click="changeDate(dayIndex)"
            >
              <view class="item-tit">
                {{ dayItem.name }}
              </view>
              <view class="item-date">
                {{ dayItem.date }}
              </view>
              <view class="line" v-if="selectDateIndex == dayIndex"></view>
            </view>
          </view>
          <!-- 选择教练 box -->
          <view class="selectCoach">
            <view
              class="coach-list mar-b20"
              v-for="(coacItem, coacIndex) in personList"
              :key="coacIndex"
            >
              <view class="list-item flex-a pad-r20">
                <view
                  class="item-l"
                  :style="{
                    width: '18%',
                  }"
                >
                  <view class="item-img" @click="onCoach(coacItem)">
                    <u-avatar :src="coacItem.avatar" size="120rpx"></u-avatar>
                  </view>
                </view>

                <view
                  class="item-r flex-col ju-bt"
                  :style="{
                    width: '82%',
                  }"
                >
                  <view class="r-top flex-row flex-a ju-bt">
                    <!-- 私教课数据 -->
                    <view class="itme-name flex-col ju-ar">
                      <view class="name" @click="onCoach(coacItem)">
                        {{ coacItem.name }}
                      </view>

                      <view class="course-time mar-t20">
                        课程时间:
                        {{ coacItem.course_time }}
                      </view>
                      <!-- 标签 -->
                      <view class="strength-tag">
                        <view class="tag-box flex-row flex-a">
                          <text
                            class="newHand"
                            v-for="(item, index) in coacItem.label"
                            :key="index"
                          >
                            {{ item }}
                          </text>
                        </view>
                      </view>
                    </view>

                    <!-- 可约时间段 -->
                    <view class="item-tips flex-col flex-a">
                      <view class="tips-txt"> 待约课时 </view>
                      <view class="tips-num flex">
                        {{ coacItem.period_count }}
                      </view>
                    </view>

                    <!-- 私教课按钮 -->
                    <view class="item-btn">
                      <view
                        class="btn-appointment flex"
                        v-if="coacItem.appointment_status_code == 2"
                        @click="appointmentFun(coacItem)"
                      >
                        预约
                      </view>
                      <view
                        class="btn-sufficient flex"
                        v-if="coacItem.appointment_status_code == 1"
                      >
                        已约满
                      </view>
                      <view
                        class="btn-sufficient flex btn-not"
                        v-if="coacItem.appointment_status_code == 3"
                      >
                        已预约
                      </view>
                      <view
                        class="btn-sufficient flex btn-not"
                        v-if="coacItem.appointment_status_code == 4"
                      >
                        不可约
                      </view>
                    </view>
                  </view>
                  <u-line margin="20rpx 0 0"></u-line>
                </view>
              </view>
            </view>
            <u-empty
              v-if="!personList.length"
              mode="list"
              text="暂无数据..."
            ></u-empty>
          </view>
        </view>
      </view>
    </view>

    <select-time ref="selectTimeRef"></select-time>
  </view>
</template>

<script>
import { baseUrl } from "@/utils/baseUrl.js";
// 选择预约时间组件
import selectTime from "@/components/selectTime/selectTime.vue";
// 获取轮播图
import { getBanner, getVipCard, getReduciblePerson } from "@/api/living.js";
import { timestampToTime } from "@/utils/util.js";
export default {
  components: {
    selectTime,
  },
  data() {
    return {
      baseUrl: baseUrl,
      // 轮播图数组
      swiperArr: [],
      // 搜索教练ipt val
      searchCoachVal: "",
      // 会员卡列表
      vipCardList: [],
      // 获取可约人员
      personList: [],
      // 展开更多状态
      moreState: false,
      // 卡的每页条数
      cardPagesize: 2,
      // 搜索教练当前页
      coachPage: 1,
      // selectDayArr 选择天
      dayArr: [],
      // 选中时间下标
      selectDateIndex: 0,
      // 选中日期
      selectDate: "",
    };
  },
  onLoad() {
    this.getBannerList(); // 获取轮播图
  },
  onShow() {
    this.coachPage = 1;
    this.personList = [];
    this.getReduciblePersonFun(); // 获取可约人员
    this.getVipCardList(); // 会员卡列表
  },
  onReachBottom() {},
  methods: {
    /* 点击教练头像 */
    onCoach(item) {
      uni.navigateTo({
        url: `/pages/store/pages/coachDetail/coachDetail?coachId=${item.id}`,
      });
    },
    // 选中日期change
    changeDate(eve) {
      this.selectDateIndex = eve;
      this.selectDate = this.dayArr[eve].new_date;
      this.getReduciblePersonFun();
    },
    // 切换展开更多状态
    toggleMore() {
      this.moreState = !this.moreState;
      if (this.moreState) {
        this.cardPagesize = 1000;
      } else {
        this.cardPagesize = 2;
      }
      this.getVipCardList();
    },
    // 点击购卡
    buyCard(eve) {
      uni.navigateTo({
        url: `/pages/store/pages/buyCourseDetail/buyCourseDetail?parentData=${JSON.stringify(
          { crad_id: eve.id, type: "typeCard" }
        )}&type=card`,
      });
    },

    // 获取可约人员列表
    getReduciblePersonFun() {
      getReduciblePerson({
        page: this.coachPage,
        list_rows: 20,
        keyword: this.searchCoachVal,
        date: this.selectDate,
      }).then((res) => {
        this.dayArr = res.data.date;
        this.personList = res.data.list;
      });
    },
    // 获取选购会员卡列表
    getVipCardList() {
      getVipCard({
        page: 1,
        list_rows: this.cardPagesize,
      }).then((res) => {
        this.vipCardList = res.data.data;
      });
    },
    // 获取居家轮播图
    getBannerList() {
      getBanner({
        type: "home_training",
      }).then((res) => {
        this.swiperArr = res.data;
      });
    },
    // 查看教练详情
    goCoachDetail(eve) {
      uni.navigateTo({
        url: `/pages/store/pages/coachDetail/coachDetail?coachId=${eve.id}`,
      });
    },
    // 点击预约
    appointmentFun(item) {
      // 打开时间选择组件
      this.$refs.selectTimeRef.openSelectTime({
        courseType: "home_training",
        selectDate: item.period.date,
        coachId: item.id,
        storeId: "",
        homeState: true,
      });
    },
    // 搜索教练
    searchCoach() {
      this.coachPage = 1;
      this.personList = [];
      this.getReduciblePersonFun();
    },
  },
};
</script>

<style lang="scss" scoped>
.daySelect-box {
  .select-item .item-tit {
    color: #202020;
    font-weight: 600;
    font-family: PingFang SC-Semibold, Ping;
  }
  .select-item .item-date {
    font-family: PingFang SC-Medium, PingFang SC;
    font-weight: 500;
    color: #202020;
  }
  .item-tit {
    font-size: 27rpx;
  }
  .item-date {
    font-size: 18rpx;
    margin: 15rpx 0;
  }
  .day-item {
    .line {
      width: 25%;
      height: 5rpx;
      background-color: #202020;
      border-radius: 20rpx;
    }
    width: 14%;
    font-family: PingFang SC-Medium, PingFang SC;
    font-weight: 500;
    color: rgba(0, 0, 0, 0.26);
    flex-shrink: 0;
  }
  display: flex;
  width: 100%;
  height: 100rpx;
  margin-top: 30rpx;
}
.appointment-list {
  .selectCoach {
    .coach-list {
      .list-item {
        .item-l {
          width: 18%;
        }
        .item-r {
          .r-top {
            .periods-time {
              width: 72%;
            }
            .item-btn {
              width: 18%;
            }
            .leagueClass {
              width: 72%;
            }
            width: 100%;
          }
          width: 82%;
        }
        .item-btn {
          .btn-appointment {
            font-size: 26rpx;
            color: rgba(13, 188, 20, 0.9);
          }
          .btn-sufficient {
            color: #fe5e10;
            font-size: 26rpx;
          }
        }
        .item-tips {
          width: 18%;
          margin-top: -35rpx;
          .tips-txt {
            font-size: 24rpx;
            margin-bottom: 15rpx;
            color: #7d7d7d;
          }
          .tips-num {
            width: 75rpx;
            height: 50rpx;
            background-color: #f7f7f7;
            font-weight: bold;
            border-radius: 10rpx;
            border: 1px solid rgba(32, 32, 32, 0.3);
          }
        }
        .itme-name {
          .course-time {
            font-size: 23rpx;
            color: #8b8b8b;
          }
          .strength-tag {
            .tag-box {
              position: absolute;
              left: 0;
              top: 26rpx;
              width: 145%;
            }
            .newHand {
              font-size: 23rpx;
              background: #f8f8f8;
              border-radius: 6rpx;
              padding: 4rpx 9rpx;
              color: #a6a6a6;
              margin-right: 6rpx;
            }
            position: relative;
            height: 60rpx;
          }
          .name {
            font-family: PingFang SC-Regular, PingFang SC;
            font-weight: 400;
            color: #202020;
          }
          justify-content: space-around;
          margin-left: 20rpx;
          height: 100%;
          width: 60%;
        }
        height: 100%;
      }
    }
    width: 100%;
    background-color: eee;
  }
}
.coach-box {
  .search-box {
    .search-btn {
      width: 130rpx;
      height: 80rpx;
      color: #fff;
      font-size: 28rpx;
      margin-left: -20rpx;
      background-color: #fe5e10;
      border-radius: 50rpx;
      position: absolute;
      top: 0;
      right: 0;
    }
    .search-ipt {
      width: 95%;
    }
    width: 100%;
    position: relative;
    margin: 40rpx 0;
  }
  .coach-tit {
    .tit-txt {
      margin-left: 10rpx;
      font-weight: 600;
      color: #434343;
      font-size: 30rpx;
    }
  }
  background-color: #fff;
  border-radius: 20rpx;
}
.select-vipCard {
  .more {
    .more-icon {
      transform: rotate(-90deg);
      margin-right: 6rpx;
      margin-top: 5rpx;
    }
    font-weight: 400;
    color: #939393;
    font-size: 26rpx;
  }
  .cart-list {
    .cart-buy {
      .cart-buy-btn {
        width: 130rpx;
        height: 65rpx;
        color: #fff;
        font-size: 30rpx;
        background: #fe5e10;
        border-radius: 40rpx;
        opacity: 1;
      }
      .cart-price {
        .price-num {
          font-family: DIN-Medium, DIN;
          font-weight: 600;
          color: #fe5e10;
          font-size: 34rpx;
        }
      }
      padding-top: 20rpx;
      height: 150rpx;
      justify-content: space-between;
    }
    .cart-info {
      .info-tips {
        font-family: PingFang SC-Regular, PingFang SC;
        font-weight: 400;
        color: rgba(0, 0, 0, 0.4);
        font-size: 24rpx;
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
      }
      .info-tit {
        font-family: PingFang SC-Medium, PingFang SC;
        font-weight: 600;
        color: #2f2f2f;
        font-size: 30rpx;
      }
      width: 50%;
      // background-color: #f99;
      margin-left: 20rpx;
      height: 150rpx;
      justify-content: space-between;
    }
    margin-top: 30rpx;
    margin-bottom: 40rpx;
  }
  .select-tit {
    font-weight: 550;
    color: #434343;
    font-size: 30rpx;
  }
  background-color: #fff;
  border-radius: 20rpx;
}
.swiper-box {
  width: 100%;
  height: 220rpx;
}
.wrap {
  min-height: 100vh;
  background-color: #f9f9f9;
  opacity: 1;
}
</style>
