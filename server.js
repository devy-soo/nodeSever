const express = require('express')    // node_modules 에 있는 express 관련 파일을 가져온다.
const app = express()    // express 는 함수이므로, 반환값을 변수에 저장한다.


// 3000 포트로 서버 오픈
app.listen(8080, function() {
    console.log("start! express app on port 8080")
})


app.get('/', function(req,res) {
  res.sendFile(__dirname + "/index.html")
})

// localhost:3000/main 브라우저에 res.sendFile() 내부의 파일이 띄워진다.
app.get('/index', function(req,res) {
  res.sendFile(__dirname + "/index.html")
})

// public 디렉토리를 static으로 기억한다.
// public 내부의 파일들을 localhost:8080/파일명 으로 브라우저에서 불러올 수 있다.
// app.use(express.static('resources'))



/*
const cors = require ('cors');
app.use(cors({
    origin:['http://localhost:8080','http://127.0.0.1:8080'],
    credentials:true
}));

app.use(function (req, res, next) {

  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', '*');
  res.header('Access-Control-Allow-Credentials', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  next();
});
*/


/*
const cors = require('cors');
const router = express.Router();

router.get('/', cors(), (req, res) => { res.send('cors!') });
*/



/*
module.exports = {
  devapp: {
    proxy: {
      '/api': {
        target: 'https://api.evan.com',
        changeOrigin: true,
        pathRewrite: { '^/api': '' },
      },
    }
  }
}

*/



const cors = require('cors');
app.use(cors());