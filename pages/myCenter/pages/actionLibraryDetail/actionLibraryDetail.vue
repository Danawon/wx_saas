<template>
	<view>
		<head-nav
			title="知识库详情"
			bgColor="#fff"
			:goBack="true"
		></head-nav>
		<view class="content-box pad20">
			<view class="head-tit">{{ dataObj.article_title }}</view>
			<view class="content-info pad-b20">
				<u-parse :content="dataObj.article_content"></u-parse>
			</view>
		</view>
	</view>
</template>

<script>
import { baseUrl } from '@/utils/baseUrl.js';
import { knowledgeDetail } from "@/api/myCenter.js"
export default {
	data() {
		return {
			baseUrl: baseUrl,
			id: "", // 知识详情
			dataObj: {}, // 知识数据
		};
	},
	onLoad(eve) {
		this.id = eve.id;
		this.getKnowledgeDetail();
	},
	methods: {
		getKnowledgeDetail() {
			knowledgeDetail({
				id: this.id
			}).then(res => {
				this.dataObj = res.data;
			})
		},
	},
};
</script>

<style lang="scss" scoped>
.content-info {
	font-weight: 400;
	color: #999999;
	font-size: 28rpx;
	text-indent: 2em;
	line-height: 50rpx;
}
.img-box {
	width: 100%;
	height: 350rpx;
	image {
		width: 100%;
		height: 100%;
	}
}
.head-tit {
	font-weight: 600;
	color: #202020;
	font-size: 32rpx;
}
</style>
