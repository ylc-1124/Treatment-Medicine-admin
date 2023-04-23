import request from '@/utils/request'

export default {
  // 多条件查询用户列表
  getPresProdList(presId){
    return request({
      url: '/prescriptionProd/list',
      method: 'get',
      params: {
        presId
      }
    })
  },
}
