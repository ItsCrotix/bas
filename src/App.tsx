import { useCallback, useEffect, useState } from "react";
import "./App.css";
import LoginScreen from "./screens/loginscreen/LoginScreen";
import { exitProgram } from "./utils/windowCommands";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  // checks if the user is already logged in when the app starts this in theory should always be false.
  const checkLoginState = useCallback(async () => {
    try {
      const res = await window.api.invoke("checkLoginState");
      setIsLoggedIn(res.isLoggedIn);
      setLoading(false);
    } catch (error) {
      console.error("Check login state failed", error);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkLoginState();
  }, [checkLoginState, isLoggedIn]);

  useEffect(() => {
    window.api.receive("loginState", (data) => {
      setIsLoggedIn(data.isLoggedIn);
      setLoading(false);
    });

    return () => {
      window.api.removeAllListeners("loginState");
    };
  }, []);

  if (loading) {
    return (
      <div className="LoadingContainer">
        <div className="LoadingSpinner" />
      </div>
    );
  }

  if (isLoggedIn) {
    return (
      <div className="App">
        <header className="App-header">
          <p>Logged In</p>
          <button onClick={exitProgram}>exit</button>
        </header>
      </div>
    );
  }

  return <LoginScreen />;
}

export default App;
