import { NavLink } from "react-router-dom";
import { CiCirclePlus } from "react-icons/ci";
import { FiPlus } from "react-icons/fi";
import type { RootState } from "../redux/store";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import blogService from "../services/blog.service";

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

const HomePage = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [blogs, setBlogs] = useState<IBlogData[]>();

  const fetchBlogs = async () => {
    try {
      const response = await blogService.getRequest("/blog");
      setBlogs(response.data);
    } catch (exception) {
      toast.error("Error fetching blogs");
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  if (blogs) {
    return (
      <>
        <div className="flex flex-col gap-4">
          {user ? (
            <div>
              <NavLink
                to="/blog/create"
                className={
                  "w-fit text-lg underline text-gray-600 flex items-center hover:text-indigo-950"
                }
              >
                <FiPlus />
                <span>New Blog</span>
              </NavLink>
            </div>
          ) : (
            <></>
          )}

          <div
            className={`bg-yellow-30 grid grid-cols-1 xl:grid-cols-2 gap-x-10 gap-y-5 `}
          >
            {/* blog posts */}
            {blogs?.map((blog) => {
              return (
                <NavLink
                  key={blog._id}
                  to={`/blog/${blog.slug}`}
                  className="flex flex-col p-5 shadow-2xl rounded-2xl bg-indigo-100"
                >
                  <div className="text-xl text-gray-600 flex justify-between">
                    <div>{blog.title}</div>
                    <span className="text-sm text-gray-500">
                      {blog.tag.title}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500">{blog.subtitle}</div>
                  <div className="text-gray-600">
                    {blog.body.length > 100
                      ? blog.body.slice(0, 200) + "..."
                      : blog.body}
                  </div>
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

export default HomePage;
