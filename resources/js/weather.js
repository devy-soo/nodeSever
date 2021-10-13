// 날짜
const today = new Date();
let hours = today.getHours(); 

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
	var today = getDate(0).split('/');
	todayDate.innerText = `${today[0]}월 ${today[1]}일`;   
}









// open api key
const openKey = 'lpu6mNTAPteBKDRE0JpHMQhMQ0LYNzQPiZIkU5OQB8%2B8gyF7m7gp5kahbMcZVUsv06NIkdh7dvX8vdCe35WLmQ%3D%3D';
let todayFormet = today.toISOString().substring(0,10).replace(/-/g,''); //yyyymmdd
let openDate = todayFormet + '0600';




  

let geoCoords = 'coords';




/* ### 현재위치 ### */
// 위치 요청 허락
function handleGeoAccept(position) {
	
	const latitude = position.coords.latitude;
	const longitude = position.coords.longitude;
	const coordsObj = {latitude : latitude, longitude : longitude};

	saveGeoToCoords(coordsObj);
}



// 위치 거절
function handleGeoReject() { 
	alert("위치 정보 제공을 허용해주세요.\n위치 정보를 불러오는데 실패했습니다.");
}

//위치 저장
function saveGeoToCoords(coordsObj){
    localStorage.setItem(geoCoords, JSON.stringify(coordsObj));
}

// 사용자 위치 요청 (수락, 거절)
function askForCoords() { 
	navigator.geolocation.getCurrentPosition(handleGeoAccept, handleGeoReject);
}




//위치 
function loadCoords() {
    const loadedCords = localStorage.getItem(geoCoords);

    let loadedCordsObject = {};
    loadedCordsObject =  JSON.parse(loadedCords);
	
    // 만약 loadedCord 가 null 이면
    if(loadedCords === null) {
        askForCoords()
    }
	return loadedCordsObject;

}


/*
//참고하기
async function post(host, path, body, headers = {}) {
  const url = `https://${host}/${path}`;
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body: JSON.stringify(body),
  };
  const res = await fetch(url, options);
  const data = await res.json();
  if (res.ok) {
    return data;
  } else {
    throw Error(data);
  }
}

post("jsonplaceholder.typicode.com", "posts", {
  title: "Test",
  body: "I am testing!",
  userId: 1,
})
  .then((data) => console.log(data))
  .catch((error) => console.log(error));

*/






/// 현재 좌표값으로 주소 알아내기
function coordsToAddress(coords){
	let myHeaders = new Headers();

	let myInit = { 
		method: 'GET',
		headers: myHeaders,
		headers : {'Authorization' : 'KakaoAK 2c9fafbd450c3523f216521256ccd060'},
		cache: 'default' 
	};

	let myRequest = new Request( `https://dapi.kakao.com/v2/local/geo/coord2address.json?x=${coords.longitude}&y=${coords.latitude}&input_coord=WGS84` , myInit);

	// modifyCoordsByGrid(coords);

	fetch(myRequest).then(response => response.json())
	.then(addressObj => {
		addressObj = {
			address_name : addressObj.documents[0].address.address_name,
			addressName2 : addressObj.documents[0].address.region_1depth_name,
			addressName3 : addressObj.documents[0].address.region_2depth_name
		};
		console.log(addressObj);
		return addressObj;
	}).then((addressObj) => {
			let smallCode = getRegionCode(addressObj);
			let largeCode = getRegion(addressObj);
			let regionCode = [smallCode, largeCode];
			return regionCode;
	}).then((regionCode) => {
		convertCode(regionCode[0]);
		weekIconSetting(regionCode[1]);
	}).catch(function(err){
		console.log(err)
	});
}

coordsToAddress(loadCoords());


/*

  function getWeather() {
	return new Promise(function(resolve, reject) {
		coordsToAddress(loadCoords());
		let coords = coordsToAddress(loadCoords());
		resolve(coords)
	});
  } //Promise사용 시 작업이 끝났음을 알려주는 resolve를 인자로 받아들임.
  
  getWeather()
  	.then((addressObj) => {
			let smallCode = getRegionCode(addressObj);
			let largeCode = getRegion(addressObj);
			let regionCode = [smallCode, largeCode];
			return regionCode;
	}).then((regionCode) => {
		convertCode(regionCode[0]);
		weekIconSetting(regionCode[1]);
	});

	*/




