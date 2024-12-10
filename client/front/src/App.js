import React, { useState } from "react";

const SignupPage = () => {
  const [darkMode, setDarkMode] = useState(false);

  const toggleTheme = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  const themeStyles = {
    container: {
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: darkMode ? "#121212" : "#f5f5f5",
      color: darkMode ? "#ffffff" : "#000000",
      transition: "background-color 0.3s, color 0.3s",
    },
    form: {
      backgroundColor: darkMode ? "#1e1e1e" : "#ffffff",
      color: darkMode ? "#ffffff" : "#000000",
      padding: "20px",
      borderRadius: "8px",
      boxShadow: darkMode
        ? "0 4px 8px rgba(0, 0, 0, 0.5)"
        : "0 4px 8px rgba(0, 0, 0, 0.1)",
    },
    input: {
      width: "100%",
      padding: "10px",
      margin: "10px 0",
      borderRadius: "4px",
      border: darkMode ? "1px solid #333" : "1px solid #ccc",
      backgroundColor: darkMode ? "#333" : "#fff",
      color: darkMode ? "#fff" : "#000",
    },
    button: {
      padding: "10px 20px",
      backgroundColor: darkMode ? "#6200ea" : "#6200ea",
      color: "#fff",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
    },
  };

  return (
    <div style={themeStyles.container}>
      <h1>Signup Page</h1>
      <label>
        <input
          type="checkbox"
          checked={darkMode}
          onChange={toggleTheme}
        />{" "}
        Enable Dark Mode
      </label>
      <form style={themeStyles.form}>
        <label>
          Name:
          <input
            type="text"
            placeholder="Enter your name"
            style={themeStyles.input}
          />
        </label>
        <label>
          Email:
          <input
            type="email"
            placeholder="Enter your email"
            style={themeStyles.input}
          />
        </label>
        <label>
          Password:
          <input
            type="password"
            placeholder="Enter your password"
            style={themeStyles.input}
          />
        </label>
        <button type="submit" style={themeStyles.button}>
          Signup
        </button>
      </form>
    </div>
  );
};

export default SignupPage;
