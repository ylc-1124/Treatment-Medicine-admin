import request from '@/utils/request'

export default {
  getOrderDetailListByOrderId(orderId){
    return request({
      url: `/orderDetails/${orderId}`,
      method: 'get',
    })
  }
}
