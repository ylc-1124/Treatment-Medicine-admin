import request from '@/utils/request'

export default {
  getDepartmentOptionsByHospId(hospId){
    return request({
      url: '/department/options',
      method: 'get',
      params: {
        hospId
      }
    })
  },
  getAllDepartments(){
    return request({
      url: '/department/all',
      method: 'get',
    })
  },
  getDepartmentListByHospId(hospId){
    return request({
      url: `/department/${hospId}`,
      method: 'get',
    })
  }
}
