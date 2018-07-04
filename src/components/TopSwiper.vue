<template>
    <div class="swiper">
        <!-- 图书轮播图组件 -->
        <swiper :indicator-dots='true' indicator-color='#EA5A49' :autoplay='true' :interval='3000' :duration='1000' :circular='true'>
            <div :key="imgindex" v-for="(top,imgindex) in imgUrls">
                <swiper-item>
                    <img @click="bookDetail(img)" class="slide-image" mode="aspectFit" v-for="img in top" :key="img.id" :src="img.image" alt="">
                </swiper-item>
            </div>
        </swiper>
    </div>
</template>
<script>
export default {
    props: ['tops'],
    computed: {
        imgUrls(){
            // 排行榜图书三个为一组显示
            // 对数组进行切割
            // 实现chunk方法
            let res = this.tops;
            return [res.slice(0,3),res.slice(3,6),res.slice(6)]
        }
    },
    methods: {
        bookDetail(item){
            // 点击排行榜图片图书详情跳转
            wx.navigateTo({
                url: '/pages/detail/main?id='+item.id,
            })
        }
    }
}
</script>
<style lang='scss'>
.swiper{
   margin-top: 5px;
   .slide-image{
       width: 33%;
       height: 250rpx;
   }
}
</style>
