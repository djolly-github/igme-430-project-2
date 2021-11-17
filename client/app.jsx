const handleChangePassword = (e) => {
  e.preventDefault();

  if ($("#resetNewPass").val() !== $("#resetConfirmPass").val()) {
    handleError(("Passwords do not match"));
    return false;
  }

  sendAjax('POST', $("#changePasswordForm").attr("action"), $("#changePasswordForm").serialize(), (response) => {
    closeNotification();
    renderTestComponent($("input[name=_csrf]").val());
  });

  return false;
};

const ChangePassword = (props) => {
  return (
    <form
      id="changePasswordForm"
      name="changePasswordForm"
      onSubmit={handleChangePassword}
      action="/changePassword"
      method="POST"
    >
      <label htmlFor="resetOldPass">Old Password: </label>
      <input id="resetOldPass" name="resetOldPass" type="text" placeholder="old" />

      <label htmlFor="resetNewPass">New Password: </label>
      <input id="resetNewPass" name="resetNewPass" type="text" placeholder="new" />

      <label htmlFor="resetConfirmPass">Confirm Password: </label>
      <input id="resetConfirmPass" name="resetConfirmPass" type="text" placeholder="confirm new" />

      <input type="hidden" name="_csrf" value={props.csrf} />
      <input className="formSubmit" type="submit" value="Change Password" />
    </form>
  );
};

const renderChangePassword = (csrf) => {
  ReactDOM.render(
    <ChangePassword csrf={csrf} />,
    document.querySelector("#client"),
  );
};

const TestComponent = (props) => {
  return (
    <div>
      <p>
        App is running properly!
      </p>
      <button
        onClick={() => renderChangePassword(props.csrf)}
      >
        Change Password
      </button>
    </div>
  );
};

const renderTestComponent = (csrf) => {
  ReactDOM.render(
    <TestComponent csrf={csrf} />,
    document.querySelector("#client"),
  );
};

const setup = (csrf) => {
  const closeNotifButton = document.querySelector("#notificationContainer button");

  closeNotifButton.addEventListener("click", (e) => {
    e.preventDefault();
    closeNotification();
  });

  renderTestComponent(csrf);
};

$(document).ready(function() {
  getToken(setup);
});