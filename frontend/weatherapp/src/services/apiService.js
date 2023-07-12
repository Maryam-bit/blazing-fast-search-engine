import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_BASE_URL || "http://localhost:3000/api/v1";

const apiService = axios.create({
  baseURL: API_BASE_URL,
});

// Weather widget Api Service

export const getCoords = async () => {
  try {
    console.log("Getting coordinates");
    return await axios.get("http://ip-api.com/json");
  } catch (error) {
    console.log(error);
    throw new Error("Error getting location information");
  }
};

export const getWeather = async (lat, lon) => {
  try {
    return await axios.get(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=weathercode,temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=auto&current_weather=true`
    );
  } catch (error) {
    console.error(error);
    throw new Error("Error getting weather information");
  }
};

// User Authentication Service

// export const userLogin = async (email, password) => {
//   try {
//     return await apiService.post("/user/login", { email, password });
//   } catch (error) {
//     console.log("🚀 ~ file: apiService.js:39 ~ userLogin ~ error:", error)
//     if (error.response && error.response.data && error.response.data.error) {
//       throw new Error(error.response.data.error);
//     } else if (error.response.data.error) {
//       throw new Error(error.response.data.error.details[0].message);
//     }
//   }
// };

export const userLogin = async (email, password) => {
  try {
    return await apiService.post("/user/login", { email, password });
  } catch (error) {
    console.log(error)
    throw createError(error)
  }
};

export const userRegister = async (username, email, password) => {
  try {
    return await apiService.post("/user/register", {
      user_name: username,
      email,
      password,
    });
  } catch (error) {
    console.error(error);
    throw createError(error);
  }
};

export const userProfile = async () => {
    try {
        let token = localStorage.getItem("jwt");
        return await apiService.get("/user/me", {
            headers: {
                "Authorization": "Bearer "+ token
            }
        })
    } catch (error) {
        console.log("🚀 ~ file: apiService.js:82 ~ userProfile ~ error:", error)
        throw (error)
    }
}

const createError = (error) => {
    if(error.request.status == 403) {
        console.error(error.response.data.error.details[0].message)
        return error.response.data.error.details[0].message;
    } else if (error.request.status == 404) {
        console.log("🚀 ~ file: apiService.js:76 ~ createError ~ error.response.data.error:", error.response.data.error)
        return error.response.data.error;
    } else if (error.request.status == 401) {
        console.log("Un authenticated")
        return "Unauthenticated user"
    } else if (error.request.status == 400) {
        console.log("Un authenticated")
        return "User Already registered"
    } else {
        return "server error"
    }
}