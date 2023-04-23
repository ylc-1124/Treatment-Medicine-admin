<template>
  <div class="login-container">
    <el-form id="loginForm" ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on" label-position="left">

      <div class="title-container">
        <h3 class="title">欢迎登录"在线寻医问药"网站</h3>
      </div>

      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="username"
          v-model="loginForm.username"
          placeholder="用户名"
          name="username"
          type="text"
          tabindex="1"
          auto-complete="on"
        />
      </el-form-item>
      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          :key="passwordType"
          ref="password"
          v-model="loginForm.password"
          :type="passwordType"
          placeholder="密码"
          name="password"
          tabindex="2"
          auto-complete="on"
          @keyup.enter.native="handleLogin"
        />
        <span class="show-pwd" @click="showPwd">
          <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
        </span>
      </el-form-item>

      <div align="right" id="yszc" >
        <el-link type="primary" @click="openyszcDialog">医生注册</el-link>
      </div>
      <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;" @click.native.prevent="handleLogin">登 录</el-button>
    </el-form>


    <!--  医生注册对话框-->
    <el-dialog @close="clearyszcForm" title="医生注册" :visible.sync="yszcDialog" width="50%" >
      <el-form ref="yszcFormRef" :model="yszcForm" :rules="rules">
        <el-row>
          <el-col :span="12">
            <el-form-item label="用户名" :label-width="formLabelWidth" prop="username">
              <el-input v-model="yszcForm.userInfo.username" autocomplete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item  label="登录密码" :label-width="formLabelWidth" prop="password">
              <el-input type="password" v-model="yszcForm.userInfo.password" autocomplete="off"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="真实姓名" :label-width="formLabelWidth">
              <el-input v-model="yszcForm.doctorInfo.doctorName" autocomplete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系电话" :label-width="formLabelWidth">
              <el-input v-model="yszcForm.userInfo.phone" autocomplete="off"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="性别" :label-width="formLabelWidth">
              <el-radio v-model="yszcForm.doctorInfo.sex" label="m">男</el-radio>
              <el-radio v-model="yszcForm.doctorInfo.sex" label="f">女</el-radio>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="年龄" :label-width="formLabelWidth">
              <el-input v-model="yszcForm.doctorInfo.age" autocomplete="off"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="电子邮件" :label-width="formLabelWidth" prop="email">
              <el-input v-model="yszcForm.userInfo.email" autocomplete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="医院&科室" :label-width="formLabelWidth">
              <span>
                {{yszcForm.doctorInfo.hospName}}
              </span>
              <!-- 弹出子对话框，选择医院和科室-->
              <el-button type="primary" @click="openHospitalDialog" size="small" icon="el-icon-edit" circle></el-button>
            </el-form-item>
          </el-col>
        </el-row>
        <!--          嵌套医院对话框-->
        <el-dialog
          @close="clearHospitalDialog"
          width="45%"
          title="查询医院"
          :visible.sync="hospitalDialogVisible"
          append-to-body>
          <!--            搜索框-->
          <el-card>
            <el-row>
              <el-col :span="15">
                <el-input @change="getHospitalList" v-model="searchModel.hospName" placeholder="医院名称" style="width: 180px" clearable></el-input>
                <el-button type="primary" size="small" icon="el-icon-search" style="margin-left: 10px" @click="getHospitalList" circle></el-button>
              </el-col>
            </el-row>
          </el-card>
          <!--           医院信息的列表-->
          <el-card>
            <el-table
              :data="hospitalList"
              style="width: 100%">
              <el-table-column
                prop="hospName"
                label="医院名称"
                width="180">
              </el-table-column>
              <el-table-column
                prop="address"
                label="所在地"
                width="180">
              </el-table-column>
              <el-table-column
                label="选择科室">
                <template slot-scope="scope">
                  <el-row>
                    <el-col :span="12">
                      <el-select @click="getDepartmentOptionsByHospId(scope.row.id)" v-model="yszcForm.doctorInfo.departmentId"  placeholder="请选择" size="small" clearable>
                        <el-option
                          v-for="item in departmentOptions"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value">
                        </el-option>
                      </el-select>
                    </el-col>
                    <el-col :span="12">
                      <el-button  type="success" @click="setHospIdAndClose(scope.row)" size="small" icon="el-icon-check" circle ></el-button>
                    </el-col>
                  </el-row>
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
          <div slot="footer" class="dialog-footer">
            <el-button @click="hospitalDialogVisible = false">关 闭</el-button>
          </div>
        </el-dialog>
        <el-row>
          <el-col :span="12">
            <el-form-item label="证件照" :label-width="formLabelWidth">
              <el-upload
                class="avatar-uploader"
                :action="uploadURL"
                :show-file-list="false"
                list-type="picture-card"
                :limit="1"
                :on-success="handleZJZSuccess"
                :before-upload="beforeAvatarUpload">
                <img v-if="yszcForm.doctorInfo.photo" :src="yszcForm.doctorInfo.photo" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="从医资质证明" :label-width="formLabelWidth">
              <el-upload
                class="avatar-uploader"
                :action="uploadURL"
                list-type="picture-card"
                :limit="1"
                :show-file-list="false"
                :on-success="handleCertiSuccess"
                :before-upload="beforeAvatarUpload">
                <img v-if="yszcForm.doctorInfo.certification" :src="yszcForm.doctorInfo.certification" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="简介" :label-width="formLabelWidth">
              <el-input
                type="textarea"
                :rows="5"
                v-model="yszcForm.doctorInfo.introduction" style="width: 85%">
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="专长" :label-width="formLabelWidth">
              <el-input
                type="textarea"
                :rows="5"
                v-model="yszcForm.doctorInfo.speciality" style="width: 85%">
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="yszcDialog = false">取 消</el-button>
        <el-button type="primary" @click="saveDoctor">提 交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { validUsername } from '@/utils/validate'
