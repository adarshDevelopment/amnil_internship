import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import type { RootState } from "../redux/store";
import { CiLogout } from "react-icons/ci";
import { logout } from "../redux/auth/authSlice";
import { IoHomeOutline } from "react-icons/io5";
import { BsCursor } from "react-icons/bs";

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
        <div className="container mx-auto h-full flex items-center bg-pink-40 justify-between gap-4">
          <NavLink to={"/"} className={({isActive}) => isActive ? 'text-teal-700 underline underline-offset-4 hover:text-teal-700' : 'hover:text-gray-500'}>
            <IoHomeOutline className="text-3xl"/>
          </NavLink>
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <NavLink to={`/user/${user._id}/blogs`} className={({isActive}) => isActive ? 'underline underline-offset-4 font-bold text-teal-600' : ''}>{user.name}</NavLink>
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
      </div>
    </>
  );
};
export default Navbar;