// dfs_xy_conv(code, v1, v2);
function modifyCoordsByGrid(searchInfo){

	let roArray = changeCode("toXY", searchInfo.latitude, searchInfo.longitude);
	// 위도/경도 -> 기상청 좌표x / 좌표 y 변환
	nowWeather(roArray.nx, roArray.ny);

	if( hours > 10 ){
		todayTempMax(roArray.nx, roArray.ny);
	}

	if( hours >= 5 ){
		todayTempMin(roArray.nx, roArray.ny);
	}

	// console.log(roArray);
}




function loadWeatherByAddress(addressObj){
	let todayCity = document.querySelector('#todayCity');
	todayCity.innerText = addressObj.addressName3;

	getRegionCode(addressObj.addressName2, addressObj.addressName3);
	weekIconSetting(addressObj.addressName2, addressObj.addressName3);
}




// 기상청 지역 구분(small region json)
function getAddressJson(file, callback) {
	let jsonFile = new XMLHttpRequest();
	jsonFile.overrideMimeType("application/json");
	jsonFile.open("GET", file, true);
	jsonFile.onreadystatechange = function() {
		if (jsonFile.readyState === 4 && jsonFile.status == "200") {
			callback(jsonFile.responseText);
		}
	}
	jsonFile.send(null);
}
  
var jsonData;

getAddressJson("js/address.json", function(text){
	jsonData = JSON.parse(text);
	// console.log(jsonData);
	// console.log(data[0].region);
  
});


// address.json과 주소 검색 비교 > 지역 코드 반환 (일주일날씨)
function getRegionCode(addressName){

	// console.log(`sido:${addressName2}, sigungu:${addressName3}`);

	let addressName2 = addressName.addressName2;
	let addressName3 = addressName.addressName3;

	for (let i in jsonData) { 

		let regionName = jsonData[i].region;
		// let regionCode;

		if(addressName2.match('광주')){
			// regionCode = '11F20501'
			// return convertCode(regionCode);
			return '11F20501';

		}else if(addressName3.match('광주')){
			// regionCode = '11B20702'
			// return convertCode(regionCode);
			return '11B20702';

		}else if(addressName3.match('고성')){
			if(addressName2.match('강원')){ 
				// regionCode = '11D20402'
				// return convertCode(regionCode); 
				return '11D20402';
			}
			if(addressName2.match('경남')){ 
				// regionCode = '11H20404'
				// return convertCode(regionCode); 
				return '11F20501';
			}

		}else if(addressName2.match(regionName)){
			regionJsonObj = jsonData.filter(it => it.region.includes(regionName));
			// return convertCode(regionJsonObj[0].code);
			return regionJsonObj[0].code;

		}else if(addressName3.match(regionName)){
			regionJsonObj = jsonData.filter(it => it.region.includes(regionName));
			// return convertCode(regionJsonObj[0].code);
			return regionJsonObj[0].code;
		}

	}

}



// 3-7 날씨 지역 코드
const weekIconRegionArr = [
	{region: "서울", code: "11B00000"},
	{region: "인천", code: "11B00000"},
	{region: "경기", code: "11B00000"},
	{region: "대전", code: "11C20000"},
	{region: "세종특별자치시", code: "11C20000"},
	{region: "충남", code: "11C20000"},
	{region: "충북", code: "11C10000"},
	{region: "광주", code: "11F20000"},
	{region: "전남", code: "11F20000"},
	{region: "전북", code: "11F10000"},
	{region: "대구", code: "11H10000"},
	{region: "경북", code: "11H10000"},
	{region: "부산", code: "11H20000"},
	{region: "울산", code: "11H20000"},
	{region: "경남", code: "11H20000"},
	{region: "제주특별자치도", code: "11G00000"}
];

