<template>
	<view>
		<head-nav
			title="知识库"
			bgColor="#fff"
			:goBack="true"
		></head-nav>
		<view class="head-tit pad-t20 pad-l20 pad-r20">
			<view class="tit-1">健康知识，先来问问</view>
			<view class="tit-2">
				翰思健康致力于提供专业健康信息服务
			</view>
		</view>
		<view class="search-box  pad20">
			<view class="search-ipt">
				<u-search
					borderColor="#FE5E10"
					shape="round"
					bgColor="#fff"
					height="70rpx"
					placeholder="搜索关键词"
					:showAction="false"
					:inputStyle="{
						'padding-right': '95rpx'
					}"
					v-model="searchCoachVal"
				></u-search>
			</view>
			<view class="search-btn flex" @click="searchCoach">
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
		<view class="list-box pad-l40 pad-r40 pad-t20 pad-b40">
			<view
				class="li mar-t20"
				v-for="(item, index) in list"
				:key="index"
				@click="goDetails(item)"
			>
				<view class="img-box">
					<image
						:src="item.article_images"
						mode=""
					></image>
				</view>
				<view class="li-tit pad20">
					{{ item.article_title }}
				</view>
				<view class="text-more pad-l20 pad-r20 pad-b20">
					<xzj-readMore hideLineNum="4" showHeight="100">
						{{ item.short_content }}
					</xzj-readMore>
				</view>
			</view>
			<!-- <view class="answer pad20 mar-t20">
				<view class="answer-tit">
					吃槟榔会影响我单手开法拉利吗？
				</view>
				<view class="answer-val mar-t20">
					不会的，亲
				</view>
			</view> -->
		</view>
		
		<u-empty
			v-if="!list.length"
			mode="list"
			text="暂无数据..."
		></u-empty>
	</view>
</template>

<script>
import { baseUrl } from '@/utils/baseUrl.js';
import { knowledgeBase, tabsFilter } from '@/api/myCenter.js';
import xzjReadMore from "../components/xzj-readMore/xzj-readMore.vue"
export default {
	components: {
		xzjReadMore
	},
	data() {
		return {
			baseUrl: baseUrl,
			searchCoachVal: '',
			tabList: [
				{
					name: '全部',
					id: ''
				}
			],
			// tabs当前选中
			tabsCurrent: 0,
			// 知识id
			knowledgeId: '',
			// 当前页
			current: 1,
			// 知识库列表
			list: []
		};
	},
	onLoad(eve) {
		this.getVideoFilter();
	},
	onShow() {
		this.reset();
		this.getKnowledgeBase();
	},
	methods: {
		// 获取tabs筛选
		getVideoFilter() {
			tabsFilter({
				type: 'knowledge_base'
			}).then(res => {
				this.tabList.push(...res.data)
			})
		},
		reset() {
			this.current = 1;
			this.list = [];
		},
		// 获取知识库列表
		getKnowledgeBase() {
			knowledgeBase({
				cid: this.tabList[this.tabsCurrent].id,
				page: this.current,
				list_rows: 20
			}).then(res => {
				this.list = [
					...this.list,
					...res.data.data
				];
			});
		},
		// 跳转详情
		goDetails(eve) {
			uni.navigateTo({
				url:
					`/pages/myCenter/pages/actionLibraryDetail/actionLibraryDetail?id=${eve.id}`
			});
		},
		// tabschange改变
		tabsChange(eve) {
			this.tabsCurrent = eve.index;
			this.reset();
			this.getKnowledgeBase();
		}
	}
};
</script>

<style lang="scss" scoped>
.list-box {
	.answer {
		.answer-val {
			font-weight: 400;
			color: #999999;
			font-size: 24rpx;
		}
		.answer-tit {
			font-size: 32rpx;
			font-weight: 600;
		}
		width: 100%;
		box-shadow: 0px 8rpx 20rpx 0px rgba(0, 0, 0, 0.15);
		height: 140rpx;
		border-radius: 10rpx;
	}
	.li {
		.li-tit {
			font-weight: 600;
			color: #202020;
			font-size: 32rpx;
		}
		.img-box {
			width: 100%;
			height: 350rpx;
			image {
				width: 100%;
				height: 100%;
			}
		}
		border-radius: 10rpx;
		box-shadow: 0px 8rpx 20rpx 0px rgba(0, 0, 0, 0.15);
		width: 100%;
		// height: 400rpx;
	}
}
.head-tit {
	.tit-2 {
		font-weight: 300;
		color: #ffa376;
		font-size: 26rpx;
		margin-top: 10rpx;
	}
	.tit-1 {
		font-weight: 600;
		font-size: 35rpx;
		color: #202020;
	}
	padding-bottom: 10rpx;
}
.search-box {
	.search-btn {
		width: 150rpx;
		height: 75rpx;
		color: #fff;
		font-size: 28rpx;
		margin-left: -20rpx;
		background: linear-gradient(
			102deg,
			#ff7c3c 0%,
			#fe5e10 100%
		);
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
