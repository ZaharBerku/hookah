import axios, { AxiosRequestConfig } from "axios";

export class Resource {
  fetch = async (data: AxiosRequestConfig) => {
    return axios(data);
  };
}
