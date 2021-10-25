// 날짜
const today = new Date();
let hours = today.getHours(); 

// open api key
const openKey = 'lpu6mNTAPteBKDRE0JpHMQhMQ0LYNzQPiZIkU5OQB8%2B8gyF7m7gp5kahbMcZVUsv06NIkdh7dvX8vdCe35WLmQ%3D%3D';
let todayFormet = today.toLocaleString().substring(0,13).replace(/\s|\./g,''); //yyyymmdd
// let todayFormet = today.toISOString().substring(0,13).replace(/-/g,''); //yyyymmdd
let openDate = todayFormet + '0600';



/* 일주일 날씨 */
// 일주일 최고최저 온도
async function getWeekTemp(smallRegion){
	try {
		const twoDaysTemp = await getTwoDaysTemp(smallRegion);
		const daysTemp = await getDaysTemp(smallRegion);
		// console.log(`${twoDaysTemp},${daysTemp}`);
		return `${twoDaysTemp},${daysTemp}`;
	} catch (error) {
		console.log(error);
	}
}


// 1~2 최고최저 온도
function getTwoDaysTemp(regionCode){

    let apiUrl = `http://apis.data.go.kr/1360000/VilageFcstMsgService/getLandFcst?serviceKey=${openKey}&dataType=json&regId=${regionCode}`;

	return new Promise(function(resolve) {
		$.getJSON( apiUrl, function(data){
			// console.log(data);

			//  ~ am 4
			if( hours < 5){
				// console.log("~ am 4"); 
				let weekMinTem1 = data.response.body.items.item[3].ta;
				let weekMaxTem1 = data.response.body.items.item[4].ta;
				let weekMinTem2 = data.response.body.items.item[5].ta;
				let weekMaxTem2 = data.response.body.items.item[6].ta;
				
				let weekTempArr = [weekMinTem1, weekMaxTem1, weekMinTem2, weekMaxTem2];
				resolve(weekTempArr);
			}


			// am 5 ~ am 11
			if( 5 <= hours && hours <= 10 ){
				// console.log("am 5 ~ am 10"); 
				let weekMinTem1 = data.response.body.items.item[2].ta;
				let weekMaxTem1 = data.response.body.items.item[3].ta;
				let weekMinTem2 = data.response.body.items.item[4].ta;
				let weekMaxTem2 = data.response.body.items.item[5].ta;

				let weekTempArr = [weekMinTem1, weekMaxTem1, weekMinTem2, weekMaxTem2];
				resolve(weekTempArr);
			}
			

			//  am11
			if( hours > 10 ){
				// console.log("am11 ~ "); 
				let weekMinTem1 = data.response.body.items.item[1].ta;
				let weekMaxTem1 = data.response.body.items.item[2].ta;
				let weekMinTem2 = data.response.body.items.item[3].ta;
				let weekMaxTem2 = data.response.body.items.item[4].ta;
				
				let weekTempArr = [weekMinTem1, weekMaxTem1, weekMinTem2, weekMaxTem2];
				resolve(weekTempArr);
			}

		});
	});
}


// 3-7일 최고최저 온도  중기예보
function getDaysTemp(regionCode){

	// 3~7일 기온
    let apiUrl = `http://apis.data.go.kr/1360000/MidFcstInfoService/getMidTa?serviceKey=${openKey}&dataType=json&regId=${regionCode}&tmFc=${openDate}`;

	return new Promise(function(resolve) {
		$.getJSON( apiUrl, function(data){
			// console.log(data);
			let weekMinTem3 = data.response.body.items.item[0].taMin3;
			let weekMaxTem3 = data.response.body.items.item[0].taMax3;
			let weekMinTem4 = data.response.body.items.item[0].taMin4;
			let weekMaxTem4 = data.response.body.items.item[0].taMax4;
			let weekMinTem5 = data.response.body.items.item[0].taMin5;
			let weekMaxTem5 = data.response.body.items.item[0].taMax5;
			let weekMinTem6 = data.response.body.items.item[0].taMin6;
			let weekMaxTem6 = data.response.body.items.item[0].taMax6;
			let weekTempArr = [weekMinTem3, weekMaxTem3, weekMinTem4, weekMaxTem4, weekMinTem5, weekMaxTem5, weekMinTem6, weekMaxTem6];

			resolve(weekTempArr); 
		});
    });
}








// 일주일 날씨
async function getWeekSky(smallRegion, largeRegion){
	try {
		const twoDaysSky = await getTwoDaysSky(smallRegion);
		const daysSky = await getDaysSky(largeRegion);
		// console.log(`${twoDaysSky},${daysSky}`);
		return `${twoDaysSky},${daysSky}`;
	} catch (error) {
		console.log(error);
	}
}