function getRegion(addressName){
	
	let addressName2 = addressName.addressName2;
	let addressName3 = addressName.addressName3;

	if( addressName2 == '강원'){

		if( addressName3 == '고성군' || addressName3 == '속초시' || addressName3 == '양양군' || addressName3 == '강릉시' || addressName3 == '동해시' || addressName3 == '삼척시' || addressName3 == '태백시' ){
			// let weekIconRegion = {region: "강원도영동", code: "11D20000"};
			return '11D20000';
		}else{
			// let weekIconRegion = {region: "강원도영서", code: "11B00000"};
			return '11B00000';
		}

	}else{

		let weekIconRegion = weekIconRegionArr.find(x => x.region === addressName2);
		// weekRegionCode = weekIconRegion.code;
		return weekIconRegion.code;

	}
}






// (0)1-2 기온, 날씨
function twoDaysWeather(regionCode){
	// let selectCodes = regionCode[0].code;
	
    let day2OpenTem = `https://cors.bridged.cc/http://apis.data.go.kr/1360000/VilageFcstMsgService/getLandFcst?serviceKey=${openKey}&dataType=json&regId=${regionCode}`;

    $.getJSON( day2OpenTem ,function(data){

        // console.log(data);
        // console.log(day2OpenTem);


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
		function dayIconSetting(dayIcon, sky, water){

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
			console.log("~ am 4"); 

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

			dayIconSetting( day1IconAm, sky3, water3);
			dayIconSetting( day1IconPm, sky4, water4);
			dayIconSetting( day2IconAm, sky5, water5);
			dayIconSetting( day2IconPm, sky6, water6);
		}


		// am 5 ~ am 11
		if( 5 <= hours && hours <= 10 ){
			// console.log(data); 
			console.log("am 5 ~ am 10"); 

			let todayTemMax = document.getElementById("todayTemMax");
			
			let temp5 = data.response.body.items.item[5].ta;
			let sky5 = data.response.body.items.item[5].wfCd;
			let water5 = data.response.body.items.item[5].rnYn;


			todayTemMax.innerText = parseInt(temp1);
			weekMinTem1.innerText = parseInt(temp2);
			weekMaxTem1.innerText = parseInt(temp3);
			weekMinTem2.innerText = parseInt(temp4);
			weekMaxTem2.innerText = parseInt(temp5);

			dayIconSetting( day1IconAm, sky2, water2);
			dayIconSetting( day1IconPm, sky3, water3);
			dayIconSetting( day2IconAm, sky4, water4);
			dayIconSetting( day2IconPm, sky5, water5);
		}
		


		//  am11
		if( hours > 10 ){
			console.log("am11 ~ "); 
			// console.log(data);
			
			weekMinTem1.innerText = parseInt(temp1);
			weekMaxTem1.innerText = parseInt(temp2);
			weekMinTem2.innerText = parseInt(temp3);
			weekMaxTem2.innerText = parseInt(temp4);

			dayIconSetting( day1IconAm, sky1, water1);
			dayIconSetting( day1IconPm, sky2, water2);
			dayIconSetting( day2IconAm, sky3, water3);
			dayIconSetting( day2IconPm, sky4, water4);
		}

		

    });


}



// 중기 예보 3-7일  (일주일 기온)
function weekTempSetting(regionCode){

	// 3~7일 기온
    let weekOpenTem = `https://cors.bridged.cc/http://apis.data.go.kr/1360000/MidFcstInfoService/getMidTa?serviceKey=${openKey}&dataType=json&regId=${regionCode}&tmFc=${openDate}`;

	// console.log(weekOpenTem);


    $.getJSON( weekOpenTem ,function(data){
        // console.log(data);
		
		let weekMaxTem3 = document.getElementById("dayMaxTem3");
		weekMaxTem3.innerText = parseInt(data.response.body.items.item[0].taMax3);

		let weekMaxTem4 = document.getElementById("dayMaxTem4");
		weekMaxTem4.innerText = parseInt(data.response.body.items.item[0].taMax4);

		let weekMaxTem5 = document.getElementById("dayMaxTem5");
		weekMaxTem5.innerText = parseInt(data.response.body.items.item[0].taMax5);

		let weekMaxTem6 = document.getElementById("dayMaxTem6");
		weekMaxTem6.innerText = parseInt(data.response.body.items.item[0].taMax6);


		let weekMinTem3 = document.getElementById("dayMinTem3");
		weekMinTem3.innerText = parseInt(data.response.body.items.item[0].taMin3);

		let weekMinTem4 = document.getElementById("dayMinTem4");
		weekMinTem4.innerText = parseInt(data.response.body.items.item[0].taMin4);

		let weekMinTem5 = document.getElementById("dayMinTem5");
		weekMinTem5.innerText = parseInt(data.response.body.items.item[0].taMin5);

		let weekMinTem6 = document.getElementById("dayMinTem6");
		weekMinTem6.innerText = parseInt(data.response.body.items.item[0].taMin6);

		
    });


}


