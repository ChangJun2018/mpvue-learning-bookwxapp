// 图书评论接口，个人，图书
// 根据bookid,查询图书详情页的评论列表
// 根据openid,查询个人评论图书

const { mysql } = require('../qcloud')

module.exports=async (ctx)=>{
    // 获取请求参数
    const { bookid,openid } = ctx.request.query;

    // 联表查询获取评论集
    const mysqlSelect =   mysql('comments')
                            .select('comments.*','cSessionInfo.user_info')
                            .join('cSessionInfo','comments.openid','cSessionInfo.open_id')
    // 根据前台所传参数判断是个人评论列表，还是图书评论列表
    // 根据openid和bookid
    let comments
    if(bookid){
        // 图书详情页的评论列表
        comments = await mysqlSelect.where('bookid',bookid)
    }else if(openid){
        // 个人评论列表
        comments = await mysqlSelect.where('openid',openid)
    }
    // 返回数据
    ctx.state.data={
        list:comments.map(v=>{
            const info = JSON.parse(v.user_info)
            return Object.assign({},v,{
                title:info.nickName,
                image:info.avatarUrl
            })
        })
    }
}