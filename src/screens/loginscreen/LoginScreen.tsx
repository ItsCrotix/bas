import { useCallback, useState } from "react";
import { IoClose } from "react-icons/io5";
import logo from "../../images/logo.png";
import { exitProgram } from "../../utils/windowCommands";
import "./LoginScreen.css";

const LoginScreen = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const login = useCallback(async (username: string, password: string) => {
    try {
      const res = await window.api.invoke("login", {
        username: username,
        password: password,
      });

      if (res.isLoggedIn) {
        await window.api.invoke("redirectToMainApp", { res });
      }
    } catch (error) {
      console.error("Login failed", error);
    }
  }, []);

  return (
    <div className="LoginContainer">
      <div className="DragArea" />
      <div className="LoginGradient" />
      <div className="LoginImageContainer">
        <img src={logo} alt="BUUR Logo" />
      </div>
      <div className="LoginFormContainer">
        <form className="LoginForm">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") login(username, password);
            }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") login(username, password);
            }}
          />
          <button type="button" onClick={() => login(username, password)}>
            Login
          </button>
        </form>
      </div>
      <button className="ExitButton" onClick={exitProgram}>
        <IoClose />
      </button>
    </div>
  );
};

export default LoginScreen;
