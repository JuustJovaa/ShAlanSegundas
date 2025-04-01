import React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import {
  Box,
  Button,
  Typography,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { getAuth } from "firebase/auth";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import StudentDialog from "../components/AgregarAlumnosModal";
import { useEffect, useState } from "react";
// import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ClearIcon from "@mui/icons-material/Clear";
import CheckIcon from "@mui/icons-material/Check";
import {
  addStudent,
  updateStudent,
  recordAttendance,
  deleteStudent,
} from "../firebase/FirebaseService";
import { db } from "../firebase/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import MenuActions from "../components/menuActionsButton";
import { useSnackbar } from "notistack";
import { Slide, Zoom } from "@mui/material";
import Skeleton from "@mui/material/Skeleton";
import DeleteConfirmationDialog from "../components/DeleteAlumnosModal";

const columns = [
  {
    id: "nombreAlumno",
    label: "Nombre del Alumno",
    minWidth: 150,
  },
  {
    id: "grado",
    label: "Grado",
    minWidth: 100,
  },
  {
    id: "seccion",
    label: "Sección",
    minWidth: 100,
  },
  {
    id: "actions",
    label: "",
    minWidth: 200,
    align: "center",
  },
];

function ListadoAlumnos() {
  const auth = getAuth();
  const user = auth.currentUser;
  const { enqueueSnackbar } = useSnackbar();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [openDialog, setOpenDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [students, setStudents] = useState([]);
  const [currentStudent, setCurrentStudent] = useState({
    id: "",
    nombreAlumno: "",
    grado: "",
    seccion: "",
    asesorId: "",
  });
  const [loadingData, setLoadingData] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [alumnoToDelete, setAlumnoToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleOpenDialog = () => {
    setCurrentStudent({
      nombreAlumno: "",
      grado: "",
      seccion: "",
      asesorId: "",
    });
    setOpenDialog(true);
    setIsEditing(false);
  };

  const handleCloseDialog = () => {
    setCurrentStudent({
      id: "",
      nombreAlumno: "",
      grado: "",
      seccion: "",
      asesorId: "",
    });
    setOpenDialog(false);
  };

  const handleEdit = (alumno) => {
    console.log("Editando alumno:", alumno);
    setCurrentStudent({
      id: alumno.id,
      nombreAlumno: alumno.nombreAlumno,
      grado: alumno.grado,
      seccion: alumno.seccion,
      asesorId: user.uid,
    });
    setIsEditing(true);
    setOpenDialog(true);
  };

  const handleAttendance = async (alumno, presente) => {
    const fecha = new Date()
      .toLocaleDateString("es-MX", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      })
      .replace(/\//g, "-");
    try {
      await recordAttendance(alumno.id, alumno.nombreAlumno, fecha, presente);
      showNotification(
        `Asistencia registrada: ${alumno.nombreAlumno} - ${
          presente ? "Presente" : "Ausente"
        }`
      );
    } catch (error) {
      showNotification("Error al registrar asistencia", "error");
      console.error("Error al registrar asistencia:", error);
    }
  };

  /*   useEffect(() => {
    if (user) {
      const fetchAlumnos = async () => {
        const querySnapshot = await getDocs(collection(db, "alumnos"));
        const alumnosData = querySnapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .filter(alumno => alumno.asesorId === user.uid);
        
        setStudents(alumnosData);
      };
      
      fetchAlumnos();
    }
  }, [user]); */

  const handleDelete = async (alumno) => {
    if (window.confirm(`¿Eliminar a ${alumno.nombreAlumno}?`)) {
      try {
        await deleteStudent(alumno.id);
        setStudents((prev) => prev.filter((r) => r.id !== alumno.id));
        showNotification("Alumno agregado correctamente");
      } catch (error) {
        console.error("Error al eliminar:", error);
      }
    }
  };

  const handleSendData = async (data) => {
    try {
      if (isEditing) {
        await updateStudent(currentStudent.id, {
          nombreAlumno: data.nombreAlumno,
          grado: data.grado,
          seccion: data.seccion,
        });
        setStudents((prev) =>
          prev.map((s) =>
            s.id === currentStudent.id
              ? {
                  ...s,
                  nombreAlumno: data.nombreAlumno,
                  grado: data.grado,
                  seccion: data.seccion,
                }
              : s
          )
        );
        showNotification("Alumno actualizado correctamente");
      } else {
        const newStudentData = {
          nombreAlumno: data.nombreAlumno,
          grado: data.grado,
          seccion: data.seccion,
          asesorId: user.uid,
        };

        const newStudent = await addStudent(newStudentData);
        setStudents((prev) => [
          ...prev,
          {
            id: newStudent.id,
            ...newStudentData,
          },
        ]);
        showNotification("Alumno agregado correctamente");
      }
    } catch (error) {
      console.error("Error al guardar:", error);
      throw error;
    } finally {
      handleCloseDialog();
    }
  };

  const showNotification = (message, variant = "success") => {
    enqueueSnackbar(message, {
      variant,
      TransitionComponent: variant === "error" ? Slide : Zoom,
      anchorOrigin: {
        vertical: "top",
        horizontal: "right",
      },
      autoHideDuration: 3000,
    });
  };

  useEffect(() => {
    const fetchAlumnos = async () => {
      try {
        setLoadingData(true);
        const querySnapshot = await getDocs(collection(db, "alumnos"));
        const alumnosData = querySnapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .filter((alumno) => alumno.asesorId === user.uid);
        setStudents(alumnosData);
      } catch (error) {
        showNotification("Error al cargar alumnos", "error");
        setStudents([]);
        console.error("Error al cargar alumnos:", error);
      } finally {
        setLoadingData(false);
      }
    };

    if (user) {
      fetchAlumnos();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleOpenDeleteDialog = (alumno) => {
    setAlumnoToDelete(alumno);
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setAlumnoToDelete(null);
    setIsDeleting(false);
  };

  const handleConfirmDelete = async () => {
    if (!alumnoToDelete) return;
    
    setIsDeleting(true);
    try {
      await deleteStudent(alumnoToDelete.id);
      setStudents(prev => prev.filter(a => a.id !== alumnoToDelete.id));
      showNotification('Alumno eliminado correctamente', 'success');
    } catch (error) {
      showNotification('Error al eliminar el alumno', 'error');
      console.error("Error al eliminar:", error);
    } finally {
      handleCloseDeleteDialog();
    }
  };

  const SkeletonRow = () => (
    <TableRow>
      {columns.map((column) => (
        <TableCell key={`skeleton-${column.id}`}>
          <Skeleton
            animation="wave"
            height={24}
            width={column.minWidth ? `${column.minWidth}px` : "100%"}
          />
        </TableCell>
      ))}
    </TableRow>
  );

  return (
    <Box
      sx={{
        width: "85%",
        display: "flex",
        flexDirection: "column",
        p: isSmallScreen ? 1 : 3,
        pb: isSmallScreen ? 8 : 3,
        height: "100%",
        overflow: "hidden",
        mt: isSmallScreen ? 8 : 4,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: isSmallScreen ? "column" : "row",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
          gap: 1,
        }}
      >
        <Typography
          variant={isSmallScreen ? "h6" : "h4"}
          sx={{
            fontWeight: "bold",
            color: theme.palette.primary.main,
            mb: isSmallScreen ? 0 : 1,
          }}
        >
          Listado de Alumnos
        </Typography>

        <Button
          size={isSmallScreen ? "small" : "medium"}
          variant="contained"
          color="primary"
          startIcon={<AddCircleOutlineIcon />}
          sx={{
            whiteSpace: "nowrap",
            minWidth: "fit-content",
            alignSelf: "flex-end",
            mb: isSmallScreen ? 1 : 0,
          }}
          onClick={handleOpenDialog}
        >
          {isSmallScreen ? "Agregar" : "Agregar Alumno"}
        </Button>
      </Box>

      <Paper
        sx={{
          width: "100%",
          height: "80%",
          overflow: "hidden",
          boxShadow: theme.shadows[3],
          borderRadius: theme.shape.borderRadius,
        }}
      >
        <TableContainer
          sx={{
            maxHeight: "calc(100vh - 240px)",
            [theme.breakpoints.down("sm")]: {
              maxHeight: "calc(100vh - 200px)",
            },
          }}
        >
          <Table
            stickyHeader
            aria-label="tabla de alumnos"
            size={isSmallScreen ? "small" : "medium"}
          >
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    sx={{
                      minWidth: column.minWidth,
                      fontWeight: "bold",
                      backgroundColor: theme.palette.grey[200],
                      fontSize: isSmallScreen ? "0.75rem" : "0.875rem",
                    }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {loadingData
                ? Array.from({ length: 5 }).map((_, index) => (
                    <SkeletonRow key={`skeleton-${index}`} />
                  ))
                : students
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) => (
                      <TableRow
                        hover
                        role="checkbox"
                        tabIndex={-1}
                        key={index}
                        sx={{
                          "&:nth-of-type(odd)": {
                            backgroundColor: theme.palette.action.hover,
                          },
                        }}
                      >
                        <TableCell
                          sx={{
                            fontSize: isSmallScreen ? "0.75rem" : "0.875rem",
                          }}
                        >
                          {row.nombreAlumno}
                        </TableCell>

                        <TableCell
                          sx={{
                            fontSize: isSmallScreen ? "0.75rem" : "0.875rem",
                          }}
                        >
                          {row.grado}
                        </TableCell>

                        <TableCell
                          sx={{
                            fontSize: isSmallScreen ? "0.75rem" : "0.875rem",
                          }}
                        >
                          {row.seccion}
                        </TableCell>
                        <TableCell
                          align="center"
                          sx={{
                            fontSize: isSmallScreen ? "0.75rem" : "0.875rem",
                            width: "5%",
                          }}
                        >
                          <MenuActions
                            actions={[
                              {
                                label: "Editar",
                                icon: <EditIcon />,
                                handler: () => handleEdit(row),
                                sx: { color: "primary.main" },
                              },
                              {
                                label: "Eliminar",
                                icon: <DeleteIcon />,
                                handler: () => handleOpenDeleteDialog(row),
                                sx: { color: "error.main" },
                              },
                              {
                                label: "Presente",
                                icon: <CheckIcon />,
                                handler: () => handleAttendance(row, true),
                              },
                              {
                                label: "Ausente",
                                icon: <ClearIcon />,
                                handler: () => handleAttendance(row, false),
                              },
                            ]}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={students.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Filas por página:"
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} de ${count !== -1 ? count : `más de ${to}`}`
          }
          sx={{
            "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows":
              {
                fontSize: isSmallScreen ? "0.75rem" : "0.875rem",
              },
          }}
        />
      </Paper>
      <StudentDialog
        open={openDialog}
        handleClose={handleCloseDialog}
        sendData={handleSendData}
        initialData={currentStudent}
        isEditing={isEditing}
      />
      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        onConfirm={handleConfirmDelete}
        title={`¿Seguro que deseas eliminar a ${alumnoToDelete?.nombreAlumno || 'este alumno'}?`}
        loading={isDeleting}
      />
    </Box>
  );
}

export default ListadoAlumnos;
