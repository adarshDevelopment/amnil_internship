import axiosInstance from "../config/axios.config";
export interface ISuccessResponse {
  data: any | string;
  options: any;
  status: string;
  message: string;
}

class BaseService {
  getRequest = async (url: string): Promise<ISuccessResponse>  => {
    return await axiosInstance.get(`${url}`);
  };

  postRequest = async (url: string, data: any): Promise<ISuccessResponse> => {
    return await axiosInstance.post(url, data);
  };

  putRequest = async (url: string, data: any): Promise<ISuccessResponse> => {
    return await axiosInstance.put(url, data);
  };

  deleteRequest = async (url: string): Promise<ISuccessResponse> => {
    return await axiosInstance.delete(url);
  };
}

export default BaseService;
