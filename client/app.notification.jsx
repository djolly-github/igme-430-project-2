/**
 * View for the notification popup
 * @param {*} props React props
 * @returns React component
 */
const NotificationPopup = (props) => {
    return (
    <div>
      <button
        className="closeButton"
      >
        <i className="fas fa-times"></i>
      </button>
      <p className="message">
        <span>Error goes here</span>
      </p>
    </div>
  )
}

/**
 * Creates the notification popup component
 */
const createNotificationPopup = () => {
  ReactDOM.render(
    <NotificationPopup
    />,
    document.querySelector("#notificationContainer"),
  );

  const closeNotifButton = document.querySelector("#notificationContainer button");
  closeNotifButton.addEventListener("click", (e) => {
    e.preventDefault();
    closeNotification();
  });
}