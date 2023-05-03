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
          width="100"
        >
        </el-table-column>
        <el-table-column
          prop="bqjs"
          label="病情简述"
        >
        </el-table-column>
        <el-table-column
          prop="jczl"
          label="检查资料"
          width="180"
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
            <el-tag v-if="scope.row.status == 0">待处理</el-tag>
            <el-tag v-else-if="scope.row.status == 1" type="warning">待问诊</el-tag>
            <el-tag v-else-if="scope.row.status == 2" type="success">已问诊</el-tag>
            <el-tag v-else-if="scope.row.status == 3" type="success">已完成</el-tag>
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
          prop="processDate"
          label="处理日期"
          width="180"
        >
        </el-table-column>
        <el-table-column
          label="操作"
          width="240"
        >
          <template slot-scope="scope">
            <el-button @click="openwzUI(scope.row)" size="small" type="warning" >在线问诊</el-button>
            <el-button @click="updateConsultRecord(scope.row,2)" size="small" type="success" >问诊结束</el-button>
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
    <!--  在线问诊对话框-->
    <el-dialog @close="closewzDialog" :title="title" :visible.sync="wzdialogVisible" width="60%">
      <div style="width: 800px; margin: 0 auto; background-color: white;">
        <div style="text-align: center; line-height: 50px;">
          {{chatPatientName}}（{{ chatUser }}）
        </div>
        <!--          聊天框-->
        <div style="height: 350px; overflow:auto; border-top: 1px solid #ccc" v-html="content"></div>
        <!--          输入框-->
        <div style="height: 200px">
            <textarea v-model="text" style="height: 160px; width: 100%; padding: 20px; border: none; border-top: 1px solid #ccc;
             border-bottom: 1px solid #ccc; outline: none"></textarea>
          <div style="text-align: right; padding-right: 10px">
            <el-button type="primary" size="mini" @click="send">发送</el-button>
          </div>
        </div>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import consultRecordApi from '@/api/consultRecordManage'
import store from '@/store'
import userApi from '@/api/userManage'

let socket

