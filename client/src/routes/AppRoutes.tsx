import { Route, Routes } from "react-router-dom";
import { ROUTE_HOME, ROUTE_LOGIN } from "../constants";
import Login from "../pages/Login";
import Home from "../pages/Home";
import type { Socket } from "socket.io-client";

const AppRoutes = ({ socket }: { socket: Socket }) => {
  return (
    <Routes>
      <Route path={ROUTE_HOME} element={<Home socket={socket} />} />
      <Route path={ROUTE_LOGIN} element={<Login />} />
    </Routes>
  );
};

export default AppRoutes;
