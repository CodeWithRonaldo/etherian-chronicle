import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { ThirdwebProvider } from "thirdweb/react";
import { StoryDataContext } from "./contexts/StoryDataContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThirdwebProvider>
      <StoryDataContext>
        <App />
      </StoryDataContext>
    </ThirdwebProvider>
  </StrictMode>
);