export default {
  name: 'Login',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!validUsername(value)) {
        callback(new Error('请输入正确的用户名'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('密码不能少于6位'))
      } else {
        callback()
      }
    }
    var checkEmail = (rule, value, callback) => {
      var reg = /^[A-Za-z0-9]+([_\.][A-Za-z0-9]+)*@([A-Za-z0-9\-]+\.)+[A-Za-z]{2,6}$/
      if (!reg.test(value)) {
        return callback(new Error('邮箱格式错误'))
      }
      callback()
    }
    return {
      uploadURL: process.env.VUE_APP_BASE_API + '/upload', //图片上传的URL，后端保存到阿里云OSS中，并返回访问的URL地址
      departmentOptions: [{
        value: 1,
        label: '儿科'
      }, {
        value: 2,
        label: '骨科'
      }, {
        value: 3,
        label: '外科'
      }, {
        value: 4,
        label: '内科'
      }],
      total: 0,
      hospitalList: [{id: 1,hospName: '西京医院',address: '西安市未央区'}], //查询出的医院列表
      hospitalDialogVisible: false,
      searchModel:{},
      yszcForm: {userInfo:{},doctorInfo:{}},
      formLabelWidth: '100px',
      yszcDialog: false,
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 50, message: '长度在 3 到 50 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入初始密码', trigger: 'blur' },
          { min: 6, max: 16, message: '长度在 6 到 16 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入电子邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ]
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  methods: {
    setHospIdAndClose(hospital){
      this.yszcForm.doctorInfo.hospId = hospital.id
      this.yszcForm.doctorInfo.hospName = hospital.hospName
      this.hospitalDialogVisible = false
      this.$message({
        message: '医院&科室设置成功!',
        type: 'success'
      })
    },
    //获取医院所有的科室
    getDepartmentOptionsByHospId(hospId){

    },
    getHospitalList(){

    },
    clearHospitalDialog(){
      this.searchModel = {}
    },
    //证件照上传成功
    handleZJZSuccess(res, file) {
      this.yszcForm.doctorInfo.photo = URL.createObjectURL(file.raw);
    },
    //从医资质证明上传成功
    handleCertiSuccess(res, file) {
      this.yszcForm.doctorInfo.certification = URL.createObjectURL(file.raw);
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg';
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error('上传图片只能是 JPG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 2MB!');
      }
      return isJPG && isLt2M;
    },
    saveDoctor(){

    },
    openHospitalDialog(){
      this.hospitalDialogVisible = true
    },
    clearyszcForm(){
      this.yszcForm = {userInfo: {},doctorInfo: {}}
      this.$refs.yszcFormRef.clearValidate()
    },
    openyszcDialog(){
      this.yszcDialog = true
    },
    handleSizeChange(pageSize) {// pageSize修改的回调
      this.searchModel.pageSize = pageSize
      this.getHospitalList()
    },
    handleCurrentChange(pageNo) {// pageNo修改的回调
      this.searchModel.pageNo = pageNo
      this.getHospitalList()
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('user/login', this.loginForm).then(() => {
            this.$router.push({ path: '/' })  //登录成功进入主页 ，使用路由器的push方式进行路由跳转
            this.loading = false
          }).catch(() => {
            this.loading = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg:#283443;
$light_gray:#fff;
$cursor: #fff;

//@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
//  .login-container .el-input input {
//    color: $cursor;
//  }
//}

/* 重新设置 element-ui css */
/*只对登录表单生效*/
.login-container #loginForm{
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg:#2d3a4b; //背景颜色
$dark_gray:#889aa4;
$light_gray:#eee;

.login-container{
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  background-image: url("../../assets/bg.jpg");
  background-size: 100%;

  display: flex;
  align-items: center;

  .login-form { //登录表单
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 35px 35px 0;
    margin: 0 auto;
    overflow: hidden;
    background-color: #1f2d3d; //背景色
    border-radius: 8px; //圆角
    opacity: 0.85; //透明度
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}

#yszc {
  margin-bottom: 10px;
}

.el-dialog .el-input {
  width: 85%;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 120px;
  height: 120px;
  line-height: 120px;
  text-align: center;
}
.avatar {
  width: 120px;
  height: 120px;
  display: block;
}

.el-button{
  margin-left: 10px;
}

</style>
