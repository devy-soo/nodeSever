const express = require('express')
const app=express()

app.set('views',__dirname+'/views')
app.set('view engine','ejs')
app.engine('html', require('ejs').renderFile)

app.use('/js', express.static('resources/js'))
app.use('/css', express.static('resources/css'))

// 3030 포트로 서버 오픈
app.listen(3030, function() {
    console.log("start! express app on port 3030")
})


app.get("/", (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "*")
    // 위 두 줄을 추가해주면 CORS 를 허용하게 됩니다.
    next();
})




function getDate(num){
	
	const today = new Date();
	today.setDate(today.getDate() + num);
	let month = ("0" + (1 + today.getMonth())).slice(-2);
	let day = ("0" + today.getDate()).slice(-2);

	const date = `${month}/${day}`;
	return date;
}

function setWeekDate(){
	for(let i = 1; i < 7; i++){
		let dayDate = document.getElementById(`dayDate${i}`);
		let weekDate = getDate(i);
		console.log(i);
		dayDate.innerText = weekDate;
	}
}


app.get('/',(req,res)=>{
    res.render('index',{name : getDate(0)})
})

