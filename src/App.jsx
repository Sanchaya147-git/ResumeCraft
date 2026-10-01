import React from "react";
import { Routes, Route, Link } from "react-router-dom";

import Home from "./pages/Home";
import Builder from "./pages/Builder";
import Templates from "./pages/Templates";

import "./App.css";

function App() {
  return (
    <div className="app">

     <header className="navbar">
      <div className="logo">
  <div className="logo-icon"></div>
  <span className="logo-text">ResumeCraft</span>
</div>

  <nav className="nav-links">
    <a href="/">Home</a>
    <a href="/builder">Builder</a>
    <a href="/templates">Templates</a>
  </nav>
</header>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/builder" element={<Builder />} />
        <Route path="/templates" element={<Templates />} />
      </Routes>

    </div>
  );
}

export default App;