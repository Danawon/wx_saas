import { baseUrlApi } from "@/utils/baseUrl.js"
import logrecord from "@/common/log.js"
/* 获取是否授权使用蓝牙 */
export const authorizationBluetoothStatus = () => {
	wx.getSetting({
		success: (res) => {
			wx.authorize({
				scope: 'scope.bluetooth',
				success: () => {
					/* 用户同意授权 */
				},
				fail: (err) => {
					logrecord.warn('微信检测蓝牙状态异常',{
						errInfo: JSON.stringify(err)
					})
					if(!uni.getStorageSync("scope.bluetooth")) {
						wx.showModal({
							content: '检测到您没打开此小程序的蓝牙，是否去设置打开？',
							confirmText: "确认",
							cancelText: "取消",
							success: function(res) {
								//点击“确认”时打开设置页面
								if (res.confirm) {
									wx.openSetting({
										success: (res) => {}
									})
								} else {
									/* 用户点击取消 */
								}
								uni.removeStorageSync("scope.bluetooth")
							}
						});
					}
					uni.setStorageSync("scope.bluetooth", true)
				}
			})
		}
	})
}
/* 获取用户权限 是或授权使用中活离开后 都获取定位 实现小程序后天不被杀死 */
export const getAuthorizeUserLocationBackgroundState = callBack => {
	uni.getSetting({
		success(res) {
			if (!res.authSetting['scope.userLocationBackground']) {
				uni.authorize({
					scope: 'scope.userLocationBackground',
					success: () => {},
					fail(res) {
						callBack(false)
					}
				})
			} else {
				callBack(true)
			}
		}
	})
}
/* 开启监听位置变化 */
export const startLocationUpdateBackground = () => {
	wx.startLocationUpdateBackground({
		success: (res) => {
			// 开始监听位置变化
			wx.onLocationChange(() => {
				// 位置发生改变
			})
		},
		fail: (res) => {
		},
	});
}
/* // 关闭监听位置变化 */
export const closeLocaionListener = () => {
	wx.offLocationChange() // 关闭监听位置变化
	wx.stopLocationUpdate()
}
/* 
	音频实例
		low 低强度.mp3
		height 高强度.mp3
		middle_low 中低强度.mp3
		middle_h_add 中高加.mp3
		middle_h 中高强度.mp3
		middle 中强度.mp3
		prepare 心肺功能测试准备.mp3
		over 热身结束后.mp3
		start_test 正式测试.mp3
	
*/
let innerAudioContext = "";

/* 初始化音频实例 */
export const createInnerAudio = () => {
	/* 创建音频实例 */
	innerAudioContext = uni.createInnerAudioContext();
}
/* 音频播放 */
export const audioPlay = audioUrl => {
	// 是否遵循系统静音开关
	innerAudioContext.obeyMuteSwitch = false;
	innerAudioContext.src = audioUrl;
	/* 播放回调 */
	innerAudioContext.play();
	innerAudioContext.onError(err => {
	})
}
/* 销毁音频实例 回调 停止不放 */
export const audioDestroy = () => {
	innerAudioContext.destroy()
}

/* 转移 img数组格式 返回图片字符串格式 */
export const editStr = e => {
	let str = '';
	e.forEach((item, index) => {
		if (index == e.length - 1) {
			str = str + item.url;
		} else {
			str = str + item.url + ',';
		}
	});
	return str
}
/* 转移 img字符串 返回图片数组格式 */
export const editArr = e => {
	let arr = [];
	if (Array.isArray(e)) {
		e.forEach(item => {
			arr.push({
				url: item
			})
		})
	} else {
		e.split(",").forEach(item => {
			arr.push({
				url: item
			})
		})
	}
	return arr

}
/**
 * 用户授权读取微信运动数据
 */
export const authorizeWeRun = () => {
	// var that = this
	//首先获取用户的授权状态
	wx.getSetting({
		success(res) {
			if (!res.authSetting['scope.werun']) {
				// 如果用户还未授权过，需要用户授权读取微信运动数据
				wx.authorize({
					scope: 'scope.werun',
					success() {
						//读取微信步数数据
						// that.getWeRunData()
					},
					fail() {
						//如果用户拒绝授权，提示用户需要同意授权才能获取他的微信运动数据					  
						wx.showModal({
							title: '读取微信运动数据失败',
							content: '检测到您没打开此小程序的微信步数权限，是否去设置打开？',
							confirmText: "确认",
							cancelText: "取消",
							success: function(res) {
								//点击“确认”时打开设置页面
								if (res.confirm) {
									uni.openSetting({
										success: (res) => {}
									})
								} else {
								}
							}
						});
					}
				})
			} else {
				//如果用户已授权过，直接开始同步微信运动数据
				//读取微信步数数据
				// that.getWeRunData()
			}
		}
	})
}
//引导用户开启权限
export const  isAuth = () => {
  uni.showModal({
	content: '由于您还没有允许保存图片到您相册里,无法进行保存,请点击确定允许授权',
	success: (res) => {
	  if (res.confirm) {
		uni.openSetting({
		  success: (result) => {

		  }
		});
	  }
	}
  });
}

/* 下载图片到本地 */
export const downLoadImg = (url) =>{
  //下载图片资源至本地，返回文件的本地临时路径
  uni.downloadFile({
	url: url,
	success: (res) =>{
	  if (res.statusCode === 200){
		//保存图片至相册
		uni.saveImageToPhotosAlbum({
		  filePath: res.tempFilePath,
		  success: () => {
			uni.showToast({
			  title: "保存成功",
			  icon: "none"
			});
		  },
		  fail: () => {
			uni.showToast({
			  title: "保存失败，请稍后重试",
			  icon: "none"
			});
		  }
		});
	  }
	}
  })
}
/* 生成图片 */
export const generateImg = () => {
	return new Promise((resolve, reject) => {
		uni.authorize({
			scope: 'scope.writePhotosAlbum',
			success: () => {
			  // 已授权
			 resolve(true)
			},
			fail: () => {
			  // 拒绝授权，获取当前设置
			  uni.getSetting({
				success: (result) => {
				  if (!result.authSetting['scope.writePhotosAlbum']) {
					isAuth()
				  }
				}
			  });
			}
		})
	})
		
}
/* 上传图片 */
export const uploadFilePromise = (url) => {
	return new Promise((resolve, reject) => {
		uni.uploadFile({
			url: `${baseUrlApi}upload/file`, // 仅为示例，非真实的接口地址
			filePath: url,
			name: 'image',
			header: {
				'Authori-zation':
					'Bearer' +
					' ' +
					uni.getStorageSync('token')
			},
			formData: {
				type: "store"
			},
			success: (res) => {
				let data = JSON.parse(res.data);
				if(data.code == 200) {
					resolve({data: data.data})
				}else {
					uni.showToast({
						title: "上传失败！",
						icon: "error"
					})
					reject();
				}
			}
		});
	})
}