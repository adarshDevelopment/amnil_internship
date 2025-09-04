import { useForm } from "react-hook-form";

interface IBlogData {
  title: string;
  subtitle: string;
  body: string;
}
const EditBlogPage = () => {
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
    },
  });

  const submitBlog = (data: IBlogData) => {
    alert("form submitted");
    reset()
  };
  return (
    <>
      <div className="flex bg-pink-3 flex-col">
        <form
          onSubmit={handleSubmit(submitBlog)}
          className="flex flex-col gap-3 text-gray-600"
        >
          {/* title */}
          <div className="w-full flex flex-col">
            <span>Title</span>
            <div className="flex items-end gap-3">
              <input
                {...register("title")}
                className="border border-gray-500 w-[40%] focus:outline-none py-1 px-2"
                placeholder="TItle"
              />
              <span className="text-sm text-red-600">
                {errors.title?.message}
              </span>
            </div>
          </div>

          {/* Subtitle */}
          <div className="w-full flex flex-col">
            <span>Subtitle</span>
            <div className="flex items-end gap-3">
              <input
                {...register("subtitle")}
                className="border border-gray-500 w-[60%] focus:outline-none py-1 px-2"
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
                {...register("subtitle")}
                className="border border-gray-500 w-[100%] h-50 focus:outline-none py-1 px-2"
              />
              <span className="text-sm text-red-600">
                {errors.body?.message}
              </span>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="px-3 py-2 bg-blue-500 text-white rounded-md cursor-pointer hover:bg-blue-600 font-semibold"
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
