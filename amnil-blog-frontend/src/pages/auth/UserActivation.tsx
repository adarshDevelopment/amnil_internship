import { useEffect } from "react";
import { toast, Toaster } from "sonner";
import authService from "../../services/auth.service";
import { useNavigate, useParams } from "react-router-dom";

const UserActivation = () => {
  const { token } = useParams();
  const navigate = useNavigate()

  const activateAccount = async () => {
    try {
      const response = await authService.getRequest(`/auth/activate-user/${token}`);
      toast.success(response.message);
      setTimeout(()=>{
        navigate('/')
      }, 500)
    } catch (exception: any) {
      toast.error(exception.message);
    }
  };

  useEffect(() => {
    activateAccount();
  },[]);
  return (
    <>
    
      <Toaster richColors closeButton position="top-right" />
    </>
  );
};

export default UserActivation;
