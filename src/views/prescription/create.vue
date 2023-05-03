<template>
  <div>
    <!--  搜索栏-->
    <el-card id="search">
      <el-row>
        <el-col :span="20">
          <el-input @change="getConsultRecordList" v-model="searchModel.patName " placeholder="患者姓名" clearable
          ></el-input>
          <el-button @click="getConsultRecordList" type="primary" round icon="el-icon-search">查询</el-button>
        </el-col>
      </el-row>
    </el-card>
    <!--  结果列表-->
    <el-card>
      <el-table
        :data="consultRecordList"
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
          prop="patName"
          label="患者姓名"
          width="100"
        >
        </el-table-column>
        <el-table-column
          prop="bqjs"
          label="病情简述"
          width="180"
        >
        </el-table-column>
        <el-table-column
          prop="jczl"
          label="检查资料"
        >
          <template slot-scope="scope">
            <el-image
              style="width: 100px; height: 100px"
              :src="scope.row.jczl"
              :preview-src-list="[scope.row.jczl]"
            >
            </el-image>
          </template>
        </el-table-column>
        <el-table-column
          prop="status"
          label="问诊状态"
          width="140"
        >
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status == 0">待处理</el-tag>
            <el-tag v-else-if="scope.row.status == 1" type="success">已同意</el-tag>
            <el-tag v-else-if="scope.row.status == 2" type="danger">已问诊</el-tag>
            <el-tag v-else-if="scope.row.status == 3" type="danger">已完成</el-tag>
            <el-tag v-else-if="scope.row.status == 4" type="danger">已拒绝</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="createDate"
          label="创建日期"
          width="180"
        >
        </el-table-column>
        <el-table-column
          prop="consultDate"
          label="问诊日期"
          width="180"
        >
        </el-table-column>
        <el-table-column
          label="操作"
          width="200"
        >
          <template slot-scope="scope">
            <el-button @click="updateConsultRecord(scope.row,3)" size="small" type="primary" >完成</el-button>
            <el-button v-if="scope.row.presId == null" @click="openPresForm(scope.row)" size="small" type="success" >开处方</el-button>
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

    <!--    处方开具的表单-->
    <el-dialog @close="clearForm" :title="title" :visible.sync="outerVisible" width="60%">
      <el-form ref="presFormRef" :model="presForm" :rules="rules">
        <el-form-item label="临床诊断" :label-width="formLabelWidth" prop="lczd">
          <el-input v-model="presForm.lczd" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item  label="备注信息" :label-width="formLabelWidth">
          <el-input  v-model="presForm.bzxx" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="添加药品" :label-width="formLabelWidth">
          <el-button type="primary" size="small" icon="el-icon-plus" @click="innerVisible = true" circle></el-button>
<!--          嵌套对话框-->
          <el-dialog
            @close="clearDialog"
            width="50%"
            title="搜索药品"
            :visible.sync="innerVisible"
            append-to-body>
<!--            搜索框-->
              <el-card>
                <el-row>
                  <el-col :span="15">
                    <el-input @change="getDialogProductList" v-model="searchModel.prodName" placeholder="产品名称" style="width: 180px" clearable></el-input>
                    <el-button type="primary" size="small" icon="el-icon-search" style="margin-left: 10px" @click="getDialogProductList" circle></el-button>
                  </el-col>
                </el-row>
              </el-card>
<!--           产品信息的列表-->
              <el-card>
                <el-table
                  :data="dialogProductList"
                  style="width: 100%">
                  <el-table-column
                    prop="name"
                    label="产品名"
                    width="180">
                  </el-table-column>
                  <el-table-column
                    prop="dosageForm"
                    label="剂型"
                    width="180">
                  </el-table-column>
                  <el-table-column
                    prop="specs"
                    label="产品规格">
                  </el-table-column>
                  <el-table-column
                    label="操作">
                    <template slot-scope="scope">
                      <el-button @click="addPresProdList(scope.row)" size="small" type="success" round>添加</el-button>
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
            <div slot="footer" class="dialog-footer">
              <el-button @click="innerVisible = false">关 闭</el-button>
            </div>
          </el-dialog>
          <el-table
            :data="presForm.productList"
            style="width: 85%">
            <el-table-column
              prop="name"
              label="产品名"
              width="180">
            </el-table-column>
            <el-table-column
              prop="dosageForm"
              label="剂型"
              width="180">
            </el-table-column>
            <el-table-column
              prop="method"
              label="用法用量"
              width="180">
            </el-table-column>
