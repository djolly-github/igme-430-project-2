const { useState } = React;

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
 * Component for Task editing
 * @param {*} props React props
 * @returns React component
 */
const TaskEditor = (props) => {
  const [isEditingContent, setEditingContent] = useState(false);
  const [currentEditedContent, setEditedContent] = useState(props.content);
  
  const onClose = (e) => {
    e.preventDefault();
    $('#newTaskForm').toggleClass('active', false);
    new Promise((resolve, reject) => {
      setTimeout(() => ReactDOM.unmountComponentAtNode(document.querySelector('#editor')), 250);
    });

    return false;
  };

  const onTaskCreate = (e) => {
    e.preventDefault();
  
    if (!$("#taskTitle").val()) {
      openNotification('Title is required for task');
      return false;
    }
  
    sendAjax('POST', '/task', $('#newTaskForm').serialize(), () => {
      getToken(createMainAppWindow);
      onClose(e);
      openNotification(props._id ? 'Task updated successfully' : 'Task created successfully');
    });
  
    return false;
  };

  const onToggleEdit = (e) => {
    e.preventDefault();
    setEditingContent(!isEditingContent);
    if (e.target.type === 'textarea') {
      setEditedContent(e.target.value);
    }
  }

  return (
    <form
      id="newTaskForm"
      name="newTaskForm"
      onSubmit={onTaskCreate}
      action="/task"
      method="POST"
    >
      <button
        className="closeButton"
        onClick={(e) => onClose(e)}
      >
        <i className="fas fa-times"></i>
      </button>

      <div className="control">
        <label htmlFor="taskTitle">Task Title: </label>
        <input id="taskTitle" type="text" name="title" placeholder="title" defaultValue={props.title || ''}/>
      </div>

      <div className="control">
        <label htmlFor="taskValue">Experience Value: </label>
        <input id="taskValue" type="number" min="0" name="value" placeholder="0+" defaultValue={props.value || 0}/>
      </div>

      {
        isEditingContent
          ?
            <div className="control">
              <label htmlFor="taskContent">Task Content: </label>
              <textarea
                id="taskContent"
                name="content"
                placeholder="plaintext"
                defaultValue={currentEditedContent || ''}
                onBlur={onToggleEdit}
                autoFocus
              />
            </div>
          :
            <div className="control">
              <p>Task Content: </p>
              <div
                onClick={onToggleEdit}
                className="contentEditClosed"
              >
                {
                  currentEditedContent
                    ? <p>{currentEditedContent}</p>
                    : <i>No content entered</i>
                }
              </div>
              <input type="hidden" name="content" value={currentEditedContent}/>
            </div>
      }

      

      <div className="control">
        <input type="hidden" name="_csrf" value={props.csrf}/>
        {
          props._id ? <input type="hidden" name="_id" value={props._id}/> : null
        }
        <input className="formSubmit" type="submit" value={props._id ? 'Update' : 'Create'} />
      </div>
    </form>
  );
}

/**
 * Component for Tasks
 * @param {*} props React props
 * @returns React component
 */
const TaskItem = (props) => {
  /**
   * Handler for the Delete button
   * @param {*} e event caller object
   * @returns false
   */
  const onTaskDelete = (e, msg = 'Deleted successfully') => {
    e.preventDefault();

    sendAjax('DELETE', '/task', `_id=${props._id}&_csrf=${props.csrf}`, () => {
      openNotification(msg);
      createMainAppWindow(props.csrf);
    });

    return false;
  };

  /**
   * Handler for the Complete button
   * @param {*} e event caller object
   * @returns false
   */
  const onTaskComplete = (e) => {
    e.preventDefault();

    sendAjax('POST', '/exp', `experience=${props.exp + (props.value || 0)}&_csrf=${props.csrf}`, () => {
      onTaskDelete(e, 'Completed successfully');
    });
    
    return false;
  };

  /**
   * Handler for the View/Edit button
   * @param {*} e event caller object
   * @returns false
   */
  const onTaskViewEdit = (e) => {
    e.preventDefault();

    ReactDOM.render(
      <TaskEditor
        csrf={props.csrf}
        title={props.title}
        content={props.content}
        value={props.value}
        _id={props._id}
      />,
      document.querySelector("#editor"),
    );

    closeNotification();
    new Promise((resolve, reject) => {
      setTimeout(() => $('#newTaskForm').toggleClass('active', true), 50);
    });

    return false;
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
          onClick={(e) => onTaskComplete(e)}
        >
          <i className="fas fa-check-circle"></i>
          Complete
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
  /**
   * Handler for the New Task button
   * @param {*} e event caller object
   * @returns false
   */
  const onNewTask = (e) => {
    e.preventDefault();

    ReactDOM.render(
      <TaskEditor csrf={props.csrf} />,
      document.querySelector("#editor"),
    );

    closeNotification();
    new Promise((resolve, reject) => {
      setTimeout(() => $('#newTaskForm').toggleClass('active', true), 50);
    });

    return false;
  };

  if (props.tasks) {
    return (
      <div>
        <div
          className="control group"
        >
          <button
            onClick={(e) => onNewTask(e)}
          >
            New Task
          </button>
        </div>
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
                  value={task.value}
                  csrf={props.csrf}
                  exp={props.exp}
                  key={task._id}
                />
              )
            })
          }
        </div>
      </div>
    );
  }
  
  return (
    <div>
      <p>No tasks exist yet</p>
    </div>
  );
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
  sendAjax('GET', '/exp', `_csrf=${csrf}`, (mainResp) => {
    ReactDOM.render(
      <MainAppWindow
        exp={mainResp.experience}
        csrf={csrf}
      />,
      document.querySelector("#client"),
    );
  
    sendAjax('GET', '/task', `_csrf=${csrf}`, (listResp) => {
      ReactDOM.render(
        <TaskList
          tasks={listResp.tasks || []}
          csrf={csrf}
          exp={mainResp.experience}
        />,
        document.querySelector("#taskList"),
      );
    });
  })
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