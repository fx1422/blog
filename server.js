const express = require('express')
const static = require('express-static')//设置静态资源
const cookieParser = require('cookie-parser')//获取cookie
const cookieSession = require('cookie-session')//获取session
const bodyParser = require('body-parser')//解析url 数据
const multer = require('multer')//解析图片，文件等
const consolidate = require('consolidate')
const mysql = require('mysql')

//连接池
const db = mysql.createPool(
    {
        host: 'localhost',
        user: 'root',
        password: '123456',
        database: 'blog'
    }
)


const server = express()


server.listen(8081)

//1.解析cookie
server.use(cookieParser('sdasadasdsdsdsds'))


//2.使用session
const arr = []
for (let i = 0; i < 100000; i++) {
    arr.push('keys_' + Math.random())
}
server.use(cookieSession({name: 'zjq_sees_id', keys: arr, maxAge: 20 * 3600 * 1000}))
//3.post数据
server.use(bodyParser.urlencoded({extended: false}))
server.use(multer({dest: './www/upload'}).any())
//用户请求
/* server.use('/', function (req, res, next) {
    //GET---POST---FILES--COOKIE---SESSION----
    console.log(req.query, req.body, req.files, req.cookies, req.session)
    next()
}) */

//4.配置模板引擎
//输出什么---放在哪-----用哪一种------
server.set('view engine', 'html')
server.set('views', './template')
server.engine('html', consolidate.ejs)

//接收用户请求
server.get('/', function (req, res) {
    db.query("SELECT * FROM banner_table", (err,data) => {
        if(err){
            res.status(500).send('database error').end()
        }else {
            console.log(data[0].src)
            res.render('index.ejs',{banners:data})
        }

    })
})


//4.static数据 

server.use(static('./www'))