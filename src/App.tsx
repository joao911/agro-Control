import "./App.css";
import Router from "./Router";
import { BrowserRouter } from "react-router-dom";
import { useIdleTimer } from "react-idle-timer";
import { useCallback } from "react";
import { isEmpty } from "@mui/material";
import { userStore } from "./store/user";

function App() {
  const { user, clearUser } = userStore();
  const handleOnIdle = useCallback(() => {
    if (!isEmpty(user?.access_token)) {
      console.log("Usuário inativo por 30 minutos.");
      clearUser();
    }
  }, [user?.access_token]);

  useIdleTimer({
    timeout: 1000 * 60 * 5,
    onIdle: handleOnIdle,
    debounce: 500,
    events: ["mousemove", "keydown", "mousedown", "touchstart"],
  });
  return (
    <>
      <BrowserRouter>
        <Router />
      </BrowserRouter>
    </>
  );
}

export default App;
