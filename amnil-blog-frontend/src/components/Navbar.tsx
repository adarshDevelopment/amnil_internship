import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import type { RootState } from "../redux/store";
import { CiLogout } from "react-icons/ci";
import { logout } from "../redux/auth/authSlice";

const Navbar = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();

  const logoutUser = () => {
    const answer = window.confirm("Are you sure you want to logout?");
    if (answer) {
      dispatch(logout());
    }
  };

  return (
    <>
      <div className="h-16 bg-blue-40 fixed top-0 w-full bg-indigo-100 ">
        <div className="container mx-auto h-full flex items-center bg-pink-40 justify-end gap-4">
          {user ? (
            <>
              <div>{user.name}</div>
              <div
                className="flex items-center cursor-pointer hover:text-indigo-500"
                onClick={logoutUser}
              >
                <CiLogout />
                <div className="">Logout</div>
              </div>
            </>
          ) : (
            <>
              <NavLink to={"/login"}>login</NavLink>
              <NavLink to={"/register"}>Register</NavLink>
            </>
          )}
        </div>
      </div>
    </>
  );
};
export default Navbar;
