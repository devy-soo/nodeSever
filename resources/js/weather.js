// 날짜
const today = new Date();
let hours = today.getHours(); 

// open api key
const openKey = 'lpu6mNTAPteBKDRE0JpHMQhMQ0LYNzQPiZIkU5OQB8%2B8gyF7m7gp5kahbMcZVUsv06NIkdh7dvX8vdCe35WLmQ%3D%3D';
let todayFormet = today.toLocaleString().substring(0,13).replace(/\s|\./g,''); //yyyymmdd
// let todayFormet = today.toISOString().substring(0,13).replace(/-/g,''); //yyyymmdd
let openDate = todayFormet + '0600';

setWeekDate();
setTodayDate();


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
		dayDate.innerText = weekDate;
	}
}

function setTodayDate(){
	
	let todayDate = document.getElementById("todayDate");
	let today = getDate(0).split('/');
	todayDate.innerText = `${today[0]}월 ${today[1]}일`;   
}







// (0)1-2 기온, 날씨
function setTwoDaysWeather(regionCode){
	// let selectCodes = regionCode[0].code;
	
    let apiUrl = `http://apis.data.go.kr/1360000/VilageFcstMsgService/getLandFcst?serviceKey=${openKey}&dataType=json&regId=${regionCode}`;

    $.getJSON( apiUrl ,function(data){

		// 최저최고
		let weekMinTem1 = document.getElementById("dayMinTem1");
		let weekMaxTem1 = document.getElementById("dayMaxTem1");
		let weekMinTem2 = document.getElementById("dayMinTem2");
		let weekMaxTem2 = document.getElementById("dayMaxTem2");

		// 아이콘
		let day1IconAm = document.getElementById("dayIcon2");
		let day1IconPm = document.getElementById("dayIcon3");
		let day2IconAm = document.getElementById("dayIcon4");
		let day2IconPm = document.getElementById("dayIcon5");

		
		let temp1 = data.response.body.items.item[1].ta;
		let temp2 = data.response.body.items.item[2].ta;
		let temp3 = data.response.body.items.item[3].ta;
		let temp4 = data.response.body.items.item[4].ta;
		
		let sky1 = data.response.body.items.item[1].wfCd;
		let sky2 = data.response.body.items.item[2].wfCd;
		let sky3 = data.response.body.items.item[3].wfCd;
		let sky4 = data.response.body.items.item[4].wfCd;
		
		let water1 = data.response.body.items.item[1].rnYn;
		let water2 = data.response.body.items.item[2].rnYn;
		let water3 = data.response.body.items.item[3].rnYn;
		let water4 = data.response.body.items.item[4].rnYn;


		// 1-2 날씨 아이콘
		function setTwoDaysIcon(dayIcon, sky, water){

			if( water == 0 ){
				if( sky == 'DB01'){
					dayIcon.className = 'xi-sun-o';
				}else{
					dayIcon.className = 'xi-cloudy';
				}
			}else if( water == 1 ||  water == 4 ){
				dayIcon.className = 'xi-pouring';
			}else if( water == 3 ){
				dayIcon.className = 'xi-snowy';
			}else{
				dayIcon.className = 'xi-umbrella-o';
			}	
		}



		//  ~ am 4
		if( 5 > hours ){
			// console.log(data);
			// console.log("~ am 4"); 

			let todayTemMin = document.getElementById("todayTemMin");
			let todayTemMax = document.getElementById("todayTemMax");
			
			let temp5 = data.response.body.items.item[5].ta;
			let temp6 = data.response.body.items.item[6].ta;
			let sky5 = data.response.body.items.item[5].wfCd;
			let sky6 = data.response.body.items.item[6].wfCd;
			let water5 = data.response.body.items.item[5].rnYn;
			let water6 = data.response.body.items.item[6].rnYn;


			todayTemMin.innerText = parseInt(temp1);
			todayTemMax.innerText = parseInt(temp2);
			weekMinTem1.innerText = parseInt(temp3);
			weekMaxTem1.innerText = parseInt(temp4);
			weekMinTem2.innerText = parseInt(temp5);
			weekMaxTem2.innerText = parseInt(temp6);

			setTwoDaysIcon( day1IconAm, sky3, water3);
			setTwoDaysIcon( day1IconPm, sky4, water4);
			setTwoDaysIcon( day2IconAm, sky5, water5);
			setTwoDaysIcon( day2IconPm, sky6, water6);
		}


		// am 5 ~ am 11
		if( 5 <= hours && hours <= 10 ){
			// console.log(data); 
			// console.log("am 5 ~ am 10"); 
			let todayTemMax = document.getElementById("todayTemMax");
			
			let temp5 = data.response.body.items.item[5].ta;
			let sky5 = data.response.body.items.item[5].wfCd;
			let water5 = data.response.body.items.item[5].rnYn;

			todayTemMax.innerText = parseInt(temp1);
			weekMinTem1.innerText = parseInt(temp2);
			weekMaxTem1.innerText = parseInt(temp3);
			weekMinTem2.innerText = parseInt(temp4);
			weekMaxTem2.innerText = parseInt(temp5);

			setTwoDaysIcon( day1IconAm, sky2, water2);
			setTwoDaysIcon( day1IconPm, sky3, water3);
			setTwoDaysIcon( day2IconAm, sky4, water4);
			setTwoDaysIcon( day2IconPm, sky5, water5);
		}
		

		//  am11
		if( hours > 10 ){
			// console.log("am11 ~ "); 
			// console.log(data);
			weekMinTem1.innerText = parseInt(temp1);
			weekMaxTem1.innerText = parseInt(temp2);
			weekMinTem2.innerText = parseInt(temp3);
			weekMaxTem2.innerText = parseInt(temp4);

			setTwoDaysIcon( day1IconAm, sky1, water1);
			setTwoDaysIcon( day1IconPm, sky2, water2);
			setTwoDaysIcon( day2IconAm, sky3, water3);
			setTwoDaysIcon( day2IconPm, sky4, water4);
		}

    });
}



