import request from '../utils/request.js' 

// 抽奖次数
export function walletInfo(data){
	return request({
		url: 'wallet/wheel/info',
		method: 'POST',
		data
	})
}

// 开始抽奖
export function walletTurn(data){
	return request({
		url: 'wallet/wheel/turn?type='+data.type+'&ten='+data.ten,
		method: 'POST',
		data
	})
}
// 抽奖记录
export function walletRecord(data){
	return request({
		url: 'wallet/wheel/turn_logs',
		method: 'POST',
		data
	})
}


