import request from '../utils/request.js' 

// 创建解析任务
export function describe(data){
	return request({
		url: 'user/describe',
		method: 'POST',
		data
	})
}

// 获取解析列表
export function describePage(data){
	return request({
		url: 'user/describe/page',
		method: 'POST',
		data
	})
}
// 删除解析
export function deleteBatch(data){
	return request({
		url: 'user/describe/deleteBatch',
		method: 'DELETE',
		data
	})
}
// 解析详情
export function detail(data){
	return request({
		url: 'user/describe/detail/'+data.id,
		method: 'POST',
		data
	})
}
