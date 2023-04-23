<template>
  <div>
    <!--  搜索栏-->
    <el-card id="search">
      <el-row>
        <el-col :span="20">
          <el-input @change="getConsultRecordList" v-model="searchModel.patName " placeholder="患者姓名" clearable></el-input>
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
          width="180"
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
              :preview-src-list="[scope.row.jczl]">
            </el-image>
          </template>
        </el-table-column>
        <el-table-column
          prop="status"
          label="问诊状态"
          width="180"
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
          label="操作"
          width="200"
        >
          <template slot-scope="scope">
            <el-button @click="updateConsultRecord(scope.row,1)" size="medium" type="success" round  >接收</el-button>
            <el-button @click="updateConsultRecord(scope.row,4)" size="medium" type="danger" round >拒绝</el-button>
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
  </div>
</template>

<script>
import consultRecordApi from '@/api/consultRecordManage'
export default {
  name: 'handle',
  data() {
    return {
      searchModel: {
        pageNo: 1,
        pageSize: 10,
        status: 0  //查询待处理的记录
      },
      consultRecordList: [],
      total: 0,
    }
  },
  methods: {
    updateConsultRecord(consRecord,status){
      if (status == 1){
        //接受问诊请求，之后便可以进行在线问诊
        this.$confirm(`您确认进行此修改吗？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          consRecord.status = status
          consultRecordApi.updateConsultRecord(consRecord).then(
            response=>{
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
          });
        });
      }else if (status == 4){
        //拒绝接受问诊请求

        //1、写拒绝的理由
        this.$prompt('请输入拒绝理由', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(({ value }) => {
          consRecord.status = status
          consRecord.jjly = value
          //2、更新
          consultRecordApi.updateConsultRecord(consRecord).then(
            response => {
              this.$message({
                message: response.msg,
                type: 'success'
              })
              this.getConsultRecordList()
            }
          )
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消输入'
          });
        });

      }

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
    },
  },
  mounted() {
    this.getConsultRecordList()
  }
}
</script>

<style scoped>
/*使条件框在一行展示*/
#search .el-input{
  width: 200px;
  margin-right: 10px;
}
#search .el-button{
  margin-left: 10px;
}

.el-dialog .el-input {
  width: 85%;
}

</style>
