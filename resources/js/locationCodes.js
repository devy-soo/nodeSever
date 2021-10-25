let geoCoords = 'coords';	// 좌표
var jsonData;	// 기상청 지역 구분(small region json)



// 기상청 좌표값
// LCC DFS 좌표변환을 위한 기초 자료
const RE = 6371.00877; // 지구 반경(km)
const GRID = 5.0; // 격자 간격(km)
const SLAT1 = 30.0; // 투영 위도1(degree)
const SLAT2 = 60.0; // 투영 위도2(degree)
const OLON = 126.0; // 기준점 경도(degree)
const OLAT = 38.0; // 기준점 위도(degree)
const XO = 43; // 기준점 X좌표(GRID)
const YO = 136; // 기1준점 Y좌표(GRID)
// LCC DFS 좌표변환 ( code : "toXY"(위경도->좌표, x:위도, y:경도), "toLL"(좌표->위경도,x:x, y:y) )

 function changeCode(code, x, y) {
    const DEGRAD = Math.PI / 180.0;
    const RADDEG = 180.0 / Math.PI;
 
    let re = RE / GRID;
    const slat1 = SLAT1 * DEGRAD;
    const slat2 = SLAT2 * DEGRAD;
    const olon = OLON * DEGRAD;
    const olat = OLAT * DEGRAD;
 
    let sn = Math.tan(Math.PI * 0.25 + slat2 * 0.5) / Math.tan(Math.PI * 0.25 + slat1 * 0.5);
    sn = Math.log(Math.cos(slat1) / Math.cos(slat2)) / Math.log(sn);
    let sf = Math.tan(Math.PI * 0.25 + slat1 * 0.5);
    sf = Math.pow(sf, sn) * Math.cos(slat1) / sn;
    let ro = Math.tan(Math.PI * 0.25 + olat * 0.5);
    ro = re * sf / Math.pow(ro, sn);
    const roArray = {};
    if (code == "toXY") {
 
        roArray['lat'] = x;
        roArray['lng'] = y;
        let ra = Math.tan(Math.PI * 0.25 + (x) * DEGRAD * 0.5);
        ra = re * sf / Math.pow(ra, sn);
        let theta = y * DEGRAD - olon;
        if (theta > Math.PI) theta -= 2.0 * Math.PI;
        if (theta < -Math.PI) theta += 2.0 * Math.PI;
        theta *= sn;
        roArray['nx'] = Math.floor(ra * Math.sin(theta) + XO + 0.5);
        roArray['ny'] = Math.floor(ro - ra * Math.cos(theta) + YO + 0.5);
    }
    else {
        roArray['nx'] = x;
        roArray['ny'] = y;
        const xn = x - XO;
        const yn = ro - y + YO;
        ra = Math.sqrt(xn * xn + yn * yn);
        if (sn < 0.0) - ra;
        const alat = Math.pow((re * sf / ra), (1.0 / sn));
        alat = 2.0 * Math.atan(alat) - Math.PI * 0.5;
 
        if (Math.abs(xn) <= 0.0) {
            theta = 0.0;
        }
        else {
            if (Math.abs(yn) <= 0.0) {
                theta = Math.PI * 0.5;
                if (xn < 0.0) - theta;
            }
            else theta = Math.atan2(xn, yn);
        }
        const alon = theta / sn + olon;
        roArray['lat'] = alat * RADDEG;
        roArray['lng'] = alon * RADDEG;
    }
    return roArray;
}
// changeCode

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




