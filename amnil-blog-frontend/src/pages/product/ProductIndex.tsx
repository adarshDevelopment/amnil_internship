import { NavLink } from "react-router-dom";
import { toast } from "sonner";
import productService from "../../services/product.service";
import type { IProduct } from "./DisplayProduct";
import { MdDelete } from "react-icons/md";
import { useEffect, useState } from "react";
import { MdEdit } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";
import type { IPaginationData } from "../HomePage";

const ProductIndex = () => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [pagination, setPagination] = useState<IPaginationData>();
  const [page, setPage] = useState<number>(1);

  const fetchProducts = async (pageNumber: number) => {
    try {
      const response = await productService.getRequest(
        `/product?page=${pageNumber}&limit=6`
      );
      setPagination(response.options.pagination);
      setProducts(response.data);
    } catch (exception) {
      toast.error("Error fetching products");
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      const answer = window.confirm(
        "Are you sure you want to delete this product?"
      );
      if (!answer) {
        return;
      }
      const reponse = await productService.deleteRequest(`/product/${id}`);
      fetchProducts(pagination?.page as number);
      toast.success("Product successfully deleted");
    } catch (exception) {
      toast.error("Error deleting post");
    }
  };

  useEffect(() => {
    fetchProducts(page);
  }, [page]);
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

              <tbody className="text-gray-600">
                {products.map((product, index) => (
                  <tr key={product._id}>
                    <td className="text-center">{index + 1}</td>
                    <td className="p-5"><NavLink className={'font-bold hover:text-teal-600'} to={`/products/${product._id}`}>{product.title}</NavLink></td>
                    <td>Rs. {product.price}</td>
                    <td>{product.stock}</td>
                    <td className="py-5  ">
                      {product.image ? (
                        <img
                          className="h-[50px] object-contain"
                          src={product.image}
                          alt=""
                        />
                      ) : (
                        <img
                        className="h-[50px]"
                          src="https://thumbs.dreamstime.com/b/image-not-available-icon-vector-set-white-background-eps-330821927.jpg"
                          alt=""
                        />
                      )}
                    </td>
                    <td className=" justify-center items-end h-full">
                      <div className="flex justify-center items-end gap-3">
                        <button
                          className="cursor-pointer hover:text-red-700"
                          onClick={() => {
                            deleteProduct(product._id);
                          }}
                        >
                          <MdDelete className="text-2xl " />
                        </button>
                        <NavLink to={`/products/edit/${product._id}`} className="cursor-pointer">
                          <MdEdit className="text-2xl text-yellow-600 hover:text-yellow-700" />
                        </NavLink>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}

            <div className="flex justify-center items-center mt-5 gap-4">
              <button
                disabled={pagination?.page === 1}
                onClick={() => {
                  setPage((page) => {
                    return page - 1;
                  });
                }}
                className={
                  pagination?.page === 1
                    ? "font-bold text-gray-400"
                    : "font-bold text-teal-600 cursor-pointer"
                }
              >
                Prev
              </button>
              <span>
                {pagination?.page} of {pagination?.totalPages}
              </span>
              <button
                onClick={() => {
                  setPage((prev) => {
                    return prev + 1;
                  });
                }}
                disabled={pagination?.page === pagination?.totalPages}
                className={
                  pagination?.page === pagination?.totalPages
                    ? "font-bold text-gray-400 "
                    : "font-bold text-teal-600 cursor-pointer"
                }
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }
};

export default ProductIndex;
