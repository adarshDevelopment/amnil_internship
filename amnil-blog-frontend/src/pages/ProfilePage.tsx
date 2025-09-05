import { NavLink } from "react-router-dom";
import { CiCirclePlus } from "react-icons/ci";
import { FiPlus } from "react-icons/fi";
import type { RootState } from "../redux/store";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import blogService from "../services/blog.service";
import { IoIosAddCircleOutline } from "react-icons/io";

interface IBlogData {
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

const ProfilePage = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [blogs, setBlogs] = useState<IBlogData[]>();

  const fetchProfileBlogs = async () => {
    try {
      const response = await blogService.getRequest("/auth/showProfileBlogs");
      setBlogs(response.data);
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
        <div className="w-2xl mx-auto text-gray-500 font-semibold  text-3xl">
          Your Blogs
        </div>

        <div className="flex flex-col gap-4">
          {user ? (
            <div>
              <NavLink
                to="/blog/create"
                className={
                  "text-gray-600 flex items-center justify-center hover:text-indigo-950 "
                }
              >
                <IoIosAddCircleOutline className="text-4xl" />
                <span>New Blog</span>
              </NavLink>
            </div>
          ) : (
            <></>
          )}

          <div
            // className={`bg-yellow-30 grid grid-cols-1 xl:grid-cols-2 gap-x-10 gap-y-5 `}
            className={`flex flex-col gap-5 `}
          >
            {/* blog posts */}
            {blogs?.map((blog) => {
              return (
                <NavLink
                  key={blog._id}
                  to={`/blog/${blog.slug}`}
                  className="flex flex-col p-5 shadow-2xl rounded-2xl  bg-gray-100 w-2xl mx-auto h-75 justify-between"
                >
                  {/* title and body */}
                  <div>
                    <div className="text-xl text-gray-600 flex justify-between">
                      <div>{blog.title}</div>
                      <span className="text-sm text-gray-500">
                        {blog.tag.title}
                      </span>
                    </div>
                    <div className="text-sm text-gray-500">{blog.subtitle}</div>
                    <div className="text-gray-600">
                      {blog.body.length > 100
                        ? blog.body.slice(0, 400) + "..."
                        : blog.body}
                    </div>
                  </div>
                  {/* author */}
                  <span className="text-sm underline text-gray-600">
                    By John Cena{" "}
                  </span>
                </NavLink>
              );
            })}
          </div>
        </div>
      </>
    );
  }
};

export default ProfilePage;
