<template>
    <div>
        <!-- 书籍详情组件 -->
        <BookInfo :info="info"></BookInfo>
        <CommentList :comments="comments"></CommentList>
        <!-- 书籍评论部分 -->
        <div class="comment" v-if="showAdd">
            <textarea class="textarea" v-model="comment" :maxlength="100" placeholder="请输入图书短评"></textarea>
            <div class="location">
                地理位置:
                <switch color='#EA5A49' :checked="location" @change="getGeo"></switch>
                <span class="text-primary">{{ location }}</span>
            </div>
            <div class="phone">
                手机型号:
                <switch color='#EA5A49' :checked="phone" @change="getPhone"></switch>
                <span class="text-primary">{{ phone }}</span>
            </div>
            <button class="btn" @click="addComment">
                评论
            </button>
        </div>
        <div v-else class="text-footer">
            您未登录或者已经评论过了
        </div>
        <button class="btn" open-type='share'>转发给好友</button>
    </div>
</template>
<script>
import { get,post,showModal } from "@/util";
import BookInfo from "@/components/BookInfo";
import CommentList from "@/components/CommentList";
export default {
  components: {
    BookInfo,CommentList
  },
  data() {
    return {
      userinfo:{},
      comments:[],
      bookid: "",
      info: {},
      comment:'',
      location:'',
      phone:''
    };
  },
  computed: {
    showAdd(){
        // 没登录
        if(!this.userinfo.openId){
            return false
        }
        // 评论页面里查到有自己的openid
        if(this.comments.filter(v=>v.openid==this.userinfo.openId).length){
            return false
        }
        return true
    }  
  },
  methods: {
    // 获取书籍信息的方法
    async getDetail() {
      const info = await get("/weapp/bookdetail", { id: this.bookid });
      this.info = info;
      // 设置导航标题为书名
      wx.setNavigationBarTitle({
        title: info.title
      });
    },
    // 获取图书评论的方法
    async getComments(){
        const comments = await get('/weapp/commentlist',{bookid:this.bookid})
        this.comments = comments.list
    },
    // 获取用户手机型号
    getPhone(e){
        if(e.target.value){
            const phoneInfo = wx.getSystemInfoSync();
            this.phone = phoneInfo.model;
        }else{
            this.phone = '';
        }
    },
    // 获取用户地理位置
    // 小程序获取用户经纬度
    // 百度地图API获取用户城市
    getGeo(e){
        // 2pZXyiFwAakRVuKV46U3x0RuD2XQeF0A
        // 百度地图API token
        const ak = '2pZXyiFwAakRVuKV46U3x0RuD2XQeF0A'
        // 百度地图API 请求地址
        let url = 'http://api.map.baidu.com/geocoder/v2/'
        if(e.target.value){
            // 小程序获取用户位置返回经纬度
            wx.getLocation({
                success: (geo)=>{
                    // 请求百度地图API
                    wx.request({
                        url,
                        data: {
                            ak,
                            location:`${geo.latitude},${geo.longitude}`,
                            output:'json'
                        },
                        success:res=>{
                            if(res.data.status == 0){
                                this.location = res.data.result.addressComponent.city
                            }else{
                                this.location = '未知地点'
                            }
                        }
                    })
                }
            })
        }else{
            this.location = '';
        }
    },
    // 添加评论的方法
    async addComment(){
        if(!this.comment){
            return
        }
        // 评论内容 手机型号 地理位置 图书id 用户的openid
        const data = {
            openid:this.userinfo.openId,
            bookid:this.bookid,
            comment:this.comment,
            phone:this.phone,
            location:this.location
        }
        try{
            // 请求添加评论的接口
           await post('/weapp/addcomment',data);
           this.comment = '';
            // 获取评论列表的方法
           this.getComments();
        }catch(e){
            showModel('失败',e.msg);
        }
    }
  },
  mounted() {
    // 通过this.$root.$mp.query获取传递的options
    this.bookid = this.$root.$mp.query.id;
    this.getDetail();
    this.getComments();
    const userinfo = wx.getStorageSync('userInfo')
    if(userinfo){
        this.userinfo = userinfo;
    }
  },
};
</script>
<style lang="scss">
.comment{
    .textarea{
        width: 730rpx;
        height: 220rpx;
        background: #eee;
        padding: 10rpx;
    }
    .location{
        margin-top: 10px;
        padding: 5px 10px;
    }
    .phone{
        margin-top: 10px;
        padding: 5px 10px;
    }
}
</style>
