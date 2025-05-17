<template>
	<view>
		<head-nav
			title="翰思运动健康问卷"
			bgColor="#fff"
			:goBack="true"
		></head-nav>
		<u-line></u-line>
		<view class="padlr20 padtb40">
			<view class="head-tips tips mar-b20">
				运动前,请先回答下面的8个问题。如果你的年龄介于15-69岁，请完成以下问题后决定运动前是否应该咨询医生。如果您的年龄高于69岁，且运动不多，请直接咨询医生。
			</view>
			<view
				class="list-box"
				v-for="(item, index) in questionnaireList"
				:key="index"
			>
				<view class="li-tit mar-t20">
					({{ index + 1 }}) {{ item.tit }}
				</view>
				<view class="li-radio felx">
					<u-radio-group
						v-model="item.radioVal"
						placement="row"
						iconPlacement="right"
						:disabled="KHQstate"
						activeColor="#f99"
					>
						<view
							class="radio-item  flex-row mar-t20"
						>
							<u-radio
								class="mar-r20"
								activeColor="red"
								:name="1"
								label="否"
							></u-radio>
							<u-radio
								activeColor="red"
								:name="2"
								label="是"
							></u-radio>
						</view>
					</u-radio-group>
				</view>
			</view>
			<view class="fot-tips tips mar-t40">
				我知道运动对身体带来的收益，同时我也知晓运动也会有一定风险，如果在前8个问题中有回答一个“是”，
				需要停止运动，并去医院就医。同时我愿意承担由运动带来的可能风险。对于我本人的身体相关数据，
				我愿意开放给翰思系统平台，用于对我身体有利的运动指导和其他方案等。
			</view>
			<view
				class="mar-t40 pad20 signature-box flex-col flex-a"
				v-if="signUrl"
			>
				<view class="img-box">
					<view class="img-tans">
						<u--image
							:showLoading="true"
							:src="signUrl"
							width="190rpx"
							height="600rpx"
							mode="scaleToFill"
						></u--image>
					</view>
				</view>
				<view class="time mar-t20">
					签署时间：{{ siginTime }}
				</view>
			</view>
			<view class="flex martb40" v-if="!KHQstate">
				<view class="btn-box">
					<u-button
						type="primary"
						text="去签名"
						@click="goSign"
					></u-button>
				</view>
			</view>
		</view>
		<view class="bnt-box pad20" v-if="!KHQstate">
			<view class="fot-btn flex" @click="submit">
				提交
			</view>
		</view>
		<view class="bnt-box pad20" v-if="KHQstate">
			<view class="record-tit flex-row flex-a">
				<u-avatar
					:src="baseUrl + 'record.png'"
					size="30"
				></u-avatar>
				<view class="tit-txt">历史记录</view>
			</view>
			<view class="record-list mar-t40">
				<view
					class="li padlr20 padtb40 mar-b40"
					v-for="(item, index) in list"
					:key="index"
					@click="onSelectRecord(item.id)"
				>
					<view class="li-tit flex-row flex-a ju-bt">
						<view class="tit-l">
							<view class="tit-date">
								{{ item.time_name }}
							</view>
						</view>
						<view class="tit-r flex-row">
							<u-icon
								name="arrow-right"
								size="20"
							></u-icon>
						</view>
					</view>
				</view>

				<u-empty
					v-if="!list.length"
					mode="list"
					text="暂无历史数据..."
				></u-empty>
			</view>
		</view>
	</view>
</template>

