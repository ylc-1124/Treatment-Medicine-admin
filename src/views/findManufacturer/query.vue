<template>
  <div>
    <!--  搜索栏-->
    <el-card id="search">
      <el-row>
        <el-col :span="20">
          <el-input @change="getManuList" v-model="searchModel.approvalNumber" placeholder="国药准字" clearable></el-input>
          <el-button @click="getManuList" type="primary" round icon="el-icon-search">查询</el-button>
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
          width="280"
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
import manuApi from '@/api/drugManufacturerManage'
export default {
  name: 'query',
  data() {
    return {
      manuList: [],
      searchModel: {
        pageNo: 1,
        pageSize: 10
      },
      total: 0,
    }
  },
  methods: {
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
