import { useState } from "react";
import "./App.css";

function App() {
  const [message, setMessage] = useState("false");

  const requestMessage = async () => {
    //@ts-ignore
    const res = await window.api.testInvoke();
    setMessage(res);
  };

  return (
    <div className="App">
      <header className="App-header">
        <p>click me</p>
        <button onClick={requestMessage}>{message}</button>
      </header>
    </div>
  );
}

export default App;
