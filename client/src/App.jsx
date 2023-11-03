import axios from "axios";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LandingPage } from "./pages/LandingPage";
import { LoginUser } from "./pages/LoginUser";
import { RegisterUser } from "./pages/RegisterUser";
import { UpdateUser } from "./pages/UpdateUser";
import { ViewUser } from "./pages/ViewUser";
import { ViewQuestions } from "./pages/ViewQuestions";
import { History } from "./pages/History";
import { UpdateQuestion } from "./pages/UpdateQuestion";
import { ViewSession } from "./pages/ViewSession";
import { ErrorPage } from "./pages/ErrorPage";
import { errorCodeContent } from "./utils/error";

function App() {
  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      if (
        error.response &&
        Object.keys(errorCodeContent).includes(error.response.status.toString())
      ) {
        window.location.replace(`/error?statusCode=${error.response.status}`);
      }
      return Promise.reject(error);
    }
  );
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" exact={true} Component={LandingPage} />
        <Route path="/login-user" exact={true} Component={LoginUser} />
        <Route path="/register-user" exact={true} Component={RegisterUser} />
        <Route path="/update-user" exact={true} Component={UpdateUser} />
        <Route path="/me" exact={true} Component={ViewUser} />
        <Route path="/browse-admin" exact={true} Component={ViewQuestions} />
        <Route path="/history" exact={true} Component={History} />

        <Route
          path="/update-question"
          exact={true}
          Component={UpdateQuestion}
        />
        <Route path="/session/:id" exact={true} Component={ViewSession} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
