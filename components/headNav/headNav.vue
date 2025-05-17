<template>
	<view class="nav-box">
		<u-navbar
			leftText="返回"
			:title="title"
			safeAreaInsetTop
			:titleStyle="{
				'font-weight': '500',
				color: titColor
			}"
			:fixed="fixed"
			@leftClick="goBackFun"
			:bgColor="bgColor"
		>
			<view class="flex" slot="left">
				<u-icon
					v-if="!leftSlot"
					name="arrow-left"
					size="40rpx"
					:bold="true"
					:color="iconC"
				></u-icon>
				<slot v-else></slot>
			</view>
		</u-navbar>
	</view>
</template>

<script>
export default {
	props: {
		title: {
			type: String,
			default: '标题'
		},
		// 图标颜色
		iconC: {
			type: String,
			default: '#434343'
		},
		// 导航背景颜色
		bgColor: {
			type: String,
			default: '#fff'
		},
		// 标题颜色
		titColor: {
			type: String,
			default: '#434343'
		},
		// 是否固定头部
		fixed: {
			type: Boolean,
			default: false
		},
		// 左侧插槽
		leftSlot: {
			type: Boolean,
			default: false
		},
		// 是否允许返回
		goBack: {
			type: Boolean,
			default: false
		},
		// 是否返回首页
		goIndex: {
			type: Boolean,
			default: false
		},
		/* 反正指定 navigateBack 页码 */
		backIndex: {
			type: Number,
			default: 0,
		},
	},
	data() {
		return {};
	},
	methods: {
		// 返回上一页
		goBackFun() {
			if (this.goBack) {
				// uni.navigateBack();
				let pages = getCurrentPages();
				if (pages[pages.length - 2]) {
					//如果有上一页，就返回上一页
					wx.navigateBack();
				} else {
					uni.switchTab({
						url: '/pages/store/index/index',
						success: function(e) {
							var page = getCurrentPages().pop(); // 返回页面数组的最后一个页面数据
							if (page == undefined || page == null)
								return; //如果最后一个页面为undefined或null，即当前就在首页 return出去，不调用onLoad
							page.onLoad();
						}
					});
				}
			} else if (this.goIndex) {
				uni.switchTab({
					url: '/pages/store/index/index',
					success: function(e) {
						var page = getCurrentPages().pop(); // 返回页面数组的最后一个页面数据
						if (page == undefined || page == null)
							return; //如果最后一个页面为undefined或null，即当前就在首页 return出去，不调用onLoad
						page.onLoad();
					}
				});
			}else if(this.backIndex > 1) {
				uni.navigateBack({
					delta: this.backIndex
				})
			}
		}
	}
};
</script>

<style lang="scss" scoped></style>
