/**
 * View for the Main App Window
 * @param {*} props React props
 * @returns React component
 */
 const MainAppWindow = (props) => {
  return (
    <div>
      <div
        className="control group"
      >
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

      <div

      >
        <p>Experience: { props.exp }</p>
      </div>

      <div
        id="taskList"
      >
      </div>
    </div>
  );
};

/**
 * Creates the main app window component
 * @param {*} csrf Cross Site Request Forgery token
 */
const createMainAppWindow = (csrf) => {
  let types = ['GET', 'GET', 'GET'];
  let actions = ['/exp', '/premium', '/task'];
  let params = [`_csrf=${csrf}`, `_csrf=${csrf}`, `_csrf=${csrf}`];
  sendMulti(types, actions, params, (resp) => {
    ReactDOM.render(
      <MainAppWindow
        exp={resp.experience}
        csrf={csrf}
      />,
      document.querySelector("#client"),
    );

    ReactDOM.render(
      <TaskList
        tasks={resp.tasks || []}
        csrf={csrf}
        exp={resp.experience}
        isPremium={resp.isPremium}
      />,
      document.querySelector("#taskList"),
    );
  });
};
