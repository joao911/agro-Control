import { useMemo } from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { userStore } from "./store/user";
import { Home } from "./Screens/Sign/Home";
import { Login } from "./Screens/SignOut/Login";
import { DefaultLayout } from "./Screens/DefaultLayout";
import { DefaultLayoutSigInOut } from "./Screens/DefaultLayoutSigInOut";

function Router() {
  const { user } = userStore();

  const userLogged = useMemo(() => {
    return Boolean(user?.token);
  }, [user]);

  interface ProtectedRouteProps {
    user: boolean;
    redirectPath?: string;
  }

  const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
    user,
    redirectPath = "/login",
  }) => {
    if (!user) {
      return <Navigate to={redirectPath} replace />;
    }

    return <Outlet />;
  };

  return (
    <Routes>
      <Route path="/" element={<Navigate to={userLogged ? "/" : "/login"} />} />
      <Route element={<DefaultLayoutSigInOut />}>
        <Route path="/login" element={<Login />} />
      </Route>
      <Route element={<ProtectedRoute user={Boolean(userLogged)} />}>
        <Route element={<DefaultLayout />}>
          <Route path="/" element={<Home />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default Router;
