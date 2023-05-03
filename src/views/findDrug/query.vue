<template>
  <div>
    <!--  搜索栏-->
    <el-card id="search">
      <el-row>
        <el-col :span="20">
          <el-input @change="getDrugList" v-model="searchModel.genericName" placeholder="药品通用名" clearable></el-input>
          <el-select v-model="searchModel.classification" clearable @change="getDrugList" placeholder="药品类型">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-button @click="getDrugList" type="primary" round icon="el-icon-search">查询</el-button>
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
<!--        <el-table-column-->
<!--          prop="id"-->
<!--          label="用户ID"-->
<!--          width="80"-->
<!--        >-->
<!--        </el-table-column>-->
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
            <el-tag v-else-if="scope.row.classification == 0" >非处方药</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="function"
          label="功能主治"
          >
        </el-table-column>
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
            <el-button @click="openEditUI(scope.row.id)" type="primary" size="small">详情</el-button>
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
    <el-dialog @close="clearDrugInfo" :title="title" :visible.sync="dialogFormVisible">
      <el-card>
        <el-row>
          <el-col :span="4">
            <h2>{{drugInfo.genericName}}</h2>
          </el-col>
        </el-row>
      </el-card>

      <el-card>
        <h2>功能主治</h2>
        <span>{{drugInfo.function}}</span>
        <h2>不良反应</h2>
        <span>{{drugInfo.adrs}}</span>
        <h2>禁忌</h2>
        <span>{{drugInfo.taboo}}</span>
        <h2>用药注意事项</h2>
        <span>{{drugInfo.medicationPrecautions}}</span>
      </el-card>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import drugApi from '@/api/drugManage'
export default {
  name: 'query',
  data() {
    return {
      options: [{
        value: 0,
        label: '非处方药'
      }, {
        value: 1,
        label: '处方药'
      }],
      searchModel: {
        pageNo: 1,
        pageSize: 10
      },
      drugList: [],
      total: 0,
      title: ' ',
      dialogFormVisible: false,
      drugInfo: {},
      formLabelWidth: '130px',
    }
  },
  methods: {
    clearDrugInfo() {
      this.drugInfo = {}
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
        // //添加操作
        // this.title = '添加用户'
      } else {
        //修改操作
        this.title = '药品详情'
        //根据id查询用户信息
        drugApi.getDrugById(id).then(
          response => {
            this.drugInfo = response.data
          }
        )
      }
      this.dialogFormVisible = true
    }
  },
  mounted() {
    // 组件创建时候就查询用户列表
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
#search .el-button{
  margin-left: 10px;
}

.el-dialog .el-input {
  width: 85%;
}

</style>
