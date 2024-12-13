export const getToken = () => {
  return localStorage.getItem("token");
};

export const clearAuth = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};
