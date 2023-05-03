<template>
  <div>
    <!-- 搜索框-->
    <el-card id="search">
      <el-row>
        <el-col :span="15">
          <el-input @change="getProductList" v-model="searchModel.prodName" placeholder="药品名称" style="width: 180px"
                    clearable
          ></el-input>
          <el-button icon="el-icon-search" style="margin-left: 10px" @click="getProductList" type="primary" round>查询
          </el-button>
        </el-col>
      </el-row>
    </el-card>
    <!--    药品分类-->
    <el-card>
      <div slot="header">
        <span>药品分类</span>
      </div>
      <el-button size="small" @click="setPcIdAndGetProductList(null)">所有分类</el-button>
      <el-button style="margin-bottom: 10px ;margin-left: 10px" v-for="pc in productClassificationList" :key="pc.id"
                 size="small" @click="setPcIdAndGetProductList(pc.id)"
      >{{ pc.pcDesc }}
      </el-button>
    </el-card>

    <!--   药品列表-->
    <el-card>
      <div slot="header">
        <el-row>
          <el-col :span="20">
            <span>药品列表</span>
          </el-col>
          <el-col :span="4" align="right">
            <el-badge :value="shopCart.recordList.length" class="item">
              <el-button @click="openShopCart" type="danger" icon="el-icon-shopping-cart-2" size="small" plain>
                我的购物车
              </el-button>
            </el-badge>
          </el-col>
        </el-row>
      </div>
      <el-table
        :data="productList"
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
          prop="name"
          label="药品名称"
          width="180"
        >
        </el-table-column>
        <el-table-column
          prop="photo"
          label="图片"
          width="150"
        >
          <template slot-scope="scope">
            <el-image
              style="width: 100px; height: 100px"
              :src="scope.row.photo"
              :preview-src-list="[scope.row.photo]"
            >
            </el-image>
          </template>
        </el-table-column>
        <el-table-column
          prop="specs"
          label="产品规格"
          width="140"
        >
        </el-table-column>
        <el-table-column
          prop="classification"
          label="药品类别"
          width="100"
        >
          <template slot-scope="scope">
            <el-tag v-if="scope.row.drug.classification == 1" type="danger">处方药</el-tag>
            <el-tag v-else-if="scope.row.drug.classification == 0">非处方药</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="dosageForm"
          label="剂型"
          width="100"
        >
        </el-table-column>
        <el-table-column
          prop="approvalNumber"
          label="国药准字"
        >
        </el-table-column>
        <el-table-column
          prop="price"
          label="药品价格"
          width="100"
        >
        </el-table-column>
        <el-table-column
          prop="remain"
          label="库存数"
          width="100"
        >
        </el-table-column>
        <el-table-column
          label="操作"
          width="180"
        >
          <template slot-scope="scope">
            <el-button @click="openXqUI(scope.row)" size="small" type="primary">详情</el-button>
            <el-button @click="addShopCartRecord(scope.row)" size="small" type="danger" icon="el-icon-s-goods">购买
            </el-button>
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
    <!--    药品详细信息对话框-->
    <el-dialog @close="closeypxqDialog" :title="title" :visible.sync="ypxqdialogVisible" width="50%">
      <el-card>
        <el-row>
          <el-col :span="4">
            <el-image
              style="width: 100px; height: 100px"
              :src="productInfo.photo"
              :preview-src-list="[productInfo.photo]"
            >
            </el-image>
          </el-col>
          <el-col :span="20">
            <h2>{{ productInfo.name }}</h2>
            <h5>生产厂家: {{ productInfo.manufacturer.name }}</h5>
            <h5>联系电话: {{ productInfo.manufacturer.phone }}</h5>
          </el-col>
        </el-row>
      </el-card>

      <el-card>
        <h2>功能主治</h2>
        <span>{{ productInfo.drug.function }}</span>
        <h2>不良反应</h2>
        <span>{{ productInfo.drug.adrs }}</span>
        <h2>禁忌</h2>
        <span>{{ productInfo.drug.taboo }}</span>
        <h2>用药注意事项</h2>
        <span>{{ productInfo.drug.medicationPrecautions }}</span>
        <h2>用法用量</h2>
        <span>{{ productInfo.method }}</span>
        <h2>存储方式</h2>
        <span>{{ productInfo.drug.storageConditions }}</span>
      </el-card>
      <div slot="footer" class="dialog-footer">
        <el-button @click="ypxqdialogVisible = false">关 闭</el-button>
        <el-button @click="addShopCartRecord(productInfo)" type="danger" icon="el-icon-shopping-cart-2">加入购物车
        </el-button>
      </div>
    </el-dialog>

    <!--    购物车-->
    <el-dialog @close="closeShopCartDialog" :title="`全部药品 ${shopCart.recordList.length}`"
               :visible.sync="shopCartdialogVisible" width="65%"
    >
      <el-table
        ref="shopCartRecordsTable"
        :data="shopCart.recordList"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          type="selection"
          width="55"
        >
        </el-table-column>
        <el-table-column
          prop="prod.name"
          label="药品名称"
          width="120"
        >
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
          width="120"
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
          width="160"
        >
          <template slot-scope="scope">
            <el-input-number size="small" v-model="scope.row.num" @change="handleNumChange(scope.row)" :min="1"
                             :max="100" label="购买数量"
            ></el-input-number>
          </template>
        </el-table-column>
        <el-table-column
          prop="sum"
          label="小计"
          width="120"
        >
          <template slot-scope="scope">
            <span>￥{{ scope.row.sum }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="80"
        >
          <template slot-scope="scope">
            <el-button @click="deleteShopCartRecord(scope.row.id)" size="small" type="danger" plain>删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div slot="footer" class="dialog-footer">
        <el-row>
          <el-col :span="10" align="left">
            <el-button type="text" style="color: black;margin-left: 20px" @click="deleteBatchRecords">删除选中的药品
            </el-button>
            <el-button type="text" style="color: black;margin-left: 20px" @click="clearShopCart">清理购物车</el-button>
          </el-col>
          <el-col :span="14" align="right">
            <span style="color: gray;margin-right: 10px">已选择<em style="color: red">{{
                multipleSelection.length
              }}</em>件药品</span>
            <span style="color: gray;margin-right: 10px">总价: <em style="color: red"> ￥{{
                shopCart.zongjia
              }} </em></span>
            <el-button @click="openjiesuanDialog" type="danger">去结算</el-button>
          </el-col>
        </el-row>
      </div>
    </el-dialog>


    <!--    结算页-->
    <el-dialog @close="closejiesuanDialog" title="填写并核对订单信息" :visible.sync="jiesuandialogVisible" width="65%">

      <el-card>
        <h3>选择收货地址</h3>
        <el-row>
          <!-- 收货地址-->
          <el-col :span="6" v-for="address in deliveryAddressList" :key="address.id" style="margin-right: 20px">
            <el-link :underline="false">
              <el-card
                :class="address.selected == 1 ? 'addressClassselected' : 'addressClassUnselected'"
                style="width: 237px;height: 106px"
                @click.native="setDeliveryAddress(address)"
              >
                <el-row style="font-weight: 600">
                  {{ address.sheng }}{{ address.shi }}({{ address.shrxm }}收)
                </el-row>
                <br>
                <div>
                  {{ address.jiedao }} {{ address.xxdz }} {{ address.phone }}
                </div>
              </el-card>
            </el-link>
          </el-col>
        </el-row>

        <h3 style="margin-top: 30px">确认订单信息</h3>
        <el-table
          :data="multipleSelection"
          style="width: 100%"
        >
          <el-table-column
            prop="prod.name"
            label="药品名称"
          >
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
            width="160"
          >
            <template slot-scope="scope">
              <span>x{{ scope.row.num }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="sum"
            label="小计"
            width="120"
          >
            <template slot-scope="scope">
              <span style="color: red">￥{{ scope.row.sum }}</span>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
      <div slot="footer" class="dialog-footer">
        <el-row style="margin-bottom: 10px">
          <el-col :span="24" align="right">
            <span style="font-size: small">总药品金额:<em>￥{{ shopCart.zongjia }}</em></span>
          </el-col>
        </el-row>
        <el-row style="margin-bottom: 10px">
          <el-col :span="24" align="right">
            <span style="font-size: small">运费:<em>￥0</em></span>
          </el-col>
        </el-row>
        <el-row style="margin-bottom: 10px">
          <span style="font-size: small">实付款: <em style="color: red;font-size: x-large">￥{{ shopCart.zongjia }}</em></span>
        </el-row>
        <el-row>
          <el-col :span="10" align="left">
            <el-button type="text" icon="el-icon-back" style="color: gray;margin-right: 10px"
                       @click="jiesuandialogVisible = false"
            >返回购物车
            </el-button>

          </el-col>
          <el-col :span="14" align="right">
            <el-button @click="submitOrder(orderData)" type="danger" style="margin-top: 10px">提交订单</el-button>
          </el-col>
        </el-row>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import prodApi from '@/api/productManage'
import prodClassApi from '@/api/productClassificationManage'
import shopCartApi from '@/api/shopCartManage'
import addressApi from '@/api/deliveryAddressManage'
import orderApi from '@/api/orderManage'

export default {
  name: 'buy',
  data() {
    return {
      orderData: { order: {}, shopCartRecordList: {} },  //包含后端创建订单所需的数据
      shopCart: { zongjia: 0, recordList: [] }, //购物车的属性
      multipleSelection: [],  //保存选中的购物车记录对象
      productClassificationList: [],
      productList: [],  //表格展示产品
      deliveryAddressList: [], //当前患者的收获地址
      productInfo: { drug: {}, manufacturer: {} },
      searchModel: {
        pageNo: 1,
        pageSize: 10
      },
      ypxqdialogVisible: false,
      shopCartdialogVisible: false,
      jiesuandialogVisible: false,
      total: 0,
      title: '药品详细信息'
    }
  },
  methods: {
    //提交订单
    submitOrder(orderData) {
      //生成订单编号
      let currDate = new Date()
      let year = currDate.getFullYear()
      let month = currDate.getMonth() + 1 < 10 ? '0' + (currDate.getMonth() + 1) : currDate.getMonth() + 1
      let day = currDate.getDate() < 10 ? '0' + currDate.getDate() : currDate.getDate()
      let date = year + month + day //20190524
      let timestamp = Date.parse(currDate) //155866554500
      //生成订单
      let orderNo = date + timestamp //20190524155866554500
      orderData.order.orderNo = orderNo
      orderData.order.totalAmount = this.shopCart.zongjia
      orderData.shopCartRecordList = this.multipleSelection   //选中的购物车记录
      orderApi.addOrder(orderData).then(
        response => {
          this.$message({
            type: 'success',
            message: response.msg
          })
          //刷新购物车
          this.getshopCartRecords()
          //浏览器打开支付宝支付页面,登录完成支付
          window.open(`http://localhost:9999/alipay/pay?subject=药品购买订单&traceNo=${orderData.order.orderNo}&totalAmount=${orderData.order.totalAmount}`)

          this.jiesuandialogVisible = false
        }
      )
    },
    //设置收货地址id，并更新展示的样式
    setDeliveryAddress(address) {
      //切换class
      for (var a of this.deliveryAddressList) {
        a.selected = 0
      }
      address.selected = 1
      this.orderData.order.addressId = address.id
    },
    //当前用户的所有收获地址
    getDeliveryAddressList() {
      addressApi.getAllDeliveryAddressList().then(
        response => {
          this.deliveryAddressList = response.data
          //设置默认收货地址id
          for (var a of this.deliveryAddressList) {
            //设置默认收货地址的id
            if (a.selected == 1) {
              this.orderData.order.addressId = a.id
            }
          }
        }
      )
    },
    //打开结算页面
    openjiesuanDialog() {
      if (this.multipleSelection.length > 0) {
        this.getDeliveryAddressList()
        this.jiesuandialogVisible = true
      } else {
        this.$message({
          type: 'info',
          message: '请选择药品进行结算'
        })
      }
    },
    closejiesuanDialog() {
      //关闭结算页重新获取购物车中的数据
      this.getshopCartRecords()
    },

    addShopCartRecord(product) {
      //将该产品加入到患者的购物车中
      shopCartApi.addShopCartRecord(product).then(
        response => {
          this.$message({
            type: 'success',
            message: response.msg
          })
          this.getshopCartRecords()
        }
      )
    },
    //清理购物车
    clearShopCart() {
      this.$confirm(`您确认要清理购物车？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        //获取选中的记录的id集合
        var ids = []
        for (var record of this.shopCart.recordList) {
          ids.push(record.id)
        }
        console.log(ids)
        //批量删除
        shopCartApi.deleteShopCartBatchRecordByIds(ids).then(
          response => {
            // this.$message({
            //   type: 'success',
            //   message: '清理购物车成功'
            // })
            this.getshopCartRecords()
          }
        )
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },

    deleteBatchRecords() {
      this.$confirm(`您确认删除选中的药品？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        //获取选中的记录的id集合
        var ids = []
        for (var record of this.multipleSelection) {
          ids.push(record.id)
        }
        console.log(ids)
        //批量删除
        shopCartApi.deleteShopCartBatchRecordByIds(ids).then(
          response => {
            // this.$message({
            //   type: 'success',
            //   message: response.msg
            // })
            this.getshopCartRecords()
          }
        )
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },

    deleteShopCartRecord(recordId) {
      this.$confirm(`您确认删除该药品吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        shopCartApi.deleteShopCartRecordById(recordId).then(
          response => {
            // this.$message({
            //   type: 'success',
            //   message: response.msg
            // })
            this.getshopCartRecords()
          }
        )
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },

    getshopCartRecords() {
      //获取当前患者购物车中的记录
      shopCartApi.getAllShopCartRecords().then(
        response => {
          this.shopCart.recordList = response.data
        }
      )
    },

    //处理药品数量变化
    handleNumChange(record) {
      //更新当前记录的总价
      record.sum = record.price * record.num
      //更新数据库
      shopCartApi.updateShopCartRecord(record).then(
        response => {
          console.log(response.msg)
          //重新计算需要支付的总金额
          let count = 0
          for (var record of this.multipleSelection) {
            count += record.sum
          }
          this.shopCart.zongjia = count
          // this.getshopCartRecords()
        }
      )
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.shopCartRecordsTable.toggleRowSelection(row)
        })
      } else {
        this.$refs.shopCartRecordsTable.clearSelection()
      }
    },

    handleSelectionChange(record) {
      //记录加入选中的列表中
      this.multipleSelection = record
      //重新计算需要支付的总金额
      let count = 0
      for (var record of this.multipleSelection) {
        count += record.sum
      }
      this.shopCart.zongjia = count
    },

    openShopCart() {
      this.shopCartdialogVisible = true
    },

    closeShopCartDialog() {
      //关闭购物车的回调
    },
    openXqUI(product) {
      this.productInfo = product
      this.ypxqdialogVisible = true
    },
    closeypxqDialog() {
      this.productInfo = { drug: {}, manufacturer: {} },
        this.ypxqdialogVisible = false
    },
    getProductList() {
      prodApi.getProductList(this.searchModel).then(
        response => {
          this.productList = response.data.rows
          this.total = response.data.total
        }
      )
    },
    getProductClassificationList() {
      prodClassApi.getAllProductClassifications().then(
        response => {
          this.productClassificationList = response.data
        }
      )
    },

    setPcIdAndGetProductList(pcId) {
      this.searchModel.pcId = pcId
      this.getProductList()
    },

    handleSizeChange(pageSize) {// pageSize修改的回调
      this.searchModel.pageSize = pageSize
      this.getProductList()
    },
    handleCurrentChange(pageNo) {// pageNo修改的回调
      this.searchModel.pageNo = pageNo
      this.getProductList()
    }
  },
  mounted() {
    this.getProductList()
    this.getProductClassificationList()
    this.getshopCartRecords()
  }
}
</script>

<style scoped>
#search .el-input {
  width: 200px;
  margin-right: 10px;
}

.el-dialog .el-input {
  width: 85%;
}

.addressClassselected {
  background: url("../../assets/dizhi1.png");
}

.addressClassUnselected {
  background: url("../../assets/dizhi2.png");
}

</style>
