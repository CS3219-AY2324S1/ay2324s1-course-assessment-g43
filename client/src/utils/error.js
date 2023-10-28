export const errorCodeContent = {
  401: {
    title: "Unauthorized",
    description:
      "You are not authorized to access this page, please login and try again",
    buttonText: "Login",
    redirectUrl: "/login-user",
  },
  404: {
    title: "Page Not Found",
    description: "The page you are looking for does not seem to exist",
    buttonText: "Back Home",
    redirectUrl: "/",
  },
  500: {
    title: "Something went wrong",
    description: "Please refresh the page or try again later",
    buttonText: "Back Home",
    redirectUrl: "/",
  },
};
