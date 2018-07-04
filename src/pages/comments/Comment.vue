<template>
    <div class="container">
        <!-- 评论组件 -->
        <CommentList v-if="userinfo.openId" type="user" :comments="comments"></CommentList>
        <!-- 用户添加图书 -->
        <div v-if="userinfo.openId">
            <div class="page-title">我的图书</div>
            <Card v-for="book in books" :key="book.id" :book=book></Card>
            <div v-if="!books.length">暂时还没有添加过书,快去添加几本吧。</div>
        </div>
    </div>
</template>
<script>
import { get,showModal } from "@/util"
import CommentList from "@/components/CommentList";
import Card from "@/components/Card";
export default {
    data () {
        return {
            comments:[],
            userinfo:{},
            books:{}
        }
    },
    components: {
        CommentList,Card
    },
    methods: {
        // 页面初始化方法
        init(){
            wx.showNavigationBarLoading()
            this.getComments()
            this.getBooks()
            wx.hideNavigationBarLoading()
        },
        //  获取个人评论列表
        async getComments(){
            const comments = await get('/weapp/commentlist',{openid:this.userinfo.openId})
            this.comments = comments.list
        },
        // 获取图书
        async getBooks(){
            const books = await get('/weapp/booklist',{openid:this.userinfo.openId});
            this.books = books.list
        }
    },
    // 下拉刷新
    onPullDownRefresh(){
        this.init()
        wx.stopPullDownRefresh()
    },
    // 页面打开执行的方法
    onShow () {
        // 判断用户是否登录
        if(!this.userinfo.openId){
            let userinfo = wx.getStorageSync('userInfo')
            if(userinfo){
                this.userinfo = userinfo
                this.init()
            }else{
            wx.showModal({
                title:"温馨提示",
                content:"访问此页面需先登录",
                showCancel:false,
            })
        }
        }
    }
}
</script>
<style>

</style>
