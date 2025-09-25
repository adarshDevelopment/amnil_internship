import { useEffect, useState } from "react";
import { toast } from "sonner";
import productService from "../../services/product.service";
import type { IPaginationData } from "../HomePage";
export interface IProduct {
  _id: string;
  title: string;
  price: number;
  stock: number;
  category: string;
  description: string;
  user: string;
  image: string;
}

export interface ICategory {
  title: string;
  _id: string;
}

const DisplayProduct = () => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [minRange, setMinRange] = useState<number>(0);
  const [maxRange, setMaxRange] = useState<number>(5000000);
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [searchCategory, setSearchCategory] = useState<string>("");
  const [page, setPage] = useState<number>(1);

  const [pagination, setPagination] = useState<IPaginationData>();

  const fetchProducts = async (pageNumber: number = 1) => {
    try {
      console.log("inside fetchProducts");
      const response = await productService.getRequest(
        `/product?search=${searchKeyword}&category=${searchCategory}&minPrice=${minRange}&maxPrice=${maxRange}&page=${pageNumber}&limit=6`
      );
      setProducts(response.data);
      setPagination(response.options.pagination);
    } catch (exception) {
      console.log("exception from List products page: ", exception);
      toast.error("Error fetching products");
    }
  };

  const fetchStatingItems = async () => {
    try {
      const categoryResponse = await productService.getRequest("/category");
      setCategories(categoryResponse.data);
    } catch (exception) {
      toast.error("Error fetching starting items");
    }
  };

  useEffect(() => {
    fetchStatingItems();
  }, []);
  console.log("page: ", page);
  useEffect(() => {
    fetchProducts(page);
  }, [minRange, maxRange, searchCategory, searchKeyword, page]);
  return (
    <>
      <div className="bg-red-40 w-full mx-auto grid grid-cols-8 ">
        {/* search filter */}
        <aside className="bg-yellow-30 col-span-2 p-5 flex h-full ">
          <div className="bg-pink-30 w-full h-full flex flex-col gap-5">
            {/* search bar */}
            <div>
              <input
                onChange={(e) => setSearchKeyword(e.target.value)}
                value={searchKeyword}
                className="border border-gray-400 w-full px-2 py-1 focus:outline-none rounded-sm"
                type="text"
                placeholder="Search products..."
              />
            </div>

            {/* category select */}
            <div>
              <select
                onChange={(e) => setSearchCategory(e.target.value)}
                name="categorySearch"
                id=""
                className="border w-full py-1 px-2 border-gray-400 rounded-sm focus:outline-none"
              >
                <option value="">All</option>
                {categories?.map((cat) => {
                  return (
                    <option key={cat._id} value={cat._id}>
                      {cat.title}
                    </option>
                  );
                })}
              </select>
            </div>

            {/* Min slider */}
            <div className="flex flex-col">
              <span>Min Range {minRange}</span>
              {/* <input min={0} max={100000} type="range" value={minRange} onChange={(e)=>setMinRange(+e.target.value)} className="w-full active:bg-red-300" /> */}
              <input
                type="number"
                value={minRange}
                onChange={(e) => setMinRange(+e.target.value)}
                className="border border-gray-400 w-full px-2 py-1 focus:outline-none rounded-sm"
              />
            </div>

            {/* Max slider */}
            <div className="flex flex-col">
              <span>Min Range: Rs. {maxRange}</span>
              <input
                type="number"
                value={maxRange}
                onChange={(e) => setMaxRange(+e.target.value)}
                className="border border-gray-400 w-full px-2 py-1 focus:outline-none rounded-sm"
              />
              {/* <input
              min={0}
              max={100000}
              type="range"
              value={maxRange}
              onChange={(e) => setMaxRange(+e.target.value)}
              className="w-full active:bg-red-300"
            /> */}
            </div>

            {/* Pagination */}
            <div className="flex items-center gap-3 justify-center">
              <button
                onClick={() => {
                  setPage((prev) => {
                    return prev - 1;
                  });
                }}
                disabled={page === 1}
                className={`${
                  page === 1
                    ? "text-gray-400"
                    : "text-teal-600 font-bold cursor-pointer"
                }`}
              >
                Prev
              </button>
              <span>1 of</span>
              <span>{pagination?.totalPages}</span>
              <button
                className={`${
                  pagination?.totalPages === page
                    ? "text-gray-400"
                    : "text-teal-600 font-bold cursor-pointer"
                }`}
                disabled={pagination?.totalPages === page}
                onClick={() => {
                  setPage((prev) => prev + 1);
                }}
              >
                Next
              </button>
            </div>
          </div>
        </aside>

        {/* main div */}
        <main className="col-span-6 flex flex-col gap-5">
          <div className="bg-purple-40 col-span-6 grid grid-cols-3 gap-8 p-5">
            {products.map((product) => {
              return (
                <div
                  key={product._id}
                  className="flex flex-col gap-3 shadow-2xl border-gray-300 border p-3 rounded-xl"
                >
                  <img
                    className="h-[300px] object-contain"
                    src={
                      product.image
                        ? product.image
                        : "https://thumbs.dreamstime.com/b/image-not-available-icon-vector-set-white-background-eps-330821927.jpg"
                    }
                    alt=""
                  />
                  <div className="px-4">
                    <div className="text-teal-600">{product.title}</div>
                    <div className="flex items-center justify-between text-gray-500">
                      <div>Rs {product.price}</div>
                      <div>Stock: {product.stock}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      </div>
    </>
  );
};

export default DisplayProduct;
