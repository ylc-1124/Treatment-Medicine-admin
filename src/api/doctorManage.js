import request from '@/utils/request'
// 一个方法对应一个后端接口
export default {
  // 多条件查询用户列表
  getDoctorList(searchModel){
    return request({
      url: '/doctor/list',
      method: 'get',
      params: {
        pageNo: searchModel.pageNo,
        pageSize: searchModel.pageSize,
        doctorName: searchModel.doctorName,
        depId:searchModel.depId,
        hospId: searchModel.hospId
      }
    })
  },
  updateDoctor(doctor){
    return request({
      url: '/doctor/update',
      method: 'put',
      data: doctor
    })
  },
  getDoctorById(id){
    return request({
      url: `/doctor/${id}`,
      method: 'get'
    })
  },
  registerDoctor(doctorRegister){
    return request({
      url: '/doctor/register',
      method: 'post',
      data: doctorRegister
    })
  }
}
