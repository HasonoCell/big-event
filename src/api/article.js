import request from '../utils/request.js'

export const artGetChannelService = () => request.get('/my/cate/list')

export const artChangeChannelService = (data) => 
    request.put('/my/cate/info', data)
export const artAddChannelService = (data) => 
    request.post('/my/cate/add', data)

export const artDelChannelService = (id) => 
    request.delete('/my/cate/del', {
        params: { id }
    })

export const artGetListService = (params) => 
    request.get('/my/article/list', { params })

export const artDelListService = (id) => 
    request.delete('/my/article/info', { 
        params: { id } 
    })

export const artPublishService = (data) => 
    request.post('/my/article/add', data)

export const artGetDetailService = (id) => 
    request.get('my/article/info', { params: { id } })

export const artEditService = (data) => 
    request.put('my/article/info', data)