/**
 * Component for Task editing
 * @param {*} props React props
 * @returns React component
 */
const TaskEditor = (props) => {
   /**
    * Converts user raw markdown input to sanatized HTML
    * @param {*} content The raw/pre-parsed string
    * @returns string of HTML content
    */
  const getParsedContent = (content) => {
    const parsed = props.isPremium
      ? MarkdownIt.render(content || '__No content entered__')
      : content || '<i>No content entered</i>';
    return purify.sanitize(parsed);
  }

  const [isEditingContent, setEditingContent] = useState(false);
  const [currentEditedContent, setEditedContent] = useState(props.content);
  
  /**
   * Handler for the close button
   * @param {*} e The event object
   * @returns false
   */
  const onClose = (e) => {
    e.preventDefault();
    $('#newTaskForm').toggleClass('active', false);
    new Promise((resolve, reject) => {
      setTimeout(() => ReactDOM.unmountComponentAtNode(document.querySelector('#editor')), 250);
    });

    return false;
  };

  /**
   * Handler for the Create/Update button
   * @param {*} e The event object
   * @returns false
   */
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

  /**
   * Handler for entering/exiting the task content edit box, toggling between preview/editor
   * @param {*} e The event object
   */
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
        props.isPremium
          ?
          <div className="control">
            <label htmlFor="taskDeadline">Deadline: </label>
            <input id="taskDeadline" type="date" name="deadline" defaultValue={props.deadline || null}/>
          </div>
          :
            <input id="taskDeadline" type="date" name="deadline" defaultValue={props.deadline || null} hidden/>
      }

      {
        isEditingContent
          ?
            <div className="control">
              <label htmlFor="taskContent">Task Content: </label>
              <textarea
                id="taskContent"
                name="content"
                placeholder={props.isPremium ? 'Markdown' : 'plaintext'}
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
                onKeyDown={(e) => {
                  if (e.key === 'Enter') onToggleEdit(e);
                }}
                className="contentEditClosed"
                dangerouslySetInnerHTML={{ __html: getParsedContent(currentEditedContent) }}
                style={props.isPremium ? { whiteSpace: 'normal' } : { whiteSpace: 'pre' }}
              >
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
   * Gets formatted timestamp and relative time for a due date
   * @param {*} date The date string in YYYY-MM-DD
   * @returns String with relative due and actual date in parenthesis
   * @example
   * // returns 'Due in 6 days (12/10/2021)' if Date.Now is '2021-12-03'
   * getFormattedDeadline('2021-12-10')
   * @example
   * // returns 'Due 3 days ago (12/1/2021)' if Date.Now is '2021-12-03'
   * getFormattedDeadline('2021-12-01')
   */
  const getFormattedDeadline = (date) => {
    const dateObj = new Date(`${date} 00:00`);
    return `Due ${moment(date).fromNow()} (${dateObj.toLocaleDateString()})`;
  };

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
        deadline={props.deadline}
        isPremium={props.isPremium}
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
      <div
        className="taskTitle"
      >
        <p
          className="taskTitleElement"
        >
          { props.title }
        </p>
        {
          props.isPremium
            ?
              props.deadline
                ?
                  <p
                    className="indicator"
                  >
                    { getFormattedDeadline(props.deadline) }
                  </p>
                :
                  <p
                    className="indicator"
                  >
                    <i>No deadline set</i>
                  </p>
            :
              <div></div>
        }
      </div>
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
      <TaskEditor
        csrf={props.csrf}
        isPremium={props.isPremium}
      />,
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
                  deadline={task.deadline}
                  csrf={props.csrf}
                  exp={props.exp}
                  isPremium={props.isPremium}
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