// 3~7 날씨
function weekIconSetting(regionCode){  


	let weekOpenIcon = `https://cors.bridged.cc/http://apis.data.go.kr/1360000/MidFcstInfoService/getMidLandFcst?serviceKey=${openKey}&pageNo=1&numOfRows=10&dataType=json&regId=${regionCode}&tmFc=${openDate}`;

	// http://apis.data.go.kr/1360000/MidFcstInfoService/getMidLandFcst?serviceKey=lpu6mNTAPteBKDRE0JpHMQhMQ0LYNzQPiZIkU5OQB8%2B8gyF7m7gp5kahbMcZVUsv06NIkdh7dvX8vdCe35WLmQ%3D%3D&pageNo=1&numOfRows=10&dataType=JSON&regId=11B00000&tmFc=202109230600

	// console.log(weekOpenIcon);

    $.getJSON( weekOpenIcon ,function(data){

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





/* ### 검색 ### */
// 주소 api 이용
function searchAddress(){
	document.getElementById("address_kakao").addEventListener("click", function(){ //주소입력칸을 클릭하면
		
		//카카오 지도 발생
		new daum.Postcode({
			oncomplete: function(data) { //선택시 입력값 세팅
				console.log(data);
				
				const addressObj = {
					addressName : data.query,
					addressName2 : data.sido,
					addressName3 : data.sigungu
				};

				document.getElementById("address_detail").value = addressObj.addressName;
				document.getElementById("address_detail2").value = addressObj.addressName2; 
				document.getElementById("address_detail3").value = addressObj.addressName3;

				return addressObj;
				
				
				// loadWeatherByAddress(addressObj);
				// addressToCoords(addressObj.addressName);
				
			}
		}).open();
	});
}




// 주소로 위도경도 정보 가져오기
function addressToCoords(addr /*, callback*/){

	let addressName = addr.addressName;
    
    let loca = `https://dapi.kakao.com/v2/local/search/address.json?query=${addressName}`;


	
	modifyCoordsByGrid(coords);
	let myHeaders = new Headers();

	let myInit = { 
		method: 'GET',
		headers: myHeaders,
		headers : {'Authorization' : 'KakaoAK 2c9fafbd450c3523f216521256ccd060'},
		cache: 'default' 
	};

	let myRequest = new Request( loca , myInit);


	fetch(myRequest).then(response => response.json())
	.then(searchInfo => {
		searchInfo = {
			latitude : parseFloat(data.documents[0].x).toFixed(4),
			longitude : parseFloat(data.documents[0].y).toFixed(4)
		};
		return searchInfo;
	}).then((addressObj) => {
			let smallCode = getRegionCode(addressObj);
			let largeCode = getRegion(addressObj);
			let regionCode = [smallCode, largeCode];
			return regionCode;
		}).then((regionCode) => {
		convertCode(regionCode[0]);
		weekIconSetting(regionCode[1]);
	}).catch(function(err){
		console.log(err)
	});


	/*
    $.ajax({
        url : loca,
        type : 'GET',
        headers : {
          'Authorization' : 'KakaoAK 2c9fafbd450c3523f216521256ccd060'
        },
		// async:false,
        success : function(data) {
        //   console.log(data);
            // console.log(data.documents[0].x + "와" + data.documents[0].y);
            // console.log(data.documents[0].road_address.region_2depth_name + " "+ data.documents[0].road_address.region_3depth_name );

            let addressX = parseFloat(data.documents[0].x).toFixed(4);
            let addressY = parseFloat(data.documents[0].y).toFixed(4);

            const searchInfo = {
                latitude : addressY,
                longitude : addressX
            };
            
			// return getSerchLocaion = searchInfo;
            loadWeatherByCoords(searchInfo);

			// callback(searchInfo);

        },
        error : function(e) {
          alert("주소를 불러오는데 실패했습니다");
        }
      });
	  */

	//   return getSerchLocaion;
}



//  코드 변환 (일주일 날씨)
function convertCode(regionCode){

	weekTempSetting(regionCode);
	twoDaysWeather(regionCode);
  
}






/* 오늘 날씨  */


// 현재 기온, 날씨
function nowWeather(nx, ny){
	
	
	let fcstBaseTime = ('0' + (hours - 1) + '30').slice(-4);

	let todayOpenWeater = `https://cors.bridged.cc/http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtFcst?serviceKey=${openKey}&numOfRows=30&dataType=json&base_date=${todayFormet}&base_time=${fcstBaseTime}&nx=${nx}&ny=${ny}`;

	// http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtFcst?serviceKey=lpu6mNTAPteBKDRE0JpHMQhMQ0LYNzQPiZIkU5OQB8%2B8gyF7m7gp5kahbMcZVUsv06NIkdh7dvX8vdCe35WLmQ%3D%3D&numOfRows=30&pageNo=1&dataType=json&base_date=20210928&base_time=0830&nx=61&ny=126


    $.getJSON( todayOpenWeater ,function(data){

		// console.log(data);
		console.log(todayOpenWeater);

		
		let todayIcon = document.getElementById("todayIcon");
		let todayWeather = document.getElementById("todayWeather");
		let todayTemp = document.getElementById("todayTem");

		let temp = data.response.body.items.item[24].fcstValue;
		let sky = data.response.body.items.item[18].fcstValue;
		let water = data.response.body.items.item[6].fcstValue;

		// console.log(sky +"&"+ water);

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
function todayTempMin(nx, ny){
	
	// 현재 날씨
	let todayTempMin = `https://cors.bridged.cc/http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst?serviceKey=${openKey}&pageNo=5&dataType=json&base_date=${todayFormet}&base_time=0200&nx=${nx}&ny=${ny}`;

	// http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst?serviceKey=lpu6mNTAPteBKDRE0JpHMQhMQ0LYNzQPiZIkU5OQB8%2B8gyF7m7gp5kahbMcZVUsv06NIkdh7dvX8vdCe35WLmQ%3D%3D&pageNo=1&numOfRows=50&dataType=json&base_date=20210927&base_time=0500&nx=55&ny=127

	// console.log(todayTempMin);

    $.getJSON( todayTempMin ,function(data){

		// console.log(data);

		let todayTemMin = document.getElementById("todayTemMin");
		let temp = data.response.body.items.item[8].fcstValue;

		todayTemMin.innerText = parseInt(temp);
        
    });



}


// 11시 이후 최고 온도
function todayTempMax(nx, ny){
	
	// 현재 날씨
	let todayTempMax = `https://cors.bridged.cc/http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst?serviceKey=${openKey}&pageNo=9&dataType=json&base_date=${todayFormet}&base_time=0800&nx=${nx}&ny=${ny}`;

	// http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst?serviceKey=lpu6mNTAPteBKDRE0JpHMQhMQ0LYNzQPiZIkU5OQB8%2B8gyF7m7gp5kahbMcZVUsv06NIkdh7dvX8vdCe35WLmQ%3D%3D&pageNo=1&numOfRows=50&dataType=json&base_date=20210927&base_time=0500&nx=55&ny=127
	
	// console.log(todayTempMax);
	
    $.getJSON( todayTempMax ,function(data){

		// console.log(data);
		
		let todayTemMax = document.getElementById("todayTemMax");
		let temp = data.response.body.items.item[4].fcstValue;

		todayTemMax.innerText = parseInt(temp);

    });
}






// xi-my-location 클릭시 현재 위치 새로 저장
document.querySelector(".xi-my-location").addEventListener("click", function(){ 
	// loadWeatherByCoords();
	loadCoords();
});

