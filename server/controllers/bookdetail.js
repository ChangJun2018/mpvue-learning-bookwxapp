
// 图书详情页获取图书信息的接口
// 根据图书id查询books表和cSessionInfo表
// 返回图书的信息和用户头像和用户名
// 对查询到的图书点击次数进行累加

const { mysql } = require('../qcloud')

module.exports=async (ctx)=>{
    // 获取请求图书id
    const {id} = ctx.request.query;
    // 获取图书信息
    const detail = await mysql('books')
                            .select('books.*','cSessionInfo.user_info')
                            .join('cSessionInfo','books.openid','cSessionInfo.open_id')
                            .where('id',id)
                            .first()
    
    const info = JSON.parse(detail.user_info)
    ctx.state.data = Object.assign({},detail,{
        tags:detail.tags.split(','),
        summary:detail.summary.split('\n'),
        user_info:{
            name:info.nickName,
            image:info.avatarUrl
        }
    })
    // 对查询到的图书点击次数进行累加
    await mysql('books')
                .where('id',id)
                .increment('count',1)
}