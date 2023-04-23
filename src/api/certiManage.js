import request from '@/utils/request'

export default {
  getCertiList(searchModel){
    return request({
      url: '/certi/list',
      method: 'get',
      params: {
        pageNo: searchModel.pageNo,
        pageSize: searchModel.pageSize,
        status: searchModel.status,
        applicantName: searchModel.applicantName
      }
    })
  },
  updateStatus(certi){
    return request({
      url: '/certi/updateStatus',
      method: 'put',
      data: certi
    })
  }
}
