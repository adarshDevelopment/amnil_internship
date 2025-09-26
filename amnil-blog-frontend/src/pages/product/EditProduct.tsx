import { IoMdAdd } from "react-icons/io";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import type { IProduct } from "./DisplayProduct";
import { set, useForm } from "react-hook-form";
import { toast } from "sonner";
import productService from "../../services/product.service";
import { useEffect, useState } from "react";
import type { ICategory } from "./DisplayProduct";

const EditProduct = () => {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [product, setProduct] = useState<IProduct>();
  const navigate = useNavigate();
  const id = useParams().id;
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    setError,
    reset,
  } = useForm<IProduct>();

  const fetchCategory = async () => {
    try {
      const response = await productService.getRequest("/category");
      setCategories(response.data);
    } catch (exception) {
      toast.error("Error fetching categories");
    }
  };

  const fetchExistingData = async () => {
    try {
      const response = await productService.getRequest(`/product/${id}`);
      const actualProduct = {
        ...response.data,
        category: response.data.category._id,
      };
      setProduct(actualProduct);
      reset(actualProduct);
    } catch (exception) {
      toast.error("Error fetching old data");
    }
  };

  const updateProduct = async (data: IProduct) => {
    try {
      let payload = {};

      if ((data.image as any) instanceof FileList && data.image.length > 0) {
        payload = { image: data.image[0] };
      }

      payload = {
        ...payload,
        title: data.title,
        price: data.price,
        stock: data.stock,
        category: data.category,
        description: data.description,
      };

      const response = await productService.putRequest(
        `/product/${id}`,
        payload,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast.success("Product successfully updated");
      navigate(`/products/${response.data._id}`);
    } catch (exception: any) {
      if (exception.error) {
        Object.keys(exception.error).map((error) => {
          setError(error as keyof IProduct, {
            message: exception.error[error],
          });
        });
      }
    }
  };

  useEffect(() => {
    fetchCategory();
    fetchExistingData();
  }, []);

  return (
    <>
      <div className="bg-red-40 w-4xl mx-auto flex flex-col gap-5 ">
        {/* top buttons */}
        <div className="flex justify-between items-center">
          <div className="text-gray-500 font-bold text-2xl">Edit Product</div>
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
          onSubmit={handleSubmit(updateProduct)}
          className="bg-green-40 w-4xl mx-auto flex flex-col gap-4"
        >
          {product?.image ? (
            <div className="flex flex-col gap-2 h-[200px] text-gray-500 font-semibold">
              <img
                className="h-full object-contain"
                src={product.image}
                alt=""
              />
            </div>
          ) : (
            <></>
          )}

          {/* Image */}
          <div className="flex flex-col gap-2 text-gray-500 font-semibold">
            <span>Image</span>
            <div className="flex flex-col gap-">
              <input
                type="file"
                {...register("image")}
                className="focus:outline-none border-gray-400 border px-2 py-1 rounded-md"
              />
              <span className="text-red-600 text-sm">
                {errors.image?.message}
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
                className="focus:outline-none border-gray-400 border px-2 py-1 rounded-md"
              />
              <span className="text-red-600 text-sm">
                {errors.title?.message}
              </span>
            </div>
          </div>

          {/* Price */}
          <div className="flex flex-col gap-2 text-gray-500 font-semibold">
            <span>Price</span>
            <div className="flex flex-col gap-">
              <input
                type="number"
                {...register("price")}
                className="focus:outline-none border-gray-400 border px-2 py-1 rounded-md"
              />
              <span className="text-red-600 text-sm">
                {errors.price?.message}
              </span>
            </div>
          </div>

          {/*Stock */}
          <div className="flex flex-col gap-2 text-gray-500 font-semibold">
            <span>Stock</span>
            <div className="flex flex-col gap-">
              <input
                type="number"
                {...register("stock")}
                className="focus:outline-none border-gray-400 border px-2 py-1 rounded-md"
              />
              <span className="text-red-600 text-sm">
                {errors.stock?.message}
              </span>
            </div>
          </div>

          {/* Category */}
          <div className="flex flex-col gap-2 text-gray-500 font-semibold">
            <span>Category</span>
            <div className="flex flex-col gap-">
              <select
                {...register("category")}
                className="focus:outline-none border-gray-400 border px-2 py-1 rounded-md"
              >
                {categories?.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.title}
                  </option>
                ))}
              </select>
              <span className="text-red-600 text-sm">
                {errors.category?.message}
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="flex flex-col gap-2 text-gray-500 font-semibold">
            <span>Description</span>
            <div className="flex flex-col gap-">
              <textarea
                {...register("description")}
                className="focus:outline-none border-gray-400 border px-2 py-1 rounded-md h-[100px]"
              />
              <span className="text-red-600 text-sm">
                {errors.description?.message}
              </span>
            </div>
          </div>

          <button
            disabled={isSubmitting}
            type="submit"
            className={` text-white py-1 px-2 font-bold rounded-md ${
              isSubmitting
                ? "bg-gray-400"
                : "hover:bg-blue-600 bg-blue-500 cursor-pointer"
            } `}
          >
            Submit
          </button>
        </form>
      </div>
    </>
  );
};

export default EditProduct;
