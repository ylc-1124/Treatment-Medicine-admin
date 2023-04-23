import request from '@/utils/request'

export default {

  getPresList(searchModel) {
    return request({
      url: '/prescription/list',
      method: 'get',
      params: {
        pageNo: searchModel.pageNo,
        pageSize: searchModel.pageSize,
        startDate: searchModel.dateRange != null ? searchModel.dateRange[0] : undefined,
        endDate: searchModel.dateRange != null ? searchModel.dateRange[1] : undefined,
        status: searchModel.status
      }
    })
  },
  updateStatus(pres) {
    return request({
      url: '/prescription/update',
      method: 'put',
      data: pres
    })
  },
  addPres(pres){
    return request({
      url: '/prescription/add',
      method: 'post',
      data: pres
    })
  }
}
