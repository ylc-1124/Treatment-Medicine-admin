<template>
  <div>
    <!--  搜索栏-->
    <el-card id="search">
      <el-row>
        <el-col :span="20">
          <el-input v-model="searchModel.doctorName" placeholder="医生姓名" clearable></el-input>
          <el-button @click="getDoctorList" type="primary" round icon="el-icon-search">查询</el-button>
        </el-col>
      </el-row>
    </el-card>
    <!--  结果列表-->
    <el-card>
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
<!--        <el-table-column-->
<!--          prop="id"-->
<!--          label="医生ID"-->
<!--          width="80"-->
<!--        >-->
<!--        </el-table-column>-->
        <el-table-column
          prop="doctorName"
          label="医生姓名"
          width="150"
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
          prop="sex"
          label="性别"
          width="80"
        >
          <template slot-scope="scope">
            <el-tag v-if="scope.row.sex == 'm'">男</el-tag>
            <el-tag v-if="scope.row.sex == 'f'">女</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="age"
          label="年龄"
          width="80"
        >
        </el-table-column>
        <el-table-column
          prop="hospitalName"
          label="所属医院"
          width="180"
        >
        </el-table-column>
        <el-table-column
          prop="departmentName"
          label="所属科室"
          width="80"
        >
        </el-table-column>
        <el-table-column
          prop="introduction"
          label="个人简介"
        >
        </el-table-column>
        <el-table-column
          label="操作"
          width="180"
        >
          <template slot-scope="scope">
            <el-button @click="openEditUI(scope.row.id)" type="primary" icon="el-icon-edit" circle></el-button>
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
    <!--    信息编辑对话框-->
    <el-dialog @close="clearForm" :title="title" :visible.sync="dialogFormVisible">
      <el-form ref="doctorFormRef" :model="doctorForm" :rules="rules">
        <el-form-item label="医生姓名" :label-width="formLabelWidth" prop="doctorName">
          <el-input v-model="doctorForm.doctorName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="性别" :label-width="formLabelWidth">
          <el-radio v-model="doctorForm.sex" label="m">男</el-radio>
          <el-radio v-model="doctorForm.sex" label="f">女</el-radio>
        </el-form-item>
        <el-form-item label="年龄" :label-width="formLabelWidth">
          <el-input v-model="doctorForm.age" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="简介" :label-width="formLabelWidth">
          <el-input
            type="textarea"
            autosize
            v-model="doctorForm.introduction" style="width: 85%">
          </el-input>
        </el-form-item>
        <el-form-item label="专长" :label-width="formLabelWidth">
          <el-input
            type="textarea"
            autosize
            v-model="doctorForm.speciality" style="width: 85%">
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveDoctor">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import doctorApi from '@/api/doctorManage'
export default {
  name: 'info',
  data() {
    return {
      rules: {
        doctorName: [
          { required: true, message: '请输入医生姓名', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ]
      },
      searchModel: {
        pageNo: 1,
        pageSize: 10
      },
      doctorList: [],
      total: 0,
      title: ' ',
      dialogFormVisible: false,
      doctorForm: {},
      formLabelWidth: '130px',
    }
  },
  methods: {
    saveDoctor() {
      // 触发表单验证
      this.$refs.doctorFormRef.validate((valid) => {
        if (valid) {
          // 验证通过，提交请求给后台
          doctorApi.updateDoctor(this.doctorForm).then(
            response => {
              // 成功提示
              this.$message({
                message: response.msg,
                type: 'success'
              })
              // 关闭对话框
              this.dialogFormVisible = false
              // 刷新数据
              this.getDoctorList()
            }
          )
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    clearForm() {
      this.doctorForm = {}
      this.$refs.doctorFormRef.clearValidate()
    },
    handleSizeChange(pageSize) {// pageSize修改的回调
      this.searchModel.pageSize = pageSize
      this.getDoctorList()
    },
    handleCurrentChange(pageNo) {// pageNo修改的回调
      this.searchModel.pageNo = pageNo
      this.getDoctorList()
    },
    // 更新页面数据
    getDoctorList() {
      doctorApi.getDoctorList(this.searchModel).then(
        // response是后端返回的result对象
        response => {
          this.doctorList = response.data.rows
          this.total = response.data.total
        }
      )
    },
    openEditUI(id) {
      if (id == null) {
        // //添加操作
        // this.title = '添加患者'
      } else {
        //修改操作
        this.title = '修改医生信息'
        //根据id查询患者信息
        doctorApi.getDoctorById(id).then(
          response => {
            this.doctorForm = response.data
          }
        )
      }
      this.dialogFormVisible = true
    }
  },
  mounted() {
    // 组件创建时候就查询
    this.getDoctorList()
  }
}
</script>

<style scoped>
/*使条件框在一行展示*/
#search .el-input {
  width: 200px;
  margin-right: 10px;
}

.el-dialog .el-input {
  width: 85%;
}
</style>
