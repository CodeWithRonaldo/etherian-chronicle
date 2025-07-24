import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { ThirdwebProvider } from "thirdweb/react";
import { UserDataContext } from "./contexts/UserDataContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThirdwebProvider>
      <UserDataContext>
        <App />
      </UserDataContext>
    </ThirdwebProvider>
  </StrictMode>
);
