<template>
	<view>
		<u-popup
			:show="show"
			mode="center"
			@close="show = false"
			round="15"
			:closeable="true"
			:safeAreaInsetBottom="false"
		>
			<view class="content padlr20">
				<view class="title pad20">
					选择快捷语
				</view>
				<view class="li-box">
					<view
						class="li"
						:class="{'selected-li': selectedIndex.includes(index)}"
						v-for="(item, index) in list"
						:key="index"
						@click.stop="onLi(item,index)"
					>
						<view class="txt pad20">
							<text v-if="arouseType">{{ item.name }}</text>
							<text v-else>{{ item.content }}</text>
						</view>
						<u-line margin="10rpx 0 20rpx"></u-line>
					</view>
					<u-empty
						v-if="!list.length"
						mode="list"
						text="暂无数据..."
					></u-empty>
				</view>
				
			</view>
		</u-popup>
	</view>
</template>

<script>
import {
	shortcutList
} from '@/api/sportsTeacher.js';
export default {
	data() {
		return {
			show: false,
			/* 快捷语列表 */
			list: [],
			/* 选中下标 */
			selectedIndex: [],
			/* 课程类型 */
			type: "",
			/* 选中评分类型 */
			scoreType: '',
			arouseType: '', // 唤起类型
		};
	},
	 options: {
	    styleIsolation: 'shared', // 解除样式隔离
	  },
	methods: {
		/* show toggle */
		toggleShow(e) {
			this.show = !this.show;
			this.selectedIndex = [];
			this.arouseType = e.arouseType
			if(e.arouseType) {
				this.list = e.list;
			}else {
				this.list = [];
				this.scoreType = e.radiovalue;
				this.type =  e.type;
				this.getShortcutList();
			}
		},
		/* 选中快捷语 */
		onLi(item, index) {
			if(this.selectedIndex.includes(index)) {
				return
			}
			this.selectedIndex.push(index)
			if(this.arouseType) {
				this.$emit("selectedShortcut", item.name)
			}else {
				this.$emit("selectedShortcut", item.content)
			}
		},
		/* 获取快捷语句 */
		getShortcutList() {
			shortcutList({
				type: this.scoreType,
				product_type: this.type
			}).then(res => {
				this.list = res.data;
			})
		},
	}
};
</script>

<style lang="scss" scoped>
/deep/ .u-popup__content{
	padding: 20rpx 0;
}
.content {
	.title {
		text-align: center;
		font-size: 30rpx;
		color: #333;
	}
	.selected-li {
		background-color: rgba(254, 94, 16, .2);
		border-radius: 10rpx;
	}
	.li-box {
		width: 600rpx;
		height: 800rpx;
		overflow-y: scroll;
		
		.txt {
			font-size: 26rpx ;
			line-height: 38rpx;
		}
	}
}
</style>
