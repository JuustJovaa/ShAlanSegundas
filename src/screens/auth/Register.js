import React, { useState } from "react";
import { auth } from "../../firebase/firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { FirebaseError } from "firebase/app";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Box, TextField } from "@mui/material";

const RegisterUsers = () => {
  const [formData, setFormData] = useState({
    advisorName: "",  
    email: "",
    password: "",
    confirmPassword: ""
  });
  
  const [errors, setErrors] = useState({
    advisorName: "",  
    email: "",
    password: "",
    confirmPassword: "",
    form: ""
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    let valid = true;
    const newErrors = {
      advisorName: "",
      email: "",
      password: "",
      confirmPassword: "",
      form: ""
    };

    if (!formData.advisorName.trim()) {
      newErrors.advisorName = "El nombre del asesor es requerido";
      valid = false;
    } else if (formData.advisorName.length < 3) {
      newErrors.advisorName = "El nombre debe tener al menos 3 caracteres";
      valid = false;
    }

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

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: "",
        form: ""
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    setErrors(prev => ({ ...prev, form: "" }));

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.advisorName,
        formData.email,
        formData.password
      );
      
      console.log("Usuario registrado:", {
        uid: userCredential.user.uid,
        email: formData.email,
        advisorName: formData.advisorName,
      });
      
      navigate("/login");
    } catch (error) {
      if (error instanceof FirebaseError) {
        console.error("Error:", error.message);
        let errorMessage = "Error al registrar el usuario";
        
        if (error.code === "auth/invalid-email") {
          setErrors(prev => ({ ...prev, email: "El correo electrónico no es válido" }));
        } else if (error.code === "auth/email-already-in-use") {
          setErrors(prev => ({ ...prev, email: "El correo electrónico ya está en uso" }));
        } else if (error.code === "auth/weak-password") {
          setErrors(prev => ({ ...prev, password: "La contraseña es demasiado débil" }));
        } else {
          setErrors(prev => ({ ...prev, form: errorMessage }));
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
        p: { xs: 2, sm: 3 }
      }}
    >
      <Card
        sx={{
          width: { xs: '90%', sm: '80%', md: '70%', lg: '500px' },
          maxWidth: '500px',
          borderRadius: '10px',
          p: { xs: 2, sm: 3, md: 4 }
        }}
        component="form"
        onSubmit={handleSubmit}
        noValidate
      >
        <CardContent
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: { xs: 2, sm: 3 }
          }}
        >
          <Typography
            variant="h5"
            sx={{
              fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.75rem' },
              textAlign: 'center',
              mb: { xs: 2, sm: 3 },
              fontWeight: 'bold'
            }}
          >
            Regístrate
          </Typography>

          {errors.form && (
            <Typography color="error" sx={{ mb: { xs: 1, sm: 2 } }}>
              {errors.form}
            </Typography>
          )}

          <TextField
            fullWidth
            label="Nombre del asesor"
            name="advisorName"
            value={formData.advisorName}
            onChange={handleChange}
            error={Boolean(errors.advisorName)}
            helperText={errors.advisorName}
            disabled={isSubmitting}
            sx={{ mb: { xs: 1, sm: 2 } }}
          />

          <TextField
            fullWidth
            label="Correo electrónico"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            error={Boolean(errors.email)}
            helperText={errors.email}
            disabled={isSubmitting}
            sx={{ mb: { xs: 1, sm: 2 } }}
          />

          <TextField
            fullWidth
            label="Contraseña"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            error={Boolean(errors.password)}
            helperText={errors.password}
            disabled={isSubmitting}
            sx={{ mb: { xs: 1, sm: 2 } }}
          />

          <TextField
            fullWidth
            label="Confirmar contraseña"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            error={Boolean(errors.confirmPassword)}
            helperText={errors.confirmPassword}
            disabled={isSubmitting}
            sx={{ mb: { xs: 2, sm: 3 } }}
          />

          <Button
            fullWidth
            variant="contained"
            size="large"
            type="submit"
            disabled={isSubmitting}
            sx={{
              py: { xs: 1, sm: 1.5 },
              fontSize: { xs: '0.875rem', sm: '1rem' },
              mt: { xs: 1, sm: 2 }
            }}
          >
            {isSubmitting ? "Registrando..." : "REGISTRARSE"}
          </Button>

          <Typography
            sx={{
              mt: { xs: 2, sm: 3 },
              fontSize: { xs: '0.875rem', sm: '1rem' },
              textAlign: 'center'
            }}
          >
            ¿Ya tienes una cuenta?{' '}
            <Button
              color="primary"
              size="small"
              onClick={() => navigate("/login")}
              sx={{
                fontSize: 'inherit',
                p: 0,
                minWidth: 'auto',
                textTransform: 'none'
              }}
            >
              Inicia sesión
            </Button>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default RegisterUsers;