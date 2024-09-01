import axios from "axios";

const api = axios.create({
  //baseURL: "http://127.0.0.1:8000/api",
  baseURL: "https://goldenrod-octopus-600472.hostingersite.com/api",
});

export default api;
