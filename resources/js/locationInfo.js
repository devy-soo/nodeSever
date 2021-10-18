let geoCoords = 'coords';	// 좌표
var jsonData;	// 기상청 지역 구분(small region json)




/* ### 현재위치 ### */
//위치 
function getLoadCoords() {
	const loadedCords = localStorage.getItem(geoCoords);
	let loadedCordsObject = {};
	loadedCordsObject = JSON.parse(loadedCords);

	if (loadedCords === null) {askForCoords();}

	return loadedCordsObject;
}


// 사용자 위치 요청 (수락, 거절)
function askForCoords() { 
	navigator.geolocation.getCurrentPosition(saveCoords, rejectCoords);

	// let id = navigator.geolocation.watchPosition(saveCoords, rejectCoords); 
	// navigator.geolocation.clearWatch(id);
}

// 위치 거절
function rejectCoords() { 
	alert("위치 정보 제공을 허용해주세요.\n위치 정보를 불러오는데 실패했습니다.");
}

//위치 저장
function saveCoords(position){
	const latitude = position.coords.latitude;
	const longitude = position.coords.longitude;
	const coordsObj = {latitude : latitude, longitude : longitude};
	// alert(coordsObj);
    localStorage.setItem(geoCoords, JSON.stringify(coordsObj));

	history.go(0);
}

function clearCoords() {
	localStorage.removeItem(geoCoords);
	askForCoords();
}





/* ### 검색 ### */
const getSearchingAddress = () => {
	return new Promise(function(resolve) {
		new daum.Postcode({
			oncomplete: function(data) { //선택시 입력값 세팅
				const addressObj = {
					addressName : data.query,
					addressName2 : data.sido,
					addressName3 : data.sigungu,
					addressName4 : data.bname
				};
				console.log(data);
				resolve(addressObj);
			}
		}).open();
	});
}



// 주소명으로 주소 정보 알아내기
function getLocationInfoByAddress(addr){
	// return new Promise((resolve, reject) => {

		let addressName = addr.addressName;
		let loca = `https://dapi.kakao.com/v2/local/search/address.json?query=${addressName}`;

		let myHeaders = new Headers();
		let myInit = { 
			method: 'GET',
			headers: myHeaders,
			headers : {'Authorization' : 'KakaoAK 2c9fafbd450c3523f216521256ccd060'},
			cache: 'default' 
		};
                    
		let myRequest = new Request(loca , myInit);
		
		let todayCity = document.querySelector('#todayCity');
		todayCity.innerText = addr.addressName4;

		fetch(myRequest).then(response => response.json())
		.then(data => {
			console.log(data);
			searchInfo = {
				latitude : parseFloat(data.documents[0].y).toFixed(7),
				longitude : parseFloat(data.documents[0].x).toFixed(7)
			};

			let smallCode = getSigunRegionCode(addr);
			let largeCode = getSidoRegionCode(addr);

			let getAddressByCoords = {
				xy : modifyCoordsByGrid(searchInfo), 
				smallRegion: smallCode,  
				largeRegion: largeCode
			};
			return getAddressByCoords;

		}).then(addressObj => {
			setWeather(addressObj);
		}).catch(function(err){
			// reject(err)
			console.log(err)
		});
	// })
}







// 현재 좌표값으로 주소 정보 알아내기
let getLocationInfoByCoords = (coords) =>{
	return new Promise((resolve, reject) => {

		let url = `https://dapi.kakao.com/v2/local/geo/coord2address.json?x=${coords.longitude}&y=${coords.latitude}&input_coord=WGS84`;

		let myHeaders = new Headers();
		let myInit = { 
			method: 'GET',
			headers: myHeaders,
			headers : {'Authorization' : 'KakaoAK 2c9fafbd450c3523f216521256ccd060'},
			cache: 'default' 
		};

		let myRequest = new Request(url , myInit);


		fetch(myRequest).then(response => response.json())
		.then(addressObj => {
			// console.log(addressObj);
			addressObj = {
				address_name : addressObj.documents[0].address.address_name,
				addressName2 : addressObj.documents[0].address.region_1depth_name,
				addressName3 : addressObj.documents[0].address.region_2depth_name
			};
			let smallCode = getSigunRegionCode(addressObj);
			let largeCode = getSidoRegionCode(addressObj);

			let getAddressByCoords = {
				xy : modifyCoordsByGrid(coords), 
				smallRegion: smallCode,  
				largeRegion: largeCode
			};
			resolve(getAddressByCoords);

			let todayCity = document.querySelector('#todayCity');
			todayCity.innerText = addressObj.addressName3;

		}).catch(function(err){
			reject(err)
			// console.log(err)
		});

	})
}







// 기상청 좌표값
function modifyCoordsByGrid(searchInfo){
	let roArray = changeCode("toXY", searchInfo.latitude, searchInfo.longitude);
    return roArray;
}




// small region
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
});



// big region, address.json과 주소 검색 비교 > 지역 코드 반환 (일주일날씨)
function getSigunRegionCode(addressName){
	// console.log(`sido:${addressName2}, sigungu:${addressName3}`);
	let addressName2 = addressName.addressName2;
	let addressName3 = addressName.addressName3;

	for (let i in jsonData) { 

		let regionName = jsonData[i].region;

		if(addressName2.match('광주')){
			return '11F20501';
		}else if(addressName3.match('광주')){
			return '11B20702';
		}else if(addressName3.match('고성')){
			if(addressName2.match('강원')){ 
				return '11D20402';
			}
			if(addressName2.match('경남')){ 
				return '11F20501';
			}
		}else if(addressName2.match(regionName)){
			regionJsonObj = jsonData.filter(it => it.region.includes(regionName));
			return regionJsonObj[0].code;

		}else if(addressName3.match(regionName)){
			regionJsonObj = jsonData.filter(it => it.region.includes(regionName));
			return regionJsonObj[0].code;
		}

	}

}




// 3-7 날씨 지역 코드
function getSidoRegionCode(addressName){
	
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
			return '11B00000';
		}
	}else{
		let weekIconRegion = weekIconRegionArr.find(x => x.region === addressName2);
		// weekRegionCode = weekIconRegion.code;
		return weekIconRegion.code;
	}
}