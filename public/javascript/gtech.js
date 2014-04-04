$(document).ready(function () {
	var pathName = $(location).attr('pathname');
	if(pathName != undefined && pathName != "/"){
		var selector = "#mainTab a[href=\"#" + pathName.replace('/','') + "\"]";
		$(selector).tab('show');		
	}

	$('#mainTab a').click(function (e) {
	  e.preventDefault();
	  var href = $(this).attr('href').replace('#','');	  
	  window.location.href = href;		  
	})
});


