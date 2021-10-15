const express = require('express')    // node_modules 에 있는 express 관련 파일을 가져온다.
const app = express()    // express 는 함수이므로, 반환값을 변수에 저장한다.


// 3000 포트로 서버 오픈
app.listen(8080, function() {
    console.log("start! express app on port 8080")
})


app.get('/', function(req,res) {
  res.sendFile(__dirname + "/resources/index.html")
})

// localhost:8080/main 브라우저에 res.sendFile() 내부의 파일이 띄워진다.
app.get('/index', function(req,res) {
  res.sendFile(__dirname + "/resources/index.html")
})

// public 디렉토리를 static으로 기억한다.
// public 내부의 파일들을 localhost:8080/파일명 으로 브라우저에서 불러올 수 있다.
app.use(express.static('resources/'))


app.get("/", (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    // 위 두 줄을 추가해주면 CORS 를 허용하게 됩니다.
 
    res.send({
      corsTest: "succeed"
    });
    // 테스트 목적으로 response (응답할) 데이터를 정해주었습니다.
});
