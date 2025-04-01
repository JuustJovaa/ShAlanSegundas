import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { Typography } from '@mui/material';

export default function StudentDialog(props) {
  const { open, handleClose, sendData, initialData = {}, isEditing = false } = props;
  
  // Estado inicial limpio
  const initialState = {
    nombreAlumno: '',
    seccion: '',
    grado: '',
  };

  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({
    nombreAlumno: '',
    seccion: '',
    grado: '',
    form: '' 
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Efecto para resetear el formulario cuando se abre/cierra o cambian los datos iniciales
  useEffect(() => {
    if (open) {
      // Resetear errores
      setErrors({
        nombreAlumno: '',
        seccion: '',
        grado: '',
        form: ''
      });
      
      // Cargar datos iniciales o resetear
      setFormData(isEditing ? {
        nombreAlumno: initialData.nombreAlumno || '',
        seccion: initialData.seccion || '',
        grado: initialData.grado || ''
      } : initialState);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, initialData, isEditing]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
        form: ''
      }));
    }
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = {
      nombreAlumno: '',
      seccion: '',
      grado: '',
      form: ''
    };

    if (!formData.nombreAlumno.trim()) {
      newErrors.nombreAlumno = 'El nombre del alumno es requerido';
      valid = false;
    } else if (formData.nombreAlumno.length < 3) {
      newErrors.nombreAlumno = 'El nombre debe tener al menos 3 caracteres';
      valid = false;
    }

    if (!formData.grado.trim()) {
      newErrors.grado = 'El grado es requerido';
      valid = false;
    } else if (!/^[0-9]+(°|to|ro)?$/.test(formData.grado.toLowerCase())) {
      newErrors.grado = 'Formato de grado inválido (ej: 5to, 3ro, 2°)';
      valid = false;
    }

    if (!formData.seccion.trim()) {
      newErrors.seccion = 'La sección es requerida';
      valid = false;
    } else if (!/^[A-Za-z]$/.test(formData.seccion)) {
      newErrors.seccion = 'La sección debe ser una sola letra (A-Z)';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    setErrors(prev => ({ ...prev, form: '' }));

    try {
      await sendData(formData);
      handleClose();
    } catch (error) {
      console.error("Error al guardar:", error);
      setErrors(prev => ({
        ...prev,
        form: error.message || 'Ocurrió un error al guardar los datos'
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        {isEditing ? 'Editar Alumno' : 'Agregar Nuevo Alumno'}
      </DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          {errors.form && (
            <Typography color="error" sx={{ mb: 2 }}>
              {errors.form}
            </Typography>
          )}

          <TextField
            autoFocus
            margin="dense"
            id="nombreAlumno"
            name="nombreAlumno"
            label="Nombre del Alumno"
            type="text"
            fullWidth
            variant="outlined"
            value={formData.nombreAlumno}
            onChange={handleChange}
            error={!!errors.nombreAlumno}
            helperText={errors.nombreAlumno}
            disabled={isSubmitting}
            sx={{ mb: 2 }}
          />
          
          <TextField
            margin="dense"
            id="grado"
            name="grado"
            label="Grado"
            type="text"
            fullWidth
            variant="outlined"
            value={formData.grado}
            onChange={handleChange}
            error={!!errors.grado}
            helperText={errors.grado}
            disabled={isSubmitting}
            sx={{ mb: 2 }}
          />
          
          <TextField
            margin="dense"
            id="seccion"
            name="seccion"
            label="Sección"
            type="text"
            fullWidth
            variant="outlined"
            value={formData.seccion}
            onChange={handleChange}
            error={!!errors.seccion}
            helperText={errors.seccion}
            disabled={isSubmitting}
          />
          
          <DialogActions sx={{ px: 0, mt: 3 }}>
            <Button 
              onClick={handleClose} 
              variant="outlined"
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              variant="contained" 
              color="primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Guardando...' : isEditing ? 'Actualizar' : 'Guardar'}
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
}