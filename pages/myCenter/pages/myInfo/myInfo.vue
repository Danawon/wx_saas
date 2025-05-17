<template>
	<view class="wrap-min">
		<head-nav
			title="个人信息"
			bgColor="#fff"
			:goBack="true"
		></head-nav>
		<view class="content mar-t20 pad20">
			<u-cell-group :border="false">
				<u-cell
					title="头像"
					value="新版本"
					:border="true"
				>
					<view class="flex-row upload-box ju-bt" slot="value">
						<u-upload
							v-if="!parentType"
							:fileList="avatarFile"
							@afterRead="afterReadAfatar"
							:deletable="false"
							name="6"
							multiple
							:maxCount="1"
							width="180rpx"
							height="180rpx"
						>
							<view class="up-icon flex">
								<u-icon
									name="plus"
									color="#999999"
									size="45rpx"
								></u-icon>
							</view>
						</u-upload>
						<u--image
							slot="value"
							v-else
							:showLoading="true"
							:src="avatarFile[0].url"
							width="180rpx"
							height="180rpx"
						></u--image>
						<view v-if="!parentType" class="upload-add" @click="afterReadAfatar">
							<view class="up-icon flex">
								<u-icon
									name="plus"
									color="#999999"
									size="45rpx"
								></u-icon>
							</view>
						</view>
					</view>
					<!-- @delete="deleteAfatar" -->
				</u-cell>
				<u-cell
					@click="openModal(1)"
					:isLink="true"
					title="昵称"
					:value="info.nickname"
					:border="true"
					shape="square"
				></u-cell>
				<u-cell
					:isLink="true"
					title="会员ID"
					:value="info.id"
					:border="true"
				></u-cell>
				<u-cell
					@click="openModal(6)"
					:isLink="true"
					title="手机号"
					:value="info.mobile || '暂无'"
					:border="true"
				></u-cell>
				<u-cell
					:isLink="true"
					title="实名认证"
					:border="true"
					@click="
						goRouter(
							'/pages/myCenter/pages/certification/certification'
						)
					"
				>
					<view
						class="state flex-row flex-a"
						slot="value"
					>
						<view
							class=""
							:class="[
								info.authentication != '1'
									? 'state1'
									: 'state2'
							]"
						>
							实名认证：
						</view>
						<view
							class="state1"
							v-if="info.authentication != '1'"
						>
							未认证
						</view>
						<view class="state2" v-else>已认证</view>
					</view>
				</u-cell>
				<u-cell
					:isLink="true"
					title="性别"
					:value="info.gender ? '男' : '女'"
					:border="true"
					@click="parentType ? sexShow = false : sexShow = true"
				>
					<view class="" slot="value">
						<view
							class=""
						>
							{{ info.gender ? '男' : '女' }}
						</view>

					</view>
				</u-cell>
				<u-cell
					@click="openModal(2)"
					:isLink="true"
					title="身高"
					:value="(Number(info.height) || '--') + 'CM'"
					:border="true"
				></u-cell>
				<u-cell
					:isLink="true"
					title="生日"
					:border="true"
				>
					<view class="" slot="value">
						<picker
							mode="date"
							:value="info.birthday"
							@change="bindDateChange"
							v-if="!parentType"
						>
							<view class="uni-input">
								{{ info.birthday }}
							</view>
						</picker>
						<view class="uni-input" v-else>
							{{ info.birthday }}
						</view>
					</view>
				</u-cell>

				<u-cell
					@click="openModal(4)"
					:isLink="true"
					title="体重"
					:value="(info.weight || '--') + 'KG'"
					:border="true"
				></u-cell>
				<u-cell
					:isLink="true"
					title="理想体重"
					:value="(info.ideal_weight || '--') + 'KG'"
					:border="true"
				></u-cell>
				<u-cell
					@click="openModal(5)"
					:isLink="true"
					title="静息心率"
					:value="(info.rhr  || '--') + '次/分钟'"
					:border="true"
				></u-cell>
				<u-cell
					title="语音播报"
					:border="true"
				>
					<view class="" slot="value">
						<u-switch :disabled="parentType " v-model="info.voice_broadcast" @change="voiceChange"></u-switch>
					</view>
				</u-cell>
			</u-cell-group>
		</view>
		<modal-tips
			ref="modalTipsRef"
			:modalShow="modalShow"
			title="修改信息"
			confirmText="确定"
			cancelText="取消"
			confirmColor="#FE5E10"
			cancelColor="#e5e5e5"
			@parentConfirm="modalConfirm"
			@parentCancel="modalCancel"
		>
			<view class="modalTxt pad-b40 ">
				<u-input
					v-if="typeState == 1"
					placeholder="请输入昵称"
					border="surround"
					v-model="info.nickname"
				></u-input>
				<u-input
					v-if="typeState == 2"
					placeholder="请输入身高"
					border="surround"
					v-model="info.height"
				>
					<text slot="suffix">CM</text>
				</u-input>
				<u-input
					v-if="typeState == 4"
					placeholder="请输入体重"
					border="surround"
					v-model="info.weight"
					
				>
					<template slot="suffix">KG</template> 
				</u-input>
				<u-input
					v-if="typeState == 5"
					placeholder="请输入静息心率"
					border="surround"
					v-model="info.rhr"
				>
				<text slot="suffix">次/分钟</text>
				</u-input>
				<u-input
					v-if="typeState == 6"
					placeholder="请输入手机号"
					border="surround"
					v-model="info.mobile"
					type="number"
				>
				</u-input>
				<view class="mar-t20" v-if="typeState == 6">
					<u-input
						placeholder="请输入验证码"
						border="surround"
						v-model="code"
						type="number"
					>
						<template slot="suffix">
							<u-code
								ref="uCode"
								@change="codeChange"
								seconds="60"
								changeText="X秒重新获取"
							></u-code>
							<u-button
								@tap="getCode"
								:text="tips"
								type="success"
								size="mini"
							></u-button>
						</template>
					</u-input>
				</view>
			</view>
		</modal-tips>
		<!-- 选择性别Sheet -->
		<u-action-sheet
			round="10"
			@close="sexShow = false"
			:safeAreaInsetBottom="true"
			cancelText="取消"
			:actions="sexList"
			title="请选择您的性别"
			:show="sexShow"
			@select="selectSex"
		></u-action-sheet>
	</view>
