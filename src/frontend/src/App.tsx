import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Layout } from "./components/layout";
import {
  Homepage,
  ChallengePage,
  SuccessPage,
  DashboardPage,
  DaoReputationPage,
  // You can also import the existing views if you want to integrate them into the new layout/routing
  CounterView,
  GreetingView,
  LlmPromptView,
} from "./views";
import { AnimatePresence } from "framer-motion";
import { useState } from "react";

// For any global styles or specific page styles that Tailwind doesn't cover directly
// import './App.css'; // Example if you had an App.css

function App() {
  // The existing loading/error states might be managed per-page or via a global context later
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route
            index
            element={
              <AnimatePresence mode="wait">
                <Homepage />
              </AnimatePresence>
            }
          />
          <Route
            path="challenge"
            element={
              <AnimatePresence mode="wait">
                <ChallengePage />
              </AnimatePresence>
            }
          />
          <Route
            path="success"
            element={
              <AnimatePresence mode="wait">
                <SuccessPage />
              </AnimatePresence>
            }
          />
          <Route
            path="dashboard"
            element={
              <AnimatePresence mode="wait">
                <DashboardPage />
              </AnimatePresence>
            }
          />
          <Route
            path="dao-reputation"
            element={
              <AnimatePresence mode="wait">
                <DaoReputationPage />
              </AnimatePresence>
            }
          />

          <Route
            path="counter"
            element={
              <CounterView onError={handleError} setLoading={setLoading} />
            }
          />
          <Route
            path="greeting"
            element={
              <GreetingView onError={handleError} setLoading={setLoading} />
            }
          />
          <Route
            path="llm"
            element={
              <LlmPromptView onError={handleError} setLoading={setLoading} />
            }
          />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
