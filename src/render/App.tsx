import { MemoryRouter as Router, Routes, Route } from "react-router";
import { MainView } from "./containers/MainView";

export const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainView />} />
      </Routes>
    </Router>
  );
};
