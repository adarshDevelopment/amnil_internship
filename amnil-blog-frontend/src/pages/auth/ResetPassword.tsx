import { useForm } from "react-hook-form";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import authService from "../../services/auth.service";
import { toast, Toaster } from "sonner";
import { useDispatch } from "react-redux";
import { setToken } from "../../redux/auth/authSlice";
import { IoHomeOutline } from "react-icons/io5";
import { useEffect } from "react";

export interface IResetPassword {
  password: string;
  confirmPassword: string;
  email: string;
}
const ResetPassword = () => {
  const { token } = useParams();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    watch,
    reset,
  } = useForm<IResetPassword>({
    mode: "all",
    defaultValues: {
      password: "",
      confirmPassword: "",
      email: "",
    },
  });
  const navigate = useNavigate();

  const submitResetPassword = async (data: IResetPassword) => {
    try {
      const {password} = data;
      const response = await authService.putRequest(`/auth/resetPassword/${token}`, {password});
      toast.success("Password successfully reset");
      navigate('/login');
    } catch (exception: any) {
      if(exception.error){
        Object.keys(exception.error).map(key=>{
          setError(key as keyof IResetPassword, {message: exception.error[key]});
        })
      }{
        toast.error(exception.message);
      }
    }
  };

  const authenticateResetToken = async () => {
    try {
      const response = await authService.getRequest(
        `/auth/authenticateResetToken/${token}`
      );
      reset(response.data);
    } catch (exception) {
      toast.error("Invalid Token.");
      navigate("/login");
    }
  };
  useEffect(() => {
    authenticateResetToken();
  }, []);
  return (
    <>
      <div className="h-screen flex items-center justify-center">
        {" "}
        <div className="w-xl mx-auto text-gray-600 shadow-2xl p-5 flex flex-col rounded-xl border border-gray-200 gap-3">
          <div className="flex items-center justify-between">
            <span className="text-lg font-semibold">Set new Password</span>
            <NavLink to={"/"}>
              {" "}
              <IoHomeOutline className="text-xl cursor-pointer hover:text-gray-700" />
            </NavLink>
          </div>

          <form
            onSubmit={handleSubmit(submitResetPassword)}
            className="flex flex-col gap-3"
          >
            {/* email */}
            <div className="flex flex-col">
              <span>Email</span>
              <input
                disabled
                type="email"
                {...register("email")}
                className="border border-gray-300 focus:outline-none py-1 px-2 bg-indigo-50"
              />
              <div className="text-sm text-red-600">
                {errors.email?.message}
              </div>
            </div>

            <div className="flex flex-col">
              <span>Password</span>
              <input
                type="password"
                {...register("password", { minLength: {value: 8, message:"Password must abe at least 8 characters long"} })}
                className="border border-gray-300 focus:outline-none py-1 px-2"
              />
              <div className="text-sm text-red-600">
                {errors.password?.message}
              </div>
            </div>

            <div className="flex flex-col">
              <span>Confirm Password</span>
              <input
                type="password"
                {...register("confirmPassword", {
                  validate: (value) =>
                    value === watch("password") || "Passwords do not match",
                })}
                className="border border-gray-300 focus:outline-none py-1 px-2"
              />
              <div className="text-sm text-red-600">
                {errors.confirmPassword?.message}
              </div>
            </div>

            <div className="flex gap-2 mx-auto flex-col w-full">
              <button className="bg-blue-400 w-full mx-auto hover:bg-blue-500 cursor-pointer font-semibold text-white px-2 py-1 rounded-md">
                Reset Password
              </button>
            </div>
          </form>
        </div>
      </div>
      <Toaster richColors closeButton position="top-right" />
    </>
  );
};

export default ResetPassword;
