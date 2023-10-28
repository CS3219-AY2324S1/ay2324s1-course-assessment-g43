import { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { errorCodeContent } from "../utils/error";

export const AxiosErrorMiddleware = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    // Add an Axios interceptor to catch errors
    axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (
          error.response &&
          Object.keys(errorCodeContent).includes(
            error.response.status.toString()
          )
        ) {
          navigate(`/error?statusCode=${error.response.status}`);
        }
        // For other error codes, you can add more logic or do nothing
        return Promise.reject(error);
      }
    );
  }, [navigate]);

  return children;
};
