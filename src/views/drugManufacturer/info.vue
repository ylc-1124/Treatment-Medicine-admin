<template>
  <div>
    <!--  搜索栏-->
    <el-card id="search">
      <el-row>
        <el-col :span="20">
          <el-input v-model="searchModel.name" placeholder="厂家名称" clearable></el-input>
          <el-button @click="getManuList" type="primary" round icon="el-icon-search">查询</el-button>
        </el-col>
        <el-col :span="4" align="right">
          <el-button @click="openEditUI(null)" type="success" icon="el-icon-plus" circle></el-button>
        </el-col>
      </el-row>
    </el-card>
    <!--  结果列表-->
    <el-card>
      <el-table
        :data="manuList"
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
<!--          label="厂家ID"-->
<!--          width="80"-->
<!--        >-->
<!--        </el-table-column>-->
        <el-table-column
          prop="name"
          label="厂家名称"
          width="200"
        >
        </el-table-column>
        <el-table-column
          prop="address"
          label="生产地址"
        >
        </el-table-column>
        <el-table-column
          prop="phone"
          label="联系电话"
          width="180"
        >
        </el-table-column>
        <el-table-column
          prop="email"
          label="电子邮箱"
          width="180"
        >
        </el-table-column>
        <el-table-column
          prop="webAddress"
          label="官网地址"
          width="180"
        >
        </el-table-column>
        <el-table-column
          label="操作"
          width="180"
        >
          <template slot-scope="scope">
            <el-button @click="openEditUI(scope.row.id)" type="primary" icon="el-icon-edit" circle></el-button>
            <el-button @click="deleteManu(scope.row)" type="danger" icon="el-icon-delete" circle></el-button>
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
    <!--    药品信息编辑对话框-->
    <el-dialog @close="clearForm" :title="title" :visible.sync="dialogFormVisible">
      <el-form ref="manuFormRef" :model="manuForm" :rules="rules">
        <el-form-item label="厂家名称" :label-width="formLabelWidth" prop="name">
          <el-input v-model="manuForm.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="生产地址" :label-width="formLabelWidth">
          <el-input
            type="textarea"
            autosize
            placeholder="请输入生产地址"
            v-model="manuForm.address" style="width: 85%">
          </el-input>
        </el-form-item>
        <el-form-item label="联系电话" :label-width="formLabelWidth">
          <el-input v-model="manuForm.phone" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电子邮箱" :label-width="formLabelWidth" prop="email">
          <el-input v-model="manuForm.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="官网地址" :label-width="formLabelWidth">
          <el-input v-model="manuForm.webAddress" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveManu">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import manuApi from '@/api/drugManufacturerManage'
export default {
  name: 'info',
  data() {
    var checkEmail = (rule, value, callback) => {
      var reg = /^[A-Za-z0-9]+([_\.][A-Za-z0-9]+)*@([A-Za-z0-9\-]+\.)+[A-Za-z]{2,6}$/
      if (!reg.test(value)) {
        return callback(new Error('邮箱格式错误'))
      }
      callback()
    }
    return {
      manuList: [],
      rules: {
        name: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 50, message: '长度在 3 到 50 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入电子邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ]
      },
      searchModel: {
        pageNo: 1,
        pageSize: 10
      },
      total: 0,
      title: ' ',
      dialogFormVisible: false,
      manuForm: {},
      formLabelWidth: '130px',
    }
  },
  methods: {
    deleteManu(manu) {
      this.$confirm(`您确认删除厂家${manu.name}？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        manuApi.deleteManuById(manu.id).then(
          response =>{
            this.$message({
              type: 'success',
              message: response.msg
            });
            this.getManuList()
          }
        )
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    saveManu() {
      // 触发表单验证
      this.$refs.manuFormRef.validate((valid) => {
        if (valid) {
          // 验证通过，提交请求给后台
          manuApi.saveManu(this.manuForm).then(
            response => {
              // 成功提示
              this.$message({
                message: response.msg,
                type: 'success'
              })
              // 关闭对话框
              this.dialogFormVisible = false
              // 刷新数据
              this.getManuList()
            }
          )
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    clearForm() {
      this.manuForm = {}
      this.$refs.manuFormRef.clearValidate()
    },
    handleSizeChange(pageSize) {// pageSize修改的回调
      this.searchModel.pageSize = pageSize
      this.getManuList()
    },
    handleCurrentChange(pageNo) {// pageNo修改的回调
      this.searchModel.pageNo = pageNo
      this.getManuList()
    },
    // 更新页面数据
    getManuList() {
      manuApi.getManuList(this.searchModel).then(
        // response是后端返回的result对象
        response => {
          this.manuList = response.data.rows
          this.total = response.data.total
        }
      )
    },
    openEditUI(id) {
      if (id == null) {
        //添加操作
        this.title = '添加厂家'
      } else {
        //修改操作
        this.title = '修改厂家'
        //根据id查询厂家
        manuApi.getManuById(id).then(
          response => {
            this.manuForm = response.data
          }
        )
      }
      this.dialogFormVisible = true
    }
  },
  mounted() {
    this.getManuList()
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
