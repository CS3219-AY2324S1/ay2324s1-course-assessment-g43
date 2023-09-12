import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { RegisterUser } from "./components/RegisterUser";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" exact={true} Component={RegisterUser} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
