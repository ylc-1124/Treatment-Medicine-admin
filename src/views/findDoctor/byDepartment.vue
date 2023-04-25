<template>
  <div>
    <!--  展示所有科室-->
    <el-card >
      <div slot="header">
        <span>科室列表</span>
      </div>
      <el-button size="small" @click="setDepIdAndGetDoctorList(null)">所有科室</el-button>
      <el-button v-for="dep in departmentList" :key="dep.id"  size="small" @click="setDepIdAndGetDoctorList(dep.id)">{{dep.depName}}</el-button>
    </el-card>
    <!--  医生推荐列表-->
    <el-card>
      <div slot="header">
        <span>推荐医生列表</span>
      </div>
      <el-table
        :data="doctorList"
        stripe
        style="width: 100%"
      >
        <el-table-column
          label="#"
          width="80"
        >
          <template slot-scope="scope">
            <!--        编号计算公式 (pageNo - 1) * pageSize + index + 1 -->
            {{ (searchModel.pageNo - 1) * searchModel.pageSize + scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column
          prop="doctorName"
          label="医生姓名"
          width="120"
        >
        </el-table-column>
        <el-table-column
          prop="photo"
          label="证件照"
          width="150"
        >
          <template slot-scope="scope">
            <el-image
              style="width: 100px; height: 100px"
              :src="scope.row.photo"
              :preview-src-list="[scope.row.photo]">
            </el-image>
          </template>
        </el-table-column>
        <el-table-column
          prop="hospitalName"
          label="所属医院"
          width="140"
        >
        </el-table-column>
        <el-table-column
          prop="departmentName"
          label="科室"
          width="80"
        >
        </el-table-column>
        <el-table-column
          prop="zc"
          label="职称"
          width="140"
        >
        </el-table-column>
        <el-table-column
          prop="speciality"
          label="擅长"
        >
        </el-table-column>
        <el-table-column
          prop="wzPrice"
          label="问诊价格"
          width="80"
        >
        </el-table-column>
        <el-table-column
          label="操作"
          width="180"
        >
          <template slot-scope="scope">
            <el-button @click="openXqUI(scope.row)" size="small" type="primary">详情</el-button>
            <el-button @click="openWzUI(scope.row)" size="small" type="warning">问诊</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!--  分页组件-->
    <div class="block">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="searchModel.pageNo"
        :page-sizes="[5, 10, 20, 50]"
        :page-size="searchModel.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </div>
    <!--    医生详细信息对话框-->
    <el-dialog @close="closeDialog" :title="title" :visible.sync="dialogFormVisible" width="50%">
      <el-card>
        <el-row>
          <el-col :span="4">
            <el-image
              style="width: 100px; height: 100px"
              :src="doctorInfo.photo"
              :preview-src-list="[doctorInfo.photo]">
            </el-image>
          </el-col>
          <el-col :span="6">
            <h2>{{doctorInfo.doctorName}}</h2>
            <h4> {{doctorInfo.age}}岁 </h4>
            <h4>{{doctorInfo.hospitalName}} {{doctorInfo.departmentName}}</h4>
          </el-col>
        </el-row>
      </el-card>

      <el-card>
        <h2>简介</h2>
        <span>{{doctorInfo.introduction}}</span>
        <h2>擅长</h2>
        <span>{{doctorInfo.speciality}}</span>
        <h2>获奖荣誉</h2>
        <span>{{doctorInfo.hjry}}</span>
        <h2>科研成果</h2>
        <span>{{doctorInfo.kycg}}</span>
      </el-card>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">关 闭</el-button>
      </div>
    </el-dialog>

<!--    对话框嵌套问诊表单-->
    <el-dialog @close="clearConsultRecordForm" title="问诊记录" :visible.sync="consultRecordFormVisible">
      <el-form ref="consultRecordFormRef" :model="consultRecordForm" >
        <el-form-item label="病情简述" :label-width="formLabelWidth" >
          <el-input style="width: 85%" v-model="consultRecordForm.bqjs" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="检查资料" :label-width="formLabelWidth">
          <el-upload
            class="avatar-uploader"
            :action="uploadURL"
            :show-file-list="false"
            :limit="1"
            list-type="picture-card"
            :on-success="handlejczlSuccess"
            :before-upload="beforejczlUpload">
            <img v-if="jczlUrl" :src="jczlUrl" alt="" width="100%">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="consultRecordFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveConsultRecord">提 交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import docApi from '@/api/doctorManage'
import depApi from '@/api/departmentManage'
import conRecApi from '@/api/consultRecordManage'
export default {
  name: 'info',
  data() {
    return {
      jczlUrl : '',
      uploadURL: process.env.VUE_APP_BASE_API + '/oss/fileUpload', //图片上传的URL
      consultRecordForm: {}, //问诊记录
      departmentList: [],
      doctorList: [],
      doctorInfo: {},
      searchModel: {
        pageNo: 1,
        pageSize: 10
      },
      total: 0,
      title: '详细信息',
      dialogFormVisible: false,
      consultRecordFormVisible: false,
      formLabelWidth: '130px',
    }
  },
  methods: {
    saveConsultRecord(){
      conRecApi.saveConsultRecord(this.consultRecordForm).then(
        response => {
          this.$message({
            message: response.msg,
            type: 'success'
          })
          this.consultRecordFormVisible = false
        }
      )
    },
    openWzUI(doctor){
      this.consultRecordForm.docId = doctor.id
      this.consultRecordFormVisible = true
    },
    beforejczlUpload(file){
      const isJPG = file.type === 'image/jpeg';
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error('上传图片只能是 JPG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 2MB!');
      }
      return isJPG && isLt2M;
    },
    handlejczlSuccess(res, file){
      this.consultRecordForm.jczl = res.data  //注入url
      this.jczlUrl = URL.createObjectURL(file.raw); //回显上传的图片
      this.$message({
        message: res.msg,
        type: 'success'
      })
    },
    clearConsultRecordForm(){
      this.consultRecordForm = {}
      this.jczlUrl = ''
      this.consultRecordFormVisible = false
    },
    closeDialog(){
      this.doctorInfo = {}
      this.dialogFormVisible = false
    },
    setDepIdAndGetDoctorList(depId){
      this.searchModel.depId = depId
      this.getDoctorList()
    },
    getDoctorList(){
      docApi.getDoctorList(this.searchModel).then(
        response => {
          this.doctorList = response.data.rows
          this.total = response.data.total
        }
      )
    },
    getDepartmentList(){
      depApi.getAllDepartments().then(
        response => {
          this.departmentList = response.data
        }
      )
    },
    handleSizeChange(pageSize) {// pageSize修改的回调
      this.searchModel.pageSize = pageSize
      this.getDoctorList()
    },
    handleCurrentChange(pageNo) {// pageNo修改的回调
      this.searchModel.pageNo = pageNo
      this.getDoctorList()
    },
    openXqUI(doctor) {
      this.doctorInfo = doctor
      this.dialogFormVisible = true
    }
  },
  mounted() {
    this.getDoctorList()
    this.getDepartmentList()
  }
}
</script>

<style scoped>


</style>
