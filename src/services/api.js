import axios from "axios";

const api = axios.create({
  baseURL: "https://goldenrod-octopus-600472.hostingersite.com/api",
});

export default api;
