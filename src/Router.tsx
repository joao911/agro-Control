import { Routes, Route } from "react-router-dom";
import { DefaultLayout } from "./Screens/DefaultLayout";
import { Home } from "./Screens/Home";

function Router() {
  return (
    <Routes>
      <Route element={<DefaultLayout />}>
        <Route path="/" element={<Home />} />
      </Route>
    </Routes>
  );
}

export default Router;
