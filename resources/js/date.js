function getDate(num){
	
	const today = new Date();
	today.setDate(today.getDate() + num);
	let month = ("0" + (1 + today.getMonth())).slice(-2);
	let day = ("0" + today.getDate()).slice(-2);

	const date = `${month}/${day}`;
	return date;
}

const setWeekDate = (() => {
	for(let i = 1; i < 7; i++){
		let dayDate = document.getElementById(`dayDate${i}`);
		let weekDate = getDate(i);
		dayDate.innerText = weekDate;
	}
})()

const setTodayDate = (() => {
	
	let todayDate = document.getElementById("todayDate");
	let today = getDate(0).split('/');
	todayDate.innerText = `${today[0]}월 ${today[1]}일`;   
})()


