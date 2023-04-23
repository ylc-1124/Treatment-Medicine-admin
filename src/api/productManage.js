import request from '@/utils/request'

export default {
  getProductList(searchModel){
    return request({
      url: '/product/list',
      method: 'get',
      params: {
        pageNo: searchModel.pageNo,
        pageSize: searchModel.pageSize,
        prodName :searchModel.prodName,
      }
    })
  },
}
