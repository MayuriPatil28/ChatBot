import React, { useState, useRef, useEffect } from "react";
import axios from "axios";

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatboxRef = useRef(null);

  useEffect(() => {
    if (chatboxRef.current) {
      chatboxRef.current.scrollTop = chatboxRef.current.scrollHeight;
    }
  }, [messages]);

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMessage = input.trim();
    setInput("");

    setMessages((prev) => [...prev, { sender: "user", text: userMessage }]);
    setIsTyping(true);

    try {
      const response = await axios.post(
        "http://localhost:5001/chat", // Replace with your server URL
        { message: userMessage },
        {
          timeout: 30000,
          headers: { "Content-Type": "application/json" },
        }
      );

      const beautifiedResponse = beautifyResponse(response.data.response);

      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: beautifiedResponse },
      ]);
    } catch (error) {
      let errorMessage = "Something went wrong. Please try again.";

      if (error.response) {
        errorMessage = error.response.data.error || errorMessage;
      } else if (error.code === "ECONNABORTED") {
        errorMessage = "Request timed out. Please try again.";
      } else if (!navigator.onLine) {
        errorMessage = "No internet connection. Please check your connection and try again.";
      }

      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: errorMessage, isError: true },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const beautifyResponse = (response) => {
    if (typeof response !== "string") {
      return "Invalid response format.";
    }

    // Break the response into paragraphs for better readability
    const paragraphs = response.split("\n").filter((p) => p.trim() !== "");

    // Wrap each paragraph in <p> tags
    const formattedResponse = paragraphs
      .map(
        (paragraph) =>
          `<p style="margin-bottom: 10px; line-height: 1.6; color: #333;">${paragraph}</p>`
      )
      .join("");

    return formattedResponse;
  };

  const MessageBubble = ({ message }) => (
    <div
      style={{
        ...styles.messageContainer,
        justifyContent: message.sender === "user" ? "flex-end" : "flex-start",
      }}
    >
      <div
        style={{
          ...styles.messageBubble,
          backgroundColor: message.isError
            ? "#ffebee"
            : message.sender === "user"
            ? "#007BFF"
            : "#f0f0f0",
          color: message.sender === "user" ? "#fff" : message.isError ? "#c62828" : "#000",
          marginLeft: message.sender === "user" ? "20%" : "0",
          marginRight: message.sender === "user" ? "0" : "20%",
        }}
        dangerouslySetInnerHTML={{ __html: message.text }} // Render beautified HTML
      />
    </div>
  );

  return (
    <div style={styles.container}>
      <div style={styles.chatbox} ref={chatboxRef}>
        {messages.map((msg, index) => (
          <MessageBubble key={index} message={msg} />
        ))}
        {isTyping && <div style={styles.typingIndicator}>Bot is typing...</div>}
      </div>
      <div style={styles.inputArea}>
        <input
          style={styles.input}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message..."
          disabled={isTyping}
        />
        <button
          style={{
            ...styles.button,
            opacity: isTyping ? 0.7 : 1,
            cursor: isTyping ? "not-allowed" : "pointer",
          }}
          onClick={handleSend}
          disabled={isTyping}
        >
          Send
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    width: "100vw",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f7f7f7",
  },
  chatbox: {
    width: "80%",
    height: "70%",
    overflowY: "scroll",
    border: "1px solid #ccc",
    borderRadius: "5px",
    padding: "20px",
    marginBottom: "10px",
    backgroundColor: "#fff",
    display: "flex",
    flexDirection: "column",
  },
  messageContainer: {
    width: "100%",
    display: "flex",
    marginBottom: "10px",
  },
  messageBubble: {
    padding: "12px 16px",
    borderRadius: "20px",
    maxWidth: "80%",
    wordBreak: "break-word",
    boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
    fontSize: "16px",
    lineHeight: "1.6",
  },
  typingIndicator: {
    alignSelf: "flex-start",
    color: "#666",
    fontSize: "0.9em",
    padding: "8px 12px",
    margin: "5px 0",
    backgroundColor: "#f0f0f0",
    borderRadius: "15px",
  },
  inputArea: {
    display: "flex",
    width: "80%",
    gap: "10px",
  },
  input: {
    flex: 1,
    padding: "12px",
    borderRadius: "25px",
    border: "1px solid #ccc",
    fontSize: "16px",
    outline: "none",
  },
  button: {
    padding: "12px 24px",
    backgroundColor: "#007BFF",
    color: "#fff",
    border: "none",
    borderRadius: "25px",
    fontSize: "16px",
    fontWeight: "500",
    transition: "all 0.2s ease",
  },
};

export default Chatbot;
