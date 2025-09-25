import { IoMdAdd } from "react-icons/io";
import { NavLink } from "react-router-dom";
import type { IProduct } from "./DisplayProduct";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import productService from "../../services/product.service";
import { useState } from "react";
import type { ICategory } from "./DisplayProduct";

const CreateProduct = () => {
  const [categories, setCategories] = useState<ICategory>({
    title: "",
    _id: "",
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<IProduct>();

  const fetchCategory = async () => {
    try {
      const response = await productService.getRequest("/category");
      setCategories(response.data);
    } catch (exception) {
      toast.error("Error fetching categories");
    }
  };
  return (
    <>
      <div className="bg-red-40 w-6xl mx-auto flex flex-col gap-5 ">
        {/* top buttons */}
        <div className="flex justify-between items-center">
          <div className="text-gray-500 font-bold text-2xl">Add Products</div>
          <NavLink
            to={"/products"}
            className={
              "bg-blue-500 px-2 py-2 text-white font-bold flex justify-center items-center"
            }
          >
            {" "}
            {/* <IoMdAdd /> */}
            Products Page
          </NavLink>
        </div>

        {/* product table */}

        <form
          action=""
          className="bg-green-400 w-4xl mx-auto flex flex-col gap-4"
        >
          {/* title */}
          <div className="flex flex-col gap-2 text-gray-500 font-semibold">
            <span>Title</span>
            <div className="flex flex-col gap-">
              <input
                type="text"
                {...register("title")}
                className="focus:outline-none border-gray-400 border "
              />
              <span className="text-red-600 text-sm">
                {errors.title?.message}
              </span>
            </div>
          </div>

          {/* title */}
          <div className="flex flex-col gap-2 text-gray-500 font-semibold">
            <span>Price</span>
            <div className="flex flex-col gap-">
              <input
                type="number"
                {...register("price")}
                className="focus:outline-none border-gray-400 border "
              />
              <span className="text-red-600 text-sm">
                {errors.price?.message}
              </span>
            </div>
          </div>

          {/* title */}
          <div className="flex flex-col gap-2 text-gray-500 font-semibold">
            <span>Stock</span>
            <div className="flex flex-col gap-">
              <input
                type="number"
                {...register("stock")}
                className="focus:outline-none border-gray-400 border "
              />
              <span className="text-red-600 text-sm">
                {errors.stock?.message}
              </span>
            </div>
          </div>

          {/* title */}
          <div className="flex flex-col gap-2 text-gray-500 font-semibold">
            <span>Title</span>
            <div className="flex flex-col gap-">
              <input
                type="text"
                {...register("title")}
                className="focus:outline-none border-gray-400 border "
              />
              <span className="text-red-600 text-sm">
                {errors.title?.message}
              </span>
            </div>
          </div>

          {/* category */}
          <div className="flex flex-col gap-2 text-gray-500 font-semibold">
            <span>Category</span>
            <div className="flex flex-col gap-">
              <select
                {...register("category")}
                className="focus:outline-none border-gray-400 border "
              >
                <option value=""></option>
              </select>
              <span className="text-red-600 text-sm">
                {errors.category?.message}
              </span>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default CreateProduct;
