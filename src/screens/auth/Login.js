// LoginScreen.js
import React, { useState, useEffect } from "react";
import { auth } from "../../firebase/firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { FirebaseError } from "firebase/app";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Box, TextField } from "@mui/material";
import { useAuth } from "../../firebase/AuthContext";

const LogIn = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/"); // Redirige si ya está autenticado
    }
  }, [user, navigate]);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    form: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    let valid = true;
    const newErrors = {
      email: "",
      password: "",
      form: "",
    };

    if (!formData.email) {
      newErrors.email = "El correo electrónico es requerido";
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Ingresa un correo electrónico válido";
      valid = false;
    }

    if (!formData.password) {
      newErrors.password = "La contraseña es requerida";
      valid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = "La contraseña debe tener al menos 6 caracteres";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
        form: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    setErrors((prev) => ({ ...prev, form: "" }));

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      console.log("Usuario logueado:", userCredential.user.uid);
      navigate("/");
    } catch (error) {
      if (error instanceof FirebaseError) {
        console.error("Error:", error.message);
        let errorMessage = "Correo electrónico o contraseña incorrectos";

        if (error.code === "auth/invalid-credential") {
          errorMessage = "Credenciales inválidas";
        } else if (error.code === "auth/too-many-requests") {
          errorMessage = "Demasiados intentos. Intenta más tarde";
        }

        setErrors((prev) => ({ ...prev, form: errorMessage }));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        backgroundColor: "#f5f5f5",
        p: { xs: 2, sm: 3 },
      }}
    >
      <Card
        sx={{
          width: { xs: "90%", sm: "80%", md: "70%", lg: "500px" },
          maxWidth: "500px",
          borderRadius: "10px",
          p: { xs: 2, sm: 3, md: 4 },
        }}
        component="form"
        onSubmit={handleSubmit}
        noValidate
      >
        <CardContent
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: { xs: 2, sm: 3 },
          }}
        >
          <Typography
            variant="h5"
            sx={{
              fontSize: { xs: "1.25rem", sm: "1.5rem", md: "1.75rem" },
              textAlign: "center",
              mb: { xs: 2, sm: 3 },
            }}
          >
            Inicia Sesión
          </Typography>
          <TextField
            fullWidth
            margin="normal"
            id="email"
            name="email"
            type="email"
            label="Correo electrónico"
            value={formData.email}
            onChange={handleChange}
            error={Boolean(errors.email)}
            helperText={errors.email}
            disabled={isSubmitting}
            sx={{ mb: { xs: 1, sm: 2 } }}
          />

          <TextField
            fullWidth
            margin="normal"
            id="password"
            name="password"
            type="password"
            label="Contraseña"
            value={formData.password}
            onChange={handleChange}
            error={Boolean(errors.password)}
            helperText={errors.password}
            disabled={isSubmitting}
            sx={{ mb: { xs: 1, sm: 2 } }}
          />

          <Button
            fullWidth
            variant="contained"
            size="large"
            color="primary"
            type="submit"
            disabled={isSubmitting}
            sx={{
              py: { xs: 1, sm: 1.5 },
              fontSize: { xs: "0.875rem", sm: "1rem" },
            }}
          >
            INICIAR SESIÓN
          </Button>

          <Typography
            color="primary"
            size="small"
            onClick={() => navigate("/login")}
            sx={{
              mt: { xs: 2, sm: 3 },
              fontSize: { xs: "0.875rem", sm: "1rem" },
              textAlign: "center",
            }}
          >
            ¿No tienes una cuenta?{" "}
            <Button
              size="small"
              sx={{
                fontSize: "inherit",
                p: 0,
                minWidth: "auto",
              }}
              onClick={() => navigate("/register")}
            >
              Regístrate
            </Button>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default LogIn;
