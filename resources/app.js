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
      "locationSearch": "https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2",
      "date": "date",
   }
});



require(['locationCodes', 'jquery'],() => {
    require(['locaInfoByGeo', 'locaInfoByAddrName', 'locationSearch', 'getWeather', 'setWeather'], function () {
        require(['getWeather', 'setWeather'], () => {});
    });
});

