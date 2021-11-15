const handleError = (message) => {
  /* TO-DO: remove domo */
	$("#errorMessage").text(message);
	$("#domoMessage").animate({width:'toggle'},350);
}

const redirect = (response) => {
  /* TO-DO: remove domo */
	$("#domoMessage").animate({width:'hide'},350);
	window.location = response.redirect;
}

const sendAjax = (type, action, data, success) => {
	$.ajax({
		cache: false,
		type: type,
		url: action,
		data: data,
		dataType: "json",
		success: success,
		error: function(xhr, status, error) {
			var messageObj = JSON.parse(xhr.responseText);
			handleError(messageObj.error);
		},
	});
};

const getToken = (callback) => {
  sendAjax('GET', '/getToken', null, (result) => {
    callback(result.csrfToken);
  });
};