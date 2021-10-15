/* ### 검색 ### */

// 주소 api 이용
// window.onload = function(){
	document.getElementById("address_kakao").addEventListener("click", function(){ //주소입력칸을 클릭하면
		//카카오 지도 발생
		new daum.Postcode({
			oncomplete: function(data) { //선택시 입력값 세팅
				// console.log(data);
				
				const addressObj = {
					addressName : data.query,
					addressName2 : data.sido,
					addressName3 : data.sigungu
				};
  
				document.getElementById("address_detail").value = addressObj.addressName;
				document.getElementById("address_detail2").value = addressObj.addressName2; 
				document.getElementById("address_detail3").value = addressObj.addressName3;
				
			}
		}).open();
	});
// }








// 카카오 fetch  
// !!!!!!했다 예에
/*
var myHeaders = new Headers();

var myInit = { method: 'GET',
               headers: myHeaders,
			   headers : {
				 'Authorization' : 'KakaoAK 2c9fafbd450c3523f216521256ccd060'
			   },
               cache: 'default' };


const loadedCords = localStorage.getItem(geoCoords);
let loadedCordsObject = {};
loadedCordsObject =  JSON.parse(loadedCords);

var myRequest = new Request( `https://dapi.kakao.com/v2/local/geo/coord2address.json?x=${loadedCordsObject.longitude}&y=${loadedCordsObject.latitude}&input_coord=WGS84` , myInit);

fetch(myRequest).then(response => response.json())
.then(json => {
    console.log(1);
    console.log(json);
});
*/
