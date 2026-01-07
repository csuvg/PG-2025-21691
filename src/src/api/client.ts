import { getClerkInstance } from "@clerk/clerk-expo";
import axios from "axios";

export const api = axios.create({
  withCredentials: true,
  baseURL: "https://api.miraiedu.online/",
});

api.interceptors.request.use(
  async config => {
    config.headers["Content-Type"] = "application/json";

    const clerkInstance = getClerkInstance();
    const token = await clerkInstance.session?.getToken({
      template: "jwt-insomnia-testing",
    });
    config.headers.Authorization = `Bearer ${token}`;

    return config;
  },
  error => Promise.reject(error)
);
