import { useForm } from "react-hook-form";
import { NavLink, useNavigate } from "react-router-dom";
import authService from "../../services/auth.service";
import { toast, Toaster } from "sonner";
import { useDispatch } from "react-redux";
import { setToken } from "../../redux/auth/authSlice";
import { IoHomeOutline } from "react-icons/io5";
interface ILoginData {
  email: string;
  password: string;
}
const LoginPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<ILoginData>({
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const submitLoginForm = async (data: ILoginData) => {
    try {
      const response = await authService.postRequest("auth/login", data);
      // console.log('response: ', response);
      localStorage.setItem("amnilBlogToken", response.data.accessToken);
      dispatch(setToken(response.data.accessToken));
      navigate("/");
      toast.success("User successfully logged in");
      // navigate to home page
    } catch (exception: any) {
      Object.keys(exception.error).map((ex) => {
        setError(ex as keyof ILoginData, { message: exception.error[ex] });
      });
      // toast.error(exception.message);
    }
  };
  return (
    <>
      <div className="h-screen flex items-center justify-center">
        {" "}
        <div className="w-xl mx-auto text-gray-600 shadow-2xl p-5 flex flex-col rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <span className="text-lg font-semibold">Log In</span>
            <NavLink to={"/"}>
              {" "}
              <IoHomeOutline className="text-xl cursor-pointer hover:text-gray-700" />
            </NavLink>
          </div>

          <form
            onSubmit={handleSubmit(submitLoginForm)}
            className="flex flex-col gap-3"
          >
            {/* email */}
            <div className="flex flex-col">
              <span>Email</span>
              <input
                type="email"
                {...register("email")}
                className="border border-gray-300 focus:outline-none py-1 px-2"
              />
              <div className="text-sm text-red-600">
                {errors.email?.message}
              </div>
            </div>

            <div className="flex flex-col">
              <span>Password</span>
              <input
                type="password"
                {...register("password")}
                className="border border-gray-300 focus:outline-none py-1 px-2"
              />
              <div className="text-sm text-red-600">
                {errors.password?.message}
              </div>
            </div>

            <div className="flex flex-col">
              <NavLink to={"/forget-password"} className="text-blue-600 italic text-sm">Forget Password?</NavLink>
            </div>

            <div className="flex gap-2 mx-auto flex-col w-full">
              <button className="bg-blue-400 w-full mx-auto hover:bg-blue-500 cursor-pointer font-semibold text-white px-2 py-1 rounded-md">
                Log in
              </button>

              <NavLink
                to={"/register"}
                className="bg-green-500 w-full text-center mx-auto hover:bg-green-600 cursor-pointer font-semibold text-white px-2 py-1 rounded-md"
              >
                Register new User
              </NavLink>
            </div>
          </form>
        </div>
      </div>
      <Toaster richColors closeButton position="top-right" />
    </>
  );
};

export default LoginPage;
