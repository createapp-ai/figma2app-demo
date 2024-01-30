import _axios, { AxiosError } from '_axios';

const API_URL = import.meta.env.VITE_API_URL as string;

const axios = _axios.create({
  baseURL: API_URL,
});

export function sleep(ms = 3000): Promise<void> {
  const wait = Math.floor(Math.random() * ms) + 1;
  return new Promise((resolve) => setTimeout(resolve, wait));
}

axios.interceptors.response.use(
  async (response) => {
    // await sleep();
    return response;
  },
  (error: AxiosError) => {
    if (error.response) {
      const message = (error.response.data as { message?: string })?.message;
      if (message) {
        error.message = message;
      }
    }
    return Promise.reject(error);
  }
);

export default axios;
