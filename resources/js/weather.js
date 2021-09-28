/* ### 현재위치 ### */

let geoCoords = 'coords';


//현재 위치 불러오기
function handlePosition(position) {
    navigator.geolocation.getCurrentPosition(

        function (position) {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            const coordsObj = {latitude : latitude, longitude : longitude};

            getAddress(coordsObj);
            
            // console.log(coordsObj);

    },function (position){
        alert('위치 정보를 불러오는데 실패했습니다.')
    });
}

handlePosition();




/// 현재 좌표값으로 주소 알아내기
function getAddress(coordsObj){

    localStorage.setItem(geoCoords, JSON.stringify(coordsObj));
    const loadedCords = localStorage.getItem(geoCoords);

    let loadedCordsObject = {};
    loadedCordsObject =  JSON.parse(loadedCords);

    console.log(loadedCords);

    let geoLocateUrl = `https://dapi.kakao.com/v2/local/geo/coord2address.json?x=${loadedCordsObject.longitude}&y=${loadedCordsObject.latitude}`;

    $.ajax({
        url : geoLocateUrl,
        type : 'GET',
        headers : {
          'Authorization' : 'KakaoAK 2c9fafbd450c3523f216521256ccd060'
        },
        success : function(data) {
          // console.log(data);
        
			const searchInfo = {
				region_1depth_name : data.documents[0].address.region_1depth_name,
				region_2depth_name : data.documents[0].address.region_2depth_name,
				region_3depth_name : data.documents[0].address.region_3depth_name
			};

        // cityName(searchInfo);

        },
        error : function(e) {
          alert("주소를 불러오는데 실패했습니다");
        }
      });

      openCityName(loadedCordsObject);

}




// address json
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
//   console.log(data[0].region);

});



/*

// 주소 정보로 지역 이름 받아오는 함수
function cityName(searchInfo){
    // alert(searchInfo.region_3depth_name);
    
    let todayCity = document.querySelector('#todayCity');
    let apiCity = searchInfo.region_3depth_name;
    todayCity.innerText = apiCity;

}
*/

//37.57326944444445, 126.97095555555556


// 오늘 도시 이름(위도경도)
function openCityName(loadedCordsObject){

	$.ajax({
		url : `https://dapi.kakao.com/v2/local/geo/coord2address.json?x=${loadedCordsObject.longitude}&y=${loadedCordsObject.latitude}&input_coord=WGS84`,
		type : 'GET',
		headers : {
		'Authorization' : 'KakaoAK 2c9fafbd450c3523f216521256ccd060'
		},
		success : function(data) {
			
			let todayCity = document.querySelector('#todayCity');
			let openCity = data.documents[0].address.region_3depth_name;
			todayCity.innerText = openCity;
			
			// console.log(data);
			
			findRegid(data);

		},
		error : function(e) {
			alert("주소를 불러오는데 실패했습니다");
		}
	});

}




// 오늘 regid(위도경도)

function findRegid(data){

	let regDepth1 = data.documents[0].address.region_1depth_name;
	let regDepth2 = data.documents[0].address.region_2depth_name;
	let regDepth3 = data.documents[0].address.region_3depth_name;

	// 서울, 인천, 부산, 울산, 대구, 광주, 대전, 세종, 제주
	const exception1 = ['서울', '인천', '부산', '울산', '대구', '광주', '대전', '세종특별자치시', '제주시']; 

	if( exception1.indexOf(regDepth1) > -1 ){

		let exceptionIndexNum = exception1.indexOf(regDepth1);
		const exceptionName = ['서울', '인천', '부산', '울산', '대구', '광주', '대전', '세종', '제주'];

		let regName = exceptionName[exceptionIndexNum];
		convertCode(regName);
		
	}else if(regDepth2){

	}

}











/* ### 검색 ### */

