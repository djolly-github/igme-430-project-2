const TestComponent = (props) => {
  return (
    <p>App is running properly!</p>
  );
};

const setup = (csrf) => {
  ReactDOM.render(
    <TestComponent />,
    document.querySelector("#client"),
  );
};

$(document).ready(function() {
  getToken(setup);
});