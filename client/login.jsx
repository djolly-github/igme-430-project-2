/**
 * View for the Login Window
 * @param {*} props React props
 * @returns React component
 */
const LoginWindow = (props) => {
  /**
   * Handler for login form submit
   * @param {*} e event object
   * @returns false (to exit early)
   */
  const handleLogin = (e) => {
    e.preventDefault();

    $("#notificationContainer").toggleClass('active', false);

    if ($("#user").val() == '' || $("#pass").val() == '') {
      openNotification("Username or password is empty");
      return false;
    }

    console.log($("input[name=_csrf").val());

    sendAjax('POST', $("#loginForm").attr("action"), $("#loginForm").serialize(), redirect);

    return false;
  };

  return (
    <form
      id="loginForm"
      name="loginForm"
      onSubmit={handleLogin}
      action="/login"
      method="POST"
      className="mainForm"
    >
      <div className="control">
        <label htmlFor="username">Username: </label>
        <input id="user" type="text" name="username" placeholder="username"/>
      </div>

      <div className="control">
        <label htmlFor="pass">Password: </label>
        <input id="pass" type="password" name="pass" placeholder="password"/>
      </div>

      <div className="control">
        <input type="hidden" name="_csrf" value={props.csrf}/>
        <input className="formSubmit" type="submit" value="Sign In" />
      </div>
    </form>
  );
};

/**
 * View for the Signup Window
 * @param {*} props React props
 * @returns React component
 */
const SignupWindow = (props) => {
  /**
   * Handler for signup form submit
   * @param {*} e event object
   * @returns false (to exit early)
   */
  const onSignup = (e) => {
    e.preventDefault();

    $("#notificationContainer").toggleClass('active', false);

    if ($("#user").val() == '' || $("#pass").val() == '' || $("#pass2").val() == '') {
      openNotification("All fields are required");
      return false;
    }

    if ($("#pass").val() !== $("#pass2").val()) {
      openNotification(("Passwords do not match"));
      return false;
    }

    sendAjax('POST', $("#signupForm").attr("action"), $("#signupForm").serialize(), redirect);

    return false;
  };

  return (
    <form
      id="signupForm"
      name="signupForm"
      onSubmit={onSignup}
      action="/signup"
      method="POST"
      className="mainForm"
    >
      <div className="control">
        <label htmlFor="username">Username: </label>
        <input id="user" type="text" name="username" placeholder="username"/>
      </div>

      <div className="control">
        <label htmlFor="pass">Password: </label>
        <input id="pass" type="password" name="pass" placeholder="password"/>
      </div>

      <div className="control">
        <label htmlFor="pass2">Password: </label>
        <input id="pass2" type="password" name="pass2" placeholder="retype password"/>
      </div>

      <div className="control">
        <input type="hidden" name="_csrf" value={props.csrf}/>
        <input className="formSubmit" type="submit" value="Sign Up" />
      </div>
    </form>
  );
};

/**
 * Creates the login window component
 * @param {*} csrf Cross Site Request Forgery token
 */
const createLoginWindow = (csrf) => {
  ReactDOM.render(
    <LoginWindow csrf={csrf} />,
    document.querySelector("#content")
  );
};

/**
 * Creates the signup window component
 * @param {*} csrf Cross Site Request Forgery token
 */
const createSignupWindow = (csrf) => {
  ReactDOM.render(
    <SignupWindow csrf={csrf} />,
    document.querySelector("#content")
  );
};

/**
 * Sets up the login page after token retrieval on document ready
 * @param {*} csrf Cross Site Request Forgery token
 */
const setup = (csrf) => {
  const loginButton = document.querySelector("#loginButton");
  const signupButton = document.querySelector("#signupButton");

  signupButton.addEventListener("click", (e) => {
    e.preventDefault();
    createSignupWindow(csrf);
    return false;
  });

  loginButton.addEventListener("click", (e) => {
    e.preventDefault();
    createLoginWindow(csrf);
    return false;
  });

  createNotificationPopup();
  createLoginWindow(csrf);
};

// get token on doc ready and pass setup as callback
$(document).ready(function() {
  getToken(setup);
});