// src/App.js
import React from "react";
import Chatbot from "./components/Chatbot";
import Header from "./components/Header";

function App() {
  return (
    <div className="App">
      <Header /> {/* Ensure this line exists */}
      <Chatbot />
    </div>
  );
}

export default App;
