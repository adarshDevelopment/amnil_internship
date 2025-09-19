import { Outlet } from "react-router-dom";
import "tailwindcss";
import Navbar from "../components/Navbar";
import { Toaster } from "sonner";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../redux/store";
import { fetchUser } from "../redux/auth/authSlice";

function GuestLayout() {
  const dispatch = useDispatch<AppDispatch>();
  const { user, token, status } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (localStorage.getItem("amnilBlogToken")) {
      dispatch(fetchUser());
    }
  }, [token]);
  if (status === "loading") {
    return <></>;
  }
  return (
    <>
      <div className="min-h-[calc(100vh-4rem)] bg-indigo-50 ">
        {/* nav */}
        <Navbar />
        {/* main body */}
        <div className=" mt-16 bg-green-30 py-4 container mx-auto">
          <Outlet />
        </div>
      </div>
     
    </>
  );
}

export default GuestLayout;
