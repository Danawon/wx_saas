<template>
	<view>
		<head-nav
			title="添加运营专员"
			bgColor="#fff"
			:goBack="true"
		></head-nav>
		<view class="pad40">
			<view class="account-box">
				<view class="account flex-row flex-a">
					<view class="lable">账号</view>
					<view class="lable-val">
						<u--input
							placeholder="请输入账号"
							border="none"
							v-model="accountVal"
							:customStyle="{
								height: '90rpx',
								background: '#F5F5F5',
								padding: '20rpx 25rpx',
								'border-radius': '20rpx'
							}"
						></u--input>
					</view>
				</view>
				<view class="pasword flex-row flex-a mar-t40">
					<view class="lable">密码</view>
					<view class="lable-val">
						<u--input
							placeholder="请输入密码"
							border="none"
							v-model="password"
							:customStyle="{
								height: '90rpx',
								background: '#F5F5F5',
								padding: '20rpx 25rpx',
								'border-radius': '20rpx'
							}"
						></u--input>
					</view>
				</view>
			</view>
			<u-line margin="50rpx 0"></u-line>
			<view class="permission-box">
				<view class="tit martb40">功能权限配置</view>
				<u-checkbox-group
					v-model="selectCheck"
					placement="row"
				>
					<view class="li-box flex-row flex-a ju-bt">
						<view
							class="li mar-b40 flex"
							v-for="(item,
							index) in permissionList"
							:key="index"
						>
							<u-checkbox
								:checked="
									selectCheck.includes(
										item.tit
									)
								"
								:label="item.tit"
								:name="item.tit"
							></u-checkbox>
						</view>
					</view>
				</u-checkbox-group>
				<u-line margin="10rpx 0 50rpx 0"></u-line>
				<u-checkbox-group
					v-model="otherCheck"
					placement="row"
				>
					<view class="li-box flex-row flex-a ju-bt">
						<view
							class="li mar-b40 "
							v-for="(item,
							index) in otherList"
							:key="index"
						>
							<u-checkbox
								:checked="
									selectCheck.includes(
										item.tit
									)
								"
								:label="item.tit"
								:name="item.tit"
							></u-checkbox>
						</view>
					</view>
				</u-checkbox-group>
			</view>
		</view>
		<view class="fot-btn pad20">
			<view class="btn flex" @click="confirmFun">
				保存
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			// 账号
			accountVal: '',
			// password
			password: '',
			// 权限列表
			permissionList: [
				{
					tit: '审核管理'
				},
				{
					tit: '新增/删除门店'
				},
				{
					tit: '管理门店'
				},
				{
					tit: '会员卡审核'
				},
				{
					tit: '训练计划模板'
				},
				{
					tit: '动作库管理'
				},
				{
					tit: '审核产品'
				},
				{
					tit: '课程模板管理'
				},
				{
					tit: '健康文案管理'
				},
				{
					tit: '协议管理'
				},
				{
					tit: '体适能评估系统配置'
				},
				{
					tit: '购物商城配置'
				},
				{
					tit: '积分奖励配置'
				},
				{
					tit: '广告页配置'
				},
				{
					tit: '居家训练产品配置'
				},
				{
					tit: '打卡产品配置'
				}
			],
			// 选中的check
			selectCheck: ['管理门店'],
			// 其他权限
			otherList: [
				{
					tit: '平台产品的销售流水查询/销售数据统计查询'
				},
				{
					tit: '运动管理师/营养师医生的服务记录查询'
				},
				{
					tit: '运动管理师/营养师医生的账户余额查询和提现操作'
				},
			],
			// 选中其他权限
			otherCheck: [],
		};
	},
	methods: {
		confirmFun() {
		}
	}
};
</script>

<style lang="scss" scoped>
	/deep/ .u-checkbox {
		text {
			line-height: 40rpx !important;
		}
	}
.li-box {
	.li {
		// min-width: 33.33%;
		margin-right: 30rpx;
	}
	flex-wrap: wrap;
}
.tit {
	font-weight: 400;
	color: rgba(0, 0, 0, 0.9);
	font-size: 36rpx;
}
.fot-btn {
	.btn {
		height: 80rpx;
		border-radius: 40rpx;
		color: #fff;
		background: #fe5e10;
		font-weight: 400;
		font-size: 32rpx;
	}
	position: fixed;
	bottom: 20rpx;
	width: 100%;
	left: 0;
	background-color: #fff;
}
.account-box {
	.lable-val {
		width: 80%;
	}
	.lable {
		width: 20%;
		padding-left: 10rpx;
	}
}
</style>
