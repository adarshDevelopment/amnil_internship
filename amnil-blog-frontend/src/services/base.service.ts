import axiosInstance from "../config/axios.config";
export interface ISuccessResponse {
  data: any | string;
  options: any;
  status: string;
  message: string;
}

export interface IConfigParams {
  headers?: {
    Authorization?: string | null;
    "Content-Type"?: "multipart/form-data" | "application/json" | string | null;
  };
  params?: {
    [key: string]: string | number | undefined | boolean;
  };
}

class BaseService {
  getRequest = async (url: string, config:IConfigParams = {}): Promise<ISuccessResponse> => {
    return await axiosInstance.get(`${url}`,config);
  };

  postRequest = async (url: string, data: any, config:IConfigParams = {}): Promise<ISuccessResponse> => {
    return await axiosInstance.post(url, data, config);
  };

  putRequest = async (url: string, data: any,config:IConfigParams = {} ): Promise<ISuccessResponse> => {
    return await axiosInstance.put(url, data, config);
  };

  deleteRequest = async (url: string, config:IConfigParams = {}): Promise<ISuccessResponse> => {
    return await axiosInstance.delete(url, config);
  };
}

export default BaseService;
