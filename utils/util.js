const formatTime = date => {
	const year = date.getFullYear()
	const month = date.getMonth() + 1
	const day = date.getDate()
	const hour = date.getHours()
	const minute = date.getMinutes()
	const second = date.getSeconds()

	return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
	n = n.toString()
	return n[1] ? n : '0' + n
}

const showToast = ({
	title
}) => {
	return new Promise((resolve, reject) => {
		uni.showToast({
			title: title,
			icon: "none",
			success: result => {
				resolve(result);
			},
			fail: error => {
				reject(error);
			}
		});
	});
};

// 过滤时间
const timestampToTime = (timestamp, type) => {
	let date = new Date(timestamp * 1000); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
	let Y = date.getFullYear() + '-';
	let M =
		(date.getMonth() + 1 < 10 ?
			'0' + (date.getMonth() + 1) :
			date.getMonth() + 1) + '-';
	let D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' ';
	let h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
	let m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes());
	// let s = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()) + '';
	// return Y + M + D + h + m + s;
	if(type) {
		return Y + M + D;
	}else {
		return Y + M + D + h + m;
	}
}
/* 转换分钟和秒 */
const filterMinuteAndS = time => {
	let m = parseInt(time / 60)
	m = m < 10 ? '0' + m : m
	let s = parseInt(time % 60)
	s = s < 10 ? '0' + s : s
	return `${m}:${s}`
}
// wx支付
const wxPay = (eve,callBack) => {
	uni.requestPayment({
		provider: 'wxpay',
		timeStamp: eve.timeStamp,
		nonceStr: eve.nonceStr,
		package: eve.package,
		signType: eve.signType,
		paySign: eve.paySign,
		success: function(res) {
			callBack(res)
			uni.showToast({
				title: '微信支付成功',
				icon: 'success'
			});
		},
		fail: function(err) {
			uni.showToast({
				title: '支付失败',
				icon: 'error'
			});
		}
	});
}

module.exports = {
	formatTime: formatTime,
	showToast: showToast,
	timestampToTime,
	filterMinuteAndS,
	wxPay,
}
