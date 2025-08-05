import { Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import Home from "./pages/Home";

export default function App() {
  return (
    <>
      <Toaster richColors position="top-center" />
        <Routes>
          <Route path="/" element={<Home />} />
          {/* You can add more routes later: About, Contact, etc */}
        </Routes>
    </>
  );
}
