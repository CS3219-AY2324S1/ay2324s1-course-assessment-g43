import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LandingPage } from "./components/LandingPage";
import { LoginUser } from "./components/LoginUser";
import { RegisterUser } from "./components/RegisterUser";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" exact={true} Component={LandingPage} />
        <Route path="/LoginUser" exact={true} Component={LoginUser} />
        <Route path="/RegisterUser" exact={true} Component={RegisterUser} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
