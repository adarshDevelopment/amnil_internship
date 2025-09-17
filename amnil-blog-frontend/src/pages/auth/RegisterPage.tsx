import { useForm } from "react-hook-form";
import { NavLink, useNavigate } from "react-router-dom";
import authService from "../../services/auth.service";
import { IoHomeOutline } from "react-icons/io5";
import { toast, Toaster } from "sonner";
interface IRegisterData {
  name: string;
  email: string;
  password: string;
  isAdmin: boolean;
}
const RegsiterPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<IRegisterData>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      isAdmin: false,
    },
  });

  const navigate = useNavigate();
  const registerForm = async (data: IRegisterData) => {
    // alert("User registered");
    try {
      await authService.postRequest("auth/register", data);
      toast.success('User successfully created. Please log in');
      navigate("/login");
    } catch (exception: any) {
      if (exception.error) {
        Object.keys(exception.error).map((ex) => {
          setError(ex as keyof IRegisterData, { message: exception.error[ex] });
        });
        return;
      }
      toast.error("Something went wrong");
      if (exception.message) {
        // setError("email", { message: exception.message });
      }
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
            onSubmit={handleSubmit(registerForm)}
            className="flex flex-col gap-3"
          >
            {/* name */}
            <div className="flex flex-col">
              <span>Name</span>
              <input
                type="text"
                {...register("name")}
                className="border border-gray-300 focus:outline-none py-1 px-2"
              />
              <div className="text-sm text-red-600">{errors.name?.message}</div>
            </div>

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

            <div className="flex items-center gap-4">
              <span>Is Admin?</span>
              <input
                type="checkbox"
                {...register("isAdmin")}
                className="border border-gray-300 focus:outline-none py-1 px-2"
              />
              <div className="text-sm text-red-600">
                {errors.password?.message}
              </div>
            </div>

            <div className="flex items-center justify-start mx-auto gap-3 w-full flex-col">
              <button className="bg-blue-400 w-full mx-auto hover:bg-blue-500 cursor-pointer font-semibold text-white px-2 py-1 rounded-md">
                Register
              </button>

              <NavLink
                to={"/login"}
                className="bg-green-500 w-full mx-auto hover:bg-green-600 text-center cursor-pointer font-semibold text-white px-2 py-1 rounded-md"
              >
                Already a member
              </NavLink>
            </div>
          </form>
        </div>
      </div>
      <Toaster richColors closeButton position="top-right"/>
    </>
  );
};

export default RegsiterPage;
