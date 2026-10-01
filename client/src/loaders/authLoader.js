import { redirect } from "react-router-dom";

const authLoader = () => {
  const token = localStorage.getItem("token");

  if (!token) {
    return redirect("/login");
  }

  return null;
};

export default authLoader;