export default {
  name: 'onlineDoc',
  data() {
    return {
      user: {},
      users: [],     //在线用户列表
      chatUser: '',  //聊天对象的用户名
      chatPatientName: '', //聊天患者的名字
      text: "",      //输入框中的内容
      messages: [],  //存放服务器传来的消息
      content: '',    //聊天框内容

      searchModel: {
        pageNo: 1,
        pageSize: 10,
        status: 1  //查询待问诊的记录
      },
      consultRecordList: [],
      total: 0,
      title: '',
      wzdialogVisible: false,
    }
  },
  methods: {
    updateConsultRecord(consRecord,status){
      this.$confirm(`您确认问诊结束了吗？`, '提示', {
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
    },
    //发送消息的方法
    send() {
      if (!this.chatUser) {
        this.$message({type: 'warning', message: "请选择聊天对象"})
        return;
      }
      if (!this.text) {
        this.$message({type: 'warning', message: "请输入内容"})
      } else {
        if (typeof (WebSocket) == "undefined") {
          console.log("您的浏览器不支持WebSocket");
        } else {
          console.log("您的浏览器支持WebSocket");
          // 组装待发送的消息 json 数据  {"from": "xxx", "to": "xxx", "text": "xxx"}
          let message = { from: this.user.username, to: this.chatUser, text: this.text }
          socket.send(JSON.stringify(message));  // 将组装好的json发送给服务端，由服务端进行转发
          this.messages.push({user: this.user.username, text: this.text})
          // 更新聊天框的内容
          this.createContent(null, this.user.username, this.text)
          // 清空聊天框
          this.text = '';
        }
      }
    },
    //将聊天消息数据转换成 html 结构渲染
    createContent(remoteUser, nowUser, text) {
      let html
      // 本人发送的数据的渲染方式
      if (nowUser) {
        html = "<div class=\"el-row\" style=\"padding: 5px 0\">\n" +
          "  <div class=\"el-col el-col-22\" style=\"text-align: right; padding-right: 10px;\">\n" +
          "    <div class=\"tip left\" style=\"color: white;\n" +
          "  text-align: center;\n" +
          "  border-radius: 10px;\n" +
          "  font-family: sans-serif;\n" +
          "  padding: 10px;\n" +
          "  width:auto;\n" +
          "  display:inline-block !important;\n" +
          "  display:inline;\n" +
          "  background-color: forestgreen;\">" + text + "</div>\n" +
          "  </div>\n" +
          "  <div class=\"el-col el-col-2\">\n" +
          "  <span class=\"el-avatar el-avatar--circle\" style=\"height: 40px; width: 40px; line-height: 40px;\">\n" +
          "    <img src=\"https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif\" style=\"object-fit: cover;\">\n" +
          "  </span>\n" +
          "  </div>\n" +
          "</div>";
      } else if (remoteUser) {   // 远程用户发来的聊天消息的渲染方式
        html = "<div class=\"el-row\" style=\"padding: 5px 0\">\n" +
          "  <div class=\"el-col el-col-2\" style=\"text-align: right\">\n" +
          "  <span class=\"el-avatar el-avatar--circle\" style=\"height: 40px; width: 40px; line-height: 40px;\">\n" +
          "    <img src=\"https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif\" style=\"object-fit: cover;\">\n" +
          "  </span>\n" +
          "  </div>\n" +
          "  <div class=\"el-col el-col-22\" style=\"text-align: left; padding-left: 10px;  \">\n" +
          "    <div class=\"tip right\" style=\"color: white;\n" +
          "  text-align: center;\n" +
          "  border-radius: 10px;\n" +
          "  font-family: sans-serif;\n" +
          "  padding: 10px;\n" +
          "  width:auto;\n" +
          "  display:inline-block !important;\n" +
          "  display:inline;\n" +
          "  background-color: deepskyblue;\">" + text + "</div>\n" +
          "  </div>\n" +
          "</div>";
      }
      console.log(html)
      //渲染聊天框内容
      this.content += html;
    },
    //建立websocket连接，绑定相应的回调函数
    init() {
      let username = store.getters.name;
      this.user.username = username
      let _this = this;
      if (typeof (WebSocket) == "undefined") {
        console.log("您的浏览器不支持WebSocket");
      } else {
        console.log("您的浏览器支持WebSocket");
        let socketUrl = "ws://localhost:9999/imserver/" + username;

        if (socket != null) {
          socket.close();
          socket = null;
        }
        // 开启一个websocket服务
        socket = new WebSocket(socketUrl);
        //打开事件
        socket.onopen = function () {
          console.log("websocket已打开");
        };
        //  浏览器接收到消息的回调函数
        socket.onmessage = function (msg) {
          console.log("收到数据====" + msg.data)
          let data = JSON.parse(msg.data)  // 对收到的json数据进行解析， 类似这样的： {"users": [{"username": "zhang"},{ "username": "admin"}]}
          //判断收到的消息类型
          if (data.users) {
            // 1、如果有users字段说明是更新在线人员列表的消息
            _this.users = data.users.filter(user => user.username !== username)  // 获取当前连接的所有用户信息，并且排除自身，自己不会出现在自己的聊天列表里
            // 如果聊天的对象在线，则显示对方在线，否则设置为不在线

          } else {
            // 2、没有则是单播消息  {"from": "zhang", "text": "hello"}
            if (data.from === _this.chatUser) {  //消息来源 == 正在聊天的对象则渲染数据
              _this.messages.push(data)
              // 渲染聊天内容
              _this.createContent(data.from, null, data.text)
            }
          }
        };
        //关闭事件
        socket.onclose = function () {
          console.log("websocket已关闭");
        };
        //发生了错误事件
        socket.onerror = function () {
          console.log("websocket发生了错误");
        }
      }
    },
    //打开聊天界面
    openwzUI(conRec){
      //查询患者的用户名是什么
      userApi.getUsernameByPatId(conRec.patId).then(
        response => {
          this.chatUser = response.data  //设置聊天对象的用户名
          this.chatPatientName = conRec.patName
          this.wzdialogVisible = true
        }
      )
    },
    closewzDialog(){
      this.chatUser = ''
      this.chatPatientName = ''
      this.content = ''
      this.getConsultRecordList()
      this.wzdialogVisible = false
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
    this.init()
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

.tip {
  color: white;
  text-align: center;
  border-radius: 10px;
  font-family: sans-serif;
  padding: 10px;
  width:auto;
  display:inline-block !important;
  display:inline;
}

.right {
  background-color: deepskyblue;
}
.left {
  background-color: forestgreen;
}
</style>
