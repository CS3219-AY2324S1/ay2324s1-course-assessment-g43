import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LandingPage } from "./components/LandingPage";
import { LoginUser } from "./components/LoginUser";
import { RegisterUser } from "./components/RegisterUser";
import UpdateUser from "./components/UpdateUser";
import Navbar from "./components/Navbar";

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
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
