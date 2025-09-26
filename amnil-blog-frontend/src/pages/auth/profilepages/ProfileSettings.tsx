import { useForm } from "react-hook-form";
import { toast } from "sonner";
import authService from "../../../services/auth.service";
import { useSelector } from "react-redux";
import type { RootState } from "../../../redux/store";
import { userType } from "../../../config/constants";
import { useEffect, useState } from "react";
import { data } from "react-router-dom";

interface IUserData {
  _id: string;
  name: string;
  email: string;
  userType: "admin" | "user";
  image: "";
}

const ProfileSettings = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [localUser, setLocalUser] = useState<IUserData>();

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<IUserData>({
    defaultValues: localUser,
  });

  const fetchUserDetail = async () => {
    try {
      const response = await authService.getRequest("/auth/me");

      setLocalUser(response.data); // for state
      reset(response.data); // for rhf
    } catch (exception) {
      toast.error("Error fetching user detail");
    }
  };

  const submitUpdateForm = async (data: IUserData) => {
    try {
      // console.log('data: ', data);

      let payload = {};

      if ((data.image as any) instanceof FileList && data.image.length > 0) {
        // const file = (data.image as unknown as FileList)?.[0];

        payload = { ...data, image: data.image[0] };
      } else {
        payload = { ...data };
      }

      const response = await authService.putRequest(
        "/auth/updateOwnProfile",
        payload,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setLocalUser(response.data);
      reset(response.data);
      toast.success("User Detail succcessfully updated");
    } catch (exception) {
      toast.error("Problem updating user details.");
    }
  };

  // console.log("localuser: ", localUser);
  useEffect(() => {
    fetchUserDetail();
  }, []);

  if (localUser) {
    return (
      <div className="w-2xl mx-auto flex flex-col gap-4">
        {/* picture */}
        <div className="flex justify-center">
          <div className="w-75 h-75 rounded-full">
            <img
              className="w-75 h-75 rounded-full"
              src={`${
                localUser.image ||
                "https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg"
              }`}
              alt=""
            />
          </div>
        </div>
        <form
          onSubmit={handleSubmit(submitUpdateForm)}
          className="flex flex-col gap-5"
        >
          {/* image */}
          <div className="flex flex-col gap-2">
            <label htmlFor="name">Image</label>
            <input
              className="border focus:outline-none w-full border-gray-400 rounded-md px-2 py-1 cursor-pointer"
              type="file"
              {...register("image")}
            />
          </div>

          {/* name */}
          <div className="flex flex-col gap-2">
            <label htmlFor="name">Full Name</label>
            <input
              className="border focus:outline-none w-full border-gray-400 rounded-md px-2 py-1"
              type="text"
              {...register("name")}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="email">Email</label>
            <input
              disabled
              className=" border focus:outline-none w-full border-gray-400 rounded-md px-2 py-1"
              type="text"
              {...register("email")}
            />
          </div>

          {user?.userType === userType.admin ? (
            <div className="flex flex-col gap-2">
              <label htmlFor="userType">Email</label>
              <select
                className="border border-gray-400 rounded-md px-2 py-1"
                disabled
              >
                <option value={userType.admin}>Admin</option>
                <option value={userType.user}>User</option>
              </select>
            </div>
          ) : (
            <></>
          )}
          <div className="flex flex-col gap-2 mt-4">
            <button
              disabled={isSubmitting}
              className={`border focus:outline-none w-full border-gray-400 font-semibold text-white px-2 py-1 rounded-md ${
                isSubmitting
                  ? "bg-gray-400 "
                  : "bg-blue-400  mx-auto hover:bg-blue-500  cursor-pointer"
              } `}
            >
              Update User Detail
            </button>
          </div>

          {}
        </form>
      </div>
    );
  }
};

export default ProfileSettings;
