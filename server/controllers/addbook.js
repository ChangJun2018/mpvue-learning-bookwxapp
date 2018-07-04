// 新增图书接口
// 通过图书的isbn查询豆瓣api返回图书信息，存储到mysql数据库
// 通过用户的openid用来识别谁添加的图书，并一并存储到数据库中
// 存储数据库books表中

const https=require('https')
const { mysql }=require('../qcloud')

module.exports=async (ctx)=>{
    // 获取请求传过来的isbn和openid
    const {isbn,openid}=ctx.request.body;
    if(isbn && openid){
        // 添加图书前查询数据库中是否重复
        const findRes=await mysql('books').select().where('isbn',isbn);
        if(findRes.length){
            ctx.state={
                code:-1,
                data:{
                    msg:"图书已存在"
                }
            }
            return
        }
        // 获取豆瓣信息
        let url='https://api.douban.com/v2/book/isbn/'+isbn;
        // 接收数据,并对数据进行处理，拿所需的数据。
        const bookinfo=await getJSON(url);
        const rate=bookinfo.rating.average;
        const { title, image, alt, publisher, summary, price}=bookinfo;
        const tags=bookinfo.tags.map(v=>{
            return `${ v.title } ${ v.count }`
        }).join(',')
        const author=bookinfo.author.join(",");
        try {
            await mysql('books').insert({
                isbn, openid, rate, title, image, alt, publisher, summary, price, tags, author
            })
            ctx.state.data={
                title,
                msg:"success"
            }
        } catch (error) {
            ctx.state={
                code:-1,
                data:{
                    msg:"新增失败"+error.sqlMessage
                }
            }
        }
    }
}

// 获取豆瓣图书信息JSON的工具函数
function getJSON(url){
    return new Promise((resolve,reject)=>{
        https.get(url,res=>{
            // 定义一个变量接收返还的数据
            let urlData='';
            res.on('data',data=>{
                urlData+=data;
            })
            // 将最后的数据json格式化然后返回
            res.on('end',data=>{
                const bookinfo=JSON.parse(urlData);
                if(bookinfo.title){
                    resolve(bookinfo)
                }
                reject(bookinfo)
            })
        })
    })
}