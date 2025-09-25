import { NavLink } from "react-router-dom";
import { toast } from "sonner";
import productService from "../../services/product.service";
import type { IProduct } from "./DisplayProduct";
import { MdDelete } from "react-icons/md";
import { useEffect, useState } from "react";
import { MdEdit } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";

const ProductIndex = () => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const fetchProducts = async () => {
    try {
      const response = await productService.getRequest("/product");
      setProducts(response.data);
    } catch (exception) {
      toast.error("Error fetching products");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);
  if (products) {
    return (
      <>
        <div className="bg-red-40 w-6xl mx-auto flex flex-col gap-5 ">
          {/* top buttons */}
          <div className="flex justify-between items-center">
            <div className="text-gray-500 font-bold text-2xl">Products</div>
            <NavLink
              to={"/products/create"}
              className={
                "bg-blue-500 px-2 py-2 text-white font-bold flex justify-center items-center"
              }
            >
              {" "}
              <IoMdAdd />
              Add Product
            </NavLink>
          </div>

          {/* product table */}

          <div className="shadow- p-3 border border-gray-300">
            <table className="bg-yellow-20 w-full">
              <thead>
                <tr>
                  <th>SN</th>
                  <th className="text-center">Title</th>
                  <th className="text-start">Price</th>
                  <th className="text-start">Quantity</th>
                  <th className="text-start">Image</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {products.map((product, index) => (
                  <tr key={product._id}>
                    <td className="text-center">{index + 1}</td>
                    <td className="p-5">{product.title}</td>
                    <td>Rs. {product.price}</td>
                    <td>{product.stock}</td>
                    <td className="">
                      {/* <img
                        className="h-[50px] object-contain"
                        src={product.image}
                        alt=""
                      /> */}
                      img
                    </td>
                    <td className=" justify-center items-end h-full">
                      <div className="flex justify-center items-end gap-3">
                        <button>
                          <MdDelete className="text-2xl text-red-600" />
                        </button>
                        <button>
                          <MdEdit className="text-2xl text-yellow-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </>
    );
  }
};

export default ProductIndex;
