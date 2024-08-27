import request from '../utils/request.js' 

// 立即体验taskUpscale
export function taskUpscale(data){
	return request({
		url: 'task/upscale',
		method: 'POST',
		data
	})
}
export function taskSuperreal(data){
	return request({
		url: 'task/superreal',
		method: 'POST',
		data
	})
}
// 使用水印
export function taskDownload(data){
	return request({
		url: 'task/download',
		method: 'POST',
		data
	})
}
