import { GoHome } from "react-icons/go";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { IoSettingsOutline } from "react-icons/io5";
import { FaRegTrashAlt } from "react-icons/fa";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import blogService from "../services/blog.service";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";

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

const BlogPage = () => {
  const navigate = useNavigate();
  const { slug } = useParams();
  const { user } = useSelector((state: RootState) => state.auth);
  const [blog, setBlog] = useState<IBlogData>();

  const fetchBlog = async () => {
    try {
      const response = await blogService.getRequest(`/blog/${slug}`);
      setBlog(response.data);
      console.log("response: ", response.data);
    } catch (exception) {
      toast.error("Error fetching blog");
    }
  };
  console.log("user selector: ", user);

  const deleteBlog = async () => {
    const answer = window.confirm("Are you sure you want to delete this blog?");
    try {
      if (answer) {
        await blogService.deleteRequest(`/blog/${blog?.slug}`);
      }
      navigate("/");
    } catch (exception) {
      toast.error("Error deleting blog");
    }
  };
  useEffect(() => {
    fetchBlog();
  }, []);
  if (blog) {
    return (
      <div className="flex flex-col gap-4">
        <div>
          <NavLink
            to="/"
            className={
              "w-fit text-lg underline text-gray-600 flex items-center hover:text-indigo-950"
            }
          >
            <GoHome />
            <span>Home Page</span>
          </NavLink>
        </div>

        <div className="bg-pink-40 text-gray-600 flex flex-col gap-1">
          {/* title and options */}
          <div className=" flex justify-between items-end">
            <span className="text-lg font-semibold">{blog?.title}</span>
            {user?.id === blog.user._id ? (
              <div className="flex justify-end gap-3">
                <NavLink
                  to={"/blog/edit/:uniqueSlug"}
                  className={
                    "bg-yellow-500 hover:bg-yellow-600 px-2 py-1 rounded-md text-white font-semibold flex items-center gap-1"
                  }
                >
                  <span>
                    <IoSettingsOutline />
                  </span>
                  Edit
                </NavLink>

              <button
                  onClick={deleteBlog}
                  className="flex items-center bg-red-400 hover:bg-red-500 cursor-pointer rounded-md px-2 py-1 text-white font-semibold"
                >
                  <FaRegTrashAlt /> Delete
                </button>
              </div>
            ) : (
              <></>
            )}
          </div>
          {/* tag and author */}
          <div className="flex items-center gap-3">
            <div className="text-sm rounded-lg bg-green-500 w-fit px-2 py-1 font-semibold text-white">
              {blog.tag.title}
            </div>
            <div className="font-semibold underline">{blog?.user.name}</div>
          </div>

          <div className="text-md">{blog?.subtitle}</div>

          <div className="mt-3">{blog?.body}</div>
        </div>
      </div>
    );
  }
};

export default BlogPage;
