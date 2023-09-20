import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LandingPage } from "./pages/LandingPage";
import { LoginUser } from "./pages/LoginUser";
import { RegisterUser } from "./pages/RegisterUser";
import UpdateUser from "./pages/UpdateUser";
import Navbar from "./components/Navbar";
import ViewUser from "./pages/ViewUser";
import { ViewQuestions } from "./pages/ViewQuestions";

function App() {
  return (
    <>
      <Navbar />
      <BrowserRouter>
        <Routes>
          <Route path="/" exact={true} Component={LandingPage} />
          <Route path="/login-user" exact={true} Component={LoginUser} />
          <Route path="/register-user" exact={true} Component={RegisterUser} />
          <Route path="/update-user" exact={true} Component={UpdateUser} />
          <Route path="/me" exact={true} Component={ViewUser} />
          <Route path="/browse" exact={true} Component={ViewQuestions} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
