import request from '@/utils/request'

export default {
  // 多条件查询用户列表
  getDrugList(searchModel){
    return request({
      url: '/drug/list',
      method: 'get',
      params: {
        pageNo: searchModel.pageNo,
        pageSize: searchModel.pageSize,
        genericName: searchModel.genericName,
        classification: searchModel.classification
      }
    })
  },
  addDrug(drug){
    return request({
      url: '/drug/add',
      method: 'post',
      data: drug
    })
  },
  updateDrug(drug){
    return request({
      url: '/drug/update',
      method: 'put',
      data: drug
    })
  },
  getDrugById(id){
    return request({
      url: `/drug/${id}`,
      method: 'get'
    })
  },
  saveDrug(drug){
    if (drug.id == null || drug.id == undefined){
      return this.addDrug(drug)
    } else{
      return this.updateDrug(drug)
    }
  },
  deleteDrugById(id) {
    return request({
      url: `/drug/delete/${id}`,
      method: 'delete'
    })
  }
}
