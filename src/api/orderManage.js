import request from '@/utils/request'

export default {
  addOrder(orderData){
    return request({
      url: '/order',
      method: 'post',
      data:orderData
    })
  },
  getOrderList(searchModel){
    return request({
      url: '/order/list',
      method: 'get',
      params: {
        pageNo: searchModel.pageNo,
        pageSize: searchModel.pageSize,
        orderNo: searchModel.orderNo,
        status: searchModel.status
      }
    })
  },
  getOrderListForAdmin(searchModel){
    return request({
      url: '/order/list2',
      method: 'get',
      params: {
        pageNo: searchModel.pageNo,
        pageSize: searchModel.pageSize,
        orderNo: searchModel.orderNo,
        status: searchModel.status
      }
    })
  },

  //主要为了更新订单状态
  updateOrder(order){
    return request({
      url: '/order',
      method: 'put',
      data: order
    })
  },

  confirmReceivedByOrderId(orderId){
    return request({
      url: `/order/confirmReceived/${orderId}`,
      method: 'put',
    })
  },

  removeOrder(orderId){
    return request({
      url: `/order/${orderId}`,
      method: 'delete',
    })
  }

}
