/**
 * View for the Toggle Premium Window
 * @param {*} props React props
 * @returns React component
 */
const TogglePremiumWindow = (props) => {
  const premiumStatement = props.isPremium ? 'have' : 'do not have';

  /**
   * Handler for toggle premium button click
   * @param {*} csrf Cross Site Request Forgery token
   * @returns false
   */
  const onTogglePremium = (e, csrf) => {
    e.preventDefault();

    sendAjax('POST', '/premium', `_csrf=${csrf}`, (response) => {
      createTogglePremium(csrf);
      openNotification("Premium status toggled successfully");
    });

    return false;
  };

  /**
   * Handler for back button
   * @param {*} e event object
   * @returns false
   */
   const onBack = (e) => {
    e.preventDefault();
    createMainAppWindow(props.csrf);

    return false;
  }

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
      <div
        className="control group"
      >
        <button
          onClick={onBack}
        >
          Go Back!
        </button>
        <button
          onClick={(e) => onTogglePremium(e, props.csrf)}
        >
          Sure!
        </button>
      </div>
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
