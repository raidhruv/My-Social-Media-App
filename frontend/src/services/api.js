import axios from "axios";

const api=axios.create({
baseURL: "http://localhost:8000/api/v1"
});

api.interceptors.request.use(config=>{
const token=localStorage.getItem("accessToken");

if(token){
config.headers.Authorization=`Bearer ${token}`;
}

return config;
});

api.interceptors.response.use(
response=>response,

async error=>{

const originalRequest=error.config;

if (
    error.response?.status === 401 &&
    !originalRequest._retry &&
    !originalRequest.url.includes("/auth/login") &&
    !originalRequest.url.includes("/auth/register") &&
    !originalRequest.url.includes("/auth/refresh")
) {

originalRequest._retry=true;

try{

const refreshToken = localStorage.getItem("refreshToken");

if (!refreshToken) {
    return Promise.reject(error);
}

const response = await api.post("/auth/refresh", {
    refresh_token: refreshToken,
});

const newAccessToken = response.data.access_token;

localStorage.setItem("accessToken",newAccessToken);


originalRequest.headers.Authorization=`Bearer ${newAccessToken}`;

return api(originalRequest);

}catch(refreshError){

localStorage.removeItem("accessToken");
localStorage.removeItem("refreshToken");

window.location.href="/login";

return Promise.reject(refreshError);
}
}

return Promise.reject(error);
}
);

export default api;