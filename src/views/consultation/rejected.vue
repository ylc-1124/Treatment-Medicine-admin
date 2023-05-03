<template>
  <div>
    <!--  搜索栏-->
    <el-card id="search">
      <el-row>
        <el-col :span="20">
          <el-input @change="getConsultRecordList" v-model="searchModel.docName " placeholder="医生姓名" clearable></el-input>
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
          prop="docName"
          label="医生姓名"
          width="120"
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
          width="180px"
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
          width="120"
        >
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status == 0" type="primary">已发送</el-tag>
            <el-tag v-else-if="scope.row.status == 1" type="warning">待问诊</el-tag>
            <el-tag v-else-if="scope.row.status == 2" type="warning">待开具处方</el-tag>
            <el-tag v-else-if="scope.row.status == 3" type="success">问诊完成</el-tag>
            <el-tag v-else-if="scope.row.status == 4" type="danger">已拒绝</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="jjly"
          label="拒绝理由"
        >
        </el-table-column>
        <el-table-column
          prop="createDate"
          label="创建日期"
          width="180"
        >
        </el-table-column>
        <el-table-column
          prop="processDate"
          label="处理日期"
          width="180"
        >
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
  name: 'onlinePat',
  data() {
    return {
      searchModel: {
        pageNo: 1,
        pageSize: 10,
        status: 4  //查询已发送的记录
      },
      consultRecordList: [],
      total: 0,
    }
  },
  methods: {
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
      consultRecordApi.getConsultRecordListForPat(this.searchModel).then(
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
