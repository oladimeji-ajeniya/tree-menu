import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import MenuPage from "./pages/MenuPage";
import EditMenuPage from "./pages/EditMenuPage";

import { QueryClient, QueryClientProvider } from "react-query";
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<MenuPage />} />
          <Route path="/menus/edit/:id" element={<EditMenuPage />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