// 1-2 날씨
function getTwoDaysSky(regionCode){
	// let selectCodes = regionCode[0].code;
	
    let apiUrl = `http://apis.data.go.kr/1360000/VilageFcstMsgService/getLandFcst?serviceKey=${openKey}&dataType=json&regId=${regionCode}`;

	
	return new Promise(function(resolve) {
		$.getJSON( apiUrl, function(data){
			// console.log(data);
			let sky1 = data.response.body.items.item[1].wfCd;
			let sky2 = data.response.body.items.item[2].wfCd;
			let sky3 = data.response.body.items.item[3].wfCd;
			let sky4 = data.response.body.items.item[4].wfCd;
			
			let water1 = data.response.body.items.item[1].rnYn;
			let water2 = data.response.body.items.item[2].rnYn;
			let water3 = data.response.body.items.item[3].rnYn;
			let water4 = data.response.body.items.item[4].rnYn;

			//  ~ am 4
			if( 5 > hours ){
				// console.log("~ am 4"); 
				
				let sky5 = data.response.body.items.item[5].wfCd;
				let sky6 = data.response.body.items.item[6].wfCd;
				let water5 = data.response.body.items.item[5].rnYn;
				let water6 = data.response.body.items.item[6].rnYn;
				let weekSkyArr =[
					getTwoDaysSkySting( sky3, water3),
					getTwoDaysSkySting( sky4, water4),
					getTwoDaysSkySting( sky5, water5),
					getTwoDaysSkySting( sky6, water6)
				]

				resolve(weekSkyArr);
			}

			// am 5 ~ am 11
			if( 5 <= hours && hours <= 10 ){
				// console.log("am 5 ~ am 10"); 
				let sky5 = data.response.body.items.item[5].wfCd;
				let water5 = data.response.body.items.item[5].rnYn;
				let weekSkyArr =[
					getTwoDaysSkySting( sky2, water2),
					getTwoDaysSkySting( sky3, water3),
					getTwoDaysSkySting( sky4, water4),
					getTwoDaysSkySting( sky5, water5)
				]

				resolve(weekSkyArr);
			}

			//  am11
			if( hours > 10 ){
				// console.log("am11 ~ "); 
				let weekSkyArr =[
					getTwoDaysSkySting( sky1, water1),
					getTwoDaysSkySting( sky2, water2),
					getTwoDaysSkySting( sky3, water3),
					getTwoDaysSkySting( sky4, water4)
				]

				resolve(weekSkyArr);
			}

		});
	});
}


// 1-2 날씨 판별
function getTwoDaysSkySting(sky, water){
	if( water == 0 ){
		if( sky == 'DB01'){
			return 'xi-sun-o';
		}else{
			return 'xi-cloudy';
		}
	}else if( water == 1 ||  water == 4 ){
		return 'xi-pouring';
	}else if( water == 3 ){
		return 'xi-snowy';
	}else{
		return 'xi-umbrella-o';
	}	
}


// 3~7 날씨
function getDaysSky(regionCode){  

	let apiUrl = `http://apis.data.go.kr/1360000/MidFcstInfoService/getMidLandFcst?serviceKey=${openKey}&pageNo=1&numOfRows=10&dataType=json&regId=${regionCode}&tmFc=${openDate}`;

	
	return new Promise(function(resolve) {
		$.getJSON( apiUrl, function(data){
			// console.log(data);
			let weekStingAm3 = data.response.body.items.item[0].wf3Am
			let weekStingPm3 = data.response.body.items.item[0].wf3Pm
			let weekStingAm4 = data.response.body.items.item[0].wf4Am;
			let weekStingPm4 = data.response.body.items.item[0].wf4Pm;
			let weekStingAm5 = data.response.body.items.item[0].wf5Am;
			let weekStingPm5 = data.response.body.items.item[0].wf5Pm;
			let weekStingAm6 = data.response.body.items.item[0].wf6Am;
			let weekStingPm6 = data.response.body.items.item[0].wf6Pm;

			let weekArr = [weekStingAm3, weekStingPm3, weekStingAm4, weekStingPm4, weekStingAm5, weekStingPm5, weekStingAm6, weekStingPm6]; 
			let weekStingArr = new Array(); 

			for(let i = 0; i < 8; i++){
				let daySting = weekArr[i];
				let snowIs = daySting.indexOf('눈');
				let rainIs = daySting.indexOf('비');
				let showerIcon = daySting.indexOf('소나기');
				let sunnyIcon = daySting.indexOf('맑음');

				if( (rainIs!=-1 || showerIcon!=-1) && snowIs!=-1){
					weekStingArr.push('xi-umbrella-o');
				}else if( rainIs!=-1 || showerIcon!=-1 ){
					weekStingArr.push('xi-pouring');
				}else if( snowIs!=-1 ){
					weekStingArr.push('xi-snowy');
				}else if( sunnyIcon!=-1 ){
					weekStingArr.push('xi-sun-o');
				}else{
					weekStingArr.push('xi-cloudy');
				}
			}

			resolve(weekStingArr);

		});
	});
	
}







