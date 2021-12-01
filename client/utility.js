/**
 * Handler for opening notifications
 * @param {*} message The message to display in the notification box
 */
const openNotification = (message) => {
	$("#notificationContainer .message span").text(message);
	$("#notificationContainer").toggleClass('active', true);
}

/**
 * Handler for redirects
 * @param {*} response response object
 */
const redirect = (response) => {
	$("#notificationContainer").toggleClass('active', false);
	window.location = response.redirect;
}

/**
 * Handler for closing notifications
 */
const closeNotification = () => {
  $("#notificationContainer").toggleClass('active', false);
}

/**
 * Makes a single AJAX request via jQuery.ajax
 * @param {*} type The type of request to make (GET, POST, etc.)
 * @param {*} action The action url (/exp, /task, etc.)
 * @param {*} data The request params
 * @param {*} success Callback when successful
 */
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

/**
 * Makes a series of AJAX requests for every type/action/data provided (note: parameter arrays must all be the same length)
 * @param {*} type The array of requests to make (GET, POST, etc.)
 * @param {*} action The array of action urls (/exp, /task, etc.)
 * @param {*} data The array of request params
 * @param {*} success Callback when all requests successful
 */
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

/**
 * Gets CSRF token
 * @param {*} callback callback when token retrieved
 */
const getToken = (callback) => {
  sendAjax('GET', '/getToken', null, (result) => {
    callback(result.csrfToken);
  });
};
