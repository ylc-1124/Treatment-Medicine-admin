import request from '@/utils/request'
// 一个方法对应一个后端接口
export default {
  // 多条件查询用户列表
  getPatientList(searchModel){
    return request({
      url: '/patient/list',
      method: 'get',
      params: {
        pageNo: searchModel.pageNo,
        pageSize: searchModel.pageSize,
        patientName: searchModel.patientName,
      }
    })
  },
  updatePatient(patient){
    return request({
      url: '/patient/update',
      method: 'put',
      data: patient
    })
  },
  getPatientById(id){
    return request({
      url: `/patient/${id}`,
      method: 'get'
    })
  }
}
