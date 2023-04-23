<template>
  <div>
    <!--  搜索栏-->
    <el-card id="search">
      <el-row>
        <el-col :span="20">
          <el-input v-model="searchModel.applicantName " placeholder="申请人姓名" clearable></el-input>
          <el-select v-model="searchModel.status" @change="getCertiList" placeholder="审核状态">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-button @click="getCertiList" type="primary" round icon="el-icon-search">查询</el-button>
        </el-col>
      </el-row>
    </el-card>
    <!--  结果列表-->
    <el-card>
      <el-table
        :data="certificationList"
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
          prop="applicantName"
          label="申请人姓名"
          width="180"
        >
        </el-table-column>
        <el-table-column
          prop="certification"
          label="资质证明"
        >
          <template slot-scope="scope">
              <el-image
                style="width: 100px; height: 100px"
                :src="scope.row.url"
                :preview-src-list="[scope.row.url]">
              </el-image>
          </template>
        </el-table-column>
        <el-table-column
          prop="status"
          label="审核状态"
          width="180"
        >
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status == 0">待审核</el-tag>
            <el-tag v-else-if="scope.row.status == 1" type="success">通过</el-tag>
            <el-tag v-else-if="scope.row.status == 2" type="danger">未通过</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="createDate"
          label="提交日期"
          width="180"
        >
        </el-table-column>
        <el-table-column
          prop="processDate"
          label="处理日期"
          width="180"
        >
        </el-table-column>
        <el-table-column
          label="操作"
          width="200"
        >
          <template slot-scope="scope">
            <el-button @click="updateStatus(scope.row,1)" type="success" round  >通过</el-button>
            <el-button @click="updateStatus(scope.row,2)" type="danger" round >拒绝</el-button>
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
import certiApi from '@/api/certiManage'
import drugApi from '@/api/drugManage'
export default {
  name: 'check',
  data() {
    return {
      options: [{
        value: 0,
        label: '待审核'
      }, {
        value: 1,
        label: '通过'
      }, {
        value: 2,
        label: '未通过'
      }],
      searchModel: {
        pageNo: 1,
        pageSize: 10,
        status: 0
      },
      certificationList: [],
      total: 0,
    }
  },
  methods: {
    updateStatus(certi,status){
      this.$confirm(`您确认进行此修改吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        certi.status = status
        certiApi.updateStatus(certi).then(
          response=>{
            this.$message({
              message: response.msg,
              type: 'success'
            })
            // 刷新数据
            this.getCertiList()
          }
        )
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消修改'
        });
      });
    },
    handleSizeChange(pageSize) {// pageSize修改的回调
      this.searchModel.pageSize = pageSize
      this.getCertiList()
    },
    handleCurrentChange(pageNo) {// pageNo修改的回调
      this.searchModel.pageNo = pageNo
      this.getCertiList()
    },
    // 更新页面数据
    getCertiList() {
      certiApi.getCertiList(this.searchModel).then(
        response => {
          this.certificationList = response.data.rows
          this.total = response.data.total
        }
      )
    },
  },
  mounted() {
    this.getCertiList()
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
