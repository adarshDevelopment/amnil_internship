import { useForm } from "react-hook-form";
import { NavLink, useNavigate } from "react-router-dom";
import blogService from "../../services/blog.service";
import { toast } from "sonner";
import { useEffect, useState } from "react";

interface IBlogData {
  title: string;
  subtitle: string;
  body: string;
  tag: string;
}
interface ITagData {
  _id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}
const CreateBlogPage = () => {
  const {
    register,
    formState: { errors },
    setError,
    handleSubmit,
    reset,
  } = useForm<IBlogData>({
    defaultValues: {
      title: "",
      subtitle: "",
      body: "",
      tag: "",
    },
  });
  const [tags, setTags] = useState<ITagData[]>();
  const navigate = useNavigate();

  const submitBlog = async (data: IBlogData) => {
    try {
      const response = await blogService.postRequest("/blog", data);
      toast.success("blog successfully posted");
      console.log('response: ', response);
      const slug = response.data.slug;
      navigate(`/blog/${slug}`)
    } catch (exception) {
      toast.error("error posting blog");
    }
  };
  const fetchTags = async () => {
    const response = await blogService.getRequest("/tag");
    setTags(response.data);
  };
  useEffect(() => {
    fetchTags();
  }, []);
  return (
    <>
      <div className="flex bg-pink-3 flex-col gap-4 w-3xl mx-auto">
        {/* <div>
          <NavLink
            to="/"
            className={
              "w-fit text-lg underline text-gray-600 flex items-center hover:text-indigo-950"
            }
          >
            <GoHome />
            <span>Home Page</span>
          </NavLink>
        </div> */}

        <form
          onSubmit={handleSubmit(submitBlog)}
          className="flex flex-col gap-3 text-gray-600"
        >
          {/* title */}
          <div className="w-full flex flex-col">
            <span>Title</span>
            <input
              required
              {...register("title")}
              className="border border-gray-500 w-full focus:outline-none py-1 px-2"
              placeholder="TItle"
            />
            <span className="text-sm text-red-600">
              {errors.title?.message}
            </span>
          </div>

          {/* Tag */}
          <div className="w-full flex flex-col">
            <span>Tag</span>
            <select
              required
              {...register("tag")}
              className="border border-gray-500  focus:outline-none py-1 px-2"
            >
              <option value={""}>Select a tag</option>
              {tags?.map((tag) => {
                return (
                  <option key={tag._id} value={tag._id}>
                    {tag.title}
                  </option>
                );
              })}
            </select>
            <span className="text-sm text-red-600">{errors.tag?.message}</span>
          </div>

          {/* Subtitle */}
          <div className="w-full flex flex-col">
            <span>Subtitle</span>

            <input
              {...register("subtitle")}
              className="border border-gray-500` focus:outline-none py-1 px-2"
              placeholder="Subtitle"
            />
            <span className="text-sm text-red-600">
              {errors.subtitle?.message}
            </span>
          </div>

          <div className="w-full flex flex-col">
            <span>Body</span>

            <textarea
              {...register("body", { required: "Body is required" })}
              className="border border-gray-500 w-[100%] h-100 focus:outline-none py-1 px-2"
            />
            <span className="text-sm text-red-600">{errors.body?.message}</span>
          </div>

          <div>
            <button
              type="submit"
              className="px-3 py-2 w-full bg-blue-500 text-white rounded-md cursor-pointer hover:bg-blue-600 font-semibold"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </>
  );
};
export default CreateBlogPage;
