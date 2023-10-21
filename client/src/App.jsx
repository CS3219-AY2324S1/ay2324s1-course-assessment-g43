import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LandingPage } from "./pages/LandingPage";
import { LoginUser } from "./pages/LoginUser";
import { RegisterUser } from "./pages/RegisterUser";
import { UpdateUser } from "./pages/UpdateUser";
import { ViewUser } from "./pages/ViewUser";
import { ViewQuestions } from "./pages/ViewQuestions";
import { ViewQuestionsUser } from "./pages/ViewQuestionsUser";
import { UpdateQuestion } from "./pages/UpdateQuestion";
import { ViewSession } from "./pages/ViewSession";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" exact={true} Component={LandingPage} />
        <Route path="/login-user" exact={true} Component={LoginUser} />
        <Route path="/register-user" exact={true} Component={RegisterUser} />
        <Route path="/update-user" exact={true} Component={UpdateUser} />
        <Route path="/me" exact={true} Component={ViewUser} />
        <Route path="/browse-admin" exact={true} Component={ViewQuestions} />
        <Route path="/browse-user" exact={true} Component={ViewQuestionsUser} />

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
