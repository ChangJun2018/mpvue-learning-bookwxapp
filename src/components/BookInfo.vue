<template>
    <div class="bookinfo">
        <!-- 图书详情组件 -->
        <div class="thumb">
            <img class="back" :src="info.image" alt="" mode="aspectFill">
            <img class="img" :src="info.image"  mode="aspectFit">
            <div class="info">
                <div class="title">{{info.title}}</div>
                <div class="author">{{info.author}}</div>
            </div>
        </div>
        <div class="detail">
            <img :src="userinfo.image" class="avatar" mode="aspectFit">
            {{userinfo.name}}
            <div class="right text-primary">
                {{info.rate}}分
                <Rate :value='info.rate'></Rate>
            </div>
        </div>
        <div class="detail">
            {{info.publisher}}
            <div class="right">
                {{ info.price }}
            </div>
        </div>
        <div class="tags">
            <div class="badge" v-for='tag in info.tags' :key='tag'>
                {{ tag }}
            </div>
        </div>
        <div class="summary">
            <p :key="i" v-for="(sum,i) in info.summary">
                {{ sum }}
            </p>
        </div>
    </div>
</template>
<script>
import Rate from "@/components/Rate";
export default {
    components: {
        Rate
    },
    props: ['info'],
    computed: {
        userinfo(){
            return this.info.user_info || {}
        }
    }
}
</script>
<style lang='scss'>
.bookinfo{
    .badge{
        display: inline-block;
        margin: 5px;
        border-radius: 10px;
        border: 1px #EA5A49 solid;
        color: #EA5A49;
        padding: 5px;
        font-size: 14px;
    }
    .summary{
        padding: 15px 15px;
        margin-top: 10px;
        p{
            text-indent: 2em;
            font-size: 15px;
            line-height: 20px;
        }
    }
    .right{
       float: right; 
    }
    .detail{
        padding: 5px 10px;
        font-size: 14px;
        .avatar{
            width: 20px;
            height: 20px;
            border-radius: 50%;
            vertical-align: middle;
        }
    }
    .thumb{
        width: 750rpx;
        height: 500rpx;
        overflow: hidden;
        position: relative;
        .back{
            filter: blur(15px);
            width: 100%
        }
        .img{
            position: absolute;
            height: 300rpx;
            width: 100%;
            left: 0;
            top: 30rpx;
        }
        .info{
            color: white;
            position: absolute;
            width: 100%;
            left: 0;
            top: 330rpx;
            text-align: center;
            .title{
                font-size: 20px;
            }
            .author{
                font-size: 14px;
            }
        }
    }
}
</style>
