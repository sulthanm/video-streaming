import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Login from "./components/login/Login";
import SignUp from "./components/sign-up/SignUp";
import { useState } from "react";

function App() {
  const [name, setName] = useState("") 
  const handleSetName = (_name) => {
    console.log("User name", _name)
    setName(_name)
  }
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout  name={name} />} />
        <Route path="/sign-in" element={<Login updateName={handleSetName} />} />
        <Route path="/sign-up"element={<SignUp  name={name} updateName={handleSetName}  />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