// 중기 예보 3-7일  (일주일 기온)
function setWeekTemp(regionCode){

	// 3~7일 기온
    let apiUrl = `http://apis.data.go.kr/1360000/MidFcstInfoService/getMidTa?serviceKey=${openKey}&dataType=json&regId=${regionCode}&tmFc=${openDate}`;
	// console.log(weekOpenTem);


    $.getJSON( apiUrl ,function(data){
        // console.log(data);
		let weekMaxTem3 = document.getElementById("dayMaxTem3");
		let weekMaxTem4 = document.getElementById("dayMaxTem4");
		let weekMaxTem5 = document.getElementById("dayMaxTem5");
		let weekMaxTem6 = document.getElementById("dayMaxTem6");
		let weekMinTem3 = document.getElementById("dayMinTem3");
		let weekMinTem4 = document.getElementById("dayMinTem4");
		let weekMinTem5 = document.getElementById("dayMinTem5");
		let weekMinTem6 = document.getElementById("dayMinTem6");

		weekMaxTem3.innerText = parseInt(data.response.body.items.item[0].taMax3);
		weekMaxTem4.innerText = parseInt(data.response.body.items.item[0].taMax4);
		weekMaxTem5.innerText = parseInt(data.response.body.items.item[0].taMax5);
		weekMaxTem6.innerText = parseInt(data.response.body.items.item[0].taMax6);
		weekMinTem3.innerText = parseInt(data.response.body.items.item[0].taMin3);
		weekMinTem4.innerText = parseInt(data.response.body.items.item[0].taMin4);
		weekMinTem5.innerText = parseInt(data.response.body.items.item[0].taMin5);
		weekMinTem6.innerText = parseInt(data.response.body.items.item[0].taMin6);
    });


}


// 3~7 날씨
function setWeekIcon(regionCode){  

	let apiUrl = `http://apis.data.go.kr/1360000/MidFcstInfoService/getMidLandFcst?serviceKey=${openKey}&pageNo=1&numOfRows=10&dataType=json&regId=${regionCode}&tmFc=${openDate}`;

    $.getJSON( apiUrl ,function(data){
		// console.log(data);
		let iconString3am = data.response.body.items.item[0].wf3Am
		let iconString3pm = data.response.body.items.item[0].wf3Pm
		let iconString4am = data.response.body.items.item[0].wf4Am;
		let iconString4pm = data.response.body.items.item[0].wf4Pm;
		let iconString5am = data.response.body.items.item[0].wf5Am;
		let iconString5pm = data.response.body.items.item[0].wf5Pm;
		let iconString6am = data.response.body.items.item[0].wf6Am;
		let iconString6pm = data.response.body.items.item[0].wf6Pm;

		let iconArray = [iconString3am, iconString3pm, iconString4am, iconString4pm, iconString5am, iconString5pm ,iconString6am, iconString6pm];


		for(let i = 6; i < 14; i++){
			let dayIcon =  document.getElementById('dayIcon' + i);
			let iconString = iconArray[i-6];

			let snowIs = iconString.indexOf('눈');
			let rainIs = iconString.indexOf('비');
			let showerIcon = iconString.indexOf('소나기');
			let sunnyIcon = iconString.indexOf('맑음');


			if( (rainIs!=-1 || showerIcon!=-1) && snowIs!=-1){
				dayIcon.className = 'xi-umbrella-o';
	
			}else if( rainIs!=-1 || showerIcon!=-1 ){
				dayIcon.className = 'xi-pouring';
	
			}else if( snowIs!=-1 ){
				dayIcon.className = 'xi-snowy';
	
			}else if( sunnyIcon!=-1 ){
				dayIcon.className = 'xi-sun-o';
	
			}else{
				dayIcon.className = 'xi-cloudy';
	
			}

		}
    });
}






