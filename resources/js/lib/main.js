define(["jquery", "jquery.load_js1", "jquery.load_js2"], function($) {
   
  //loading the jquery.load_js1.js and jquery.load_js2.js plugins 
  $(function() {
     $('body').load_js1().load_js2();
  });
});