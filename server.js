// node_modules 에 있는 express 관련 파일을 가져온다.
const express = require('express')

// express 는 함수이므로, 반환값을 변수에 저장한다.
const server = express()

// 3000 포트로 서버 오픈
server.listen(8080, function() {
    console.log("start! express server on port 3000")
})


server.get('/', function(req,res) {
  res.sendFile(__dirname + "/resources/index.html")
})

// localhost:3000/main 브라우저에 res.sendFile() 내부의 파일이 띄워진다.
server.get('/main', function(req,res) {
  res.sendFile(__dirname + "/resources/index.html")
})

// public 디렉토리를 static으로 기억한다.
// public 내부의 파일들을 localhost:3000/파일명 으로 브라우저에서 불러올 수 있다.
server.use(express.static('resources'))