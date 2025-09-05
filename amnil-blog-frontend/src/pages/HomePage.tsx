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

interface IPaginationData {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
}

const HomePage = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [blogs, setBlogs] = useState<IBlogData[]>();

  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    totalPages: 1,
    totalItems: 0,
  });

  const fetchBlogs = async (pageNumb: number) => {
    try {
      const response = await blogService.getRequest(
        `/blog/?page=${pageNumb}&limit=5`
      );
      setBlogs(response.data);
      setPagination(response.options);
      console.log(response.options);
    } catch (exception) {
      toast.error("Error fetching blogs");
    }
  };

  useEffect(() => {
    console.log("useEffect triggered, page: ", page);
    fetchBlogs(page);
  }, [page]);

  if (blogs) {
    return (
      <>
        <div className="flex flex-col gap-4 ">
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
                  className="flex flex-col p-5 shadow-2xl rounded-2xl  bg-gray-100 w-2xl mx-auto h- justify-between"
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

          {/* Pagination UI */}
          <div className="flex gap-2 mt-4 w-2xl mx-auto justify-center">
            <button
              className="cursor-pointer hover:text-gray-500"
              disabled={page === 1}
              onClick={() => setPage((prev) => prev - 1)}
            >
              Prev
            </button>

            {[...Array(pagination.totalPages)].map((_, i) => (
              <button
                key={i}
                className={page == i + 1 ? "font-bold" : ""}
                onClick={() => setPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}

            <button
              className={` ${
                page == pagination.totalPages
                  ? ""
                  : "hover:text-gray-500 cursor-pointer"
              }`}
              disabled={page === pagination.totalPages}
              onClick={() => {
                setPage((prev) => prev + 1);
              }}
            >
              Next
            </button>
          </div>
        </div>
      </>
    );
  }
};

export default HomePage;
