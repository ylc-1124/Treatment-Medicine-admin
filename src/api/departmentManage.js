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
}