// 주소 api 이용
window.onload = function(){
	document.getElementById("address_kakao").addEventListener("click", function(){ //주소입력칸을 클릭하면
		//카카오 지도 발생
		new daum.Postcode({
			oncomplete: function(data) { //선택시 입력값 세팅
				console.log(data);
				let addressName = data.query;
				let addressName2 = data.sido;
				let addressName3 = data.sigungu;
  
				document.getElementById("address_detail").value = addressName; // 주소 넣기
				document.getElementById("address_detail2").value = addressName2; // 주소 넣기 
				document.getElementById("address_detail3").value = addressName3; // 주소 넣기 
				// addressToLocation(addressName);
  
				
			  findRegid1(addressName2, addressName3);
			  weekRegionSelect(addressName2, addressName3);
			  
			  addressToLocation(addressName);
			}
		}).open();
	});
}




// address.json과 주소 검색 비교 > 지역 코드 반환 (일주일날씨)
function findRegid1(addressName2, addressName3){

	// console.log(`sido:${addressName2}, sigungu:${addressName3}`);

	for (let i in jsonData) { 

		let regionName = jsonData[i].region;

		if(addressName2.match(regionName)){
			return convertCode(regionName);

		}else if(addressName3.match(regionName)){
			return convertCode(regionName);
		}

	}
	
	// 광주, 고성 예외처리 필요

}
  


//  코드 변환 (일주일 날씨)
function convertCode(regionName){

	let findCode = jsonData.filter(it => it.region.includes(regionName));

	// console.log(findCode);
	// console.log(findCode[0].code);

	viewWeekWeather(findCode);
	day2Weather(findCode);
  
}


const openKey = 'lpu6mNTAPteBKDRE0JpHMQhMQ0LYNzQPiZIkU5OQB8%2B8gyF7m7gp5kahbMcZVUsv06NIkdh7dvX8vdCe35WLmQ%3D%3D';



const today = new Date();
let todayFormet = today.toISOString().substring(0,10).replace(/-/g,''); //yyyymmdd
let openDate = todayFormet + '0600';
let hours = today.getHours(); 



// 일주일 날짜
for(let i = 1; i < 7; i++){
	const dayStandard = new Date();

	dayStandard.setDate(today.getDate() + i);
	let month = ("0" + (1 + dayStandard.getMonth())).slice(-2);
	let day = ("0" + dayStandard.getDate()).slice(-2);

	let dayDate = document.getElementById("dayDate" + i);
	dayDate.innerText = month + "/" + day;                          
}



let todayDate = document.getElementById("todayDate");

const today1 = new Date();
today1.setDate(today1.getDate());
let dayDate1 = ("0" + (1 + today1.getMonth())).slice(-2);
let dayDate2 = ("0" + today1.getDate()).slice(-2);
todayDate.innerText = `${dayDate1}월 ${dayDate2}일`;              





function day2Weather(findCode){
	let selectCodes = findCode[0].code;
	
	// 1-2 기온
    let day2OpenTem = `https://cors.bridged.cc/http://apis.data.go.kr/1360000/VilageFcstMsgService/getLandFcst?serviceKey=${openKey}&dataType=json&regId=${selectCodes}`;

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
			console.log(data); 
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
		


		//  pm11
		if( hours > 10 ){
			console.log("pm11 ~ "); 
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
		



    });


}











// 중기 예보 3-7일  (일주일 기온)
function viewWeekWeather(findCode){

	let selectCodes = findCode[0].code;

	// 3~7일 기온
    let weekOpenTem = `https://cors.bridged.cc/http://apis.data.go.kr/1360000/MidFcstInfoService/getMidTa?serviceKey=${openKey}&dataType=json&regId=${selectCodes}&tmFc=${openDate}`;

	console.log(weekOpenTem);


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



		
		let todayCity = document.querySelector('#todayCity');
		todayCity.innerText = document.getElementById("address_detail3").value;
		
    });


}





// 3-7 날씨 아이콘
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


