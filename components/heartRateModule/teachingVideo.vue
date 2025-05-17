<template>
	<view >
		<modal-tips
			:modalShow="teachingVideoShow"
			title="教学视频"
			:showConfirmButton="true"
			:showCancelButton="false"
			confirmText="关闭"
			@parentConfirm="onTeachingVideoShow"
			slotContentBg="#F8F8F8"
		>
			<view class="video-box">
				<view class="vipde-tabs">
					<u-tabs
						:list="tabList"
						lineColor="#FE5E10"
						:activeStyle="{
							color: '#FE5E10',
							fontWeight: 'bold',
							transform: 'scale(1.05)'
						}"
						:inactiveStyle="{
							color: '#606266',
							transform: 'scale(1)'
						}"
						:current="tabsCurrent"
						@change="tabsChange"
					></u-tabs>
				</view>
				<view class="flex flex-wrap">
					<!-- 动作库列表 -->
					<view class="commodity-list pad20">
						<view class="list flex-row flex-j">
							<view
								class="li mar-b20 pad-b20"
								v-for="(item, index) in commodityList"
								:key="index"
								@click="playVideo(item)"
							>
								<view class="img-box">
									<u--image
										:showLoading="true"
										:src="item.article_images"
										width="100%"
										height="380rpx"
									></u--image>
								</view>
					
								<view
									class="li-tit martb10 padlr20 text-elpis2"
								>
									<u-parse :content="item.article_title"></u-parse>
								</view>
								<view
									class="time-box padlr20"
								>
									<view class="time">
										时长：{{ item.duration || '10' }}秒
									</view>
									<view class="watched mar-t5">
										{{ item.page_view }}人观看
									</view>
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
				<video
					id="myVideo"
					:src="videoSrc"
					controls
					object-fit="fill"
					:loop="true"
					@fullscreenchange="fullscreenchange"
					objectFit="contain"
					v-show="videoShow"
					:autoplay="true"
					:direction="0"
				></video>
			</view>
		</modal-tips>
	</view>
</template>

<script>
	import modalTips from '../modalTips/modalTips.vue';
	import {
		tabsFilter,
		getActionLibrary
	} from '@/api/myCenter.js';
	export default {
		name: "", // 教学视频组件
		components: {
			modalTips
		},
		data() {
			return {
				teachingVideoShow: false,
				tabList: [
					{
						name: '全部',
						id: "",
					}
				],
				// tabs当前选中
				tabsCurrent: 0,
				// 动作库列表
				commodityList: [],
				current: 1,
				videoSrc: "",
				videoContext: "", // 视频控件
				videoShow: false,
			}
		},
		onReady() {
			this.videoContext = uni.createVideoContext('myVideo',this);
		},
		methods: {
			/* 全屏开始播放视频 */
			playVideo(e) {
				/* 视频全屏播放 */
				this.videoSrc = e.video_url
				this.videoShow = true;
				this.videoContext.play();
				this.videoContext.requestFullScreen();
			},
			/* 退出全屏暂停播放 */
			fullscreenchange (e){
			   if(!e.detail.fullScreen){
					this.videoShow = false;
			      this.videoContext.pause()
			   }
			},
			// 重置数据
			reset() {
				this.current= 1;
				this.commodityList = [];
			},
			// tabschange改变
			tabsChange(eve) {
				this.tabsCurrent = eve.index;
				this.reset();
				this.getActionLibraryFun();
			},
			// 获取tabs筛选
			getVideoFilter() {
				tabsFilter({
					type: 'action_library'
				}).then(res => {
					// this.tabList.push(...res.data)
					this.tabList = res.data;
					this.getActionLibraryFun();
				})
			},
			// 获取动作库列表
			getActionLibraryFun() {
				let _this = this;
				getActionLibrary({
					list_rows: 999,
					page: _this.current,
					cid: _this.tabList[this.tabsCurrent].id
				}).then(res => {
					_this.commodityList = [..._this.commodityList, ...res.data.data]
				})
			},
			onTeachingVideoShow() {
				if(!this.teachingVideoShow) {
					this.getVideoFilter()
				}
				this.teachingVideoShow = !this.teachingVideoShow;
				this.$emit("setMetaChange")
			},
		}
	}
</script>

<style lang="scss" scoped>
	.commodity-list {
		height: 60vh;
		overflow-y: scroll;
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
</style>