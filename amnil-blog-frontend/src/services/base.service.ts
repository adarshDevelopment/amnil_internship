import axiosInstance from "../config/axios.config";

class BaseService {
  getRequest = async (url: string) => {
    return await axiosInstance.get(`${url}`);
  };

  postRequest = async (url: string, data :any) => {
    return await axiosInstance.post(url, data);
  };

  putRequest = async (url: string, data : any) => {
    return await axiosInstance.put(url, data);
  };

  deleteRequest = async (url: string) => {
    return await axiosInstance.delete(url);
  };
}

export default BaseService;
