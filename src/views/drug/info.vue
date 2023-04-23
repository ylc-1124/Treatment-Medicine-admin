<template>
  <div>
    <!--  搜索栏-->
    <el-card id="search">
      <el-row>
        <el-col :span="20">
          <el-input v-model="searchModel.genericName" placeholder="药品通用名" clearable></el-input>
          <el-button @click="getDrugList" type="primary" round icon="el-icon-search">查询</el-button>
        </el-col>
        <el-col :span="4" align="right">
          <el-button @click="openEditUI(null)" type="success" icon="el-icon-plus" circle></el-button>
        </el-col>
      </el-row>
    </el-card>
    <!--  结果列表-->
    <el-card>
      <el-table
        :data="drugList"
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
          label="药品ID"
          width="80"
        >
        </el-table-column>
        <el-table-column
          prop="genericName"
          label="药品通用名"
          width="180"
        >
        </el-table-column>
        <el-table-column
          prop="classification"
          label="药品分类"
          width="180"
        >
          <template slot-scope="scope">
            <el-tag v-if="scope.row.classification == 1" type="danger">处方药</el-tag>
            <el-tag v-if="scope.row.classification == 0" >非处方药</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="function"
          label="功能主治"
        >
        </el-table-column>
<!--        <el-table-column-->
<!--          prop="adrs"-->
<!--          label="不良反应"-->
<!--        >-->
<!--        </el-table-column>-->
<!--        <el-table-column-->
<!--          prop="medicationPrecautions"-->
<!--          label="用药注意事项"-->
<!--        >-->
<!--        </el-table-column>-->
        <el-table-column
          prop="storageConditions"
          label="储存条件"
          width="180"
        >
        </el-table-column>

        <el-table-column
          label="操作"
          width="180"
        >
          <template slot-scope="scope">
            <el-button @click="openEditUI(scope.row.id)" type="primary" icon="el-icon-edit" circle></el-button>
            <el-button @click="deleteDrug(scope.row)" type="danger" icon="el-icon-delete" circle></el-button>
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
    <el-dialog @close="clearForm" :title="title" :visible.sync="dialogFormVisible" width="55%">
      <el-form ref="drugFormRef" :model="drugForm" :rules="rules">
        <el-form-item label="药品通用名" :label-width="formLabelWidth" prop="genericName">
          <el-input v-model="drugForm.genericName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="药品分类" :label-width="formLabelWidth">
          <el-radio v-model="drugForm.classification" :label="1">处方药</el-radio>
          <el-radio v-model="drugForm.classification" :label="0">非处方药</el-radio>
        </el-form-item>
        <el-form-item label="功能主治" :label-width="formLabelWidth">
          <el-input
            type="textarea"
            autosize
            placeholder="请输入药品主要功能"
            v-model="drugForm.function" style="width: 85%">
          </el-input>
        </el-form-item>
        <el-form-item label="不良反应" :label-width="formLabelWidth">
          <el-input
            type="textarea"
            autosize
            placeholder="请输入可能产生的不良反应"
            v-model="drugForm.adrs" style="width: 85%">
          </el-input>
        </el-form-item>
        <el-form-item label="禁忌" :label-width="formLabelWidth">
          <el-input
            type="textarea"
            autosize
            placeholder="请输入药品禁忌事项"
            v-model="drugForm.taboo" style="width: 85%">
          </el-input>
        </el-form-item>
        <el-form-item label="用药注意事项" :label-width="formLabelWidth">
          <el-input
            type="textarea"
            autosize
            placeholder="注意事项"
            v-model="drugForm.medicationPrecautions" style="width: 85%">
          </el-input>
        </el-form-item>
        <el-form-item label="储存条件" :label-width="formLabelWidth">
          <el-input v-model="drugForm.storageConditions" autocomplete="off" style="width: 85%"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveDrug">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import drugApi from '@/api/drugManage'
export default {
  name: 'info',
  data() {
    return {
      drugList: [],
      rules: {
        genericName: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 50, message: '长度在 3 到 50 个字符', trigger: 'blur' }
        ]
      },
      searchModel: {
        pageNo: 1,
        pageSize: 10
      },
      total: 0,
      title: ' ',
      dialogFormVisible: false,
      drugForm: {},
      formLabelWidth: '130px',
    }
  },
  methods: {
    deleteDrug(drug) {
      this.$confirm(`您确认删除药品${drug.genericName}？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        drugApi.deleteDrugById(drug.id).then(
          response =>{
            this.$message({
              type: 'success',
              message: response.msg
            });
            this.getDrugList()
          }
        )
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    saveDrug() {
      // 触发表单验证
      this.$refs.drugFormRef.validate((valid) => {
        if (valid) {
          // 验证通过，提交请求给后台
          drugApi.saveDrug(this.drugForm).then(
            response => {
              // 成功提示
              this.$message({
                message: response.msg,
                type: 'success'
              })
              // 关闭对话框
              this.dialogFormVisible = false
              // 刷新数据
              this.getDrugList()
            }
          )
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    clearForm() {
      this.drugForm = {}
      this.$refs.drugFormRef.clearValidate()
    },
    handleSizeChange(pageSize) {// pageSize修改的回调
      this.searchModel.pageSize = pageSize
      this.getDrugList()
    },
    handleCurrentChange(pageNo) {// pageNo修改的回调
      this.searchModel.pageNo = pageNo
      this.getDrugList()
    },
    // 更新页面数据
    getDrugList() {
      drugApi.getDrugList(this.searchModel).then(
        // response是后端返回的result对象
        response => {
          this.drugList = response.data.rows
          this.total = response.data.total
        }
      )
    },
    openEditUI(id) {
      if (id == null) {
        //添加操作
        this.title = '添加药品'
      } else {
        //修改操作
        this.title = '修改药品'
        //根据id查询药品信息
        drugApi.getDrugById(id).then(
          response => {
            this.drugForm = response.data
          }
        )
      }
      this.dialogFormVisible = true
    }
  },
  mounted() {
    this.getDrugList()
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
