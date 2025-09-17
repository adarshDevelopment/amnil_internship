import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store";
import { userType } from "../constants";
import { Outlet } from "react-router-dom";

const AdminRoutes =()=>{
const {user, status} = useSelector((state: RootState)=> state.auth);

  if(status==='loading'){
    return <></>
  }

  if(!user || user.userType !== userType.admin){
    return <></>
  }

  return <Outlet/>
}

export default AdminRoutes;