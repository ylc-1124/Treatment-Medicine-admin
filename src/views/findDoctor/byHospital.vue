<template>
  <div>
    <!--            搜索框-->
    <el-card>
      <el-row>
        <el-col :span="15">
          <el-input @change="getHospitalList" v-model="searchModel.hospName" placeholder="医院名称" style="width: 180px" clearable></el-input>
          <el-button  icon="el-icon-search" style="margin-left: 10px" @click="getHospitalList" type="primary" round>查询</el-button>
        </el-col>
      </el-row>
    </el-card>
    <!--           医院信息的列表-->
    <el-card>
      <el-table
        :data="hospitalList"
        style="width: 100%">
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
          prop="hospName"
          label="医院名称"
          width="180">
        </el-table-column>
        <el-table-column
          prop="tag"
          label="医院头衔"
          width="220">
          <template slot-scope="scope" >
            <el-tag v-for="tag in scope.row.tags" size="small" style="margin-left: 10px">{{tag}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="photo"
          label="图片"
          width="200"
        >
          <template slot-scope="scope">
            <el-image
              style="width: 100px; height: 100px"
              :src="scope.row.photo"
               fit="cover"
              :preview-src-list="[scope.row.photo]">
            </el-image>
          </template>
        </el-table-column>
        <el-table-column
          prop="address"
          label="医院地址">
        </el-table-column>
        <el-table-column
          label="操作"
          width="180"
        >
          <template slot-scope="scope">
            <el-button @click="openyyXqUI(scope.row)" size="small" type="primary">详情</el-button>
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

    <!--    医院详细信息对话框-->
    <el-dialog @close="closeHospDialog" :title="title" :visible.sync="hospDialogVisible" width="50%">
      <el-card>
        <el-row>
          <el-col :span="4">
            <el-image
              style="width: 100px; height: 100px"
              :src="hospitalInfo.photo"
              :preview-src-list="[hospitalInfo.photo]">
            </el-image>
          </el-col>
          <el-col :span="20">
            <h2 style="margin-left: 10px">{{hospitalInfo.hospName}}</h2>
            <el-tag v-for="tag in hospitalInfo.tags" size="small" style="margin-left: 10px">{{tag}}</el-tag>
            <el-row>
              <el-col :span="10">
                <h5 style="margin-left: 10px">医院地址:{{hospitalInfo.address}}</h5>
              </el-col>
              <el-col :span="7">
                <h5 style="margin-left: 10px">联系电话:{{hospitalInfo.phone}}</h5>
              </el-col>
            </el-row>

          </el-col>
        </el-row>
      </el-card>
      <el-card>
        <h2>医院介绍</h2>
        <span>{{hospitalInfo.introduction}}</span>
      </el-card>
      <el-card>
        <h2>科室列表</h2>
        <el-button v-for="dep in departmentList" :key="dep.id" style="margin-left: 10px;margin-bottom: 10px" size="small"
                   @click="setDepIdAndHospIdAndGetDoctorList(dep.id,hospitalInfo.id)">{{dep.depName}}</el-button>
      </el-card>
      <!--  医生列表-->
      <el-card>
        <h2>医生列表</h2>
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
<!--          <el-table-column-->
<!--            prop="hospitalName"-->
<!--            label="所属医院"-->
<!--            width="140"-->
<!--          >-->
<!--          </el-table-column>-->
<!--          <el-table-column-->
<!--            prop="departmentName"-->
<!--            label="科室"-->
<!--            width="80"-->
<!--          >-->
<!--          </el-table-column>-->
          <el-table-column
            prop="zc"
            label="职称"
            width="140"
          >
          </el-table-column>
<!--          <el-table-column-->
<!--            prop="speciality"-->
<!--            label="擅长"-->
<!--          >-->
<!--          </el-table-column>-->
<!--          <el-table-column-->
<!--            prop="wzPrice"-->
<!--            label="问诊价格"-->
<!--            width="80"-->
<!--          >-->
<!--          </el-table-column>-->
          <el-table-column
            label="操作"
            width="180"
          >
            <template slot-scope="scope">
              <el-button @click="openysXqUI(scope.row)" size="small" type="primary">详情</el-button>
              <el-button @click="" size="small" type="warning">问诊</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
      <!--  分页组件-->
<!--      <div class="block">-->
<!--        <el-pagination-->
<!--          @size-change="handleSizeChange"-->
<!--          @current-change="handleCurrentChange"-->
<!--          :current-page="searchModel.pageNo"-->
<!--          :page-sizes="[5, 10, 20, 50]"-->
<!--          :page-size="searchModel.pageSize"-->
<!--          layout="total, sizes, prev, pager, next, jumper"-->
<!--          :total="total"-->
<!--        >-->
<!--        </el-pagination>-->
<!--      </div>-->
      <!--    医生详细信息对话框-->
      <el-dialog @close="closeysDialog" :title="title" :visible.sync="docDialogVisible" width="50%" append-to-body>
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
          <el-button @click="docDialogVisible = false">关 闭</el-button>
        </div>
      </el-dialog>

      <div slot="footer" class="dialog-footer">
        <el-button @click="hospDialogVisible = false">关 闭</el-button>
      </div>
    </el-dialog>

  </div>

</template>

<script>
import hospApi from '@/api/hospitalManage'
import depApi from '@/api/departmentManage'
import docApi from '@/api/doctorManage'
export default {
  name: 'byHospital',
  data(){
    return{
      doctorList: [],
      hospitalList: [], //查询出的医院列表
      hospitalInfo: {},
      doctorInfo: {},
      departmentList: [],
      searchModel:{
        pageNo: 1,
        pageSize: 10
      },
      total: 0,
      hospDialogVisible: false,
      docDialogVisible: false,
      title: '详细信息'
    }
  },
  methods:{
    closeysDialog(){  //关闭医生详情对话框
      this.doctorInfo = {}
      this.searchModel = { pageNo: 1, pageSize: 10 },
      this.docDialogVisible = false
    },
    //根据医院和科室查询医生
    setDepIdAndHospIdAndGetDoctorList(depId,hospId){
      this.searchModel.depId = depId
      this.searchModel.hospId = hospId
      this.getDoctorList()
    },
    //打开医生详情
    openysXqUI(doctor){
      this.doctorInfo = doctor
      this.docDialogVisible = true
    },
    getDoctorList(){
      docApi.getDoctorList(this.searchModel).then(
        response => {
          this.doctorList = response.data.rows
          // this.total = response.data.total
        }
      )
    },
    //关闭医院详情
    closeHospDialog(){
      this.hospitalInfo = {}
      this.doctorList = []
      this.searchModel = { pageNo: 1, pageSize: 10 }
      this.hospDialogVisible = false
    },
    openyyXqUI(hosp) {
      this.hospitalInfo = hosp
      depApi.getDepartmentListByHospId(hosp.id).then(
        response => {
          this.departmentList = response.data
        }
      )
      this.hospDialogVisible = true
    },
    getHospitalList(){
      hospApi.getHospitalList(this.searchModel).then(
        response => {
          this.hospitalList = response.data.rows
          this.total = response.data.total
        }
      )
    },
    handleSizeChange(pageSize) {
      this.searchModel.pageSize = pageSize
      this.getHospitalList()
    },
    handleCurrentChange(pageNo) {
      this.searchModel.pageNo = pageNo
      this.getHospitalList()
    },
    mounted(){
      this.getHospitalList()
    }
  }
}
</script>

<style scoped>


</style>
