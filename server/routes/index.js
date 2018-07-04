/**
 * ajax 服务路由集合
 */
const router = require('koa-router')({
    prefix: '/weapp'
})
const controllers = require('../controllers')

// 从 sdk 中取出中间件
// 这里展示如何使用 Koa 中间件完成登录态的颁发与验证
const { auth: { authorizationMiddleware, validationMiddleware } } = require('../qcloud')

// --- 登录与授权 Demo --- //
// 登录接口
router.get('/login', authorizationMiddleware, controllers.login)
// 用户信息接口（可以用来验证登录态）
router.get('/user', validationMiddleware, controllers.user)

// --- 图片上传 Demo --- //
// 图片上传接口，小程序端可以直接将 url 填入 wx.uploadFile 中
router.post('/upload', controllers.upload)

// --- 信道服务接口 Demo --- //
// GET  用来响应请求信道地址的
router.get('/tunnel', controllers.tunnel.get)
// POST 用来处理信道传递过来的消息
router.post('/tunnel', controllers.tunnel.post)

// --- 客服消息接口 Demo --- //
// GET  用来响应小程序后台配置时发送的验证请求
router.get('/message', controllers.message.get)
// POST 用来处理微信转发过来的客服消息
router.post('/message', controllers.message.post)

// --- 自定义小程序接口 --- //
// test 用来测试接口
router.get("/demo",controllers.demo)

// POST 用来扫码根据isbn码查询豆瓣添加图书。
router.post("/addbook",controllers.addbook)

// GET 用来获取图书列表接口
router.get("/booklist",controllers.booklist)

// GET 用来获取图书详情
router.get("/bookdetail",controllers.bookdetail)

// GET 用来获取图书排行榜
router.get("/top",controllers.top)

// POST 用来添加图书评论
router.post("/addcomment",controllers.addcomment)

// GET 用来获取图书评论
router.get("/commentlist",controllers.commentlist)

module.exports = router
