<template>
	<view class="wrap">
		<head-nav title="协议" goBack="true"></head-nav>
		<view class="agreement-box pad20 mar-t20">
				<u-parse :content="content"></u-parse>
		</view>
	</view>
</template>

<script>
	import { getAgreement } from "@/api/storeApis.js"
	export default {
		data() {
			return {
				content: '',
			}
		},
		onLoad() {
			this.getAgreement();
		},
		methods: {
			getAgreement(){
				getAgreement().then(res => {
					this.content = res.data
				})
			}
		}
	}
</script>

<style lang="scss" scoped>


</style>
