import React from "react";
import ChatbotImage from "./Chatbot.jpg"; // Import the image from the same folder

const Header = () => {
  return (
    <header style={styles.header}>
      <img
        src={ChatbotImage} 
        alt="hey!"
        style={styles.logo}
      />
      <h1 style={styles.title}>My Chatbot</h1>
    </header>
  );
};

const styles = {
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#007BFF",
    padding: "10px 20px",
    color: "white",
    borderBottom: "2px solid #0056b3",
  },
  logo: {
    height: "50px",
    width: "50px",
    marginRight: "15px",
  },
  title: {
    fontSize: "1.5rem",
    fontWeight: "bold",
  },
};

export default Header;
