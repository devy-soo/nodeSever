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

			let locationInfo = {
				xy : modifyCoordsByGrid(coords), 
				smallRegion: smallCode,  
				largeRegion: largeCode
			};
			resolve(locationInfo);

			let todayCity = document.querySelector('#todayCity');
			todayCity.innerText = addressObj.addressName3;

		}).catch(function(err){
			reject(err)
			// console.log(err)
		});

	})
}



// 좌표로 날씨 처리하기
getLocationInfoByCoords(getLoadCoords())
	.then((locationInfo) => {
		getTodayWeather(locationInfo)
		getWeekWeather(locationInfo)
	}).catch((error) => {
		console.log(error);
	})

