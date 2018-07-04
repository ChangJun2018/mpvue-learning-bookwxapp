<template>
    <div class="container">
        <div class="userinfo">
            <img :src="userinfo.avatarUrl">
            <p>{{ userinfo.nickName }}</p>
        </div>
        <YearProgress></YearProgress>

        <button v-if="userinfo.openId" @click="scanBook" class="btn">添加图书</button>
        <button v-else open-type="getUserInfo" lang="zh_CN" class="btn" @getuserinfo="login">点击登录</button>
    </div>
</template>
<script>
import qcloud from "wafer2-client-sdk";
import YearProgress from "@/components/YaerProgress";
import { get, showSuccess, post, showModal } from "@/util.js";
import config from "@/config.js";
export default {
  components: {
    YearProgress
  },
  data() {
    return {
      userinfo: {
        avatarUrl: "http://image.shengxinjing.cn/rate/unlogin.png",
        nickName: ""
      }
    }
  },
  methods: {
    async addBook(isbn){
      const res=await post('/weapp/addbook',{
        isbn,
        openid:this.userinfo.openId
      })
      showModal('添加成功',`${res.title}添加成功`)
    },
    scanBook() {
      wx.scanCode({
        success: (res) => {
          if(res.result){
            this.addBook(res.result)
          }
        }
      });
    },
    // 此处登录逻辑需重写吃完泡面之后写
    getWxLogin({encryptedData, iv, userinfo}){
      const _this = this;
      wx.login({
        success: function(loginResult){
          console.log(loginResult)
          var loginParams = {
            code:loginResult.code,
            encryptedData:encryptedData,
            iv:iv
          }
          // 设置登录地址
          qcloud.setLoginUrl(config.loginUrl)
          qcloud.login({
            loginParams,
            success(){
              // 获取用户信息
              qcloud.request({
                url:config.userUrl,
                login:true,
                success(userRes){
                  showSuccess('登录成功')
                  wx.setStorageSync('userInfo', userRes.data.data)
                  _this.userinfo = userRes.data.data
                }
              })
            },
            fail(error){
              showModal('登录失败',error)
            }
          })
        },
        fail: function(loginError) {
          showModal('登录失败',loginError)
        }
      })
    },
    login(e){
      const _this = this;
      // 查看是否授权
      wx.getSetting({
        success:function(res){
          // 授权信息里有用户信息
          console.log(res);
          if(res.authSetting['scope.userInfo']){
            // 检查用户登录是否过期
            wx.checkSession({
              success:function(){
                // 没过期，直接成功
                showSuccess('登录成功')
              },
              fail:function(){
                // 过期 重新登录 先清除登录的状态
                qcloud.clearSession()
                // 登录状态已过期，需重新登录
                // 登录需要的加密信息
                var options = {
                  encryptedData:e.mp.detail.encryptedData,
                  iv:e.mp.detail.iv,
                  userinfo:e.mp.detail.userInfo
                }
                _this.getWxLogin(options)
              }
            })
          }else{
            showModal('用户未授权',e.mp.detail.errMsg)
          }
        }
      })
    }
  },
  onShow() {
    let userinfo = wx.getStorageSync("userInfo");
    if(userinfo){
      this.userinfo = userinfo;
    }
  }
}
</script>
<style lang='scss'>
.container {
  padding: 0 30rpx;
  .userinfo {
    margin-top: 100rpx;
    text-align: center;
    img {
      width: 150rpx;
      height: 150rpx;
      margin: 20rpx;
      border-radius: 50%;
    }
  }
}
</style>
