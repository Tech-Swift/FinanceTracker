import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      {/* You can add more routes later: About, Contact, etc */}
    </Routes>
  );
}
