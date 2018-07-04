
// 添加图书评论的接口
// 获取图书id,评论内容,用户openid,用户位置,手机型号
// 存储到数据库comments表中


const { mysql } = require('../qcloud')

module.exports = async (ctx)=>{
    const {bookid,comment,openid,location,phone} = ctx.request.body;
    console.log(bookid,comment,openid,location,phone);
    try {
        await mysql('comments').insert({bookid,comment,openid,location,phone});
        ctx.state.data = {
            msg:"success"
        }
    } catch (error) {
        ctx.state = {
            code:-1,
            data:{
                msg:"评论失败:"+e.sqlMessage
            }
        }
    }
}