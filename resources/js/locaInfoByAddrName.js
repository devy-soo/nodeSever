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
				// console.log(data);
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

			let locationInfo = {
				xy : modifyCoordsByGrid(searchInfo), 
				smallRegion: smallCode,  
				largeRegion: largeCode
			};
			return locationInfo;

		}).then(addressObj => {
			getTodayWeather(addressObj);
			getWeekWeather(addressObj);
		}).catch(function(err){
			// reject(err)
			console.log(err)
		});
	// })
}




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


