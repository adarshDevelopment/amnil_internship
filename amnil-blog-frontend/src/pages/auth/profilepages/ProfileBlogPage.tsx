import { NavLink, useParams } from "react-router-dom";
import type { IBlogData, IUser } from "../ProfilePage";
import { useSelector } from "react-redux";
import type { RootState } from "../../../redux/store";
import { useEffect, useState } from "react";
import blogService from "../../../services/blog.service";
import { toast } from "sonner";

const ProfileBlogPage = () => {
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

  console.log('blog: ', blogs);
  return (
    <div
      // className={`bg-yellow-30 grid grid-cols-1 xl:grid-cols-2 gap-x-10 gap-y-5 `}
      className={`flex flex-col gap-5 `}
    >
      {/* blog posts */}
      {blogs ? (
        <>
          {" "}
          {blogs?.map((blog: IBlogData) => {
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
        </>
      ) : <>hello</>}
    </div>
  );
};

export default ProfileBlogPage;
