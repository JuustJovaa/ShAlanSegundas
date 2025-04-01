import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./firebase/AuthContext";
import LogIn from "./screens/auth/Login";
import TabsWithContent from "./views/TabsWithContent";
import { useEffect, useState } from "react";
import SplashComponent from "./Splash/SplashComponent";
import Register from "./screens/auth/Register";
import { SnackbarProvider } from "notistack";
import { Grow } from '@mui/material';

function App() {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  return loading ? (
    <SplashComponent />
  ) : (
    <AuthProvider>
      <SnackbarProvider maxSnack={3} TransitionComponent={Grow}>
        <Router>
          <Routes>
            <Route path="/login" element={<LogIn />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <TabsWithContent />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Router>
      </SnackbarProvider>
    </AuthProvider>
  );
}

export default App;
