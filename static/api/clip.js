import request from '../utils/request.js' 

// 立即体验
export function purchaseList(data){
	return request({
		url: 'gallery/copy/page',
		method: 'POST',
		data
	})
}

// 画册集列表
export function albumPage(data){
	return request({
		url: 'user/album/page',
		method: 'POST',
		data
	})
}

// 画册集草稿列表
export function taskpageList(data){
	return request({
		url: 'user/album/task_page',
		method: 'POST',
		data
	})
}

