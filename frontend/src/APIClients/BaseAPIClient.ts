import axios from "axios";

const baseAPIClient = async () => {
  const baseURL = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

  if (!baseURL) {
    throw new Error(`Missing baseURL for backend`);
  }

  return axios.create({ baseURL });
};

export default baseAPIClient;
