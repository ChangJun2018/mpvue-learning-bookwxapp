## 学习心得
> 使用mpvue学习完成一次完整的小程序开发，熟悉了小程序的组件和API，了解了小程序的开发及上线流程。

## 技术点
> 整理所用到的技术点并方便自己近期翻看巩固
- 小程序的登录(`wx.getUserInfo()`接口调整)
- mysql命令（knex）新增、查询、联表查询
- 小程序获取地理位置（结合百度地图API）、获取手机型号、存储
- swiper、switch、image组件使用
- koa的使用

##遇到的问题
> 在获取书籍列表请求booklist时遇到mysql错误错误提示```'Illegal mix of collations (utf8mb4_0900_ai_ci,IMPLICIT) and (utf8mb4_unicode_ci,IMPLICIT) for operation \'=\''```查阅之后明白是book表中的排序规则不一样在命令行中输入```ALTER TABLE books CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;```其中books是表名

> 小程序上传测试代码是出现错误project.config.json中没有qcloudRoot字段。解决办法为在其中加入`"qcloudRoot": "./server/"`,
