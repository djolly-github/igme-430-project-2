const openNotification = (message) => {
	$("#notificationContainer .message span").text(message);
	$("#notificationContainer").toggleClass('active', true);
}

const redirect = (response) => {
	$("#notificationContainer").toggleClass('active', false);
	window.location = response.redirect;
}

const closeNotification = () => {
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
			openNotification(messageObj.error);
		},
	});
};

// REFERENCE: https://usefulangle.com/post/383/javascript-wait-multiple-ajax-requests-to-finish
const sendMulti = (types, actions, datas, success) => {
  const requests = [];
  for (let i = 0; i < types.length; i++) {
    requests.push(new Promise(function(resolve, reject) {
      let xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
          if (xhr.status == 200) {
            resolve(xhr.responseText);
          } else {
            reject(JSON.parse(xhr.responseText));
          }
        }
      }
      xhr.open(types[i], [actions[i]]);
      xhr.setRequestHeader('Content-type', 'json');
      xhr.send(datas[i]);
    }));
  }

  Promise.all(requests).then(function(responses) {
    let response = {};
    responses.forEach(res => {
      res = JSON.parse(res);
      response = { ...response, ...res };
    });
    
    success(response);
  });
}

const getToken = (callback) => {
  sendAjax('GET', '/getToken', null, (result) => {
    callback(result.csrfToken);
  });
};
