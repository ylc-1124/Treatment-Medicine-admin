<template>
  <div>
    <!--  搜索栏-->
    <el-card id="search">
      <el-row>
        <el-col :span="7">
          <el-date-picker
            @change="getPresList"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            v-model="searchModel.dateRange"
            type="daterange"
            align="right"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions">
          </el-date-picker>
        </el-col>
        <el-col :span="10">
          <el-select v-model="searchModel.status" @change="getPresList" placeholder="处方状态" clearable>
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-button @click="getPresList" type="primary" round icon="el-icon-search">查询</el-button>
        </el-col>
      </el-row>
    </el-card>
    <!--  结果列表-->
    <el-card>
      <el-table
        :data="presList"
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
          label="开具医生"
          width="180"
        >
        </el-table-column>
        <el-table-column
          prop="lczd"
          label="临床诊断"
          width="200"
        >
        </el-table-column>
        <el-table-column
          prop="bzxx"
          label="备注信息"
        >
        </el-table-column>
        <el-table-column
          prop="kjDate"
          label="开具日期"
          width="180"
        >
        </el-table-column>
        <el-table-column
          prop="status"
          label="状态"
          width="150"
        >
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status == 0" type="primary">未完成</el-tag>
            <el-tag v-else-if="scope.row.status == 1" type="success">已完成</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="200"
        >
          <template slot-scope="scope">
            <el-button @click="openEditUI(scope.row.id)" type="primary" round>详情</el-button>
            <el-button v-if="scope.row.status == 0" @click="updateStatus(scope.row,1)" type="success" round>完成</el-button>
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
    <!--    处方详细信息对话框-->
    <el-dialog @close="" :title="title" :visible.sync="dialogFormVisible">
      <el-table
        :data="presProdList"
        stripe
        style="width: 100%">
        <el-table-column
          prop="prodName"
          label="药品名"
          width="180">
        </el-table-column>
        <el-table-column
          prop="dosageForm"
          label="剂型"
          width="180">
        </el-table-column>
        <el-table-column
          prop="approvalNumber"
          label="国药准字"
          width="180">
        </el-table-column>
        <el-table-column
          prop="method"
          label="用法用量">
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import presApi from '@/api/presManage'
import presProdApi from '@/api/presProdManage'
export default {
  name: 'query',
  data() {
    return {
      options: [{
        value: 0,
        label: '未完成'
      }, {
        value: 1,
        label: '已完成'
      }],

      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }]
      },
      presList: [],
      presProdList: [],
      searchModel: {
        dateRange: '',
        pageNo: 1,
        pageSize: 10
      },
      total: 0,
      title: ' ',
      dialogFormVisible: false,
      formLabelWidth: '130px',
    }
  },
  methods: {
    updateStatus(pres,status){
      this.$confirm(`您确认进行此修改吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        pres.status = status
        presApi.updateStatus(pres).then(
          response=>{
            this.$message({
              message: response.msg,
              type: 'success'
            })
            // 刷新数据
            this.getPresList()
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
      this.getPresList()
    },
    handleCurrentChange(pageNo) {// pageNo修改的回调
      this.searchModel.pageNo = pageNo
      this.getPresList()
    },
    // 更新页面数据
    getPresList() {
      //根据当前用户ID查询出处方列表
      presApi.getPresList(this.searchModel).then(
        response => {
          this.presList = response.data.rows
          this.total = response.data.total
        }
      )
    },
    getPresProdList(presId) {
      presProdApi.getPresProdList(presId).then(
        response => {
          this.presProdList = response.data
        }
      )
    },
    openEditUI(id) {
      if (id == null) {
        this.$message({
          message: '处方不存在',
          type: 'danger'
        })
      } else {
        this.title = '处方详情'
        // presProdApi 发请求查询处方包含的药品，根据处方ID查询中间表数据，返回presProdList
        presProdApi.getPresProdList(id).then(
          response=>{
            this.presProdList = response.data
          }
        )
      }
      this.dialogFormVisible = true
    },
  },
  mounted() {
    this.getPresList()
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

#search .el-select {
  margin-left: 20px;
}

.el-dialog .el-input {
  width: 85%;
}

</style>
