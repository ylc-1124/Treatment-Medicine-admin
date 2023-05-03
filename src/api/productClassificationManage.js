import request from '@/utils/request'

export default {
  getAllProductClassifications(){
    return request({
      url: '/productClassification/all',
      method: 'get',
    })
  },
}
