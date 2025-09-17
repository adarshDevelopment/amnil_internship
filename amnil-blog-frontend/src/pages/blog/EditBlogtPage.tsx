import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import blogService from "../../services/blog.service";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import type{ ISuccessResponse } from "../../services/base.service";

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

interface ITagData {
  _id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

const EditBlogPage = () => {
  const [blog, setBlog] = useState<IBlogData>();
  const [tags, setTags] = useState<ITagData[]>();
  const { slug } = useParams();
  const navigate = useNavigate();
  const {
    register,
    formState: { errors },
    setError,
    handleSubmit,
    reset,
  } = useForm<IBlogData>({
    defaultValues: blog,
  });

  const fetchBlog = async () => {
    try {
      const response = await blogService.getRequest(`/blog/${slug}`);
      setBlog(response.data);
      reset({ ...response.data, tag: response.data.tag._id });
      console.log("response: ", response);
    } catch (exception) {
      toast.error("Error fetching blog");
    }
  };

  const fetchTags = async () => {
    const response = await blogService.getRequest("/tag");
    setTags(response.data);
  };

  const updateBLog = async (data: IBlogData) => {
    try {
      const response = await blogService.putRequest(`/blog/${slug}`, {
        title: data.title,
        subtitle: data.subtitle,
        body: data.body,
        tag: data.tag,
      });
      toast.success("Blog successfully updated");
      navigate(`/blog/${slug}`);
    } catch (exception) {
      toast.error("Error updaing blog");
    }
  };

  useEffect(() => {
    fetchBlog();
    fetchTags();
  }, []);
  return (
    <>
      <div className="flex bg-pink-3 flex-col bg-red-40 w-3xl mx-auto">
        <form
          onSubmit={handleSubmit(updateBLog)}
          className="flex flex-col gap-3 text-gray-600"
        >
          {/* title */}
          <div className="w-full flex flex-col">
            <span>Title</span>
            <div className="flex items-end gap-3">
              <input
                {...register("title")}
                className="border border-gray-500 w-full focus:outline-none py-1 px-2"
                placeholder="TItle"
              />
              <span className="text-sm text-red-600">
                {errors.title?.message}
              </span>
            </div>
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
            <div className="flex items-end gap-3">
              <input
                {...register("subtitle")}
                className="border border-gray-500 w-full focus:outline-none py-1 px-2"
                placeholder="Subtitle"
              />
              <span className="text-sm text-red-600">
                {errors.subtitle?.message}
              </span>
            </div>
          </div>

          <div className="w-full flex flex-col">
            <span>Body</span>
            <div className="flex items-end gap-3">
              <textarea
                {...register("body")}
                className="border border-gray-500 w-[100%] h-200 focus:outline-none py-1 px-2"
              />
              <span className="text-sm text-red-600">
                {errors.body?.message}
              </span>
            </div>
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
export default EditBlogPage;