<script>
import { baseUrl, baseUrlApi } from '@/utils/baseUrl.js';
import { timestampToTime } from '@/utils/util.js';
import { saveKHQ, getKHQ } from '@/api/admin.js';
import { getQuestionnaireRecordList } from '@/api/myCenter.js';
export default {
	data() {
		return {
			baseUrl: baseUrl,
			// 问卷列表
			questionnaireList: [
				{
					tit:
						'你的医生是否说过你的心脏有问题,并且告诉你只能进行医生建议的运动项目?',
					radioVal: ''
				},
				{
					tit: '你运动时是否感觉胸痛?',
					radioVal: ''
				},
				{
					tit: '你上个月不运动时是否出现过胸痛状况?',
					radioVal: ''
				},
				{
					tit:
						'你是否曾经因为眩晕而跌倒,或者曾经失去知觉?',
					radioVal: ''
				},
				{
					tit:
						'你的骨骼或关节是否存在某些问题，会随着运动而加重(如背部、膝部和髋部等)?',
					radioVal: ''
				},
				{
					tit:
						'医生现在是否为你的血压或心脏问题开处方药?',
					radioVal: ''
				},
				{
					tit:
						'血糖是否有这样的情况:未得到较好控制，血糖>14mmol/L?',
					radioVal: ''
				},
				{
					tit:
						'你是否知道自己还有一些其他问题,导致不适合参加运动?',
					radioVal: ''
				}
			],
			signUrl: '', // 签名图片
			siginTime: '', // 签名时间
			KHQstate: false,
			KHQImg: '',
			uId: '', // 用户id
			list: [], // 历史列表
			recordId: '' // 历史记录id
		};
	},
	onLoad(e) {
		/* 用户id */
		this.uId = e.uid ?? e.id;
		/* 历史问卷id */
		this.recordId = e.recordId ?? '';
		uni.$off('q-sign');
		// 监听生成签字的图片地址
		uni.$on('q-sign', img => {
			uni.uploadFile({
				url: `${baseUrlApi}upload/file`, // 仅为示例，非真实的接口地址
				filePath: img,
				name: 'image',
				header: {
					'Authori-zation':
						'Bearer' +
						' ' +
						uni.getStorageSync('token')
				},
				formData: {
					image: img,
					type: 'clockin'
				},
				success: res => {
					let data = JSON.parse(res.data);
					this.signUrl = data.data;
					this.siginTime = timestampToTime(
						new Date().getTime() / 1000
					);
				},
				fail: err => {
					console.log(err, '--err');
				}
			});
		});

		this.getKHQFun();
		/* 获取历史问卷调查 */
		this.getQuestionnaireRecordListFun();
	},
	methods: {
		/* 获取历史记录 */
		getQuestionnaireRecordListFun() {
			getQuestionnaireRecordList({
				uid: this.uId
			}).then(res => {
				this.list = res.data;
			});
		},
		/* 选中历史列表 */
		onSelectRecord(id) {
			uni.navigateTo({
				url: `/pages/myCenter/pages/healthQuestionnaire/healthQuestionnaire?uid=${
					this.uId
				}&recordId=${id}`
			});
		},

		// 获取健康数据
		getKHQFun() {
			getKHQ({
				uid: this.uId,
				id: this.recordId
			}).then(res => {
				if (Array.isArray(res.data.data)) {
					this.KHQstate = false;
				} else {
					this.KHQstate = true;
					this.KHQImg = res.data.data.pdf_image;
					this.signUrl =
						res.data.data.original_sign_image;
					this.siginTime = res.data.data.createtime;
					JSON.parse(res.data.data.radio_arr).forEach(
						(item, index) => {
							this.questionnaireList[
								index
							].radioVal = item;
						}
					);
				}
			});
		},
		// 去签名
		goSign() {
			uni.navigateTo({
				url: '/uni_modules/q-sign/pages/q-sign'
			});
		},
		// 保存
		submit() {
			let radioArr = [];
			this.questionnaireList.map(item => {
				if (item.radioVal) {
					radioArr.push(item.radioVal);
				}
			});
			if (!this.signUrl) {
				uni.showToast({
					title: '请签名之后在提交哦~',
					icon: 'none'
				});
				return;
			}
			if (radioArr.length < 8) {
				uni.showToast({
					title: '请选择所有健康问卷后提交哦~',
					icon: 'none'
				});
				return;
			}
			saveKHQ({
				createtime: this.siginTime,
				sign_image: this.signUrl,
				radio_arr: JSON.stringify(radioArr)
			}).then(res => {
				uni.showToast({
					title: res.msg
				});
				setTimeout(() => {
					this.getKHQFun();
				}, 1500);
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.record-list {
	.li {
		border-radius: 20rpx;
		box-shadow: 1px 1px 10rpx 5rpx #ccc;
		.tit-date {
			font-size: 30rpx;
			font-weight: bold;
		}
	}
}
.record-tit {
	.tit-txt {
		margin-left: 10rpx;
	}
	background-color: #fafafa;
	font-size: 35rpx;
}
/deep/ .u-radio {
	.u-radio__icon-wrap--disabled--checked {
		background-color: #005ef6 !important;
		background: #005ef6 !important;
		.u-icon__icon {
			color: #fff !important;
		}
	}
}
.KHQ-box {
	image {
		width: 100%;
		height: calc(100vh - 180rpx);
	}
	width: 100vw;
	height: calc(100vh - 180rpx);
	// background-color: #f99;
}
.img-box {
	.img-tans {
		transform: rotate(270deg);
		position: absolute;
		top: -200rpx;
		left: 207rpx;
	}
	position: relative;
	width: 600rpx;
	height: 200rpx;
	overflow: hidden;
}
.btn-box {
	width: 200rpx;
}
.fot-btn {
	background: #fe5e10;
	border-radius: 40rpx;
	height: 80rpx;
	color: #fff;
}
.fot-tips {
	color: rgba(0, 0, 0, 0.9);
}
.signature-box {
	.time {
		font-weight: 400;
		color: rgba(0, 0, 0, 0.4);
		font-size: 22rpx;
	}
	background: #f5f5f5;
	border-radius: 20rpx;
}
.list-box {
	/deep/ .u-radio__text {
		margin-right: 15rpx;
	}
	/deep/ .u-radio {
		margin-right: 30rpx;
	}
	.radio-item {
		justify-content: flex-end;
		width: 100%;
	}
	.li-tit {
		line-height: 50rpx;
		font-weight: 550;
		color: rgba(0, 0, 0, 0.9);
		font-size: 26rpx;
	}
}
.tips {
	font-weight: 500;
	color: rgba(0, 0, 0, 0.9);
	font-size: 26rpx;
	line-height: 50rpx;
}
</style>
