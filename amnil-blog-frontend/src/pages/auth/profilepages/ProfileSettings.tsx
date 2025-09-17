import { useForm } from "react-hook-form";
import { toast } from "sonner";
import authService from "../../../services/auth.service";
import { useSelector } from "react-redux";
import type { RootState } from "../../../redux/store";
import { userType } from "../../../config/constants";
import { useEffect, useState } from "react";

interface IUserData {
  _id: string;
  name: string;
  email: string;
  userType: "admin" | "user";
}

const ProfileSettings = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [localUser, setLocalUser] = useState<IUserData>();

  const { register, handleSubmit, reset } = useForm<IUserData>({
    defaultValues: localUser,
  });



  const fetchUserDetail = async () => {
    try {
      const response = await authService.getRequest("/auth/me");
      // console.log('response: ', response.data);
      setLocalUser(response.data);
      reset(response.data)
    } catch (exception) {
      toast.error("Error fetching user detail");
    }
  };

  const submitUpdateForm = async (data: IUserData) => {
    try {
     const response =  await authService.putRequest("/auth/updateOwnProfile", data);
     reset(response.data);
     toast.success("User Detail succcessfully updated");
    } catch (exception) {
      toast.error("Problem updating user details.");
    }
  };

  console.log('localuser: ', localUser);
  useEffect(() => {
    
    fetchUserDetail();
  }, []);

  if (localUser) {
    return (
      <div className="w-2xl mx-auto flex flex-col gap-4">
        <form onSubmit={handleSubmit(submitUpdateForm)} className="flex flex-col gap-5">
          {/* image */}
          <div className="flex justify-center">
            <div className="w-75 bg-red-400 h-75 rounded-full"></div>
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

          <div className="flex flex-col gap-2 mt-4">
            <button className=" border focus:outline-none w-full border-gray-400 bg-blue-400  mx-auto hover:bg-blue-500 cursor-pointer font-semibold text-white px-2 py-1 rounded-md">
              Update User Detail
            </button>
          </div>

          {/* {user?.userType === userType.admin ? (
            <div className="flex flex-col gap-2">
              <label htmlFor="userType">Email</label>
              <select className="border border-gray-400 rounded-md px-2 py-1">
                <option value={userType.admin}>Admin</option>
                <option value={userType.user}>User</option>

                {
                Object.entries(userType).map(key =>{
                  return <option value={key[1]}>{key[1]}</option>
                })
              }
              </select>
            </div>
          ) : (
            <></>
          )} */}

          {}
        </form>
      </div>
    );
  }
};

export default ProfileSettings;
