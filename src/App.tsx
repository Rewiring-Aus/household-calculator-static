import React, { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Methodology from "./pages/Methodology";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme/theme";

function usePostHeight() {
  useEffect(() => {
    let lastHeight = 0;
    const postHeight = () => {
      const height = document.documentElement.scrollHeight;
      if (height !== lastHeight) {
        lastHeight = height;
        window.parent.postMessage({ type: "calculator-resize", height }, "*");
      }
    };

    // Debounced version to avoid spamming the parent frame
    // when MUI Select/Menu components cause rapid DOM mutations
    let timer: ReturnType<typeof setTimeout>;
    const debouncedPostHeight = () => {
      clearTimeout(timer);
      timer = setTimeout(postHeight, 100);
    };

    // Post on load
    postHeight();

    // Post on resize
    window.addEventListener("resize", postHeight);

    // Post on DOM changes (form expanding/collapsing, etc.)
    const observer = new MutationObserver(debouncedPostHeight);
    observer.observe(document.body, { childList: true, subtree: true, attributes: true });

    return () => {
      clearTimeout(timer);
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
