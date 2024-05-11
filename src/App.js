import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import UpdateLogin from "./components/UpdateLogin";
import CreateBoothForm from "./components/CreateBoothForm";
import SignUp from "./components/SignUp";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Login />} />
        <Route exact path="/nWuRGm1GvLXyCmQ6TbxqfQ7YasvDlY8z87TxUHrX0HUhX0Pxa9" element={<SignUp />} />
        <Route exact path="/create" element={<CreateBoothForm />} />
        <Route exact path="/update" element={<UpdateLogin />} />
      </Routes>
    </Router>
  );
};

export default App;
