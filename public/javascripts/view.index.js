$(function() {

	//Initialize the modules that will be use
	VISHWS.VALIDATION.init();

	$(".indexTab").click(function(event) {
		$("#form_alert").hide();
	});

	$("#sign_in_button").click(function(event) {
		//Validate
  		var name = $(this).parent().parent().find("input[name=login]").val();
		var password = $(this).parent().parent().find("input[name=password]").val();

		if(!VISHWS.VALIDATION.validateSignIn(name,password)){
			event.preventDefault();
			showInformationMessage("error","Please, write valid user and password.");
		}
	});

	$("#sign_up_button").click(function(event) {
		//Validate
  		var name = $(this).parent().parent().find("input[name=login]").val();
		var password = $(this).parent().parent().find("input[name=password]").val();
		var cpassword = $(this).parent().parent().find("input[name=password2]").val();

		if(!VISHWS.VALIDATION.validateSignUp(name,password,cpassword)){
			showInformationMessage("error","Please, write valid user and passwords.");
			event.preventDefault();
		}
	});

});


var showInformationMessage = function(type,message){
	$("#form_alert").attr("class","alert");

	if(type=="error"){
		$("#form_alert").addClass("alert-error");
	} else if(type=="success"){
		$("#form_alert").addClass("alert-success");
	}

	if($("#form_alert").length==1){
		$("#form_alert").html("<p>"+message+"</p>");
		$("#form_alert").show();
	} else {
		$(".tab-content").append("<div id='form_alert' class='alert alert-error'><p>"+message+"</p>");
	}
}