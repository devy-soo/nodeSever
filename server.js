const express = require('express')    // node_modules 에 있는 express 관련 파일을 가져온다.
const app = express()    // express 는 함수이므로, 반환값을 변수에 저장한다.
const request = require('request')
const cheerio = require('cheerio')


const bodyParser = require('body-parser')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))


// var allowCORS = function(req, res, next) {
//   res.header('Acess-Control-Allow-Origin', '*');
//   res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
//   res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
//   (req.method === 'OPTIONS') ?
//     res.send(200) :
//     next();

	


// 8080 포트로 서버 오픈
app.listen(8080, function() {
    console.log("start! express app on port 8080")
})

// localhost:8080/main 브라우저에 res.sendFile() 내부의 파일이 띄워진다.
app.get('/', function(req,res) {
  res.sendFile(__dirname + "/resources/index.html")
})

// public 디렉토리를 static으로 기억한다.
// public 내부의 파일들을 localhost:8080/파일명 으로 브라우저에서 불러올 수 있다.
app.use(express.static('resources/'))


app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});





const openKey = 'lpu6mNTAPteBKDRE0JpHMQhMQ0LYNzQPiZIkU5OQB8%2B8gyF7m7gp5kahbMcZVUsv06NIkdh7dvX8vdCe35WLmQ%3D%3D';

let today = new Date();
let todayFormet = today.toISOString().substring(0,10).replace(/-/g,''); //yyyymmdd
let openDate = todayFormet + '0600';


// 중기 예보 3-7일  (일주일 기온)
let weekOpenTem =`http://apis.data.go.kr/1360000/MidFcstInfoService/getMidTa?serviceKey=${openKey}&dataType=json&regId=11D20501&tmFc=${openDate}`

request.get(weekOpenTem, (error, response, body) => {
	if (error) throw error;
	try{
		let $ = cheerio.load(body);
		// const weekOpenTemJson = JSON.stringify(body);
		// console.log(weekOpenTemJson);
	}
	catch(error){
		console.error(error);
	}
});




/* nodemon 실패
const cors = require ('cors');
const corsOptions = {
	origin:['http://localhost:8080','http://apis.data.go.kr'],
    credentials:true
}

app.use(cors(corsOptions));
*/



/* nodemon 실패
app.get('/api', (req,res) => {
	res.header("Access-Control-Allow-Origin", "*");
	res.send(data);
});
*/


/* nodemon 실패
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});
*/

/* nodemon 실패
app.get("/", (req, res) => {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "X-Requested-With");
	// 위 두 줄을 추가해주면 CORS 를 허용하게 됩니다.
	
	res.send({
		corsTest: "succeed"
	});
	// 테스트 목적으로 response (응답할) 데이터를 정해주었습니다.
});
*/


/*
// install i cors  실패
const cors = require ('cors');
app.use(
	cors({
		origin: "http://localhost:8080/"
	})
)
*/



/*
app.get("/", (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*")
  // 위 두 줄을 추가해주면 CORS 를 허용하게 됩니다.

})
*/

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


// const cors = require('cors');
// app.use(cors());