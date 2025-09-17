import { useForm } from "react-hook-form";
import { NavLink } from "react-router-dom";
import { IoHomeOutline } from "react-icons/io5";
import { toast } from "sonner";
import { Toaster } from "sonner";
import authService from "../../services/auth.service";

const ForgetPassword = () => {
  const submitForgetPassord = async (data: { email: string }) => {
    try {
      const response = await authService.postRequest('/auth/forgetPassword', data);
      toast.success('Reset password link sent to your email. Please go through it.')
    } catch (exception) {
      toast.error("Error submitting for forget password");
    }
  };

  const { register, handleSubmit, setError, formState:{errors} } = useForm<{ email: string }>();
  return (
    <>
      <div className="h-screen flex items-center justify-center">
        {" "}
        <div className="w-xl mx-auto text-gray-600 shadow-2xl p-5 flex flex-col rounded-xl border border-gray-200 gap-3">
          <div className="flex items-center justify-between">
            <span className="text-lg font-semibold">Forget Password</span>
            <NavLink to={"/"}>
              {" "}
              <IoHomeOutline className="text-xl cursor-pointer hover:text-gray-700" />
            </NavLink>
          </div>

          <form
            onSubmit={handleSubmit(submitForgetPassord)}
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

            <div className="flex gap-2 mx-auto flex-col w-full">
              <button className="bg-blue-400 w-full mx-auto hover:bg-blue-500 cursor-pointer font-semibold text-white px-2 py-1 rounded-md">
                Forget Password
              </button>

              {/* <NavLink
                to={"/login"}
                className="bg-green-500 w-full text-center mx-auto hover:bg-green-600 cursor-pointer font-semibold text-white px-2 py-1 rounded-md"
              >
                Login
              </NavLink> */}
            </div>
          </form>
        </div>
      </div>
      <Toaster richColors closeButton position="top-right" />
    </>
  );
};

export default ForgetPassword;
