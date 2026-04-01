import { useAuth } from "../hooks/useAuth";
import { Navigate } from "react-router";

export const Protected = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
};
export default Protected;
