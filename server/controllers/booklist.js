
// 获取图书列表，全部或者个人
// 全部图书，对图书进行分页，每页长度为10
// 个人图书, 根据openid过滤返回个人所添加书籍列表

const { mysql } = require('../qcloud')

module.exports = async (ctx)=>{
  
  // 获取当前请求第几页
  const {page,openid} = ctx.request.query;
  const size = 10

  // 查询books表cSessionInfo表联表查询
  const mysqlSelect = mysql('books')
                  .select('books.*','cSessionInfo.user_info')
                  .join('cSessionInfo','books.openid','cSessionInfo.open_id')
                  .orderBy('books.id','desc')

  let books
  if(openid){
    // 根据opid过滤
    books = await mysqlSelect.where('books.openid', openid)
  }else{
    // 全部图书 分页
    books = await mysqlSelect.limit(size).offset(Number(page) * size)
  }

  ctx.state.data = {
    list:books.map(v=>{
      const info = JSON.parse(v.user_info)
      return Object.assign({},v,{
        user_info:{
          nickName:info.nickName
        }
      })
    })
  }
}