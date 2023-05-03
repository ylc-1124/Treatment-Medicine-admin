import request from '@/utils/request'

export default {
  getAllShopCartRecords(){
    return request({
      url: '/shopCart/all',
      method: 'get',
    })
  },
  deleteShopCartRecordById(id){
    return request({
      url: `/shopCart/${id}`,
      method: 'delete',
    })
  },

  //批量删除
  deleteShopCartBatchRecordByIds(ids){
    return request({
      url: "/shopCart",
      method: 'delete',
      data: ids
    })
  },
  addShopCartRecord(product){
    return request({
      url: "/shopCart",
      method: 'post',
      data: product
    })
  },
  updateShopCartRecord(record){
    return request({
      url: "/shopCart",
      method: 'put',
      data: record
    })
  },
}
