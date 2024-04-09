import "./App.css";
import { Routes, Route, Outlet } from "react-router-dom";
import Home from "./pages/Home";
import Room from "./pages/Room";
import NoMatch from "./pages/NoMatch";

function Layout() {
  return (
    <div>
      <Outlet />
    </div>
  );
}

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="room" element={<Room />} />

          {/* Using path="*"" means "match anything", so this route
                acts like a catch-all for URLs that we don't have explicit
                routes for. */}
          <Route path="*" element={<NoMatch />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