/* 오늘 날씨  */
// 현재 기온, 날씨
function getNowWeather(nx, ny){
	
	let fcstBaseTime = ('0' + (hours - 1) + '30').slice(-4);
	let apiUrl = `http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtFcst?serviceKey=${openKey}&numOfRows=30&dataType=json&base_date=${todayFormet}&base_time=${fcstBaseTime}&nx=${nx}&ny=${ny}`;
	// http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtFcst?serviceKey=lpu6mNTAPteBKDRE0JpHMQhMQ0LYNzQPiZIkU5OQB8%2B8gyF7m7gp5kahbMcZVUsv06NIkdh7dvX8vdCe35WLmQ%3D%3D&numOfRows=30&pageNo=1&dataType=json&base_date=20210928&base_time=0830&nx=61&ny=126

	return new Promise(function(resolve) {
		$.getJSON( apiUrl, function(data){
			// console.log(data);

			let temp = data.response.body.items.item[24].fcstValue;
			let sky = data.response.body.items.item[18].fcstValue;
			let water = data.response.body.items.item[6].fcstValue;
			let nowSky, nowSkySting;

			// 현재 아이콘
			if( water == 0 ){
				if( sky == 1 ){
					nowSky = 'xi-sun-o';
					nowSkySting = '맑음';
				}else if( sky == 3 ){
					nowSky = 'xi-cloudy';
					nowSkySting = '구름 많음';
				}else{
					nowSky = 'xi-cloudy';
					nowSkySting = '흐림';
				}

			}else if( water == 1 ||  water == 5){
				nowSky = 'xi-pouring';
				nowSkySting = '비';

			}else if( water == 2 ||  water == 6){
				nowSky = 'xi-umbrella-o';
				nowSkySting = '비와 눈';

			}else if( water == 3 ||  water == 7 ){
				nowSky = 'xi-snowy';
				nowSkySting = '눈';
				
			}else{
				console.log( `error 하늘:${sky} , 강수:${water}` );
			}	
			
			const nowWeatherArr = `${nowSky},${nowSkySting},${temp}`;

			// console.log(nowWeatherArr);
			resolve(nowWeatherArr);
			
		});
	});
}




// 오늘 최고 최저 온도
async function getTodayTemp(regionCode, nx, ny){
	
	try {
		let todayTempArr = new Array();

		if(hours < 5){
			let todayTemp = await getTodayTemp1(regionCode);
			todayTempArr = `${todayTemp}`;
		}else if(hours >= 17){
			let todayMinTemp = await getTodayTemp2(nx, ny);
			let todayMaxTemp = await getTodayTemp3(nx, ny);
			todayTempArr = `${todayMinTemp},${todayMaxTemp}`;
		}else{
			let todayMinTemp = await getTodayTemp2(nx, ny);
			let todayMaxTemp = await getTodayTemp1(regionCode);
			todayTempArr = `${todayMinTemp},${todayMaxTemp}`;
		}

		// console.log(todayTempArr);
		return todayTempArr;
	} catch (error) {
		console.log(error);
	}

}


function getTodayTemp1(regionCode){
    let apiUrl = `http://apis.data.go.kr/1360000/VilageFcstMsgService/getLandFcst?serviceKey=${openKey}&dataType=json&regId=${regionCode}`;
	
	return new Promise(function(resolve) {
		$.getJSON( apiUrl ,function(data){
			if(11 <= hours && hours < 17){
				todayTemMax = data.response.body.items.item[0].ta;
				resolve(todayTemMax);
			}else if( 5 <= hours && hours < 11 ){
				todayTemMax = data.response.body.items.item[1].ta;
				resolve(todayTemMax);
			}else if( 5 < hours ){
				todayTemMin = data.response.body.items.item[1].ta;
				todayTemMax = data.response.body.items.item[2].ta;
				let todayTemp = [todayTemMin, todayTemMax]
				resolve(todayTemp)
			}
		});
	});

}


// 5시 이후 최저 온도
function getTodayTemp2(nx, ny){	
	let apiUrl = `http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst?serviceKey=${openKey}&pageNo=5&dataType=json&base_date=${todayFormet}&base_time=0200&nx=${nx}&ny=${ny}`;

	
	return new Promise(function(resolve) {
		$.getJSON( apiUrl, function(data){
			let todayTemMin = data.response.body.items.item[8].fcstValue;
			resolve(todayTemMin);
		});
    });
}


// 17시 이후 최고 온도
function getTodayTemp3(nx, ny){
	
	let apiUrl = `http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst?serviceKey=${openKey}&pageNo=9&dataType=json&base_date=${todayFormet}&base_time=0800&nx=${nx}&ny=${ny}`;
	// http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst?serviceKey=lpu6mNTAPteBKDRE0JpHMQhMQ0LYNzQPiZIkU5OQB8%2B8gyF7m7gp5kahbMcZVUsv06NIkdh7dvX8vdCe35WLmQ%3D%3D&pageNo=1&numOfRows=50&dataType=json&base_date=20210927&base_time=0500&nx=55&ny=127
	
	return new Promise(function(resolve) {
		$.getJSON( apiUrl, function(data){
			let todayTemMax =  data.response.body.items.item[4].fcstValue;
			resolve(todayTemMax);
		});
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

