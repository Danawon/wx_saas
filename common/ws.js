import logrecord from "@/common/log.js"
let isSocketClose = false; // 是否关闭socket
let reconnectCount = 5; // 重连次数
let heartbeatInterval = ""; // 心跳定时器
let socketTask = null; // websocket对象

let againTimer = null; //断线重连定时器


let url = "wss://devsaas.hansifit.com/JbvZhE";
let onReFn = null;
let onSucFn = null;
let onErrFn = null;
let onMsgFn = null; // 接收到消息的回调
let receivedWS = () => {};
/**
 * sockeUrl：websocet的地址
 * onReceive：消息监听的回调
 * onErrorEvent：抛出错误的回调，且弹窗连接失败的提示框
 * onErrorSucceed：抛出成功回调，主要用于隐藏连接失败的提示框
 * */
const socket = (onErrorEvent, onErrorSucceed, onMessageFun) => {
	// onReFn = onReceive;
	onErrFn = onErrorEvent;
	onSucFn = onErrorSucceed;
	onMsgFn = onMessageFun;
	isSocketClose = false;
	//判断是否有websocet对象，有的话清空
	if (socketTask) {
		socketTask.close();
		socketTask = null;
		clearInterval(heartbeatInterval);
	}
	//WebSocket的地址
	// 【非常重要】必须确保你的服务器是成功的,如果是手机测试千万别使用ws://127.0.0.1:9099【特别容易犯的错误】
	// 连接
	socketTask = uni.connectSocket({
		url: url,
		header: {
			'Authorization': uni.getStorageSync("token") ? 'Bearer'+ ' ' +uni.getStorageSync("token") : ''
		},
		success(data) {
			/* 链接成功 */
			// onErrorSucceed()
			clearInterval(againTimer) //断线重连定时器
		},
		fail: (err) => {
			console.log("报错", err);
		}
	});

	// 连接打开
	socketTask.onOpen((res) => {
		clearInterval(againTimer) //断线重连定时器
		heartbeatInterval && clearInterval(heartbeatInterval);
		// 10秒发送一次心跳
		// heartbeatInterval = setInterval(() => {
		// 	sendMsg('heart')
		// }, 1000 * 5)
		heartbeatInterval = setInterval(() => {
			sendMsg(JSON.stringify({
				'event': 'ping',
				'sign': uni.getStorageSync('deviceId') || '',
				'data': {}
			}))
		}, 1000)
	
		/* 链接成功 */
		onErrorSucceed()
		/* 监听收到回调 */
		socketTask.onMessage((res) => {
			let serverData = res.data;
			try {
				const parsedData = JSON.parse(serverData);
				// 如果是心跳响应，直接返回，不处理数据
				if (parsedData.type === 'ping') {
					return;
				}
				// 只处理非心跳消息
				serverData && onMsgFn(serverData);
			} catch (e) {
				console.error('WebSocket消息解析错误:', e);
			}
		});
	})
	// 监听连接失败
	socketTask.onError((err) => {
		//停止发送心跳
		clearInterval(heartbeatInterval)
		//如果不是人为关闭的话，进行重连
		if (!isSocketClose) {
			reconnect(onErrorEvent, onErrorSucceed)
		}
	})

	// // 监听连接关闭 -
	socketTask.onClose((e) => {
		logrecord.warn('socket连接关闭',{
			messge: 'ws服务断开'
		})
		clearInterval(heartbeatInterval)
		if (!isSocketClose) {
			reconnect(onErrorEvent, onErrorSucceed)
		}
	})
}

/* 重链接 */
const reconnect = () => {
	clearInterval(againTimer) //断线重连定时器
	clearInterval(heartbeatInterval);
	socketTask && socketTask.close(); // 确保已经关闭后再重新打开
	socketTask = null;
	onErrFn({
		isShow: true,
		messge: 'ws服务正在重连...'
	})
	logrecord.warn('socket重连',{
		messge: 'ws服务正在重连...'
	})
	// 连接  重新调用创建websocet方法
	againTimer = setInterval(() => {
		socket(onErrFn, onSucFn, onMsgFn)
	}, 1000 * 5)


}

const sendMsg = (msg) => { //向后端发送命令
	try {
		//通过 WebSocket 连接发送数据
		socketTask.send({
			data: msg
		});
	} catch (e) {
		if (isSocketClose) {
			return
		} else {
			reconnect()
		}

	}
}
// 关闭websocket【必须在实例销毁之前关闭,否则会是underfined错误】beforeDestroy() {websocetObj.stop();}

const stop = callBack => {
	callBack && callBack();
	isSocketClose = true
	clearInterval(heartbeatInterval);
	clearInterval(againTimer) //断线重连定时器
	socketTask.close(); // 确保已经关闭后再重新打开
	socketTask = null;
}

export const ws = {
	socket,
	stop,
	sendMsg,
	receivedWS
};
