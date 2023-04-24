import request from '@/utils/request'

export default {
  getHospitalList(searchModel){
    return request({
      url: '/hospital/list',
      method: 'get',
      params: {
        pageNo: searchModel.pageNo,
        pageSize: searchModel.pageSize,
        hospName: searchModel.hospName
      }
    })
  },
}
