<template>
    <div>
        <!-- 图书轮播图组件  -->
        <TopSwiper :tops='tops'></TopSwiper>
        <!-- 图书组件 -->
        <Card v-for="book in books" :key="book.id" :book="book"></Card>
        <p class="text-footer" v-if="!more">没有更多数据</p>
    </div>
</template>
<script>
import { get } from "@/util";
import Card from "@/components/Card";
import TopSwiper from "@/components/TopSwiper";
export default {
  components: {
    Card,
    TopSwiper
  },
  data() {
    return {
      books: [],
      page: 0,
      more: true,
      tops:[]
    };
  },
  methods: {
    // 获取书籍列表
    async getBookList(init) {
      if (init) {
        this.page = 0;
        this.more = true;
      }
      wx.showNavigationBarLoading();
      const books = await get("/weapp/booklist", { page: this.page });
      if (books.list.length < 10 && this.page > 0) {
        this.more = false;
      }
      if (init) {
        this.books = books.list;
        wx.stopPullDownRefresh();
      } else {
        // 下拉刷新，不能直接覆盖books 而是累加
        this.books = this.books.concat(books.list);
      }
      wx.hideNavigationBarLoading();
    },
    async getTop(){
      const tops = await get('/weapp/top')
      this.tops = tops.list
    }
  },
  // 小程序下拉刷新事件
  onPullDownRefresh() {
    this.getBookList(true);
    this.getTop()
  },
  // 小程序下拉触底事件
  onReachBottom() {
    if (!this.more) {
      // 没有更多了
      return false;
    }
    // 页数+1
    this.page = this.page + 1;
    this.getBookList();
  },
  mounted() {
    this.getBookList(true);
    this.getTop()
  }
};
</script>
<style lang="scss">
</style>
