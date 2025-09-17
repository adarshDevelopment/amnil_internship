import { Navigate, Outlet } from "react-router-dom";
import type { RootState } from "../../redux/store";
import { useSelector } from "react-redux";

const ProtectedRoutes = () => {
  const { user, status } = useSelector((state: RootState) => state.auth);

  if (status === 'loading') {
    return <></>;
  }
  if (!user) {
    return <Navigate to={"/"} />;
  }
  return <Outlet />;
};

export default ProtectedRoutes;
