import React, { createContext, useState, useEffect, useContext } from "react";
import api from "../api/axios";

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch user on mount if token exists
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setLoading(false);
          return;
        }

        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        const { data } = await api.get("/auth/me");

        const userData = {
          id: data._id,
          name: data.name,
          email: data.email,
          phone: data.phone,
          isAdmin: data.isAdmin || false,
        };

        setUser(userData);
      } catch (err) {
        console.error("❌ Error fetching user:", err);
        localStorage.removeItem("token");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // 🔹 Login function
  const login = async (email, password) => {
  try {
    const res = await api.post("/auth/signin", { email, password });
    console.log("LOGIN RESPONSE:", res.data);

    if (res.data?.token) {
      localStorage.setItem("token", res.data.token);
      api.defaults.headers.common["Authorization"] = `Bearer ${res.data.token}`;
      setUser(res.data.user);
      return { success: true };
    }

    return { success: false, error: "Login failed" };
  } catch (err) {
    console.log("LOGIN ERROR:", err?.response || err);
    console.log("ERROR STATUS:", err?.response?.status);
    console.log("ERROR DATA:", err?.response?.data);
    console.log("REQUEST URL:", err?.config?.baseURL + err?.config?.url);

    return {
      success: false,
      error: err?.response?.data?.message || err.message || "Something went wrong",
    };
  }
};


  // 🔹 Logout function
  const logout = () => {
    localStorage.removeItem("token");
    delete api.defaults.headers.common["Authorization"];
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </UserContext.Provider>
  );
};
