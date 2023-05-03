import request from '@/utils/request'

export default {
  getAllDeliveryAddressList(){
    return request({
      url: '/address/all',
      method: 'get',
    })
  },
}
