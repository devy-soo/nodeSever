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



// 일주일 날짜
for(let i = 0; i < 7; i++){
	const dayStandard = new Date();

	dayStandard.setDate(today.getDate() + i);
	let month = ("0" + (1 + dayStandard.getMonth())).slice(-2);
	let day = ("0" + dayStandard.getDate()).slice(-2);

	let dayDate = document.getElementById("dayDate" + i);
	dayDate.innerText = month + "/" + day;                          
}







function day2Weather(findCode){
	let selectCodes = findCode[0].code;
	
	// 1-2 기온
    let day2OpenTem = `https://cors.bridged.cc/http://apis.data.go.kr/1360000/VilageFcstMsgService/getLandFcst?serviceKey=${openKey}&dataType=json&regId=${selectCodes}`;

    $.getJSON( day2OpenTem ,function(data){

        // console.log(data);

		let hours = today.getHours(); 

		// am 5 ~ am 11
		if( 5 <= hours && hours <= 11 ){

			let weekMinTem1 = document.getElementById("dayMinTem1");
			weekMinTem1.innerText = parseInt(data.response.body.items.item[2].ta);

			let weekMaxTem1 = document.getElementById("dayMaxTem1");
			weekMaxTem1.innerText = parseInt(data.response.body.items.item[3].ta);

			let weekMinTem2 = document.getElementById("dayMinTem2");
			weekMinTem2.innerText = parseInt(data.response.body.items.item[4].ta);

			let weekMaxTem2 = document.getElementById("dayMaxTem2");
			weekMaxTem2.innerText = parseInt(data.response.body.items.item[5].ta);
		}

		//  pm12 ~ 다음날 am 4
		if( 5 > hours || hours > 11 ){

			let weekMinTem1 = document.getElementById("dayMinTem1");
			weekMinTem1.innerText = parseInt(data.response.body.items.item[1].ta);

			let weekMaxTem1 = document.getElementById("dayMaxTem1");
			weekMaxTem1.innerText = parseInt(data.response.body.items.item[2].ta);

			let weekMinTem2 = document.getElementById("dayMinTem2");
			weekMinTem2.innerText = parseInt(data.response.body.items.item[3].ta);

			let weekMaxTem2 = document.getElementById("dayMaxTem2");
			weekMaxTem2.innerText = parseInt(data.response.body.items.item[4].ta);

			
			// 2일 아이콘 진행중
			let dayIcon1 = document.getElementById("dayIcon1");
			let amDay2Water = data.response.body.items.item[1].rnYn;
			let pmDay2Water = data.response.body.items.item[2].rnYn;
			let amDay2Sky = data.response.body.items.item[1].wfCd;
			let pmDay2Sky = data.response.body.items.item[2].wfCd;

			
			/*
			if( amDay2Water == 0 && pmDay2Water == 0 ){
				if( amDay2Sky ){
					
				}else{

				}

			}else if( amDay2Weadter != 0 && pmDay2Weadter != 0 ){
				if( amDay2Weadter == pmDay2Weadter){
					return amDay2Weadter;
				}else{
					if(amDay2Weadter == 2 || pmDay2Weadter == 2 || amDay2Weadter == 3 || pmDay2Weadter == 3){
						return 2;
					}else{
						return 1;
					}
				}
			}else{
				if( amDay2Weadter == 0){
					return pmDay2Weadter;
				}else if( pmDay2Weadter == 0 ){
					return amDay2Weadter;
				}
			}

			*/

		}



    });


}







// 중기 예보 3-7일  (일주일 기온)
function viewWeekWeather(findCode){

	let selectCodes = findCode[0].code;

	// 3~7일 기온
    let weekOpenTem = `https://cors.bridged.cc/http://apis.data.go.kr/1360000/MidFcstInfoService/getMidTa?serviceKey=${openKey}&dataType=json&regId=${selectCodes}&tmFc=${openDate}`;

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

		console.log(data);

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





