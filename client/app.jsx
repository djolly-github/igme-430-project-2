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
const onTogglePremium = (e, csrf) => {
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
      <div
        className="control group"
      >
        <button
          onClick={(e) => createMainAppWindow(props.csrf)}
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

/**
 * Component for Tasks
 * @param {*} props React props
 * @returns React component
 */
const TaskItem = (props) => {
  const onTaskDelete = (e) => {
    e.preventDefault();

    sendAjax('DELETE', '/task', `_id=${props._id}&_csrf=${props.csrf}`, () => {
      openNotification('Deleted successfully');
      createMainAppWindow(props.csrf);
    });
  };

  const onTaskViewEdit = (e) => {
    e.preventDefault();

    console.log(props);
  };

  return (
    <div
      className="task"
    >
      <p
        className="taskTitle"
      >
        { props.title }
      </p>
      <div
        className="control group"
      >
        <button
          onClick={(e) => onTaskViewEdit(e)}
        >
          <i className="fas fa-eye"></i>
          View/Edit
        </button>
        <button
          onClick={(e) => onTaskDelete(e)}
        >
          <i className="fas fa-trash"></i>
          Delete
        </button>
      </div>
    </div>
  );
};

/**
 * Component container for Tasks
 * @param {*} props React props
 * @returns React component
 */
const TaskList = (props) => {
  if (props.tasks) {
    return (
      <div
        className="taskList"
      >
        {
          props.tasks.map((task) => {
            return (
              <TaskItem
                _id={task._id}
                title={task.title}
                content={task.content}
                csrf={props.csrf}
                key={task._id}
              />
            )
          })
        }
      </div>
    );
  }
  
  return (
    <div>
      <p>No tasks exist yet</p>
    </div>
  );
};

const onTaskCreate = (e) => {
  e.preventDefault();

  if (!$("#taskTitle").val()) {
    openNotification('Title is required for task');
    return false;
  }

  sendAjax('POST', '/task', $('#newTaskForm').serialize(), () => {
    getToken(createMainAppWindow);
    $("#newTaskForm").find('input[type=text]').val('');
    openNotification('Task created successfully');
  });

  return false;
};

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

      <form
        id="newTaskForm"
        name="newTaskForm"
        onSubmit={onTaskCreate}
        action="/task"
        method="POST"
      >
        <div className="control">
          <label htmlFor="taskTitle">Task Title: </label>
          <input id="taskTitle" type="text" name="title" placeholder="title"/>
        </div>

        <div className="control">
          <label htmlFor="taskContent">Task Content: </label>
          <input id="taskContent" type="text" name="content" placeholder="plaintext"/>
        </div>

        <div className="control">
          <input type="hidden" name="_csrf" value={props.csrf}/>
          <input className="formSubmit" type="submit" value="Make Task" />
        </div>
      </form>

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
  ReactDOM.render(
    <MainAppWindow csrf={csrf} />,
    document.querySelector("#client"),
  );

  sendAjax('GET', '/task', `_csrf=${csrf}`, (response) => {
    ReactDOM.render(
      <TaskList
        tasks={response.tasks || []}
        csrf={csrf}
      />,
      document.querySelector("#taskList"),
    );
  });
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