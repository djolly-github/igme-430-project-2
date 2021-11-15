const TestComponent = (props) => {
  return (
    <p>App is running properly!</p>
  );
};

const setup = (csrf) => {
  const closeNotifButton = document.querySelector("#notificationContainer button");

  closeNotifButton.addEventListener("click", (e) => {
    e.preventDefault();
    closeNotification();
  });

  ReactDOM.render(
    <TestComponent />,
    document.querySelector("#client"),
  );
};

$(document).ready(function() {
  getToken(setup);
});