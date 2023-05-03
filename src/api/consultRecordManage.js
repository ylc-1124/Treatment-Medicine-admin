import request from '@/utils/request'
// 一个方法对应一个后端接口
export default {
  // 多条件查询用户列表（医生使用）
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
  //查询当前患者所拥有的记录（患者使用）
  getConsultRecordListForPat(searchModel){
    return request({
      url: '/consultRecord/list2',
      method: 'get',
      params: {
        pageNo: searchModel.pageNo,
        pageSize: searchModel.pageSize,
        docName: searchModel.docName,
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
  saveConsultRecord(conRec){
    return request({
      url: '/consultRecord/add',
      method: 'post',
      data: conRec
    })
  }
}
