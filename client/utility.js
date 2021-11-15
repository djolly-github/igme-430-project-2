const handleError = (message) => {
	$("#notificationContainer .message span").text(message);
	$("#notificationContainer").toggleClass('active', true);
}

const redirect = (response) => {
	$("#notificationContainer").toggleClass('active', false);
	window.location = response.redirect;
}

const closeNotification = (object) => {
  $("#notificationContainer").toggleClass('active', false);
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