import { useEffect, useState } from "react";
import { toast } from "sonner";
import productService from "../../services/product.service";
import { NavLink, useNavigate, useParams } from "react-router-dom";

export interface IShowProduct {
  _id: string;
  title: string;
  price: number;
  stock: number;
  category: {
    title: string;
    _id: string;
  };
  description: string;
  user: {
    name: string;
    email: string;
    image: string;
  };
  image: string;
}

const ProductShow = () => {
  const id = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<IShowProduct>();
  const fetchProdcuts = async () => {
    try {
      console.log("params: ", id);
      const response = await productService.getRequest(`/product/${id.id}`);
      setProduct(response.data);
    } catch (exception) {
      toast.error("Error fetching products");
    }
  };

  const [isLoadingDelete, setIsLoadingDelete] = useState<boolean>(false);
  const deleteProduct = async () => {
    try {
      setIsLoadingDelete(true);
      const answer = window.confirm("Do you want to delete this product?");
      if (!answer) {
        return;
      }
      const response = await productService.deleteRequest(`/product/${id.id}`);
      navigate("/products");
    } catch (exception) {
      toast.error("Error deleting product");
    } finally {
      setIsLoadingDelete(false);
    }
  };
  useEffect(() => {
    fetchProdcuts();
  }, []);
  if (product) {
    return (
      <>
        <div className="w-6xl bg-yellow-00 mx-auto flex flex-col gap-5 text-gray-500">
          {/* top part */}
          <div className="flex justify-between items-center">
            <div className="text-2xl font-bold ">Product Details</div>

            <div className="flex items-center gap-3">
              <NavLink
                to={`/products/edit/${id.id}`}
                className="py-2 px-3 cursor-pointer bg-yellow-600 rounded-lg font-bold text-white hover:bg-yellow-700"
              >
                Edit
              </NavLink>

              <button
                onClick={deleteProduct}
                disabled={isLoadingDelete}
                className={`py-2 px-3 cursor-pointer  font-bold text-white rounded-lg ${
                  isLoadingDelete
                    ? "bg-gray-500"
                    : "hover:bg-red-700 bg-red-600"
                }  `}
              >
                Delete
              </button>
            </div>
          </div>

          <div className="bg-green-00">
            <table className="w-full">
              <tbody>
                <tr className="border border-gray-300 ">
                  <th className="border border-gray-300 px-3 py-4">
                    Product Name
                  </th>
                  <th className="text-teal-600">{product.title}</th>
                </tr>

                <tr className="border border-gray-300">
                  <th className="border border-gray-300 px-3 py-4">Price</th>
                  <th className="text-teal-600">Rs. {product.price}</th>
                </tr>

                <tr className="border border-gray-300">
                  <th className="border border-gray-300 px-3 py-4">Stock</th>
                  <th className="text-teal-600">{product.stock}</th>
                </tr>

                <tr className="border border-gray-300">
                  <th className="border border-gray-300 px-3 py-4">Category</th>
                  <th className="text-teal-600">{product.category.title}</th>
                </tr>

                <tr className="border border-gray-300">
                  <th className="border border-gray-300 px-3 py-4">Image</th>
                  <th className="flex justify-center py-4">
                    <img
                      className="h-[300px] object-contain bg-purple-300"
                      src={
                        product.image
                          ? product.image
                          : "https://thumbs.dreamstime.com/b/image-not-available-icon-vector-set-white-background-eps-330821927.jpg"
                      }
                      alt=""
                    />
                  </th>
                </tr>

                <tr className="border border-gray-300">
                  <th className="border border-gray-300 px-3 py-4">
                    Description
                  </th>
                  <th className="text-teal-600">{product.description}</th>
                </tr>

                <tr className="border border-gray-300">
                  <th className="border border-gray-300 px-3 py-4">
                    Created By
                  </th>
                  <th className="text-teal-600">{product.user.name}</th>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </>
    );
  }
};

export default ProductShow;
