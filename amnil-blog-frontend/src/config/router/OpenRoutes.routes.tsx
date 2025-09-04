import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store";
import { Navigate, Outlet } from "react-router-dom";

const OpenRoutes = () => {
  const { status, user } = useSelector((state: RootState) => state.auth);
  console.log('status: ', status);
  if (status === "succeeded") {
    return <></>;
  }
  if (status === "idle") {
    return <Outlet />;
  }
  if (user) {
    return <Navigate to={"/"} />;
  }
  if (!user) {
    return <Outlet />;
  }
};

export default OpenRoutes;
