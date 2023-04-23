import request from '@/utils/request'
// 一个方法对应一个后端接口
export default {
  // 多条件查询用户列表
  getConsultRecordList(searchModel){
    return request({
      url: '/consultRecord/list',
      method: 'get',
      params: {
        pageNo: searchModel.pageNo,
        pageSize: searchModel.pageSize,
        patName: searchModel.patName,
        status:searchModel.status
      }
    })
  },
  updateConsultRecord(conRec){
    return request({
      url: '/consultRecord/update',
      method: 'put',
      data: conRec
    })
  },
}
