import { AxiosResponse } from "axios";

export const isSuccess = (res: AxiosResponse<any, any>) => {
  return res && res.status >= 200 && res.status < 400;
};
