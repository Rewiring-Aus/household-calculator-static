import React, { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Methodology from "./pages/Methodology";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme/theme";

function usePostHeight() {
  useEffect(() => {
    const postHeight = () => {
      const height = document.documentElement.scrollHeight;
      window.parent.postMessage({ type: "calculator-resize", height }, "*");
    };

    // Post on load
    postHeight();

    // Post on resize
    window.addEventListener("resize", postHeight);

    // Post on DOM changes (form expanding/collapsing, etc.)
    const observer = new MutationObserver(postHeight);
    observer.observe(document.body, { childList: true, subtree: true, attributes: true });

    return () => {
      window.removeEventListener("resize", postHeight);
      observer.disconnect();
    };
  }, []);
}

const App: React.FC = () => {
  usePostHeight();

  return (
    <ThemeProvider theme={theme}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/methodology" element={<Methodology />} />
      </Routes>
    </ThemeProvider>
  );
};

export default App;
