<template>
	<view>
		<head-nav
			title="健康数据"
			bgColor="#fff"
			:goBack="true"
		></head-nav>
		<!-- 分组数据 -->
		<group ref="groupRef" v-if="type === '1'"></group>
		<!-- 个人数据 -->
		<person ref="personRef" v-if="type === '2'"></person>
	</view>
</template>

<script>
import group from "./components/group.vue"
import person from "./components/person.vue"
export default {
	components: {
		group,
		person
	},
	data() {
		return {
			field: '', // 数据类型
			type: '', // 父级查看类型
			userInfo: {}, // 用户数据
			userId: "", // 用户id
			storeId: "", // 门店id
		};
	},
	onReachBottom() {
		/* 组件数据分页 */
		if(this.type === '1') {
			this.$refs.groupRef.changePage();
		}
	},
	onLoad(e) {
		this.field = e.field;
		this.userId = e.uid;
		this.type = e.type;
		this.storeId = e.storeId;
		setTimeout(() => {
			if(this.type === '2' && this.userId) {
				this.$refs.personRef.getServerData(this.field, this.userId);
			}else {
				this.$refs.groupRef.getStoreDataDisplay(this.field, this.storeId);
			}
		},0)
	},
	methods: {
	}
};
</script>

<style lang="scss" scoped>
</style>
