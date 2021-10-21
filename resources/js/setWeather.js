// 날씨 가져오기
function getTodayWeather(locationInfo){
	let nx = locationInfo.xy.nx;
	let ny = locationInfo.xy.ny;
	let smallRegion = locationInfo.smallRegion;
	
	getTodayTemp(smallRegion, nx, ny)
		.then((data) => {
			setTodayTemp(data)
		}).catch(error => console.log(error));

	getNowWeather(nx, ny)
		.then(function(data){
			setNowWeather(data)
		}).catch(error => console.log(error));
}


function getWeekWeather(locationInfo){
	let smallRegion = locationInfo.smallRegion;
	let largeRegion = locationInfo.largeRegion;

	getWeekSky(smallRegion, largeRegion)
		.then((data) => {
			setWeekSky(data);
		}).catch(error => console.log(error));

	getWeekTemp(smallRegion)
		.then((data) => {
			setWeekTemp(data)
		}).catch(error => console.log(error));
};
	





function setNowWeather(data){
	let array = data.split(',');
	console.log(array);

	document.getElementById('todayIcon').className = array[0];
	document.getElementById('todayWeather').innerText = array[1];
	document.getElementById('todayTem').innerText = array[2];

}

function setTodayTemp(data){
	let array = data.split(',');
	console.log(array);

	document.getElementById('todayTemMin').innerText = parseInt(array[0]);
	document.getElementById('todayTemMax').innerText = parseInt(array[1]);

}



function setWeekSky(data){
	let array = data.split(',');
	console.log(array);

	document.getElementById('dayIcon2').className = array[0];
	document.getElementById('dayIcon3').className = array[1];
	document.getElementById('dayIcon4').className = array[2];
	document.getElementById('dayIcon5').className = array[3];
	document.getElementById('dayIcon6').className = array[4];
	document.getElementById('dayIcon7').className = array[5];
	document.getElementById('dayIcon8').className = array[6];
	document.getElementById('dayIcon9').className = array[7];
	document.getElementById('dayIcon10').className = array[8];
	document.getElementById('dayIcon11').className = array[9];
	document.getElementById('dayIcon12').className = array[10];
	document.getElementById('dayIcon13').className = array[11];

}




function setWeekTemp(data){
	let array = data.split(',');
	console.log(array);

	document.getElementById('dayMinTem1').innerText = array[0];
	document.getElementById('dayMaxTem1').innerText = array[1];
	document.getElementById('dayMinTem2').innerText = array[2];
	document.getElementById('dayMaxTem2').innerText = array[3];
	document.getElementById('dayMinTem3').innerText = array[4];
	document.getElementById('dayMaxTem3').innerText = array[5];
	document.getElementById('dayMinTem4').innerText = array[6];
	document.getElementById('dayMaxTem4').innerText = array[7];
	document.getElementById('dayMinTem5').innerText = array[8];
	document.getElementById('dayMaxTem5').innerText = array[9];
	document.getElementById('dayMinTem6').innerText = array[10];
	document.getElementById('dayMaxTem6').innerText = array[11];
}