function weekRegionSelect(addressName2, addressName3){

	let weekRegionCode;

	if( addressName2 == '강원'){

		if( addressName3 == '고성군' || addressName3 == '속초시' || addressName3 == '양양군' || addressName3 == '강릉시' || addressName3 == '동해시' || addressName3 == '삼척시' || addressName3 == '태백시' ){
			let weekIconRegion = {region: "강원도영동", code: "11D20000"};
			weekRegionCode = weekIconRegion.code;
		}else{
			let weekIconRegion = {region: "강원도영서", code: "11B00000"};
			weekRegionCode = weekIconRegion.code;
		}

	}else{

		let weekIconRegion = weekIconRegionArr.find(x => x.region === addressName2);
		weekRegionCode = weekIconRegion.code;

	}



	// 3~7 아이콘
	let weekOpenIcon = `https://cors.bridged.cc/http://apis.data.go.kr/1360000/MidFcstInfoService/getMidLandFcst?serviceKey=${openKey}&pageNo=1&numOfRows=10&dataType=json&regId=${weekRegionCode}&tmFc=${openDate}`;

	// http://apis.data.go.kr/1360000/MidFcstInfoService/getMidLandFcst?serviceKey=lpu6mNTAPteBKDRE0JpHMQhMQ0LYNzQPiZIkU5OQB8%2B8gyF7m7gp5kahbMcZVUsv06NIkdh7dvX8vdCe35WLmQ%3D%3D&pageNo=1&numOfRows=10&dataType=JSON&regId=11B00000&tmFc=202109230600


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








/* 오늘 날씨  */

// 주소로 주소 정보 가져오기
function addressToLocation(addressName){
    
    let loca = `https://dapi.kakao.com/v2/local/search/address.json?query=${addressName}`;

    $.ajax({
        url : loca,
        type : 'GET',
        headers : {
          'Authorization' : 'KakaoAK 2c9fafbd450c3523f216521256ccd060'
        },
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
            
            changeRS(searchInfo);

        },
        error : function(e) {
          alert("주소를 불러오는데 실패했습니다");
        }
      });


}



// dfs_xy_conv(code, v1, v2);
function changeRS(searchInfo){
	let latitude = searchInfo.latitude,
	longitude = searchInfo.longitude;
	let rs = dfs_xy_conv("toXY",latitude,longitude);
	// 위도/경도 -> 기상청 좌표x / 좌표 y 변환
	searchWeather(rs.nx, rs.ny);

	if( hours > 10 ){
		todayTempMin(rs.nx, rs.ny);
		todayTempMax(rs.nx, rs.ny);
	}

	if( hours >= 5 ){
		todayTempMin(rs.nx, rs.ny);
	}

	// console.log(rs);
}





function searchWeather(nx, ny){
	
	// 현재 날씨
	let fcstBaseTime = ('0' + (hours - 1) + '30').slice(-4);

	let todayOpenWeater = `https://cors.bridged.cc/http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtFcst?serviceKey=${openKey}&numOfRows=30&dataType=json&base_date=${todayFormet}&base_time=${fcstBaseTime}&nx=${nx}&ny=${ny}`;

	// !!!!!! base time 시간 계산 함수 필요

	// http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtFcst?serviceKey=lpu6mNTAPteBKDRE0JpHMQhMQ0LYNzQPiZIkU5OQB8%2B8gyF7m7gp5kahbMcZVUsv06NIkdh7dvX8vdCe35WLmQ%3D%3D&numOfRows=30&pageNo=1&dataType=json&base_date=20210928&base_time=0830&nx=61&ny=126


    $.getJSON( todayOpenWeater ,function(data){

		// console.log(data);
		// console.log(todayOpenWeater);

		
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

	
    $.getJSON( todayTempMax ,function(data){

		console.log(data);
		
		let todayTemMax = document.getElementById("todayTemMax");
		let temp = data.response.body.items.item[4].fcstValue;

		todayTemMax.innerText = parseInt(temp);

    });
}






