<template>
	<view>
		<head-nav
			title="筛选选择"
			bgColor="#fff"
			:goBack="true"
		></head-nav>
		<view class="list">
			<u-cell-group>
				<u-cell
					@click="selectlist(item)"
					v-for="(item, index) in list"
					:key="index"
					isLink
					:title="item.name"
				>
					<u-icon
						slot="icon"
						color="#55aaff"
						size="23"
						name="calendar"
					></u-icon>
				</u-cell>
			</u-cell-group>
		</view>
		<u-empty
			v-if="!list.length"
			mode="list"
			text="暂无数据..."
		></u-empty>
	</view>
</template>

<script>
import {
	getSelectAnnual,
	getSelectQuarterly,
	getSelectMonthly,
	getSelectWeek
} from '@/api/myCenter.js';
export default {
	data() {
		return {
			list: [],
			type: '',
			uid: ''
		};
	},
	onLoad(e) {
		this.type = e.type;
		this.uid = e.uid;
		if (e.type == 1) {
			/* 月 */
			this.getSelectMonthlyFun();
		} else if (e.type == 2) {
			/* 季度 */
			this.getSelectQuarterlyFun();
		} else if (e.type == 3) {
			/* 年 */
			this.getSelectAnnualFun();
		}else if(e.type == 0) {
			this.getSelectWeekFun();
		}
	},
	methods: {
		/* 列表选中 */
		selectlist(e) {
			uni.$emit("childSelect", {
				type: this.type,
				name: e.lable,
				value: e.value,
				val: e.val
			})
			uni.navigateBack()
		},
		/* 获取周 */
		getSelectWeekFun() {
			getSelectWeek({
				uid: this.uid
			}).then(res => {
				this.list = res.data;
			});
		},
		/* 获取年筛选 */
		getSelectAnnualFun() {
			getSelectAnnual({
				uid: this.uid
			}).then(res => {
				this.list = res.data;
			});
		},
		/* 获取季度筛选 */
		getSelectQuarterlyFun() {
			getSelectQuarterly({
				uid: this.uid
			}).then(res => {
				this.list = res.data;
			});
		},
		/* 获取月筛选 */
		getSelectMonthlyFun() {
			getSelectMonthly({
				uid: this.uid
			}).then(res => {
				this.list = res.data;
			});
		}
	}
};
</script>

<style lang="scss" scoped></style>
