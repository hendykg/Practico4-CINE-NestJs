import * as yup from 'yup';

export const movieSchema = yup.object({
  titulo: yup.string().trim().required('El titulo es requerido'),
  sinopsis: yup.string().trim().required('La sinopsis es requerida'),
  genero: yup.string().trim().required('El genero es requerido'),
  duracion: yup.number().positive('Debe ser positivo').integer().required('La duracion es requerida'),
  clasificacion: yup.string().oneOf(['+14', 'R', 'Todo publico']).required('Clasificacion requerida'),
});

export const roomSchema = yup.object({
  nombre: yup.string().trim().required('El nombre de la sala es requerido'),
  filas: yup.number().positive().integer().required('Las filas son requeridas'),
  columnas: yup.number().positive().integer().required('Las columnas son requeridas'),
});

export const showtimeSchema = yup.object({
  peliculaId: yup.number().required('Selecciona una pelicula'),
  salaId: yup.number().required('Selecciona una sala'),
  fechaHora: yup.string().required('La fecha y hora son requeridas'),
  precioEntrada: yup.number().positive('El precio debe ser mayor a 0').required('El precio es requerido'),
});
