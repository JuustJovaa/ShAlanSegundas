/* import { db } from "./firebaseConfig";
import { collection, addDoc, doc, updateDoc, deleteDoc } from "firebase/firestore";

const alumnosCollection = collection(db, "alumnos"); 
const attendanceCollection = collection(db, "attendance");

export const addStudent = async (studentData) => {
  return await addDoc(alumnosCollection, studentData);
};

export const updateStudent = async (studentId, studentData) => {
  const studentDoc = doc(db, "alumnos", studentId); 
  return await updateDoc(studentDoc, studentData);
};

export const deleteStudent = async (studentId) => {
  const studentDoc = doc(db, "alumnos", studentId); 
  return await deleteDoc(studentDoc);
};

export const recordAttendance = async (alumnoId, nombre, fecha, presente) => {
  return await addDoc(attendanceCollection, {
    alumnoId,
    nombre,
    fecha,
    presente,
    timestamp: new Date()
  });
}; */

import { db } from "./firebaseConfig";
import { collection, addDoc, doc, updateDoc, deleteDoc, getDoc } from "firebase/firestore";

const alumnosCollection = collection(db, "alumnos");

// Función mejorada para agregar alumnos
export const addStudent = async (studentData) => {
  try {
    // Agregamos el asesorId si no está presente
    const completeData = {
      ...studentData,
      fechaCreacion: new Date().toISOString()
    };
    
    const docRef = await addDoc(alumnosCollection, completeData);
    
    // Obtenemos el documento recién creado para devolver todos los datos
    const docSnapshot = await getDoc(docRef);
    return { id: docRef.id, ...docSnapshot.data() };
  } catch (error) {
    console.error("Error al agregar alumno:", error);
    throw error;
  }
};

// Función para actualizar alumnos
export const updateStudent = async (studentId, studentData) => {
  try {
    const studentDoc = doc(db, "alumnos", studentId);
    await updateDoc(studentDoc, {
      ...studentData,
      fechaActualizacion: new Date().toISOString()
    });
    
    // Devolvemos los datos actualizados
    const updatedDoc = await getDoc(studentDoc);
    return { id: studentId, ...updatedDoc.data() };
  } catch (error) {
    console.error("Error al actualizar alumno:", error);
    throw error;
  }
};

// Función para eliminar alumnos
export const deleteStudent = async (studentId) => {
  try {
    const studentDoc = doc(db, "alumnos", studentId);
    await deleteDoc(studentDoc);
    return studentId; // Devolvemos el ID eliminado
  } catch (error) {
    console.error("Error al eliminar alumno:", error);
    throw error;
  }
};

// Función para registrar asistencia
export const recordAttendance = async (alumnoId, nombre, fecha, presente) => {
  try {
    const attendanceCollection = collection(db, "asistencias");
    await addDoc(attendanceCollection, {
      alumnoId,
      nombre,
      fecha,
      presente,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error al registrar asistencia:", error);
    throw error;
  }
};