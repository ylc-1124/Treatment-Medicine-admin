<template>
<!--  仅供参考：聊天室页面-->
  <div style="padding: 10px; margin-bottom: 50px">
    <el-row>
<!--        在线用户列表-->
      <el-col :span="4">
        <el-card style="width: 300px; height: 300px; color: #333">
          <div style="padding-bottom: 10px; border-bottom: 1px solid #ccc">在线医生<span style="font-size: 12px">（点击聊天气泡开始聊天）</span></div>
<!--          v-for渲染所有在线用户-->
          <div style="padding: 10px 0" v-for="user in users" :key="user.username">
            <span>{{ user.username }}</span>
            <i class="el-icon-chat-dot-round" style="margin-left: 10px; font-size: 16px; cursor: pointer"
               @click="chatUser = user.username"></i>
            <span style="font-size: 12px;color: limegreen; margin-left: 5px" v-if="user.username === chatUser">chatting...</span>
          </div>
        </el-card>
      </el-col>

<!--      聊天主体-->
      <el-col :span="20">
        <div style="width: 800px; margin: 0 auto; background-color: white;
                    border-radius: 5px; box-shadow: 0 0 10px #ccc">
          <div style="text-align: center; line-height: 50px;">
            在线问诊（{{ chatUser }}）
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
      </el-col>
    </el-row>
  </div>
</template>

<script>

import store from '@/store'

let socket;

export default {
  name: "Im",
  data() {
    return {
      circleUrl: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
      user: {},
      isCollapse: false,  //没地方用上
      users: [],     //在线用户列表
      chatUser: '',  //聊天对象的用户名
      text: "",      //输入框中的内容
      messages: [],  //存放服务器传来的消息
      content: ''    //聊天框内容
    }
  },
  created() {
    this.init()
  },
  methods: {
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
          // 组装待发送的消息 json 数据  {"from": "zhang", "to": "admin", "text": "聊天文本"}
          let message = {from: this.user.username, to: this.chatUser, text: this.text}
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
        html = "<div class=\"el-row\" el-rowstyle=\"padding: 5px 0\">\n" +
          "  <div class=\"el-col el-col-22\" style=\"text-align: right; padding-right: 10px\">\n" +
          "    <div class=\"tip left\">" + text + "</div>\n" +
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
          "  <div class=\"el-col el-col-22\" style=\"text-align: left; padding-left: 10px\">\n" +
          "    <div class=\"tip right\">" + text + "</div>\n" +
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
  }
}

</script>

<style>
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

