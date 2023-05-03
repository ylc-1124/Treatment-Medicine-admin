<template>
  <div>
    <!--  搜索栏-->
    <el-card id="search">
      <el-row>
        <el-col :span="20">
          <el-input @change="getOrderList" v-model="searchModel.orderNo" placeholder="订单编号" style="width: 180px"
                    clearable></el-input>
          <el-select v-model="searchModel.status" @change="getOrderList" placeholder="订单状态" clearable>
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-button @click="getOrderList" type="primary" round icon="el-icon-search">查询</el-button>
        </el-col>
      </el-row>
    </el-card>
    <!--  结果列表-->
    <el-card>
      <el-table
        :data="orderList"
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
          prop="orderNo"
          label="订单编号"
          width="200"
        >
        </el-table-column>
        <el-table-column
          prop="createDate"
          label="创建日期"
          width="160"
        >
        </el-table-column>
        <el-table-column
          prop="payDate"
          label="支付日期"
          width="160"
        >
        </el-table-column>
        <el-table-column
          prop="address.shrxm"
          label="收货人"
          width="80"
        >
        </el-table-column>
        <el-table-column
          label="收货地址"
        >
          <template slot-scope="scope">
            <span>{{scope.row.address.sheng}}
              {{scope.row.address.shi}}
              {{scope.row.address.qu}}
              {{scope.row.address.jiedao}}
              {{scope.row.address.xxdz}}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          label="实付款"
          width="80"
        >
          <template slot-scope="scope">
            <span>￥{{ scope.row.totalAmount }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="status"
          label="订单状态"
          width="100"
        >
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status == 0" type="info">未支付</el-tag>
            <el-tag v-else-if="scope.row.status == 1" type="primary">已支付</el-tag>
            <el-tag v-else-if="scope.row.status == 2" type="warning">待收货</el-tag>
            <el-tag v-else-if="scope.row.status == 3" type="success">已收货</el-tag>
            <el-tag v-else-if="scope.row.status == 4" type="info">已取消</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="200"
        >
          <template slot-scope="scope">
            <el-button @click="openddxqDialog(scope.row.id)" type="primary" size="small" >详情</el-button>
            <el-button v-if="scope.row.status == 0" @click="pay(scope.row)" type="danger" size="small" >去支付</el-button>
            <el-button v-if="scope.row.status == 4" @click="removeOrder(scope.row.id)" type="info" size="small" >删除订单</el-button>
            <el-button v-if="scope.row.status == 2" @click="confirmReceived(scope.row)" type="warning" size="small" >确认收货</el-button>
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
    <!--    订单详情对话框-->
    <el-dialog @close="closeddxqDialog" :title="title" :visible.sync="ddxqdialogVisible" width="55%">
      <el-table
        :data="orderDetailList"
        stripe
        style="width: 100%">
        <el-table-column
          prop="prod.name"
          label="药品名称"
          width="180">
        </el-table-column>
        <el-table-column
          prop="prod.photo"
          label="药品图片"
          width="150"
        >
          <template slot-scope="scope">
            <el-image
              style="width: 100px; height: 100px"
              :src="scope.row.prod.photo"
              :preview-src-list="[scope.row.prod.photo]"
            >
            </el-image>
          </template>
        </el-table-column>
        <el-table-column
          prop="prod.specs"
          label="药品规格"
          width="150"
        >
        </el-table-column>
        <el-table-column
          prop="price"
          label="单价"
          width="100"
        >
          <template slot-scope="scope">
            <span>￥{{ scope.row.price }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="数量"
          width="100"
        >
          <template slot-scope="scope">
            <span>x{{ scope.row.num }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="sum"
          label="小计"
          width="100"
        >
          <template slot-scope="scope">
            <span style="color: red">￥{{ scope.row.sum }}</span>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="ddxqdialogVisible = false">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import orderApi from '@/api/orderManage'
import orderDetailApi from '@/api/orderDetailManage'

export default {
  name: 'myOrder',
  data() {
    return {
      options: [{
        value: 0,
        label: '待支付'
      }, {
        value: 1,
        label: '已支付'
      }, {
        value: 2,
        label: '待收货'
      }, {
        value: 3,
        label: '已收货'
      }, {
        value: 4,
        label: '已取消'
      }
      ],
      orderList: [],
      orderDetailList: [],
      searchModel: {
        pageNo: 1,
        pageSize: 10
      },
      total: 0,
      title: ' ',
      ddxqdialogVisible: false,
      formLabelWidth: '130px',
    }
  },
  methods: {
    removeOrder(orderId){
      this.$confirm(`您确认进行此修改吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        //后端设置并更新订单状态
        orderApi.removeOrder(orderId).then(
          response => {
            this.$message({
              type: 'success',
              message: response.msg
            })
            this.getOrderList()
          }
        )
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消修改'
        });
      });
    },
    confirmReceived(order){
      this.$confirm(`您确认进行此修改吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        //后端设置并更新订单状态
        orderApi.confirmReceivedByOrderId(order.id).then(
          response => {
            this.$message({
              type: 'success',
              message: response.msg
            })
            this.getOrderList()
          }
        )
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消修改'
        });
      });
    },
    pay(order){
      window.open(`http://localhost:9999/alipay/pay?subject=药品购买订单&traceNo=${order.orderNo}&totalAmount=${order.totalAmount}`)
    },

    handleSizeChange(pageSize) {// pageSize修改的回调
      this.searchModel.pageSize = pageSize
      this.getOrderList()
    },
    handleCurrentChange(pageNo) {// pageNo修改的回调
      this.searchModel.pageNo = pageNo
      this.getOrderList()
    },
    // 更新页面数据
    getOrderList() {
      //根据当前用户ID查询出处方列表
      orderApi.getOrderList(this.searchModel).then(
        response => {
          this.orderList = response.data.rows
          this.total = response.data.total
        }
      )
    },

    //获取订单详情列表
    getOrderDetailList(orderId) {
      orderDetailApi.getOrderDetailListByOrderId(orderId).then(
        response => {
          this.orderDetailList = response.data
        }
      )
    },

    closeddxqDialog(){
      this.orderDetailList = []
    },
    openddxqDialog(orderId) {
      if (orderId == null) {
        this.$message({
          message: '订单不存在',
          type: 'danger'
        })
      } else {
        this.title = '订单详情'
        orderDetailApi.getOrderDetailListByOrderId(orderId).then(
          response=>{
            this.orderDetailList = response.data
          }
        )
      }
      this.ddxqdialogVisible = true
    },
  },
  mounted() {
    this.getOrderList()
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