</template>

<script>
import { baseUrl, baseUrlApi } from '@/utils/baseUrl.js';
import {
	personalDetails,
	editUserinfo,
	sendCode
} from '@/api/myCenter.js';
import modalTips from '@/components/modalTips/modalTips.vue';
import { timestampToTime } from '@/utils/util.js';
export default {
	components: {
		modalTips
	},
	data() {
		return {
			baseUrl: baseUrl,
			// 认证状态
			state: 1,
			info: {
				voice_broadcast: false,
			}, // 个人信息
			modalShow: false,
			typeState: '', // 打开modal的类型
			avatarFile: [], // 头像
			goState: false, // 是否发生跳转
			// 生日日期show
			birthdayShow: false,
			// 性别列表
			sexList: [
				{
					name: '男',
					id: 1
				},
				{
					name: '女',
					id: 0
				}
			],
			// 性别show
			sexShow: false,
			// 上一级页面类型
			parentType: '',
			uId: "", // 用户id
			tips: '', // 倒计时提示文字
			code: "", // 验证码
		};
	},
	onLoad(e) {
		this.parentType = e.type ?? '';
		this.uId = e.uId;
		this.getPersonalDetails();
	},
	onShow() {
		if (this.goState) {
			this.getPersonalDetails();
		}
	},
	methods: {
		codeChange(text) {
			this.tips = text;
		},
		getCode() {
			if(!this.info.mobile) {
				uni.showToast({
					title: "请输入手机号！",
					icon: "none"
				})
				return
			}
			if (this.$refs.uCode.canGetCode) {
				sendCode({
					mobile: this.info.mobile
				}).then(res =>{
					uni.$u.toast('验证码已发送');
					// // 通知验证码组件内部开始倒计时
					this.$refs.uCode.start();
				})
			  
			} else {
			  uni.$u.toast('倒计时结束后再发送');
			}
		},
		updateMobile() {
			if(!this.info.mobile || !this.code) {
				uni.showToast({
					title: "请输入手机号和验证码！",
					icon: "none"
				})
				return
			}
			this.modalCancel();
			this.editUserinfoFun({ mobile: this.info.mobile,yzm_code: this.code });
		},
		/* 语音播报change */
		voiceChange(e) {
			this.editUserinfoFun({ voice_broadcast: this.info.voice_broadcast });
		},
		/* 日期选择change */
		bindDateChange(e) {
			this.editUserinfoFun({ birthday: e.detail.value });
		},
		/* 选择性别 */
		selectSex(e) {
			if (this.parentType) {
				return;
			}
			this.editUserinfoFun({ gender: e.id });
		},
		editUserinfoFun(obj) {
			editUserinfo({
				...obj
			}).then(res => {
				uni.showToast({
					title: res.msg
				});
				setTimeout(() => {
					this.getPersonalDetails();
				}, 1500);
			});
		},
		openModal(type) {
			if (this.parentType) {
				return;
			}
			this.typeState = type;
			this.modalShow = true;
		},
		// modal 确定
		modalConfirm() {
			let programme = {
				1: () => this.callBack("nickname"), /* 修改昵称 */
				2: () => this.callBack("height"), /* 修改身高 */
				4: () => this.callBack("weight"), /* 修改体重 */
				5: () => this.callBack("rhr"), /* 静息心率 */
				6: () => this.updateMobile(),
			}
			programme[this.typeState]()
			
		},
		callBack(key) {
			if(!this.iptIsPass(this.info[key])) {
				return
			} 
			this.modalCancel();
			let obj = {}
			obj[key] = this.info[key];
			/* 静息心率 */
			this.editUserinfoFun(obj);
		},
		/* 判断 输入值 是否合规 */
		iptIsPass(e) {
			let state = true
			if(!e || e <= 0) {
				state = false
				uni.showToast({
					title: "请输入正确数据后提交！",
					icon: "none"
				})
			}
			return state
		},
		modalCancel() {
			this.modalShow = false;
		},
		// 获取个人信息
		getPersonalDetails() {
			personalDetails().then(res => {
				this.info = res.data;
				this.info.voice_broadcast = Boolean(this.info.voice_broadcast)
				this.avatarFile = [{ url: res.data.avatar }];
				/* 静息心率 */
				uni.setStorageSync('rhr', res.data.rhr)
				/* 体重 */
				uni.setStorageSync("weight",  res.data.weight)
			});
		},
		goRouter(eve) {
			if (this.parentType) {
				return;
			}
			if (this.info.authentication != '1') {
				this.goState = true;
				uni.navigateTo({
					url: eve
				});
			}
		},
		// 删除高低图片
		deleteAfatar(event) {
			this.avatarFile.splice(event.index, 1);
		},
		// 新增高低图片
		async afterReadAfatar(eve) {
			uni.chooseImage({
				count: 1,
				success: res => {
					this.uploadFilePromise(res.tempFilePaths[0]);
				}
			})
			
			return
			eve.file.forEach(item => {
				this.uploadFilePromise(item.url);
			});
		},
		uploadFilePromise(url, type) {
			let _this = this;
			uni.uploadFile({
				url: `${baseUrlApi}upload/file`, // 仅为示例，非真实的接口地址
				filePath: url,
				name: 'image',
				header: {
					'authorization':
						'Bearer' +
						' ' +
						uni.getStorageSync('token')
				},
				formData: {
					image: url,
					type: 'clockin'
				},
				success: res => {
					let data = JSON.parse(res.data);
					if(data.code == 200) {
						this.avatarFile = [{ url: data.data }];
						setTimeout(() => {
							this.editUserinfoFun({
								avatar: data.data
							});
						}, 1000);
					}else {
						uni.showToast({
							title: data.msg,
							icon: "none"
						})
					}
					
				},
				fail: err => {
				}
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.upload-box {
	width: 80%;
}
/deep/ .u-upload {
	align-items: flex-end !important;
	flex: 0 !important;
}
.up-icon {
	width: 180rpx;
	height: 180rpx;
	background-color: #f5f5f5;
}
::v-deep .u-cell__body {
	margin-top: 25rpx !important;
}
.state2 {
	color: aquamarine;
}
.state1 {
	color: #ff0d0e;
}
.content {
	background-color: #fff;
}
</style>
