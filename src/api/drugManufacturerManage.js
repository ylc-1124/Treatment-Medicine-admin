import request from '@/utils/request'

export default {
  // 条件分页查询
  getManuList(searchModel){
    return request({
      url: '/manufacturer/list',
      method: 'get',
      params: {
        pageNo: searchModel.pageNo,
        pageSize: searchModel.pageSize,
        name: searchModel.name,
        approvalNumber: searchModel.approvalNumber,
      }
    })
  },
  addManu(manu){
    return request({
      url: '/manufacturer/add',
      method: 'post',
      data: manu
    })
  },
  updateManu(manu){
    return request({
      url: '/manufacturer/update',
      method: 'put',
      data: manu
    })
  },
  getManuById(id){
    return request({
      url: `/manufacturer/${id}`,
      method: 'get'
    })
  },
  saveManu(manu){
    if (manu.id == null || manu.id == undefined){
      return this.addManu(manu)
    } else{
      return this.updateManu(manu)
    }
  },
  deleteManuById(id) {
    return request({
      url: `/manufacturer/delete/${id}`,
      method: 'delete'
    })
  }
}
