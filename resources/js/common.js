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

	console.log(findCode);
	// console.log(findCode[0].code);

	viewWeekWeather(findCode);
  
}


const openKey = 'lpu6mNTAPteBKDRE0JpHMQhMQ0LYNzQPiZIkU5OQB8%2B8gyF7m7gp5kahbMcZVUsv06NIkdh7dvX8vdCe35WLmQ%3D%3D';

let today = new Date();
let todayFormet = today.toISOString().substring(0,10).replace(/-/g,''); //yyyymmdd
let openDate = todayFormet + '0600';




// 중기 예보 3-7일  (일주일 기온)
function viewWeekWeather(findCode){

	let selectCodes = findCode[0].code;

    let weekOpenTem = `https://cors.bridged.cc/http://apis.data.go.kr/1360000/MidFcstInfoService/getMidTa?serviceKey=${openKey}&dataType=json&regId=${selectCodes}&tmFc=${openDate}`;

    // let weekOpenTem = 'http://apis.data.go.kr/1360000/MidFcstInfoService/getMidTa?serviceKey=lpu6mNTAPteBKDRE0JpHMQhMQ0LYNzQPiZIkU5OQB8%2B8gyF7m7gp5kahbMcZVUsv06NIkdh7dvX8vdCe35WLmQ%3D%3D
	//&pageNo=1&numOfRows=10&dataType=json&regId=11B10101&tmFc=202109160600';

	// http://apis.data.go.kr/1360000/MidFcstInfoService/getMidTa?serviceKey=lpu6mNTAPteBKDRE0JpHMQhMQ0LYNzQPiZIkU5OQB8%2B8gyF7m7gp5kahbMcZVUsv06NIkdh7dvX8vdCe35WLmQ%3D%3D&numOfRows=10&pageNo=1&regId=11D20501&tmFc=202109160600

	console.log(weekOpenTem);


    $.getJSON( weekOpenTem ,function(data){
        console.log(data);
		
		let weekMaxTem2 = document.getElementById("dayMaxTem2");
		weekMaxTem2.innerText = parseInt(data.response.body.items.item[0].taMax3);

		let weekMaxTem3 = document.getElementById("dayMaxTem3");
		weekMaxTem3.innerText = parseInt(data.response.body.items.item[0].taMax4);

		let weekMaxTem4 = document.getElementById("dayMaxTem4");
		weekMaxTem4.innerText = parseInt(data.response.body.items.item[0].taMax5);

		let weekMaxTem5 = document.getElementById("dayMaxTem5");
		weekMaxTem5.innerText = parseInt(data.response.body.items.item[0].taMax6);

		let weekMaxTem6 = document.getElementById("dayMaxTem6");
		weekMaxTem6.innerText = parseInt(data.response.body.items.item[0].taMax7);

		let weekMinTem2 = document.getElementById("dayMinTem2");
		weekMinTem2.innerText = parseInt(data.response.body.items.item[0].taMin3);

		let weekMinTem3 = document.getElementById("dayMinTem3");
		weekMinTem3.innerText = parseInt(data.response.body.items.item[0].taMin4);

		let weekMinTem4 = document.getElementById("dayMinTem4");
		weekMinTem4.innerText = parseInt(data.response.body.items.item[0].taMin5);

		let weekMinTem5 = document.getElementById("dayMinTem5");
		weekMinTem5.innerText = parseInt(data.response.body.items.item[0].taMin6);

		let weekMinTem6 = document.getElementById("dayMinTem6");
		weekMinTem6.innerText = parseInt(data.response.body.items.item[0].taMin7);


		
		let todayCity = document.querySelector('#todayCity');
		todayCity.innerText = document.getElementById("address_detail3").value;
		

        // for (let i = 2; i < 6; i++) {
        //     let weekMaxTem = document.getElementById("dayMaxTem" + i);
        //     let weekMinTem = document.getElementById("dayMinTem" + i);

        //     weekMinTem.innerText = parseInt(data.daily[i].temp.min);
        //     weekMaxTem.innerText = parseInt(data.response.body.items.item[0].taMax3);
        // }

        

        // let todayTemMin = document.querySelector('#todayTemMin');
        // let openTemMin = parseInt(data.daily[0].temp.min);
        // todayTemMin.innerText = openTemMin;

        // let todayTemMax = document.querySelector('#todayTemMax');
        // let openTemMax = parseInt(data.daily[0].temp.max);
        // todayTemMax.innerText = openTemMax;
    });

}
	
