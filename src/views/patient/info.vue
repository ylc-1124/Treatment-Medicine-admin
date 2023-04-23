<template>
  <div>
    <!--  搜索栏-->
    <el-card id="search">
      <el-row>
        <el-col :span="20">
          <el-input v-model="searchModel.patientName" placeholder="患者姓名" clearable></el-input>
          <el-button @click="getPatientList" type="primary" round icon="el-icon-search">查询</el-button>
        </el-col>
      </el-row>
    </el-card>
    <!--  结果列表-->
    <el-card>
      <el-table
        :data="patientList"
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
          prop="id"
          label="患者ID"
          width="80"
        >
        </el-table-column>
        <el-table-column
          prop="patientName"
          label="患者姓名"
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
          prop="address"
          label="地址"
        >
        </el-table-column>
        <el-table-column
          prop="account"
          label="账户余额( RMB )"
          width="80"
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
    <!--    患者信息编辑对话框-->
    <el-dialog @close="clearForm" :title="title" :visible.sync="dialogFormVisible">
      <el-form ref="patientFormRef" :model="patientForm" :rules="rules">
        <el-form-item label="患者姓名" :label-width="formLabelWidth" prop="patientName">
          <el-input v-model="patientForm.patientName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="性别" :label-width="formLabelWidth">
          <el-radio v-model="patientForm.sex" label="m">男</el-radio>
          <el-radio v-model="patientForm.sex" label="f">女</el-radio>
        </el-form-item>
        <el-form-item label="年龄" :label-width="formLabelWidth">
          <el-input v-model="patientForm.age" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="地址" :label-width="formLabelWidth">
          <el-input
            type="textarea"
            :rows="2"
            placeholder="请输入地址"
            v-model="patientForm.address" style="width: 85%">
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="savePatient">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import patientApi from '@/api/patientManage'
export default {
  name: 'info',
  data() {
    return {
      rules: {
        patientName: [
          { required: true, message: '请输入患者姓名', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ]
      },
      searchModel: {
        pageNo: 1,
        pageSize: 10
      },
      patientList: [],
      total: 0,
      title: ' ',
      dialogFormVisible: false,
      patientForm: {},
      formLabelWidth: '130px',
    }
  },
  methods: {
    savePatient() {
      // 触发表单验证
      this.$refs.patientFormRef.validate((valid) => {
        if (valid) {
          // 验证通过，提交请求给后台
          patientApi.updatePatient(this.patientForm).then(
            response => {
              // 成功提示
              this.$message({
                message: response.msg,
                type: 'success'
              })
              // 关闭对话框
              this.dialogFormVisible = false
              // 刷新数据
              this.getPatientList()
            }
          )
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    clearForm() {
      this.patientForm = {}
      this.$refs.patientFormRef.clearValidate()
    },
    handleSizeChange(pageSize) {// pageSize修改的回调
      this.searchModel.pageSize = pageSize
      this.getPatientList()
    },
    handleCurrentChange(pageNo) {// pageNo修改的回调
      this.searchModel.pageNo = pageNo
      this.getPatientList()
    },
    // 更新页面数据
    getPatientList() {
      patientApi.getPatientList(this.searchModel).then(
        // response是后端返回的result对象
        response => {
          this.patientList = response.data.rows
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
        this.title = '患者信息修改'
        //根据id查询患者信息
        patientApi.getPatientById(id).then(
          response => {
            this.patientForm = response.data
          }
        )
      }
      this.dialogFormVisible = true
    }
  },
  mounted() {
    // 组件创建时候就查询
    this.getPatientList()
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
