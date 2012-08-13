$(function() {

	//Initialize the modules that will be use
	VISHWS.VALIDATION.init();

	$(".indexTab").click(function(event) {
		$("#loginError").hide();
		$("#registerError").hide();
	});

	$("#sign_in_button").click(function(event) {
		//Validate
  		var name = $(this).parent().parent().find("input[name=login]").val();
		var password = $(this).parent().parent().find("input[name=password]").val();

		if(!VISHWS.VALIDATION.validateSignIn(name,password)){
			event.preventDefault();
			showInformationMessage("error","Please, write valid user and password.","login");
		}
	});

	$("#sign_up_button").click(function(event) {
		//Validate
  		var name = $(this).parent().parent().parent().find("input[name=login]").val();
		var password = $(this).parent().parent().parent().find("input[name=password]").val();
		var cpassword = $(this).parent().parent().parent().find("input[name=password2]").val();

		if(!VISHWS.VALIDATION.validateSignUp(name,password,cpassword)){
			showInformationMessage("error","Please, write valid user and passwords.","register");
			event.preventDefault();
		}
	});

});


var showInformationMessage = function(type,message,form){
	var div;

	if(form=="login"){
		div = $("#loginError");
		$("#registerError").hide();
	} else if(form=="register"){
		div = $("#registerError");
		$("#loginError").hide();
	}

	div.attr("class","alert");

	if(type=="error"){
		div.addClass("alert-error");
	} else if(type=="success"){
		div.addClass("alert-success");
	}

	if(div.children().size()==1){
		div.html("<p class='messageError'>"+message+"</p>");
		div.show();
	} else {
		div.append("<p class='messageError'>"+message+"</p>");
	}
}