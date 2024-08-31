import axios from "axios";

const api = axios.create({
  baseURL: "https://ec2-3-94-206-127.compute-1.amazonaws.com/api",
});

export default api;
