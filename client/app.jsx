/**
 * Handler for change password form submit
 * @param {*} e event object
 * @returns false
 */
const onChangePassword = (e) => {
  e.preventDefault();

  if ($("#resetNewPass").val() !== $("#resetConfirmPass").val()) {
    openNotification(("Passwords do not match"));
    return false;
  }

  sendAjax('POST', $("#changePasswordForm").attr("action"), $("#changePasswordForm").serialize(), (response) => {
    createMainAppWindow($("input[name=_csrf]").val());
    openNotification("Password changed successfully");
  });

  return false;
};

/**
 * View for the Change Password Window
 * @param {*} props React props
 * @returns React component
 */
const ChangePasswordWindow = (props) => {
  return (
    <form
      id="changePasswordForm"
      name="changePasswordForm"
      onSubmit={onChangePassword}
      action="/changePassword"
      method="POST"
    >
      <p>Fill out the information below to change your password</p>

      <div class="control">
        <label htmlFor="resetOldPass">Old Password: </label>
        <input id="resetOldPass" name="resetOldPass" type="text" placeholder="old" />
      </div>

      <div class="control">
        <label htmlFor="resetNewPass">New Password: </label>
        <input id="resetNewPass" name="resetNewPass" type="text" placeholder="new" />
      </div>

      <div class="control">
        <label htmlFor="resetConfirmPass">Confirm Password: </label>
        <input id="resetConfirmPass" name="resetConfirmPass" type="text" placeholder="confirm new" />
      </div>

      <input type="hidden" name="_csrf" value={props.csrf} />

      <div class="control group">
        <button
          onClick={() => createMainAppWindow(props.csrf)}
        >
          Go Back
        </button>
        <input className="formSubmit" type="submit" value="Change Password" />
      </div>
    </form>
  );
};

/**
 * Creates the change password window component
 * @param {*} csrf Cross Site Request Forgery token
 */
const createChangePassword = (csrf) => {
  ReactDOM.render(
    <ChangePasswordWindow csrf={csrf} />,
    document.querySelector("#client"),
  );
};

/**
 * Handler for toggle premium button click
 * @param {*} csrf Cross Site Request Forgery token
 * @returns false
 */
const onTogglePremium = (csrf) => {
  e.preventDefault();

  sendAjax('POST', '/premium', `_csrf=${csrf}`, (response) => {
    createTogglePremium(csrf);
    openNotification("Premium status toggled successfully");
  });

  return false;
};

/**
 * View for the Toggle Premium Window
 * @param {*} props React props
 * @returns React component
 */
const TogglePremiumWindow = (props) => {
  const premiumStatement = props.isPremium ? 'have' : 'do not have';
  return (
    <div>
      <h2>Premium</h2>
      <p>With premium, you have access to styling note text, labels, checklists, deadlines</p>
      <ul>
        <li>Text styling: no longer will your tasks be just plaintext!</li>
        <li>Labels: categorize your tasks and search for them later!</li>
        <li>Checklists: make your tasks a list of tasks!</li>
        <li>Deadlines: add deadlines to your tasks!</li>
      </ul>
      <p>You currently {premiumStatement} premium</p>
      <p>Toggle Premium?</p>
      <button
        onClick={(e) => onTogglePremium(e, props.csrf)}
      >
        Sure!
      </button>
      <button
        onClick={(e) => createMainAppWindow(props.csrf)}
      >
        Go Back!
      </button>
    </div>
  );
};

/**
 * Creates the toggle premium window component
 * @param {*} csrf Cross Site Request Forgery token
 */
const createTogglePremium = (csrf) => {
  sendAjax('GET', '/premium', `_csrf=${csrf}`, (response) => {
    ReactDOM.render(
      <TogglePremiumWindow
        csrf={csrf}
        isPremium={response.isPremium}
      />,
      document.querySelector("#client"),
    );
  });
};

/**
 * View for the Main App Window
 * @param {*} props React props
 * @returns React component
 */
const MainAppWindow = (props) => {
  return (
    <div>
      <p>
        App is running properly!
      </p>
      <button
        onClick={() => createChangePassword(props.csrf)}
      >
        Change Password
      </button>
      <button
        onClick={() => createTogglePremium(props.csrf)}
      >
        Toggle Premium
      </button>
    </div>
  );
};

/**
 * Creates the main app window component
 * @param {*} csrf Cross Site Request Forgery token
 */
const createMainAppWindow = (csrf) => {
  ReactDOM.render(
    <MainAppWindow csrf={csrf} />,
    document.querySelector("#client"),
  );
};

/**
 * Sets up the app page after token retrieval on document ready
 * @param {*} csrf Cross Site Request Forgery token
 */
const setup = (csrf) => {
  const closeNotifButton = document.querySelector("#notificationContainer button");

  closeNotifButton.addEventListener("click", (e) => {
    e.preventDefault();
    closeNotification();
  });

  createMainAppWindow(csrf);
};

// get token on doc ready and pass setup as callback
$(document).ready(function() {
  getToken(setup);
});