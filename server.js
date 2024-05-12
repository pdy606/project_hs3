const express = require('express')
const app = express()
const { MongoClient } = require('mongodb')

app.use(express.json())
app.use(express.urlencoded({extended:true}))

let db
const url = 'mongodb+srv://zzxxrrtt0011:qwer1234@admin12.px8ckax.mongodb.net/?retryWrites=true&w=majority&appName=admin12'
new MongoClient(url).connect().then((client)=>{
  console.log('DB연결성공')
  db = client.db('web')
  app.listen(8080, ()=>{
    console.log('http://localhost:8080 running~')
  })
}).catch((err)=>{
  console.log(err)
})

app.get('/', (req, res)=>{
    res.sendFile(__dirname+'/index.html')
})

app.get('/test', (req, res)=>{
    res.send('테스트페이지에 접속하셨습니다.')
})

app.get('/userinfo', async(req, res)=>{
    let result = await db.collection('user').find().toArray()
    res.render('list.ejs',{users:result})
})

app.get('/join', async(req, res)=>{
    res.render('join.ejs')
})
app.post('/join', (req, res)=>{
    console.log(req.body)
    db.collection('user').insertOne({
        userId : req.body.id,
        pw : req.body.pw
    })
})
app.get('/login', async(req, res) => {
    let result = await db.collection('user').findOne({ userId: req.body.username })
    if (!result) {
        return cb(null, false, { message: '아이디 DB에 없음' })
    }else{
        if(result.pw == req.body.password){
            res.redirect('/')
        }else{
            console.log('비밀번호 일치하지 않음.')
        }
    }
})