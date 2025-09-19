import { NavLink, Outlet, useParams } from "react-router-dom";
import type { RootState } from "../../redux/store";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import blogService from "../../services/blog.service";
import { IoIosAddCircleOutline } from "react-icons/io";
import { UserStatus, userType } from "../../config/constants";

export interface IBlogData {
  _id: string;
  title: string;
  subtitle: string;
  body: string;
  slug: string;
  user: {
    _id: string;
    name: string;
    email: string;
  };
  tag: {
    _id: string;
    title: string;
  };
}

export interface IUser {
  id: string;
  name: string;
  email: string;
  userType: typeof userType;
}

const ProfilePage = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [blogs, setBlogs] = useState<IBlogData[]>();
  const { userId } = useParams();
  const [localUser, setLocalUser] = useState<IUser>();

  const fetchProfileBlogs = async () => {
    try {
      const response = await blogService.getRequest(`/auth/${userId}/blogs`);
      // const userResponse = await authService.getRequest('/auth/')
      setBlogs(response.data);
      setLocalUser(response.options.user);
    } catch (exception) {
      toast.error("Error fetching blogs");
    }
  };

  useEffect(() => {
    fetchProfileBlogs();
  }, []);

  if (blogs) {
    return (
      <>
        <div className="flex flex-col gap-5">
          <div className="w-2xl mx-auto text-gray-500 font-semibold  text-3xl">
            {/* Your Blogs */}
          </div>

          <div className="flex items-center w-2xl mx-auto justify-evenly gap-5">
            <NavLink to={`/user/${userId}/blogs`} className={({isActive})=> isActive ? 'text-teal-700 underline underline-offset-4 hover:text-teal-700 font-bold' : ''}>Blogs</NavLink>
            <div className="flex flex-col gap-4">
              {user && user.status === UserStatus.active? (
                <div>
                  <NavLink
                    to="/blog/create"
                    className={
                      "text-gray-600 flex items-center justify-center hover:text-indigo-950 "
                    }
                  >
                    <IoIosAddCircleOutline className="text-4xl" />
                    <span></span>
                  </NavLink>
                </div>
              ) : (
                <></>
              )}
            </div>

            {user && user.status === UserStatus.active ? <NavLink to={`/user/${userId}/settings`} className={({isActive})=> isActive ? 'text-teal-700 underline underline-offset-4 hover:text-teal-700 font-bold' : ''}>Settings</NavLink> : <></>}

            {user && user.status === UserStatus.active && user.userType === userType.admin ? (
              <>
                <NavLink to={`/user/${userId}/tag`} className={({isActive})=> isActive ? 'text-teal-700 underline underline-offset-4 hover:text-teal-700 font-bold' : ''}>Tags</NavLink>
              </>
            ) : (
              <></>
            )}
          </div>

          {/* main outlet part */}
          <Outlet />
        </div>
      </>
    );
  }
};

export default ProfilePage;
