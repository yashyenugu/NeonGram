import axios from 'axios';


let axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_SERVER_URL
});


axiosInstance.interceptors.request.use(function (config) {
    console.log(process.env.REACT_APP_SERVER_URL);
    const token = localStorage.getItem('accessToken');
    config.headers.Authorization = token ? `Bearer ${token}` : '';
    return config;
});

export default axiosInstance;