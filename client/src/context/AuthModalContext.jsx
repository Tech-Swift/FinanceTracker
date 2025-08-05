import { createContext, useContext, useState } from "react";

const AuthModalContext = createContext();

export const AuthModalProvider = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState("login"); // <-- Add this to manage which tab is shown

  const openModal = (defaultTab = "login") => {
    setTab(defaultTab);     // Set tab to 'login' or 'signup'
    setOpen(true);
  };

  const closeModal = () => setOpen(false);

  return (
    <AuthModalContext.Provider value={{ open, openModal, closeModal, tab, setTab }}>
      {children}
    </AuthModalContext.Provider>
  );
};

export const useAuthModal = () => useContext(AuthModalContext);
