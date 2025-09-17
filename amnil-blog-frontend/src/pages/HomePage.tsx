import { NavLink } from "react-router-dom";
import type { RootState } from "../redux/store";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import blogService from "../services/blog.service";
import { IoIosAddCircleOutline } from "react-icons/io";
import { CiSearch } from "react-icons/ci";
import { useForm } from "react-hook-form";

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
  page?: number;
  limit?: number;
  totalCount: number;
  totalPages: number;
}

const HomePage = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [blogs, setBlogs] = useState<IBlogData[]>();

  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<IPaginationData>({
    totalPages: 1,
    totalCount: 0,
  });
  const [searchText, setSearchText] = useState<string>('');

  const fetchBlogs = async (pageNumb: number) => {
    try {
      const response = await blogService.getRequest(
        `/blog/?page=${pageNumb}&limit=5&search=${searchText && searchText}`
      );
      setBlogs(response.data);
      setPage(response.options.pagination.page);
      setPagination(response.options.pagination);
      // console.log(response);

    } catch (exception) {
      toast.error("Error fetching blogs");
    }
  };

  const { register, handleSubmit } = useForm<{ searchText: string }>();

  const submitSearch = async (data: { searchText: string }) => {
    try {
      if (!data.searchText) {
        await fetchBlogs(1);
      }
      fetchBlogs(1)
    } catch (exception) {}
  };
  useEffect(() => {
    // console.log("useEffect triggered, page: ", page);
    fetchBlogs(page);
  }, [page]);

  if (blogs) {
    return (
      <>
        <div className="flex flex-col gap-4 ">
          {/* new blog */}
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

          {/* search section */}
          <div className="flex relative w-fit mx-auto">
            <form onSubmit={handleSubmit(submitSearch)}>
              <input
                type="text"
              onChange={(e)=>{setSearchText(e.target.value)}}
                className="border border-gray-400 w-2xl px-4 py-2 rounded-2xl focus:outline-none"
              />
              <button type="submit" className="cursor-pointer hover:text-indigo-700">
                <CiSearch className="top-[30%] absolute right-5 text-xl" />
              </button>
            </form>
          </div>

          {/* main blogs part */}
          <div
            // className={`bg-yellow-30 grid grid-cols-1 xl:grid-cols-2 gap-x-10 gap-y-5 `}
            className={`flex flex-col gap-5 w-2xl mx-auto `}
          >
            {/* blog posts */}
            {blogs?.map((blog) => {
              return (
                <NavLink
                  key={blog._id}
                  to={`/blog/${blog.slug}`}
                  className="flex flex-col p-5 shadow-2xl rounded-2xl  bg-gray-100 w-full mx-auto h- justify-between"
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
              className={`${
                page === 1 ? "" : "cursor-pointer hover:text-indigo-500"
              }`}
              disabled={page === 1}
              onClick={() =>
                setPage((prev) => {
                  return prev - 1;
                })
              }
            >
              Prev
            </button>

            <span>{page}</span>
            <span>out of {pagination.totalPages}</span>

            <button
              className={` ${
                page == pagination.totalPages
                  ? ""
                  : "hover:text-indigo-500 cursor-pointer"
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