/* 오늘 날씨  */
// 현재 기온, 날씨
function setNowWeather(nx, ny){
	
	let fcstBaseTime = ('0' + (hours - 1) + '30').slice(-4);
	let apiUrl = `http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtFcst?serviceKey=${openKey}&numOfRows=30&dataType=json&base_date=${todayFormet}&base_time=${fcstBaseTime}&nx=${nx}&ny=${ny}`;

	// http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtFcst?serviceKey=lpu6mNTAPteBKDRE0JpHMQhMQ0LYNzQPiZIkU5OQB8%2B8gyF7m7gp5kahbMcZVUsv06NIkdh7dvX8vdCe35WLmQ%3D%3D&numOfRows=30&pageNo=1&dataType=json&base_date=20210928&base_time=0830&nx=61&ny=126


    $.getJSON( apiUrl ,function(data){
		// console.log(data);
		// console.log(todayOpenWeater);

		let todayIcon = document.getElementById("todayIcon");
		let todayWeather = document.getElementById("todayWeather");
		let todayTemp = document.getElementById("todayTem");

		let temp = data.response.body.items.item[24].fcstValue;
		let sky = data.response.body.items.item[18].fcstValue;
		let water = data.response.body.items.item[6].fcstValue;

		todayTemp.innerText = temp;

		

		// 현재 아이콘
		if( water == 0 ){
			if( sky == 1 ){
				todayIcon.className = 'xi-sun-o';
				todayWeather.innerText = '맑음';
			}else if( sky == 3 ){
				todayIcon.className = 'xi-cloudy';
				todayWeather.innerText = '구름 많음';
			}else{
				todayIcon.className = 'xi-cloudy';
				todayWeather.innerText = '흐림';
			}

		}else if( water == 1 ||  water == 5){
			todayIcon.className = 'xi-pouring';
			todayWeather.innerText = '비';

		}else if( water == 2 ||  water == 6){
			todayIcon.className = 'xi-umbrella-o';
			todayWeather.innerText = '비와 눈';

		}else if( water == 3 ||  water == 7 ){
			todayIcon.className = 'xi-snowy';
			todayWeather.innerText = '눈';
			
		}else{
			console.log( `error 하늘:${sky} , 강수:${water}` );
		}	
			

        
    });
}





// 5시 이후 최저 온도
function setTodayTempMin(nx, ny){
	
	// 현재 날씨
	let apiUrl = `http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst?serviceKey=${openKey}&pageNo=5&dataType=json&base_date=${todayFormet}&base_time=0200&nx=${nx}&ny=${ny}`;
	// http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst?serviceKey=lpu6mNTAPteBKDRE0JpHMQhMQ0LYNzQPiZIkU5OQB8%2B8gyF7m7gp5kahbMcZVUsv06NIkdh7dvX8vdCe35WLmQ%3D%3D&pageNo=1&numOfRows=50&dataType=json&base_date=20210927&base_time=0500&nx=55&ny=127
	// console.log(setTodayTempMin);

    $.getJSON( apiUrl ,function(data){
		// console.log(data);

		let todayTemMin = document.getElementById("todayTemMin");
		let temp = data.response.body.items.item[8].fcstValue;

		todayTemMin.innerText = parseInt(temp);
    });
}


// 11시 이후 최고 온도
function setTodayTempMax(nx, ny){
	
	// 현재 날씨
	let apiUrl = `http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst?serviceKey=${openKey}&pageNo=9&dataType=json&base_date=${todayFormet}&base_time=0800&nx=${nx}&ny=${ny}`;
	// http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst?serviceKey=lpu6mNTAPteBKDRE0JpHMQhMQ0LYNzQPiZIkU5OQB8%2B8gyF7m7gp5kahbMcZVUsv06NIkdh7dvX8vdCe35WLmQ%3D%3D&pageNo=1&numOfRows=50&dataType=json&base_date=20210927&base_time=0500&nx=55&ny=127
	
    $.getJSON( apiUrl ,function(data){
		// console.log(data);
		let todayTemMax = document.getElementById("todayTemMax");
		let temp = data.response.body.items.item[4].fcstValue;

		todayTemMax.innerText = parseInt(temp);
    });
}




// xi-my-location 클릭시 현재 위치 새로 저장
let reloadbtn = document.querySelector(".xi-my-location");
reloadbtn.addEventListener("click", function(){ 
	clearCoords();
});



// 좌표로 날씨 처리하기
getLocationInfoByCoords(getLoadCoords())
	.then((locationInfo) => {
		getTodayWeather(locationInfo)
		getWeekWeather(locationInfo)
	}).catch((error) => {
		console.log(error);
	})


// 주소검색으로 날씨 처리하기
let btn = document.getElementById("address_kakao");
btn.addEventListener("click", function(){
	getSearchingAddress()
		.then((addressObj) => {
			getLocationInfoByAddress(addressObj);
		}).catch((error) => {
			console.log(error);
		})
});



// 날씨 가져오기
function getTodayWeather(locationInfo){
	let nx = locationInfo.xy.nx;
	let ny = locationInfo.xy.ny;
	
	setTodayTempMax(nx, ny);
	setTodayTempMin(nx, ny);
	setNowWeather(nx, ny);
}


function getWeekWeather(locationInfo){
	let smallRegion = locationInfo.smallRegion;
	let largeRegion = locationInfo.largeRegion;

	setWeekIcon(largeRegion);
	setWeekTemp(smallRegion);
	setTwoDaysWeather(smallRegion);
};
	
