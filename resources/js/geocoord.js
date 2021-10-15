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




























let geoCoords = 'coords';	// 좌표
var jsonData;	// 기상청 지역 구분(small region json)


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
function getLoadCoords() {
    const loadedCords = localStorage.getItem(geoCoords);

    let loadedCordsObject = {};
    loadedCordsObject =  JSON.parse(loadedCords);
	
    // 만약 loadedCord 가 null 이면
    if(loadedCords === null) {
        askForCoords()
    }
	return loadedCordsObject;

}



let getLocationByGeo = function(geoLocationInfo){
	return new Promise(function(resolve, reject){
		resolve(geoLocationInfo);
		
		let geoLocationArr = []; 
		geoLocationArr.push(geoLocationInfo);
		return geoLocationArr;
	})
}


getLocationByGeo( getLoadCoords() )
	.then((coords) => {
		let address = coordsToAddress(coords);
		let grid = modifyCoordsByGrid(coords);
		console.log(address);
		let addressGrid = [address , grid];
		return addressGrid;
	})
	.then((addressObj) => {
		let smallCode = getRegionCode(addressObj);
		let largeCode = getRegion(addressObj);
		let regionCode = [smallCode, largeCode];
		return regionCode;
	}).then((regionCode) => {
		convertCode(regionCode[0]);
		weekIconSetting(regionCode[1]);
	}).catch(function(err){
		console.log(err);
	});



// coordsToAddress(loadCoords()).then((addressObj) => {
// 	let smallCode = getRegionCode(addressObj);
// 	let largeCode = getRegion(addressObj);
// 	let regionCode = [smallCode, largeCode];
// 	return regionCode;
// }).then((regionCode) => {
// 	convertCode(regionCode[0]);
// 	weekIconSetting(regionCode[1]);
// }).catch(function(err){
// 	console.log(err)
// });




// small region 알아오기
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
  

getAddressJson("js/smallRegion.json", function(text){
	jsonData = JSON.parse(text);
	// console.log(text);
	// console.log(jsonData[0].region);
});









// 현재 좌표값으로 주소 알아내기
function coordsToAddress (coords){

	/*
	let myHeaders = new Headers();

	let myInit = { 
		method: 'GET',
		headers: myHeaders,
		headers : {'Authorization' : 'KakaoAK 2c9fafbd450c3523f216521256ccd060'},
		cache: 'default' 
	};

	let myRequest = new Request( `https://dapi.kakao.com/v2/local/geo/coord2address.json?x=${coords.longitude}&y=${coords.latitude}&input_coord=WGS84` , myInit);


	fetch(myRequest).then(response => response.json())
	.then(addressObj => {
		addressObj = {
			address_name : addressObj.documents[0].address.address_name,
			addressName2 : addressObj.documents[0].address.region_1depth_name,
			addressName3 : addressObj.documents[0].address.region_2depth_name
		};
		console.log(addressObj);
		return addressObj;

	}).catch(function(err){
		console.log(err)
	});
	*/

	let geoLocateUrl = `https://dapi.kakao.com/v2/local/geo/coord2address.json?x=${coords.longitude}&y=${coords.latitude}`;

    $.ajax({
        url : geoLocateUrl,
        type : 'GET',
        headers : {
          'Authorization' : 'KakaoAK 2c9fafbd450c3523f216521256ccd060'
        },
        success : function(data) {
        //   console.log(data);
        
			const searchInfo = {
				region_1depth_name : data.documents[0].address.region_1depth_name,
				region_2depth_name : data.documents[0].address.region_2depth_name,
				region_3depth_name : data.documents[0].address.region_3depth_name
			};

			return searchInfo;


        },
        error : function(e) {
          alert("주소를 불러오는데 실패했습니다");
        }
      });



}






function modifyCoordsByGrid(searchInfo){
	let roArray = changeCode("toXY", searchInfo.latitude, searchInfo.longitude);
    return roArray;
}


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
			return '11F20501';

		}else if(addressName3.match('광주')){
			// regionCode = '11B20702'
			return '11B20702';

		}else if(addressName3.match('고성')){
			if(addressName2.match('강원')){ 
				// regionCode = '11D20402'
				return '11D20402';
			}
			if(addressName2.match('경남')){ 
				// regionCode = '11H20404'
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

function getRegion(addressName){
	
	let addressName2 = addressName.addressName2;
	let addressName3 = addressName.addressName3;

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

searchAddress();



// 주소로 위도경도 정보 가져오기
function addressToCoords(addr /*, callback*/){

	let addressName = addr.addressName;
    
    let loca = `https://dapi.kakao.com/v2/local/search/address.json?query=${addressName}`;


	
	// modifyCoordsByGrid(coords);
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
