import { BrowserRouter, Routes, Route } from "react-router-dom";
import Calculator from "./pages/Calculator";
import NotFound from "./pages/NotFound";

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Calculator />} />
      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  </BrowserRouter>
);

export default App;
