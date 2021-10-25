// you can configure loading modules from the lib directory
requirejs.config ({
   "baseUrl": "js",
   
   "paths": {
      "app": "../app",
      "jquery": "lib/jquery-3.5.1.min",
      "locationCodes": "locationCodes",
      "locaInfoByGeo": "locaInfoByGeo",
      "locaInfoByAddrName": "locaInfoByAddrName",
      "getWeather": "getWeather",
      "setWeather": "setWeather",
      "date": "date",
   }
});


//to start the application, load the main module from app folder
requirejs(["js/lib/main"]);

require([ 
     'modules/isJquery', // 함수 반환
     'modules/isJqueryVersion' // jQuery 버전 반환 
  ], 
  // 콜백 함수의 인자값은 배열인자에 설정된 것을 차례대로 받는다. 
  function ( isJquery, isJqueryVersion ) { 
     console.log(isJquery(), isJqueryVersion); 
  });
