/**
 * View for the Change Password Window
 * @param {*} props React props
 * @returns React component
 */
const ChangePasswordWindow = (props) => {
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
   * Handler for change password back button
   * @param {*} e event object
   * @returns false
   */
  const onBack = (e) => {
    e.preventDefault();
    createMainAppWindow(props.csrf);

    return false;
  }

  return (
    <form
      id="changePasswordForm"
      name="changePasswordForm"
      onSubmit={onChangePassword}
      action="/changePassword"
      method="POST"
    >
      <p>Fill out the information below to change your password</p>

      <div className="control">
        <label htmlFor="resetOldPass">Old Password: </label>
        <input id="resetOldPass" name="resetOldPass" type="password" placeholder="old" />
      </div>

      <div className="control">
        <label htmlFor="resetNewPass">New Password: </label>
        <input id="resetNewPass" name="resetNewPass" type="password" placeholder="new" />
      </div>

      <div className="control">
        <label htmlFor="resetConfirmPass">Confirm Password: </label>
        <input id="resetConfirmPass" name="resetConfirmPass" type="password" placeholder="confirm new" />
      </div>

      <input type="hidden" name="_csrf" value={props.csrf} />

      <div className="control group">
        <button
          onClick={onBack}
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