<!--            <el-table-column-->
<!--              prop="price"-->
<!--              label="价格"-->
<!--              width="80">-->
<!--            </el-table-column>-->
            <el-table-column
              label="操作">
              <template slot-scope="scope">
                <el-button @click="editMethod(scope.row)" size="small" type="primary" round>编辑</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="outerVisible = false">取 消</el-button>
        <el-button type="primary" @click="savePres">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import consultRecordApi from '@/api/consultRecordManage'
import productApi from '@/api/productManage'
import presApi from '@/api/presManage'

export default {
  name: 'create',
  data() {
    return {
      rules: {
        lczd: [
          { required: true, message: '请填写诊断结果', trigger: 'blur' },
        ]
      },
      dialogProductList: [],
      presForm: { productList: []},
      title: '处方开具',
      outerVisible: false,
      innerVisible: false,
      searchModel: {
        pageNo: 1,
        pageSize: 10,
        status: 2  //查询已问诊的记录，为其添加处方
      },
      consultRecordList: [],
      total: 0,
      formLabelWidth: '100px'
    }
  },
  methods: {
    //医生可以重新设置药品的用法用量
    editMethod(product){
      this.$prompt('请输入用法用量', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(({ value }) => {
        product.method = value
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消输入'
        });
      });
    },
    savePres(){
      // 触发表单验证
      this.$refs.presFormRef.validate((valid) => {
        if (valid) {
          //1、保存处方
          presApi.addPres(this.presForm).then(
            response => {
              // 成功提示
              this.$message({
                message: response.msg,
                type: 'success'
              })
              // 关闭对话框
              this.outerVisible = false
              // 刷新数据
              this.getConsultRecordList()
            }
          )
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    //添加当前产品到处方中
    addPresProdList(product){
      this.presForm.productList.push(product)
      this.$message({
        message: '添加药品成功',
        type: 'success'
      });
    },
    //获取对话框中的产品列表
    getDialogProductList(){
      productApi.getProductList(this.searchModel).then(
        response => {
          this.dialogProductList = response.data.rows
          this.total = response.data.total
        }
      )
    },
    openPresForm(consultRecord) {
      //注入外键
      this.presForm.consultId = consultRecord.id
      this.presForm.patId = consultRecord.patId
      this.presForm.docId = consultRecord.docId
      this.outerVisible = true
    },
    clearForm() {
      this.presForm = {productList: []}
      this.$refs.presFormRef.clearValidate()
    },
    clearDialog(){
      this.dialogProductList = []
      this.searchModel.prodName = ''
    },
    updateConsultRecord(consRecord, status) {
      //接受问诊请求，之后便可以进行在线问诊
      this.$confirm(`您确认进行此修改吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        consRecord.status = status
        consultRecordApi.updateConsultRecord(consRecord).then(
          response => {
            this.$message({
              message: response.msg,
              type: 'success'
            })
            // 刷新数据
            this.getConsultRecordList()
          }
        )
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消修改'
        })
      })
    },
    handleSizeChange(pageSize) {// pageSize修改的回调
      this.searchModel.pageSize = pageSize
      this.getConsultRecordList()
    },
    handleCurrentChange(pageNo) {// pageNo修改的回调
      this.searchModel.pageNo = pageNo
      this.getConsultRecordList()
    },
    // 更新页面数据
    getConsultRecordList() {
      consultRecordApi.getConsultRecordList(this.searchModel).then(
        response => {
          this.consultRecordList = response.data.rows
          this.total = response.data.total
        }
      )
    }
  },
  mounted() {
    this.getConsultRecordList()
  }
}
</script>

<style scoped>
/*使条件框在一行展示*/
#search .el-input {
  width: 200px;
  margin-right: 10px;
}

#search .el-button {
  margin-left: 10px;
}

.el-dialog .el-input {
  width: 85%;
}

</style>
