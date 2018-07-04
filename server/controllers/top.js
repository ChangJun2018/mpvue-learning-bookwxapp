const { mysql } = require('../qcloud')

module.exports=async (ctx)=>{
    // 查询图书排行榜
    // 根据图书点击次数排序
    const top = await mysql('books')
                        .select('id','title','image','count')
                        .orderBy('count','desc')
                        .limit(9)
    ctx.state.data={
        list:top
    }
}