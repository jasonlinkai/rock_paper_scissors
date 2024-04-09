import "./App.css";
import { Routes, Route, Outlet, useLocation, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Room from "./pages/Room";
import NoMatch from "./pages/NoMatch";
import useAuth from "./hooks/useAuth";

function Layout() {
  return (
    <Outlet />
  );
}

function RequireAuth({ children }) {
  const auth = useAuth();
  let location = useLocation();

  if (auth) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page.
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
}

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route
            path="room"
            element={
              <RequireAuth>
                <Room />
              </RequireAuth>
            }
          />
          <Route path="*" element={<NoMatch />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
